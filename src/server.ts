import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

const CANONICAL_HOST = "salahjuniordev.vercel.app";

/**
 * 301-redirect crawlers from any non-canonical production host to the
 * canonical origin. Local dev and Lovable preview/sandbox hosts are exempt so
 * the in-editor preview keeps working.
 */
function canonicalHostRedirect(request: Request): Response | undefined {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") return undefined;

  const url = new URL(request.url);
  const host = url.host.toLowerCase();
  if (host === CANONICAL_HOST) return undefined;

  const hostname = url.hostname.toLowerCase();
  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".local");
  const isSandboxPreview =
    hostname.endsWith(".lovableproject.com") ||
    hostname.endsWith(".lovable.dev") ||
    (hostname.endsWith(".lovable.app") &&
      (hostname.startsWith("id-preview--") || hostname.includes("-dev.")));
  if (isLocal || isSandboxPreview) return undefined;

  url.protocol = "https:";
  url.host = CANONICAL_HOST;
  url.port = "";
  return Response.redirect(url.toString(), 301);
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const redirect = canonicalHostRedirect(request);
      if (redirect) return redirect;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
