export async function onRequestPost({request,env}) {
  const json=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
  if(!env.AI)return json({error:"Chybí Workers AI binding."},503);
  if(request.headers.get("Origin")!==new URL(request.url).origin)return json({error:"Nepovolený původ."},403);
  const length=Number(request.headers.get("Content-Length"));
  if(length>1000000)return json({error:"Zvuk je příliš velký."},413);
  const bytes=new Uint8Array(await request.arrayBuffer());
  if(!bytes.length||bytes.length>1000000)return json({error:"Neplatná velikost zvuku."},400);
  try {
    let binary="";for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
    const result=await env.AI.run("@cf/openai/whisper-large-v3-turbo",{audio:btoa(binary),language:"en",task:"transcribe",vad_filter:true});
    return json({text:typeof result?.text==="string"?result.text.trim():""});
  }catch(e){return json({error:"Workers AI nedokázalo přepsat zvuk."},502);}
}