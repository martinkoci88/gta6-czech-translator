export async function onRequestPost({ request, env }) {
  const json = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
  if (request.headers.get("Origin") !== new URL(request.url).origin) return json({error:"Nepovolený původ."},403);
  if (!env.DEEPL_AUTH_KEY) return json({error:"Chybí DEEPL_AUTH_KEY."},503);
  let body;
  try { body = await request.json(); } catch { return json({error:"Neplatný JSON."},400); }
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 500) return json({error:"Text musí mít 1 až 500 znaků."},400);
  const key = env.DEEPL_AUTH_KEY.trim();
  const host = key.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com";
  try {
    const response = await fetch(host + "/v2/translate", {
      method:"POST", headers:{"Authorization":"DeepL-Auth-Key " + key,"Content-Type":"application/json"},
      body:JSON.stringify({text:[text],source_lang:"EN",target_lang:"CS"}),
      signal:AbortSignal.timeout(8000)
    });
    if (!response.ok) return json({error:"DeepL HTTP " + response.status}, response.status === 429 ? 429 : 502);
    const data = await response.json();
    const translatedText = data?.translations?.[0]?.text;
    if (!translatedText) return json({error:"DeepL nevrátil překlad."},502);
    return json({translatedText,provider:"DeepL"});
  } catch { return json({error:"DeepL není dostupný."},502); }
}
