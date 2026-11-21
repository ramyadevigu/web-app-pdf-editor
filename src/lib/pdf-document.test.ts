import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { exportWholePdf } from "./pdf-document";

describe("exportWholePdf", () => {
  it("copies every page into a new PDF and creates a copy name", async () => {
    const source = await PDFDocument.create();
    source.addPage([612, 792]);
    source.addPage([612, 792]);

    const sourceBytes = await source.save();
    const exported = await exportWholePdf(sourceBytes, "sample.pdf");
    const output = await PDFDocument.load(exported.bytes);

    expect(output.getPageCount()).toBe(2);
    expect(exported.name).toBe("sample-copy.pdf");
  });

  it("rejects invalid PDF input", async () => {
    await expect(
      exportWholePdf(new Uint8Array([1, 2, 3]), "broken.pdf"),
    ).rejects.toThrow();
  });
});
