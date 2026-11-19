import * as pdfjsLib from "/vendor/pdfjs-dist/build/pdf.mjs";
import { PDFDocument, StandardFonts, rgb } from "/vendor/pdf-lib/dist/pdf-lib.esm.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs-dist/build/pdf.worker.mjs";

const fixtures = [
  { id: "POC-01", file: "contract-standard.pdf" },
  { id: "POC-02", file: "fillable-form.pdf" },
  { id: "POC-03", file: "multicolumn-report.pdf" },
  { id: "POC-04", file: "embedded-font-specimen.pdf" },
  { id: "POC-05", file: "single-column-reference.pdf" },
];
const scale = 150 / 72;
const pixelThreshold = 16;
const maxDiffRatio = 0.005;
const fixturePicker = document.querySelector("#fixture");
const previewButton = document.querySelector("#preview");
const runButton = document.querySelector("#run");
const status = document.querySelector("#status");
const resultBody = document.querySelector("#results");
const canvas = document.querySelector("#page");
const viewerTitle = document.querySelector("#viewer-title");
const fontWarning = document.querySelector("#font-warning");
const report = document.querySelector("#report");

function setStatus(message) {
  status.textContent = message;
}

async function fetchBytes(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path} (${response.status})`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

async function sha256(bytes) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim().toLocaleLowerCase();
}

function findTextItem(items, sample) {
  const target = normalizeText(sample.target_text);
  const prefix = target.slice(0, Math.min(12, target.length));
  const candidates = items.filter((item) => {
    if (!item.str) return false;
    const text = normalizeText(item.str);
    return text.startsWith(prefix) || target.startsWith(text.slice(0, Math.min(12, text.length)));
  });
  return candidates
    .map((item) => ({
      item,
      distance: Math.hypot(
        item.transform[4] - sample.expected_x_pt,
        item.transform[5] - sample.expected_y_pt,
      ),
    }))
    .sort((left, right) => left.distance - right.distance)[0] ?? null;
}

function collectCaretResults(samples, items, textDivs, styles, pageNumber) {
  const pageSamples = samples.find((page) => page.page === pageNumber)?.samples ?? [];
  return pageSamples.map((sample) => {
    const match = findTextItem(items, sample);
    const itemIndex = match ? items.indexOf(match.item) : -1;
    const span = itemIndex >= 0 ? textDivs[itemIndex] : null;
    const walker = span
      ? document.createTreeWalker(span, NodeFilter.SHOW_TEXT)
      : null;
    const textNode = walker?.nextNode();
    let renderedXPt = null;
    if (textNode && match) {
      const range = document.createRange();
      range.setStart(textNode, 0);
      range.setEnd(textNode, 1);
      const rect = range.getBoundingClientRect();
      const layerRect = span.parentElement.getBoundingClientRect();
      renderedXPt = (rect.left - layerRect.left) / scale;
    }
    const actual = match && renderedXPt !== null
      ? { xPt: renderedXPt, yPt: match.item.transform[5] }
      : null;
    const delta = actual
      ? Math.hypot(
          actual.xPt - sample.expected_x_pt,
          actual.yPt - sample.expected_y_pt,
        )
      : null;
    return {
      sample: sample.sample,
      targetText: sample.target_text,
      expected: { xPt: sample.expected_x_pt, yPt: sample.expected_y_pt },
      actual,
      deltaPt: delta,
      passed: delta !== null && delta <= 2,
      fontName: match?.item.fontName ?? null,
      fontFamily: match?.item.fontName
        ? styles[match.item.fontName]?.fontFamily ?? null
        : null,
      measurement: "First-glyph DOM range x; PDF.js text-item baseline y",
    };
  });
}

function chooseEditTarget(samplesByPage, pdfPages) {
  for (const pageSamples of samplesByPage) {
    const pageItems = pdfPages.get(pageSamples.page);
    const selected = pageSamples.samples.find(
      (sample) => sample.font_size_pt <= 12 && sample.target_text.trim().length >= 12,
    );
    if (!selected || !pageItems) continue;
    const match = findTextItem(pageItems, selected);
    if (match) {
      return {
        pageNumber: pageSamples.page,
        sample: selected,
        item: match.item,
      };
    }
  }
  return null;
}

function getColumnRight(items, item, pageWidth) {
  const candidateStarts = new Map();
  for (const textItem of items) {
    if (!textItem.str || textItem.transform[4] < 48) continue;
    const x = Math.round(textItem.transform[4] / 4) * 4;
    candidateStarts.set(x, (candidateStarts.get(x) ?? 0) + 1);
  }
  const left = Math.round(item.transform[4] / 4) * 4;
  const nextColumn = [...candidateStarts.entries()]
    .filter(([x, count]) => x > left + 40 && count >= 2)
    .map(([x]) => x)
    .sort((a, b) => a - b)[0];
  return nextColumn ? nextColumn - 24 : pageWidth - 72;
}

async function renderPage(pdf, pageNumber, targetCanvas) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  targetCanvas.width = Math.ceil(viewport.width);
  targetCanvas.height = Math.ceil(viewport.height);
  const context = targetCanvas.getContext("2d", { willReadFrequently: true });
  await page.render({ canvas: targetCanvas, canvasContext: context, viewport }).promise;
  return { page, viewport };
}

function canvasPngData(canvasElement) {
  return canvasElement.toDataURL("image/png").split(",")[1];
}

function compareCanvases(originalCanvas, outputCanvas, excludedBox) {
  const width = originalCanvas.width;
  const height = originalCanvas.height;
  if (width !== outputCanvas.width || height !== outputCanvas.height) {
    throw new Error("Original and exported page dimensions do not match");
  }
  const original = originalCanvas.getContext("2d", { willReadFrequently: true })
    .getImageData(0, 0, width, height).data;
  const output = outputCanvas.getContext("2d", { willReadFrequently: true })
    .getImageData(0, 0, width, height).data;
  const diffCanvas = document.createElement("canvas");
  diffCanvas.width = width;
  diffCanvas.height = height;
  const diffContext = diffCanvas.getContext("2d");
  const diff = diffContext.createImageData(width, height);
  const editPixelBox = excludedBox
    ? {
        left: Math.max(0, Math.floor(excludedBox.x * scale)),
        right: Math.min(width, Math.ceil((excludedBox.x + excludedBox.width) * scale)),
        top: Math.max(0, Math.floor((excludedBox.pageHeight - excludedBox.y - excludedBox.height) * scale)),
        bottom: Math.min(height, Math.ceil((excludedBox.pageHeight - excludedBox.y) * scale)),
      }
    : null;
  let differentPixels = 0;
  let comparedPixels = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (editPixelBox && x >= editPixelBox.left && x < editPixelBox.right &&
          y >= editPixelBox.top && y < editPixelBox.bottom) {
        continue;
      }
      const offset = (y * width + x) * 4;
      const difference = Math.max(
        Math.abs(original[offset] - output[offset]),
        Math.abs(original[offset + 1] - output[offset + 1]),
        Math.abs(original[offset + 2] - output[offset + 2]),
      );
      comparedPixels += 1;
      if (difference > pixelThreshold) {
        differentPixels += 1;
        diff.data[offset] = 220;
        diff.data[offset + 1] = 38;
        diff.data[offset + 2] = 38;
        diff.data[offset + 3] = 255;
      } else {
        diff.data[offset + 3] = 255;
      }
    }
  }

  diffContext.putImageData(diff, 0, 0);
  return {
    width,
    height,
    differentPixels,
    comparedPixels,
    ratio: comparedPixels === 0 ? 0 : differentPixels / comparedPixels,
    passed: comparedPixels > 0 && differentPixels / comparedPixels <= maxDiffRatio,
    diffPng: canvasPngData(diffCanvas),
  };
}

async function renderPreview(filename) {
  const bytes = await fetchBytes(`/fixtures/${filename}`);
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const { page } = await renderPage(pdf, 1, canvas);
  viewerTitle.textContent = `${filename}, page 1 of ${pdf.numPages}, rendered at 150 dpi`;
  const content = await page.getTextContent();
  const firstText = content.items.find((item) => item.str);
  fontWarning.hidden = false;
  fontWarning.textContent = firstText
    ? "Visible export fallback: edited text uses Helvetica; the source PDF's embedded font is not reused."
    : "No selectable text found on this page.";
}

async function runFixture(fixture, sampleManifest, artifacts) {
  setStatus(`${fixture.id}: loading ${fixture.file}`);
  const inputBytes = await fetchBytes(`/fixtures/${fixture.file}`);
  const inputHash = await sha256(inputBytes);
  const originalPdf = await pdfjsLib.getDocument({ data: inputBytes.slice() }).promise;
  const samplePages = sampleManifest[fixture.file] ?? [];
  const pdfPages = new Map();
  const caretResults = [];
  const pageGeometry = [];

  for (let pageNumber = 1; pageNumber <= originalPdf.numPages; pageNumber += 1) {
    setStatus(`${fixture.id}: measuring caret anchors on page ${pageNumber}/${originalPdf.numPages}`);
    const page = await originalPdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const textItems = content.items.filter((item) => typeof item.str === "string");
    pdfPages.set(pageNumber, textItems);
    const textLayerContainer = document.createElement("div");
    textLayerContainer.className = "textLayer";
    textLayerContainer.style.position = "fixed";
    textLayerContainer.style.left = "-10000px";
    textLayerContainer.style.top = "0";
    textLayerContainer.style.width = `${page.getViewport({ scale }).width}px`;
    textLayerContainer.style.height = `${page.getViewport({ scale }).height}px`;
    textLayerContainer.style.setProperty("--scale-factor", String(scale));
    textLayerContainer.style.setProperty("--total-scale-factor", String(scale));
    textLayerContainer.style.setProperty("--scale-round-x", "1px");
    textLayerContainer.style.setProperty("--scale-round-y", "1px");
    document.body.append(textLayerContainer);
    const textLayer = new pdfjsLib.TextLayer({
      textContentSource: content,
      container: textLayerContainer,
      viewport: page.getViewport({ scale }),
    });
    await textLayer.render();
    for (const textDiv of textLayer.textDivs) {
      textDiv.style.position = "absolute";
      textDiv.style.color = "transparent";
      textDiv.style.whiteSpace = "pre";
    }
    const pageCaretResults = collectCaretResults(
      samplePages,
      textItems,
      textLayer.textDivs,
      content.styles,
      pageNumber,
    );
    caretResults.push(...pageCaretResults);
    pageGeometry.push({
      pageNumber,
      widthPt: page.view[2] - page.view[0],
      heightPt: page.view[3] - page.view[1],
      caretResults: pageCaretResults,
      fontNames: [...new Set(textItems.map((item) => item.fontName).filter(Boolean))],
    });
    textLayerContainer.remove();
  }

  const editTarget = chooseEditTarget(samplePages, pdfPages);
  if (!editTarget) {
    throw new Error(`No body-text edit target matched ${fixture.file}`);
  }

  const modifiedPdf = await PDFDocument.load(inputBytes);
  const modifiedPage = modifiedPdf.getPage(editTarget.pageNumber - 1);
  const originalPageGeometry = pageGeometry[editTarget.pageNumber - 1];
  const targetItem = editTarget.item;
  const fontSize = editTarget.sample.font_size_pt;
  const editBox = {
    x: targetItem.transform[4],
    y: targetItem.transform[5] - fontSize * 0.35,
    width: targetItem.width + 4,
    height: fontSize * 1.45,
    pageHeight: originalPageGeometry.heightPt,
  };
  const fallbackFont = await modifiedPdf.embedFont(StandardFonts.Helvetica);
  modifiedPage.drawRectangle({
    x: editBox.x,
    y: editBox.y,
    width: editBox.width,
    height: editBox.height,
    color: rgb(1, 1, 1),
  });
  modifiedPage.drawText("Revised sample", {
    x: editBox.x + 1,
    y: targetItem.transform[5],
    size: fontSize,
    font: fallbackFont,
    color: rgb(0, 0, 0),
  });
  const outputBytes = await modifiedPdf.save();
  const outputHash = await sha256(outputBytes);
  const exportedPdf = await pdfjsLib.getDocument({ data: outputBytes.slice() }).promise;
  const exportedPage = await exportedPdf.getPage(editTarget.pageNumber);
  const exportedText = await exportedPage.getTextContent();
  const originalPrefix = normalizeText(editTarget.sample.target_text).slice(0, 12);
  const originalTextRemains = exportedText.items.some((item) =>
    normalizeText(item.str ?? "").startsWith(originalPrefix),
  );
  const editText = "Revised sample";
  const longReplacement = "Reflow test ".repeat(80).trim();
  const stressTextWidth = fallbackFont.widthOfTextAtSize(longReplacement, fontSize);
  const columnRightPt = getColumnRight(
    pdfPages.get(editTarget.pageNumber),
    targetItem,
    originalPageGeometry.widthPt,
  );
  const availableColumnWidthPt = Math.max(0, columnRightPt - targetItem.transform[4]);
  const stressTextRightPt = targetItem.transform[4] + stressTextWidth;
  const overlapsNextColumn = pdfPages.get(editTarget.pageNumber).some((item) => {
    if (item === targetItem || !item.str) return false;
    const sameLine = Math.abs(item.transform[5] - targetItem.transform[5]) < fontSize * 0.8;
    const overlapsHorizontally = item.transform[4] < stressTextRightPt &&
      item.transform[4] + item.width > columnRightPt;
    return sameLine && overlapsHorizontally;
  });
  const reflowResult = {
    supported: false,
    test: "Single-line overlay under a deliberately overlong replacement string",
    replacementCharacters: longReplacement.length,
    replacementWidthPt: stressTextWidth,
    availableColumnWidthPt,
    overflowsColumn: stressTextWidth > availableColumnWidthPt,
    overlapsNextColumn,
    passed: false,
    reason: "The candidate draws one line and has no paragraph-wrap or reflow operation.",
  };

  const renderResults = [];
  for (let pageNumber = 1; pageNumber <= originalPdf.numPages; pageNumber += 1) {
    setStatus(`${fixture.id}: comparing output page ${pageNumber}/${originalPdf.numPages} at 150 dpi`);
    const originalPage = await originalPdf.getPage(pageNumber);
    const originalViewport = originalPage.getViewport({ scale });
    const originalCanvas = document.createElement("canvas");
    originalCanvas.width = Math.ceil(originalViewport.width);
    originalCanvas.height = Math.ceil(originalViewport.height);
    await originalPage.render({
      canvas: originalCanvas,
      canvasContext: originalCanvas.getContext("2d", { willReadFrequently: true }),
      viewport: originalViewport,
    }).promise;

    const outputPage = await exportedPdf.getPage(pageNumber);
    const outputViewport = outputPage.getViewport({ scale });
    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = Math.ceil(outputViewport.width);
    outputCanvas.height = Math.ceil(outputViewport.height);
    await outputPage.render({
      canvas: outputCanvas,
      canvasContext: outputCanvas.getContext("2d", { willReadFrequently: true }),
      viewport: outputViewport,
    }).promise;

    const comparison = compareCanvases(
      originalCanvas,
      outputCanvas,
      pageNumber === editTarget.pageNumber ? editBox : null,
    );
    const prefix = fixture.file.replace(/\.pdf$/, "");
    artifacts.push(
      { fixture: fixture.file, filename: `reference-page-${pageNumber}.png`, data: canvasPngData(originalCanvas) },
      { fixture: fixture.file, filename: `output-page-${pageNumber}.png`, data: canvasPngData(outputCanvas) },
      { fixture: fixture.file, filename: `diff-page-${pageNumber}.png`, data: comparison.diffPng },
    );
    renderResults.push({
      pageNumber,
      widthPx: comparison.width,
      heightPx: comparison.height,
      differentPixels: comparison.differentPixels,
      comparedPixels: comparison.comparedPixels,
      differenceRatio: comparison.ratio,
      passed: comparison.passed,
      excludedEditBoxPt: pageNumber === editTarget.pageNumber ? editBox : null,
    });
    originalCanvas.width = 0;
    outputCanvas.width = 0;
  }

  artifacts.push({
    fixture: fixture.file,
    filename: "output.pdf",
    data: [...outputBytes].map((byte) => String.fromCharCode(byte)).join(""),
  });

  const caretPasses = caretResults.filter((result) => result.passed).length;
  const allPagesPassFidelity = renderResults.every((result) => result.passed);
  const maxDifferenceRatio = Math.max(...renderResults.map((result) => result.differenceRatio));
  return {
    fixtureId: fixture.id,
    file: fixture.file,
    pageCount: originalPdf.numPages,
    inputSha256: inputHash,
    outputSha256: outputHash,
    caret: {
      passed: caretPasses,
      total: caretResults.length,
      ratio: caretResults.length ? caretPasses / caretResults.length : 0,
      criterionPassed: caretResults.length > 0 && caretPasses / caretResults.length >= 0.95,
      samples: caretResults,
    },
    fonts: {
      originalFontNames: [...new Set(pageGeometry.flatMap((page) => page.fontNames))],
      outputFont: "Helvetica",
      fallbackUsed: true,
      fallbackVisiblyFlagged: true,
      originalEmbeddedFontPreserved: false,
    },
    edit: {
      pageNumber: editTarget.pageNumber,
      targetText: editTarget.sample.target_text,
      replacementText: editText,
      method: "Whiteout rectangle and drawn text overlay using pdf-lib",
      editBoxPt: editBox,
      originalTextRemainsInOutputTextLayer: originalTextRemains,
      trueInPlaceReplacement: !originalTextRemains,
    },
    reflow: reflowResult,
    exportFidelity: {
      threshold: maxDiffRatio,
      maxDifferenceRatio,
      allPagesPassed: allPagesPassFidelity,
      pages: renderResults,
    },
    criticalFailures: [
      ...(originalTextRemains ? ["Original text remains in the exported text layer; replacement is an overlay."] : []),
    ],
  };
}

function renderResultsTable(fixtureResults) {
  resultBody.replaceChildren();
  for (const result of fixtureResults) {
    const row = document.createElement("tr");
    const values = [
      result.fixtureId,
      `${result.caret.passed}/${result.caret.total} (${(result.caret.ratio * 100).toFixed(1)}%)`,
      "Fallback: Helvetica, visibly flagged",
      result.reflow.overflowsColumn ? "FAIL: overflows column" : "FAIL: no reflow support",
      `${(result.exportFidelity.maxDifferenceRatio * 100).toFixed(3)}% max`,
      result.edit.trueInPlaceReplacement ? "In-place" : "FAIL: overlay only",
    ];
    for (const value of values) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }
    resultBody.append(row);
  }
}

async function runAllFixtures() {
  runButton.disabled = true;
  previewButton.disabled = true;
  fontWarning.hidden = true;
  const artifacts = [];
  try {
    setStatus("Loading frozen caret samples...");
    const sampleResponse = await fetch("/caret_samples.json");
    if (!sampleResponse.ok) throw new Error("Could not load the frozen caret sample file");
    const sampleManifest = await sampleResponse.json();
    const fixtureResults = [];
    for (const fixture of fixtures) {
      setStatus(`Running ${fixture.id} (${fixture.file})...`);
      fixtureResults.push(await runFixture(fixture, sampleManifest, artifacts));
    }

    const go = fixtureResults.filter((result) =>
      result.caret.criterionPassed &&
      result.fonts.fallbackVisiblyFlagged &&
      result.reflow.passed &&
      result.exportFidelity.allPagesPassed &&
      result.criticalFailures.length === 0,
    ).length >= 4 &&
      fixtureResults.every((result) => result.criticalFailures.length === 0);
    const versionInfo = await navigator.userAgentData?.getHighEntropyValues(["fullVersionList"]);
    const browserVersion =
      versionInfo?.fullVersionList?.find(({ brand }) => brand === "Google Chrome")?.version ?? null;
    const referenceEnvironmentMatch =
      browserVersion === "157.0.8103.51" &&
      window.innerWidth === 1280 &&
      window.innerHeight === 800 &&
      window.devicePixelRatio === 1;
    const summary = {
      protocol: "DT-03 frozen protocol, 16 November 2026",
      runId: new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z"),
      generatedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      browserVersion,
      viewportCssPixels: { width: window.innerWidth, height: window.innerHeight },
      devicePixelRatio: window.devicePixelRatio,
      expectedEnvironment: {
        browser: "Chrome 157.0.8103.51",
        viewportCssPixels: { width: 1280, height: 800 },
        devicePixelRatio: 1,
      },
      referenceEnvironmentMatch,
      rendering: { renderer: "PDF.js 6.5.438", dpi: 150, scale, pixelThreshold, maxDiffRatio },
      editing: { library: "pdf-lib 1.17.1", method: "overlay", productionUse: false },
      fixtureResults,
      overall: {
        decision: referenceEnvironmentMatch ? (go ? "GO" : "NO-GO") : "INVALID ENVIRONMENT",
        reason: !referenceEnvironmentMatch
          ? "Reference browser build, viewport, or device scale differs from the frozen protocol."
          : go
          ? "All gates pass on at least four fixtures with no critical failure."
          : "At least one frozen criterion failed or a critical in-place-editing failure occurred.",
      },
    };
    const runId = summary.runId;
    for (const artifact of artifacts) {
      if (artifact.filename === "output.pdf") {
        const binary = artifact.data;
        artifact.data = btoa(binary);
      }
    }
    const saveResponse = await fetch("/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId, summary, artifacts }),
    });
    if (!saveResponse.ok) {
      throw new Error(`Could not persist POC evidence (${saveResponse.status})`);
    }
    const saved = await saveResponse.json();
    renderResultsTable(fixtureResults);
    report.textContent = JSON.stringify(summary, null, 2);
    setStatus(
      summary.referenceEnvironmentMatch
        ? `${summary.overall.decision}: evidence saved to ${saved.savedTo}`
        : `INVALID ENVIRONMENT: evidence saved to ${saved.savedTo}`,
    );
    await renderPreview(fixturePicker.value);
  } catch (error) {
    console.error(error);
    setStatus(`POC run failed: ${error.message}`);
  } finally {
    runButton.disabled = false;
    previewButton.disabled = false;
  }
}

previewButton.addEventListener("click", async () => {
  previewButton.disabled = true;
  try {
    await renderPreview(fixturePicker.value);
    setStatus(`Preview loaded: ${fixturePicker.value}`);
  } catch (error) {
    setStatus(`Preview failed: ${error.message}`);
  } finally {
    previewButton.disabled = false;
  }
});

runButton.addEventListener("click", runAllFixtures);

if (new URLSearchParams(location.search).get("run") === "1") {
  runAllFixtures();
}
