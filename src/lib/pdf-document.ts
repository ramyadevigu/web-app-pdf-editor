import { PDFDocument } from "pdf-lib";

export async function exportWholePdf(
  inputBytes: Uint8Array,
  sourceName: string,
): Promise<{ bytes: Uint8Array; name: string }> {
  const source = await PDFDocument.load(inputBytes, {
    updateMetadata: false,
  });
  const output = await PDFDocument.create();
  const pageIndexes = source.getPageIndices();
  const copiedPages = await output.copyPages(source, pageIndexes);

  for (const page of copiedPages) {
    output.addPage(page);
  }

  const bytes = await output.save();
  const baseName = sourceName.replace(/\.pdf$/i, "") || "document";

  return {
    bytes,
    name: `${baseName}-copy.pdf`,
  };
}
