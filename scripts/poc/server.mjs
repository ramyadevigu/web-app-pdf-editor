import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const fixtureRoot = resolve(root, "tests/fixtures/poc");
const resultRoot = resolve(fixtureRoot, "results");
const fixtureFiles = new Set([
  "contract-standard.pdf",
  "fillable-form.pdf",
  "multicolumn-report.pdf",
  "embedded-font-specimen.pdf",
  "single-column-reference.pdf",
]);
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
};

function isWithin(parent, candidate) {
  const path = relative(parent, candidate);
  return path !== "" && path !== ".." && !path.startsWith(`..${sep}`);
}

function resolveStaticPath(urlPath) {
  if (urlPath === "/" || urlPath === "/index.html") {
    return resolve(root, "scripts/poc/index.html");
  }
  if (urlPath === "/poc.mjs") {
    return resolve(root, "scripts/poc/poc.mjs");
  }
  if (urlPath === "/caret_samples.json") {
    return resolve(fixtureRoot, "caret_samples.json");
  }
  if (urlPath.startsWith("/fixtures/")) {
    const filename = urlPath.slice("/fixtures/".length);
    return fixtureFiles.has(filename) ? resolve(fixtureRoot, filename) : null;
  }
  if (urlPath.startsWith("/vendor/pdfjs-dist/")) {
    const packagePath = resolve(root, "node_modules/pdfjs-dist");
    const candidate = resolve(packagePath, urlPath.slice("/vendor/pdfjs-dist/".length));
    return isWithin(packagePath, candidate) ? candidate : null;
  }
  if (urlPath.startsWith("/vendor/pdf-lib/")) {
    const packagePath = resolve(root, "node_modules/pdf-lib");
    const candidate = resolve(packagePath, urlPath.slice("/vendor/pdf-lib/".length));
    return isWithin(packagePath, candidate) ? candidate : null;
  }
  return null;
}

async function saveResults(request, response) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 50 * 1024 * 1024) {
      response.writeHead(413).end("POC results exceed the 50 MB limit");
      return;
    }
  }

  const payload = JSON.parse(body);
  if (!/^\d{8}T\d{6}Z$/.test(payload.runId) || !Array.isArray(payload.artifacts)) {
    response.writeHead(400).end("Invalid POC result payload");
    return;
  }

  const runRoot = resolve(resultRoot, payload.runId);
  await mkdir(runRoot, { recursive: true });

  for (const artifact of payload.artifacts) {
    if (
      !fixtureFiles.has(artifact.fixture) ||
      !/^(?:reference|output|diff)-page-\d+\.png$|^output\.pdf$/.test(artifact.filename) ||
      typeof artifact.data !== "string"
    ) {
      response.writeHead(400).end("Invalid POC artifact");
      return;
    }

    const fixtureDirectory = resolve(runRoot, artifact.fixture.replace(/\.pdf$/, ""));
    const destination = resolve(fixtureDirectory, artifact.filename);
    if (!isWithin(runRoot, destination)) {
      response.writeHead(400).end("Invalid POC artifact path");
      return;
    }
    await mkdir(fixtureDirectory, { recursive: true });
    await writeFile(destination, Buffer.from(artifact.data, "base64"));
  }

  const summaryPath = resolve(runRoot, "summary.json");
  await writeFile(summaryPath, `${JSON.stringify(payload.summary, null, 2)}\n`, "utf8");
  response.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ savedTo: relative(root, summaryPath) }));
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === "POST" && request.url === "/results") {
      await saveResults(request, response);
      return;
    }
    if (request.method !== "GET") {
      response.writeHead(405).end("Method not allowed");
      return;
    }

    const url = new URL(request.url, "http://127.0.0.1");
    const pathname = decodeURIComponent(url.pathname);
    const filePath = resolveStaticPath(pathname);
    if (!filePath) {
      response.writeHead(404).end("Not found");
      return;
    }

    const content = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(content);
  } catch (error) {
    const status = error.code === "ENOENT" ? 404 : 500;
    response.writeHead(status).end(status === 404 ? "Not found" : "POC server error");
    if (status === 500) {
      console.error(error);
    }
  }
});

server.listen(4173, "127.0.0.1", () => {
  console.log("DT-04 POC available at http://127.0.0.1:4173");
});
