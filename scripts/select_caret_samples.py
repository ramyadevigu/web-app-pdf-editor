from __future__ import annotations

import json
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / "tests" / "fixtures" / "poc"
SAMPLES_PER_PAGE = 10


def page_runs(page) -> list[dict]:
    runs: list[dict] = []

    def visitor(text, cm, tm, font_dict, font_size):
        content = text.strip()
        if not content:
            return
        x, y = tm[4], tm[5]
        runs.append({"text": content, "x": round(x, 2), "y": round(y, 2), "font_size": round(font_size, 2)})

    page.extract_text(visitor_text=visitor)
    return runs


def choose(runs: list[dict]) -> list[dict]:
    if not runs:
        return []
    ordered = sorted(runs, key=lambda r: (-r["y"], r["x"]))
    if len(ordered) <= SAMPLES_PER_PAGE:
        picks = ordered
    else:
        step = (len(ordered) - 1) / (SAMPLES_PER_PAGE - 1)
        picks = [ordered[round(i * step)] for i in range(SAMPLES_PER_PAGE)]
    return [
        {
            "sample": index,
            "kind": "run_start",
            "target_text": run["text"][:40],
            "expected_x_pt": run["x"],
            "expected_y_pt": run["y"],
            "font_size_pt": run["font_size"],
        }
        for index, run in enumerate(picks, start=1)
    ]


def main() -> None:
    result: dict[str, list[dict]] = {}
    for path in sorted(FIXTURES.glob("*.pdf")):
        reader = PdfReader(str(path))
        pages = []
        for number, page in enumerate(reader.pages, start=1):
            pages.append({"page": number, "samples": choose(page_runs(page))})
        result[path.name] = pages
    (FIXTURES / "caret_samples.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
