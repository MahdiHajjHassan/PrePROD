import { pageLocale } from "@/i18n/server";
import { formatDate } from "@/i18n/config";
import { requirePageActor } from "@/server/auth/page";
import { getServices } from "@/server/services";
import { Badge, EmptyState } from "@/components/ui";
import { Refresh } from "@/components/preferences";
import { ReadNotification } from "@/features/notifications";
export const metadata = { robots: { index: false, follow: false } };
export default async function Notifications({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = await pageLocale(params); const actor = await requirePageActor(locale); const result = await (await getServices()).notifications.list(actor);
  return <><div className="page-heading"><div><h1>{t.notifications}</h1><p>{t.notificationsDescription}</p></div><div className="actions"><Refresh label={t.refresh} />{result.unreadCount > 0 && <ReadNotification locale={locale} />}</div></div><p>{t.unread}: {result.unreadCount}</p>{result.items.length ? <ul className="notification-list">{result.items.map((item) => <li key={item.id}><div className="stack"><p><strong>{t[item.event.entityType]} · {t[item.event.action]}</strong>: <bdi>{item.event.label}</bdi></p><div className="task-meta"><time dateTime={item.event.createdAt}>{formatDate(item.event.createdAt, locale)}</time><Badge tone={item.readAt ? "neutral" : "accent"}>{item.readAt ? t.read : t.unread}</Badge></div></div>{!item.readAt && <ReadNotification locale={locale} id={item.id} />}</li>)}</ul> : <EmptyState title={t.noNotifications}>{t.noNotificationsHelp}</EmptyState>}</>;
}
