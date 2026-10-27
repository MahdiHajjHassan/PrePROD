"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Feedback } from "@/components/feedback";
import { dictionaries } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { request, useMutation } from "./api";
export function ReadNotification({ locale, id }: { locale: Locale; id?: string }) {
  const t = dictionaries[locale]; const mutation = useMutation(); const router = useRouter();
  return <div className="stack"><Button variant="secondary" disabled={mutation.pending} onClick={() => void mutation.run(async () => { await request(id ? `/api/notifications/${id}` : "/api/notifications/read-all", id ? "PATCH" : "POST", {}); router.refresh(); })}>{mutation.pending ? t.pending : id ? t.markRead : t.markAllRead}</Button><Feedback error={mutation.error} t={t} locale={locale} /></div>;
}
