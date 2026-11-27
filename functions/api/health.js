export function onRequestGet({env}) {
  return Response.json({
    version:"V49",
    configuration:{
      translation:Boolean(env.DEEPL_AUTH_KEY),
      whisper:Boolean(env.AI && typeof env.AI.run==="function"),
      dubbing:Boolean(env.ELEVENLABS_API_KEY && env.DUB_RATE_LIMITER && typeof env.DUB_RATE_LIMITER.limit==="function"),
      jason:Boolean(env.ELEVENLABS_JASON_VOICE_ID),
      lucia:Boolean(env.ELEVENLABS_LUCIA_VOICE_ID)
    }
  },{headers:{"Cache-Control":"no-store"}});
}
