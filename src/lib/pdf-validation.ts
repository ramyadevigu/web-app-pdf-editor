export const MAX_PDF_BYTES = 100 * 1024 * 1024;

export type PdfValidationErrorCode =
  | "EMPTY_FILE"
  | "FILE_TOO_LARGE"
  | "INVALID_SIGNATURE"
  | "READ_FAILED";

export class PdfValidationError extends Error {
  constructor(
    public readonly code: PdfValidationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PdfValidationError";
  }
}

export function validatePdfSignature(bytes: Uint8Array, size: number): void {
  if (size === 0) {
    throw new PdfValidationError("EMPTY_FILE", "This file is empty.");
  }

  if (size > MAX_PDF_BYTES) {
    throw new PdfValidationError(
      "FILE_TOO_LARGE",
      "Choose a PDF smaller than 100 MB.",
    );
  }

  const prefix = new TextDecoder("ascii").decode(bytes.slice(0, 5));
  if (!prefix.startsWith("%PDF-")) {
    throw new PdfValidationError(
      "INVALID_SIGNATURE",
      "This file does not contain a valid PDF signature.",
    );
  }
}
