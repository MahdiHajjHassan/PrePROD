"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, CheckboxField, Tabs } from "@/components/ui";
import { Feedback } from "@/components/feedback";
import { dictionaries } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { decodeResponse, RequestError, useMutation } from "./api";
export function Transfers({ locale, query }: { locale: Locale; query: string }) {
  const t = dictionaries[locale]; const [format, setFormat] = useState("json"); const [created, setCreated] = useState(0); const file = useRef<HTMLInputElement>(null); const importing = useMutation(); const exporting = useMutation(); const router = useRouter();
  return <div className="stack"><Tabs label={t.format} value={format} options={[{ value: "json", label: t.json }, { value: "csv", label: t.csv }]} onChange={(value) => { setFormat(value); importing.clear(); exporting.clear(); }}>
    <div className="transfer-grid"><section className="stack"><h2>{t.import}</h2><Alert>{t.publicWarning}</Alert><p>{t.importHelp}</p><code className="ltr">{format === "json" ? '[{"title":"…","description":"","status":"OPEN","priority":"NORMAL"}]' : "title,description,status,priority"}</code><Alert>{t.appendWarning}</Alert>
      <form className="stack" onSubmit={(event) => { event.preventDefault(); const formElement = event.currentTarget; const selected = file.current?.files?.[0]; void importing.run(async () => {
        if (!selected) throw new RequestError("VALIDATION", { file: ["required"] });
        if (selected.size > 256 * 1024) throw new RequestError("PAYLOAD_TOO_LARGE");
        let content: string; try { content = new TextDecoder("utf-8", { fatal: true }).decode(await selected.arrayBuffer()); } catch { throw new RequestError("VALIDATION", { file: ["utf8"] }); }
        const response = await fetch(`/api/transfers/import?format=${format}`, { method: "POST", credentials: "same-origin", headers: { "Content-Type": format === "json" ? "application/json" : "text/csv" }, body: content });
        const result = await decodeResponse<{ created: number }>(response); setCreated(result.created); formElement.reset(); router.refresh();
      }); }}><div className="field"><label htmlFor="import-file">{t.file}</label><input ref={file} id="import-file" name="file" type="file" accept={format === "json" ? ".json,application/json" : ".csv,text/csv"} required /></div><CheckboxField label={t.appendAccept} required /><Feedback error={importing.error} success={importing.success && `${t.imported}: ${created}`} t={t} locale={locale} /><Button disabled={importing.pending}>{importing.pending ? t.pending : t.confirmImport}</Button></form>
    </section><section className="stack"><h2>{t.export}</h2><p>{t.exportHelp}</p><Button disabled={exporting.pending} onClick={() => void exporting.run(async () => {
      const params = new URLSearchParams(query); params.set("format", format); params.delete("page");
      const response = await fetch(`/api/transfers/export?${params}`, { credentials: "same-origin" }); if (!response.ok) await decodeResponse(response);
      const url = URL.createObjectURL(await response.blob()); const link = document.createElement("a"); link.href = url; link.download = `tasks.${format}`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    })}>{exporting.pending ? t.pending : `${t.download} ${t[format === "json" ? "json" : "csv"]}`}</Button><Feedback error={exporting.error} t={t} locale={locale} /></section></div>
  </Tabs></div>;
}
