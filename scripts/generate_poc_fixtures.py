from __future__ import annotations

import json
import hashlib
from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
import reportlab


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "tests" / "fixtures" / "poc"
FONT_DIR = Path(reportlab.__file__).resolve().parent / "fonts"
PAGE_WIDTH, PAGE_HEIGHT = letter
BODY = "Vera"
BOLD = "Vera-Bold"

pdfmetrics.registerFont(TTFont(BODY, str(FONT_DIR / "Vera.ttf")))
pdfmetrics.registerFont(TTFont(BOLD, str(FONT_DIR / "VeraBd.ttf")))


def new_pdf(filename: str, title: str) -> canvas.Canvas:
    pdf = canvas.Canvas(
        str(OUTPUT / filename),
        pagesize=letter,
        pageCompression=0,
        invariant=1,
    )
    pdf.setTitle(title)
    pdf.setAuthor("PDF Editor POC fixture generator")
    pdf.setSubject("Synthetic text-editing test fixture; contains no user data")
    return pdf


def draw_wrapped(
    pdf: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    *,
    font: str = BODY,
    size: float = 11,
    leading: float = 15,
) -> float:
    pdf.setFont(font, size)
    for line in simpleSplit(text, font, size, width):
        pdf.drawString(x, y, line)
        y -= leading
    return y


def draw_header(pdf: canvas.Canvas, title: str, page: int, total: int) -> float:
    pdf.setFont(BOLD, 18)
    pdf.drawString(72, PAGE_HEIGHT - 64, title)
    pdf.setFont(BODY, 9)
    pdf.drawRightString(PAGE_WIDTH - 72, 36, f"Page {page} of {total}")
    return PAGE_HEIGHT - 100


def make_contract() -> None:
    filename = "contract-standard.pdf"
    pdf = new_pdf(filename, "Synthetic Service Agreement")
    clauses = [
        [
            "1. Parties and purpose. This sample agreement is fictional and exists only "
            "to test selectable text, paragraph boundaries, and line wrapping in a PDF.",
            "2. Services. The provider will perform the services described in a written "
            "statement of work. Each statement will identify the work, delivery dates, "
            "acceptance steps, and the contacts responsible for review.",
            "3. Term. This agreement begins on the date signed by both parties and "
            "continues until ended under its terms. A renewal requires written consent.",
        ],
        [
            "4. Fees and records. The customer will pay the fees stated in the applicable "
            "statement of work. Each party will keep ordinary records needed to confirm "
            "performance and payment.",
            "5. Confidential information. A receiving party will use reasonable care to "
            "protect confidential information and will use it only to perform this "
            "agreement. This clause does not cover information already public.",
            "6. Changes. A change to the scope, schedule, or fees must be recorded in a "
            "written amendment approved by both parties.",
        ],
        [
            "7. Ending the agreement. Either party may end this agreement after written "
            "notice if the other party materially breaches it and does not cure the breach "
            "within the stated cure period.",
            "8. General terms. This fictional sample is not legal advice. It includes "
            "long and short paragraphs so that edits can be tested near line starts, "
            "line endings, punctuation, and paragraph boundaries.",
            "Provider signature: ____________________    Customer signature: "
            "____________________",
        ],
    ]
    for index, paragraphs in enumerate(clauses, start=1):
        y = draw_header(pdf, "Sample Service Agreement", index, len(clauses))
        for paragraph in paragraphs:
            y = draw_wrapped(pdf, paragraph, 72, y, PAGE_WIDTH - 144, size=11)
            y -= 18
        pdf.showPage()
    pdf.save()


def make_form() -> None:
    filename = "fillable-form.pdf"
    pdf = new_pdf(filename, "Synthetic Project Intake Form")
    y = draw_header(pdf, "Project Intake Form", 1, 2)
    y = draw_wrapped(
        pdf,
        "This fictional form tests selectable explanatory text and AcroForm field "
        "appearance handling. Enter sample values only.",
        72,
        y,
        PAGE_WIDTH - 144,
    )
    form = pdf.acroForm
    labels = [
        ("Applicant name", "applicant_name"),
        ("Project title", "project_title"),
        ("Contact email", "contact_email"),
    ]
    y -= 15
    for label, name in labels:
        pdf.setFont(BODY, 10)
        pdf.drawString(72, y, label)
        form.textfield(
            name=name,
            tooltip=label,
            x=72,
            y=y - 30,
            width=PAGE_WIDTH - 144,
            height=20,
            borderStyle="solid",
            forceBorder=True,
        )
        y -= 62
    pdf.setFont(BODY, 10)
    pdf.drawString(72, y, "Request type")
    form.checkbox(
        name="request_standard",
        tooltip="Standard request",
        x=72,
        y=y - 25,
        size=14,
        buttonStyle="check",
        forceBorder=True,
    )
    pdf.drawString(94, y - 22, "Standard")
    form.checkbox(
        name="request_priority",
        tooltip="Priority request",
        x=180,
        y=y - 25,
        size=14,
        buttonStyle="check",
        forceBorder=True,
    )
    pdf.drawString(202, y - 22, "Priority")
    pdf.showPage()

    y = draw_header(pdf, "Project Intake Form - Terms", 2, 2)
    for paragraph in [
        "The applicant confirms that the information on this fictional form is accurate "
        "for the purpose of testing text placement and export.",
        "The reviewer may request clarification before accepting a project. No real "
        "person, business, or project is described in this sample.",
        "Reviewer notes: _________________________________________________",
    ]:
        y = draw_wrapped(pdf, paragraph, 72, y, PAGE_WIDTH - 144)
        y -= 22
    pdf.save()


