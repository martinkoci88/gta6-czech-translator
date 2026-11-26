"""Local preparation of user-supplied, authorized TSV exports. No upload to GitHub."""
import argparse, csv, json, re, os, urllib.request, time
from pathlib import Path

p=argparse.ArgumentParser()
p.add_argument("source")
p.add_argument("output")
p.add_argument("--limit",type=int,default=100)
p.add_argument("--translate",action="store_true")
p.add_argument("--endpoint",choices=["free","pro"],default="free")
a=p.parse_args()
if a.limit<1: p.error("limit must be positive")
out=Path(a.output)
seen={}
if out.exists():
    for row in json.loads(out.read_text(encoding="utf-8"))["entries"]:
        seen[row["en"].casefold()]=row
pending={}
with open(a.source,encoding="utf-8-sig",newline="") as f:
    reader=csv.DictReader(f,delimiter="\t")
    if not reader.fieldnames or not set(reader.fieldnames).intersection({"text","en"}):
        raise SystemExit("Missing text/en column")
    for row in reader:
        en=(row.get("en") or row.get("text") or "").strip()
        meta=" ".join(row.get(k) or "" for k in ("category","group","table"))
        if re.search(r"radio|music|menu|hud",meta,re.I): continue
        if not 5<=len(en)<=500 or not re.search(r"[A-Za-z]",en): continue
        key=en.casefold()
        if key not in seen: pending.setdefault(key,en)
        if len(pending)>=a.limit: break
print("Candidate lines:",len(pending),"Existing translations:",len(seen))
if not a.translate:
    print("Dry run; no API requests or output changes.")
    raise SystemExit
key=os.environ.get("DEEPL_AUTH_KEY")
if not key: raise SystemExit("Set DEEPL_AUTH_KEY locally first")
url="https://api-free.deepl.com/v2/translate" if a.endpoint=="free" else "https://api.deepl.com/v2/translate"
items=list(pending.items())
for i in range(0,len(items),25):
    batch=items[i:i+25]
    body=json.dumps({"text":[v for k,v in batch],"source_lang":"EN","target_lang":"CS"}).encode()
    req=urllib.request.Request(url,data=body,headers={"Authorization":"DeepL-Auth-Key "+key,"Content-Type":"application/json"})
    with urllib.request.urlopen(req,timeout=60) as response:
        translations=json.load(response)["translations"]
    if len(translations)!=len(batch): raise RuntimeError("Unexpected response length")
    for (k,en),tr in zip(batch,translations):
        seen[k]={"en":en,"cs":tr["text"]}
    tmp=out.with_suffix(out.suffix+".tmp")
    tmp.write_text(json.dumps({"entries":list(seen.values())},ensure_ascii=False),encoding="utf-8")
    tmp.replace(out)
    time.sleep(0.5)
print("Saved",len(seen),"translations locally.")
