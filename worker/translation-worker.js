/**
 * GTA Czech Subtitles – Cloudflare Worker translation proxy
 *
 * Deploy as a Cloudflare Worker. Add DEEPL_AUTH_KEY as a secret:
 *   npx wrangler secret put DEEPL_AUTH_KEY
 *
 * The browser calls POST /translate with { "text": "..." }.
 * The API key stays on the server and is never exposed to the iPhone/browser.
 */
const ALLOWED_ORIGINS = new Set([
  "https://martinkoci88.github.io",
  "https://martinkoci88.github.io"
]);

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://martinkoci88.github.io";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(origin)
    }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders(origin),
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/translate") {
      return json({ error: "Použij POST /translate." }, 404, origin);
    }

    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json({ error: "Nepovolený původ požadavku." }, 403, origin);
    }

    if (!env.DEEPL_AUTH_KEY) {
      return json({ error: "Na serveru chybí DEEPL_AUTH_KEY." }, 503, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Neplatný JSON požadavek." }, 400, origin);
    }

    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text || text.length > 500) {
      return json({ error: "Text musí mít 1 až 500 znaků." }, 400, origin);
    }

    try {
      const response = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          "Authorization": `DeepL-Auth-Key ${env.DEEPL_AUTH_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: [text],
          source_lang: "EN",
          target_lang: "CS"
        }),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const detail = await response.text();
        return json({
          error: "DeepL vrátil chybu.",
          provider_status: response.status,
          detail: detail.slice(0, 300)
        }, response.status === 429 ? 429 : 502, origin);
      }

      const data = await response.json();
      const translatedText = data?.translations?.[0]?.text;
      if (typeof translatedText !== "string" || !translatedText.trim()) {
        return json({ error: "DeepL nevrátil překlad." }, 502, origin);
      }

      return json({ translatedText: translatedText.trim(), provider: "DeepL" }, 200, origin);
    } catch (error) {
      return json({
        error: error?.name === "TimeoutError"
          ? "Překladová služba neodpověděla včas."
          : "Nepodařilo se spojit s překladovou službou."
      }, 502, origin);
    }
  }
};
