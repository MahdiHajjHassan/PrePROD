import { pageLocale } from "@/i18n/server";
import { formatDate } from "@/i18n/config";
import { requirePageActor } from "@/server/auth/page";
import { getServices } from "@/server/services";
import { DataTable, EmptyState } from "@/components/ui";
import { Refresh } from "@/components/preferences";
export const metadata = { robots: { index: false, follow: false } };
export default async function Activity({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = await pageLocale(params); const actor = await requirePageActor(locale); const result = await (await getServices()).activity.getSummary(actor);
  const metrics = [{ key: "created", label: t.metricCreated }, { key: "completed", label: t.metricCompleted }, { key: "deleted", label: t.metricDeleted }] as const;
  const peak = Math.max(1, ...result.days.flatMap((day) => [day.created, day.completed, day.deleted]));
  const empty = Object.values(result.current).every((value) => value === 0);
  return <><div className="page-heading"><div><h1>{t.activity}</h1><p>{t.activityDescription}</p></div><Refresh label={t.refresh} /></div>
    <dl className="activity-summary">{metrics.map(({ key, label }) => <div key={key}><dt>{label}</dt><dd className="metric">{result.current[key]}</dd><dd>{t.change}: <bdi>{result.delta[key] > 0 ? "+" : ""}{result.delta[key]}</bdi></dd></div>)}</dl>
    {empty && <EmptyState title={t.noActivity}>{t.noActivityHelp}</EmptyState>}
    <section aria-labelledby="activity-trend"><h2 id="activity-trend">{t.trend}</h2><div className="chart-legend">{metrics.map(({ key, label }) => <span key={key}><span className={`legend-marker ${key}`} aria-hidden="true" />{label}</span>)}</div><div className="chart" aria-hidden="true">{result.days.map((day) => <div className="chart-column" key={day.date}><div className="chart-day">{metrics.map(({ key }) => <div className={`chart-bar ${key}`} key={key} style={{ height: `${day[key] / peak * 100}%` }} />)}</div><span className="chart-label">{new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(new Date(day.date))}</span></div>)}</div>
      <DataTable caption={t.trend} headings={[t.date, ...metrics.map((metric) => metric.label)]}>{result.days.map((day) => <tr key={day.date}><th scope="row"><time dateTime={day.date}>{formatDate(day.date, locale)}</time></th>{metrics.map(({ key }) => <td key={key}>{day[key]}</td>)}</tr>)}</DataTable>
    </section></>;
}
