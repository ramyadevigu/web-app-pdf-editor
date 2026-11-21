import { describe, expect, it } from "vitest";
import {
  MAX_PDF_BYTES,
  PdfValidationError,
  validatePdfSignature,
} from "./pdf-validation";

describe("validatePdfSignature", () => {
  it("accepts a PDF signature", () => {
    const bytes = new TextEncoder().encode("%PDF-1.7");
    expect(() => validatePdfSignature(bytes, bytes.byteLength)).not.toThrow();
  });

  it("rejects an empty file", () => {
    expect(() => validatePdfSignature(new Uint8Array(), 0)).toThrow(
      PdfValidationError,
    );
  });

  it("rejects oversized files", () => {
    expect(() =>
      validatePdfSignature(new Uint8Array(5), MAX_PDF_BYTES + 1),
    ).toThrow("Choose a PDF smaller than 100 MB.");
  });

  it("rejects a non-PDF signature", () => {
    const bytes = new TextEncoder().encode("not a pdf");
    expect(() => validatePdfSignature(bytes, bytes.byteLength)).toThrow(
      "does not contain a valid PDF signature",
    );
  });
});