def make_report() -> None:
    filename = "multicolumn-report.pdf"
    pdf = new_pdf(filename, "Synthetic Two-Column Report")
    for page in range(1, 5):
        y = draw_header(pdf, "Quarterly Operations Report", page, 4)
        columns = [
            (
                72,
                [
                    "Summary. This original sample report uses a fixed two-column layout "
                    "to test edits near column edges and paragraph transitions.",
                    "Method. Each section contains selectable text with repeated words, "
                    "punctuation, and varied line lengths. The columns remain independent.",
                ],
            ),
            (
                318,
                [
                    "Findings. A text change should remain inside its paragraph area and "
                    "must not collide with the next block or cross into the second column.",
                    "Next steps. Review the exported page at the same scale as the source "
                    "and record any reflow or font substitution.",
                ],
            ),
        ]
        for x, paragraphs in columns:
            column_y = y
            for paragraph in paragraphs:
                column_y = draw_wrapped(
                    pdf,
                    paragraph,
                    x,
                    column_y,
                    222,
                    size=10,
                    leading=14,
                )
                column_y -= 20
        pdf.showPage()
    pdf.save()


def make_font_specimen() -> None:
    filename = "embedded-font-specimen.pdf"
    pdf = new_pdf(filename, "Synthetic Embedded Font Specimen")
    for page in range(1, 3):
        y = draw_header(pdf, "Embedded Font Specimen", page, 2)
        for size in (10, 12, 16, 22):
            pdf.setFont(BODY, size)
            pdf.drawString(
                72,
                y,
                f"Vera regular {size}: AV To Wa fi fl punctuation, 0123456789",
            )
            y -= size + 12
            pdf.setFont(BOLD, size)
            pdf.drawString(
                72,
                y,
                f"Vera bold {size}: AV To Wa fi fl punctuation, 0123456789",
            )
            y -= size + 20
        draw_wrapped(
            pdf,
            "This specimen tests embedded font resources, size changes, glyph spacing, "
            "and short text runs. The strings are original test content.",
            72,
            y,
            PAGE_WIDTH - 144,
        )
        pdf.showPage()
    pdf.save()


def make_reference() -> None:
    filename = "single-column-reference.pdf"
    pdf = new_pdf(filename, "Synthetic Single Column Reference")
    for page in range(1, 3):
        y = draw_header(pdf, "Single Column Reference", page, 2)
        paragraphs = [
            "Short baseline line for testing the first character and the final character.",
            "This longer paragraph contains repeated phrases and common punctuation. "
            "It provides several stable points for caret placement and allows a text "
            "edit to be compared with unaffected content on the same page.",
            "Final paragraph. A change here must not alter the text or layout on another "
            "page, and the exported document must remain readable.",
        ]
        for paragraph in paragraphs:
            y = draw_wrapped(pdf, paragraph, 72, y, PAGE_WIDTH - 144)
            y -= 24
        pdf.showPage()
    pdf.save()


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    make_contract()
    make_form()
    make_report()
    make_font_specimen()
    make_reference()
    fixtures = [
        ("contract-standard.pdf", 3, ["BitstreamVeraSans-Roman (embedded)", "BitstreamVeraSans-Bold (embedded)", "Helvetica (unembedded resource)"]),
        ("fillable-form.pdf", 2, ["BitstreamVeraSans-Roman (embedded)", "BitstreamVeraSans-Bold (embedded)", "Helvetica (unembedded form appearance resource)"]),
        ("multicolumn-report.pdf", 4, ["BitstreamVeraSans-Roman (embedded)", "BitstreamVeraSans-Bold (embedded)", "Helvetica (unembedded resource)"]),
        ("embedded-font-specimen.pdf", 2, ["BitstreamVeraSans-Roman (embedded)", "BitstreamVeraSans-Bold (embedded)", "Helvetica (unembedded resource)"]),
        ("single-column-reference.pdf", 2, ["BitstreamVeraSans-Roman (embedded)", "Helvetica (unembedded resource)"]),
    ]
    manifest = {
        "generator": "scripts/generate_poc_fixtures.py",
        "reportlab_version": reportlab.Version,
        "pypdf_version": "7.1.0",
        "font_source": "ReportLab's bundled Bitstream Vera font files",
        "fixtures": [],
    }
    for filename, pages, fonts in fixtures:
        pdf_path = OUTPUT / filename
        data = pdf_path.read_bytes()
        manifest["fixtures"].append(
            {
                "file": filename,
                "pages": pages,
                "fonts": fonts,
                "bytes": len(data),
                "sha256": hashlib.sha256(data).hexdigest(),
            }
        )
    (OUTPUT / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
