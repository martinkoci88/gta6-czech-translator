export async function onRequestPost({request,env}) {
  const fail=(error,status)=>Response.json({error},{status,headers:{"Cache-Control":"no-store"}});
  if(request.headers.get("Origin")!==new URL(request.url).origin)return fail("Nepovolený původ.",403);
  const key=env.ELEVENLABS_API_KEY;
  const voice=env.ELEVENLABS_VOICE_ID||"RxVyXZsJK1kay0fTKgd2";
  if(!key)return fail("Chybí ELEVENLABS_API_KEY.",503);
  let body;try{body=await request.json();}catch{return fail("Neplatný JSON.",400);}
  const text=typeof body?.text==="string"?body.text.trim():"";
  if(!text||text.length>500)return fail("Text musí mít 1 až 500 znaků.",400);
  // Require an explicitly configured rate limiter before enabling a paid public endpoint.
  if(!env.DUB_RATE_LIMITER)return fail("Dabing čeká na nastavení ochrany API.",503);
  const limit=await env.DUB_RATE_LIMITER.limit({key:request.headers.get("CF-Connecting-IP")||"unknown"});
  if(!limit.success)return fail("Limit dabingu překročen.",429);
  try{
    const r=await fetch("https://api.elevenlabs.io/v1/text-to-speech/"+encodeURIComponent(voice)+"?output_format=mp3_44100_128",{method:"POST",headers:{"xi-api-key":key.trim(),"Content-Type":"application/json","Accept":"audio/mpeg"},body:JSON.stringify({text,model_id:"eleven_multilingual_v2"}),signal:AbortSignal.timeout(12000)});
    if(!r.ok)return fail("ElevenLabs HTTP "+r.status,r.status===429?429:502);
    return new Response(r.body,{headers:{"Content-Type":"audio/mpeg","Cache-Control":"no-store"}});
  }catch{return fail("ElevenLabs není dostupný.",502);}
}
