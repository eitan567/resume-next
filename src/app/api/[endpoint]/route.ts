import { createRequire } from "node:module";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const require = createRequire(import.meta.url);

const ENDPOINTS = new Set([
  "blob-upload",
  "chat",
  "contact",
  "live-token",
  "narration",
  "narration-save",
  "narration-script",
  "narration-versions",
  "stats",
  "track",
  "tts",
]);

type RouteContext = {
  params: Promise<{ endpoint: string }>;
};

type LegacyRequest = {
  method: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
  url: string;
};

type LegacyResponse = {
  status(code: number): LegacyResponse;
  setHeader(name: string, value: string | number | readonly string[]): LegacyResponse;
  json(payload: unknown): void;
  send(payload?: unknown): void;
  end(payload?: unknown): void;
};

type LegacyHandler = (
  req: LegacyRequest,
  res: LegacyResponse,
) => unknown | Promise<unknown>;

function loadLegacyHandler(endpoint: string): LegacyHandler {
  return require(`../../../server/legacy-api/${endpoint}.js`) as LegacyHandler;
}

function requestHeaders(request: NextRequest) {
  const out: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    out[key.toLowerCase()] = value;
  });
  return out;
}

function queryParams(request: NextRequest) {
  const url = new URL(request.url);
  const out: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

async function readBody(request: NextRequest) {
  if (request.method === "GET" || request.method === "HEAD") return {};
  const text = await request.text();
  if (!text) return {};
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  }
  return text;
}

async function handleBlobUpload(request: NextRequest) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { handleUpload } = await import("@vercel/blob/client");
    const body = await request.json().catch(() => ({}));
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["audio/wav", "audio/mpeg", "audio/mp3"],
        addRandomSuffix: true,
        maximumSizeInBytes: 30 * 1024 * 1024,
        tokenPayload: JSON.stringify({}),
      }),
      onUploadCompleted: async () => {},
    });

    return Response.json(jsonResponse);
  } catch (error) {
    console.error("blob upload token error:", error);
    return Response.json(
      { error: String((error && (error as Error).message) || error) },
      { status: 400 },
    );
  }
}

async function handleLegacy(request: NextRequest, context: RouteContext) {
  const { endpoint } = await context.params;
  if (!ENDPOINTS.has(endpoint)) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (endpoint === "blob-upload") {
    return handleBlobUpload(request);
  }

  const url = new URL(request.url);
  const handler = loadLegacyHandler(endpoint);
  const headers = new Headers();
  let statusCode = 200;
  let settled = false;

  return new Promise<Response>((resolve) => {
    const finish = (payload?: unknown) => {
      if (settled) return;
      settled = true;
      if (payload === undefined || payload === null) {
        resolve(new Response(null, { status: statusCode, headers }));
        return;
      }
      if (typeof payload === "string") {
        resolve(new Response(payload, { status: statusCode, headers }));
        return;
      }
      if (payload instanceof Uint8Array) {
        const bytes = new Uint8Array(payload);
        resolve(new Response(new Blob([bytes]), { status: statusCode, headers }));
        return;
      }
      if (!headers.has("content-type")) {
        headers.set("content-type", "application/json; charset=utf-8");
      }
      resolve(new Response(JSON.stringify(payload), { status: statusCode, headers }));
    };

    const res: LegacyResponse = {
      status(code) {
        statusCode = code;
        return res;
      },
      setHeader(name, value) {
        headers.set(name, Array.isArray(value) ? value.join(", ") : String(value));
        return res;
      },
      json(payload) {
        if (!headers.has("content-type")) {
          headers.set("content-type", "application/json; charset=utf-8");
        }
        finish(payload);
      },
      send: finish,
      end: finish,
    };

    readBody(request)
      .then((body) => {
        const req: LegacyRequest = {
          method: request.method,
          headers: requestHeaders(request),
          query: queryParams(request),
          body,
          url: `${url.pathname}${url.search}`,
        };
        return handler(req, res);
      })
      .then(() => finish())
      .catch((error) => {
        console.error(`legacy api ${endpoint} error:`, error);
        if (!settled) {
          resolve(
            Response.json(
              {
                error: "Internal server error",
                details: String((error && (error as Error).message) || error),
              },
              { status: 500 },
            ),
          );
        }
      });
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handleLegacy(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleLegacy(request, context);
}
