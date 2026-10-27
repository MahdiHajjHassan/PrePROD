"use client";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Dialog, FormField, SelectField, TextField } from "@/components/ui";
import { Feedback } from "@/components/feedback";
import { dictionaries } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { TaskDTO, TaskInput } from "@/shared/tasks";
import { RequestError, request, useMutation } from "./api";
function TaskForm({ locale, task, onDone }: { locale: Locale; task?: TaskDTO; onDone: () => void }) {
  const t = dictionaries[locale]; const mutation = useMutation(); const router = useRouter(); const descriptionId = useId();
  return <form className="stack form" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const data = { title: String(form.get("title")).trim(), description: String(form.get("description")), status: form.get("status"), priority: form.get("priority"), ...(task ? { version: task.version } : {}) }; void mutation.run(async () => { if (!data.title) throw new RequestError("VALIDATION", { title: ["required"] }); await request(task ? `/api/tasks/${task.id}` : "/api/tasks", task ? "PUT" : "POST", data); onDone(); router.refresh(); }); }}>
    <Alert>{t.publicWarning}</Alert><TextField name="title" label={t.title} required maxLength={120} defaultValue={task?.title ?? ""} error={mutation.error?.fields?.title ? t.invalidField : undefined} />
    <FormField htmlFor={descriptionId} label={t.description}><textarea id={descriptionId} name="description" maxLength={1000} defaultValue={task?.description ?? ""} /></FormField>
    <div className="form-grid"><SelectField name="status" label={t.status} defaultValue={task?.status ?? "OPEN"}>{(["OPEN", "DONE"] as const).map((value) => <option key={value} value={value}>{t[value]}</option>)}</SelectField><SelectField name="priority" label={t.priority} defaultValue={task?.priority ?? "NORMAL"}>{(["LOW", "NORMAL", "HIGH"] as const).map((value) => <option key={value} value={value}>{t[value]}</option>)}</SelectField></div>
    <Feedback error={mutation.error} t={t} locale={locale} onRefresh={onDone} /><div className="actions"><Button disabled={mutation.pending}>{mutation.pending ? t.pending : task ? t.save : t.createTask}</Button><Button variant="secondary" type="button" disabled={mutation.pending} onClick={onDone}>{t.cancel}</Button></div>
  </form>;
}
export function NewTask({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false); const t = dictionaries[locale];
  return <section className="stack">{open ? <><h2>{t.newTask}</h2><TaskForm locale={locale} onDone={() => setOpen(false)} /></> : <div><Button onClick={() => setOpen(true)}>{t.newTask}</Button></div>}</section>;
}
export function TaskActions({ locale, task }: { locale: Locale; task: TaskDTO }) {
  const t = dictionaries[locale]; const [editing, setEditing] = useState(false); const [deleting, setDeleting] = useState(false); const mutation = useMutation(); const router = useRouter();
  async function updateStatus(status: TaskInput["status"]) { await request(`/api/tasks/${task.id}`, "PUT", { status, version: task.version }); router.refresh(); }
  return <div className="stack">{editing ? <TaskForm key={task.version} locale={locale} task={task} onDone={() => setEditing(false)} /> : <div className="actions"><Button variant="secondary" disabled={mutation.pending} onClick={() => { mutation.clear(); setEditing(true); }}>{t.edit}</Button><Button variant="secondary" disabled={mutation.pending} onClick={() => void mutation.run(() => updateStatus(task.status === "OPEN" ? "DONE" : "OPEN"))}>{task.status === "OPEN" ? t.markDone : t.reopen}</Button><Button variant="secondary" disabled={mutation.pending} onClick={() => { mutation.clear(); setDeleting(true); }}>{t.delete}</Button></div>}
    {!deleting && <Feedback error={mutation.error} success={mutation.success && t.saved} t={t} locale={locale} onRefresh={mutation.clear} />}
    <Dialog open={deleting} onClose={() => setDeleting(false)} title={t.deleteTask} closeLabel={t.cancel}><p>{t.deleteTaskHelp}</p><p><bdi>{task.title}</bdi></p><Feedback error={mutation.error} t={t} locale={locale} onRefresh={() => { mutation.clear(); setDeleting(false); }} /><Button variant="danger" disabled={mutation.pending} onClick={() => void mutation.run(async () => { await request(`/api/tasks/${task.id}`, "DELETE", { version: task.version }); setDeleting(false); router.refresh(); })}>{mutation.pending ? t.pending : t.confirmDelete}</Button></Dialog>
  </div>;
}
