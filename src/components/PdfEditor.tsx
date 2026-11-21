"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { exportWholePdf } from "@/lib/pdf-document";
import {
  PdfValidationError,
  validatePdfSignature,
} from "@/lib/pdf-validation";

type PdfPageProxy = {
  getViewport: (options: { scale: number }) => {
    width: number;
    height: number;
    transform: number[];
  };
  render: (options: {
    canvasContext: CanvasRenderingContext2D;
    viewport: {
      width: number;
      height: number;
      transform: number[];
    };
  }) => { promise: Promise<void>; cancel: () => void };
};

type PdfDocumentProxy = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPageProxy>;
};

type PdfError = {
  code?: string;
  name?: string;
  message?: string;
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function PdfEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [sourceBytes, setSourceBytes] = useState<Uint8Array | null>(null);
  const [pdfDocument, setPdfDocument] =
    useState<PdfDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState("Choose a PDF to begin");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let renderTask: { cancel: () => void; promise: Promise<void> } | null = null;

    async function renderPage() {
      if (!pdfDocument || !canvasRef.current) return;

      try {
        const page = (await pdfDocument.getPage(pageNumber)) as PdfPageProxy;
        if (cancelled) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas rendering is unavailable.");

        const viewport = page.getViewport({ scale: zoom });
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        renderTask = page.render({
          canvasContext: context,
          viewport,
        });
        await renderTask.promise;
      } catch (renderError) {
        if (!cancelled) {
          setError(
            renderError instanceof Error
              ? renderError.message
              : "The page could not be rendered.",
          );
        }
      }
    }

    void renderPage();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdfDocument, pageNumber, zoom]);

  async function loadFile(file: File) {
    setError("");
    setIsLoading(true);
    setStatus(`Reading ${file.name}`);

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      validatePdfSignature(bytes, file.size);

      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

      const document = await pdfjs.getDocument({
        data: bytes.slice(),
      }).promise;

      setFileName(file.name);
      setFileSize(file.size);
      setSourceBytes(bytes);
      setPdfDocument(document as unknown as PdfDocumentProxy);
      setPageNumber(1);
      setStatus(
        `${document.numPages} page${document.numPages === 1 ? "" : "s"} ready`,
      );
    } catch (loadError) {
      setPdfDocument(null);
      setSourceBytes(null);
      setFileName("");
      setFileSize(0);

      if (loadError instanceof PdfValidationError) {
        setError(loadError.message);
        setStatus("File not loaded");
        return;
      }

      const pdfError = loadError as PdfError;
      if (pdfError.name === "PasswordException") {
        setError("Encrypted PDFs are not supported in this foundation.");
      } else {
        setError("The PDF is invalid or could not be opened.");
      }
      setStatus("File not loaded");
    } finally {
      setIsLoading(false);
    }
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void loadFile(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void loadFile(file);
  }

  async function handleExport() {
    if (!sourceBytes || !fileName) return;

    setIsExporting(true);
    setError("");
    setStatus("Validating and exporting...");

    try {
      const exported = await exportWholePdf(sourceBytes, fileName);
      const byteBuffer = exported.bytes.buffer.slice(
        exported.bytes.byteOffset,
        exported.bytes.byteOffset + exported.bytes.byteLength,
      ) as ArrayBuffer;
      const blob = new Blob([byteBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = exported.name;
      anchor.click();
      URL.revokeObjectURL(url);
      setStatus(`Exported ${exported.name}`);
    } catch {
      setError("The PDF could not be exported. The original file is unchanged.");
      setStatus("Export failed");
    } finally {
      setIsExporting(false);
    }
  }

  const pageCount = pdfDocument?.numPages ?? 0;

  return (
    <main className="editor-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            PDF
          </span>
          <span>PDF Editor</span>
        </div>
        <div className="topbar-actions">
          <span className="local-badge">Local processing</span>
          {sourceBytes && (
            <button
              className="export-button"
              type="button"
              onClick={() => void handleExport()}
              disabled={isExporting}
            >
              {isExporting ? "Exporting…" : "Export copy"}
            </button>
          )}
        </div>
      </header>

      <section className="workspace">
        <aside className="sidebar">
          <div
            className={`dropzone${isDragging ? " is-dragging" : ""}`}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="upload-icon" aria-hidden="true">
              ↑
            </div>
            <strong>Open PDF</strong>
            <span>Drop a file here or choose one</span>
            <label className="choose-button">
              Choose file
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleInput}
              />
            </label>
          </div>

          {fileName && (
            <div className="file-card">
              <div className="file-icon" aria-hidden="true">
                PDF
              </div>
              <div className="file-meta">
                <strong title={fileName}>{fileName}</strong>
                <span>
                  {formatBytes(fileSize)} · {pageCount}{" "}
                  {pageCount === 1 ? "page" : "pages"}
                </span>
              </div>
            </div>
          )}

          <div className="privacy-note">
            <strong>Private by default</strong>
            <span>The file stays in this browser.</span>
          </div>
        </aside>

        <div className="document-area">
          <div className="toolstrip">
            <div className="page-controls" aria-label="Page controls">
              <button
                type="button"
                onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
                disabled={!pageCount || pageNumber <= 1}
                aria-label="Previous page"
              >
                ←
              </button>
              <span>
                {pageCount ? pageNumber : 0} / {pageCount}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPageNumber((current) => Math.min(pageCount, current + 1))
                }
                disabled={!pageCount || pageNumber >= pageCount}
                aria-label="Next page"
              >
                →
              </button>
            </div>

            <div className="zoom-controls" aria-label="Zoom controls">
              <button
                type="button"
                onClick={() => setZoom((current) => Math.max(0.5, current - 0.25))}
                disabled={!pageCount}
                aria-label="Zoom out"
              >
                −
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoom((current) => Math.min(2.5, current + 0.25))}
                disabled={!pageCount}
                aria-label="Zoom in"
              >
                +
              </button>
            </div>
          </div>

          <div className="canvas-stage">
            {error && <div className="status error">{error}</div>}
            {!error && status && (
              <div className="status" aria-live="polite">
                {isLoading ? "Loading…" : status}
              </div>
            )}
            {pdfDocument ? (
              <canvas ref={canvasRef} className="pdf-canvas" />
            ) : (
              <div className="empty-document">
                <div className="empty-sheet">
                  <span>PDF</span>
                </div>
                <h1>Open a PDF to get started</h1>
                <p>Render and export a local copy. Text editing is not enabled.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
