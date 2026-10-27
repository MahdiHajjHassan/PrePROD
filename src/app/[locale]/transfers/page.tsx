import Link from "next/link";
import { pageLocale } from "@/i18n/server";
import { requirePageActor } from "@/server/auth/page";
import { parseTaskQuery } from "@/server/tasks/query";
import { DomainError } from "@/server/errors";
import { Transfers } from "@/features/transfers";
import { Alert } from "@/components/ui";
export const metadata = { robots: { index: false, follow: false } };
export default async function TransferPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale, t } = await pageLocale(params); await requirePageActor(locale); let invalid = false; let query;
  try { query = parseTaskQuery(await searchParams); } catch (error) { if (!(error instanceof DomainError)) throw error; invalid = true; query = parseTaskQuery({}); }
  const filters = new URLSearchParams(); for (const [key, value] of Object.entries(query)) if (value !== undefined) filters.set(key, String(value));
  return <><div className="page-heading"><div><h1>{t.transfers}</h1><p>{t.transferDescription}</p></div><Link href={`/${locale}/tasks?${filters}`}>{t.backToBoard}</Link></div>{invalid && <Alert tone="error">{t.VALIDATION}</Alert>}<Transfers locale={locale} query={filters.toString()} /></>;
}
