import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, readTheme } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { getPageActor } from "@/server/auth/page";
import { getServices } from "@/server/services";
import { Logout, Preferences } from "@/components/preferences";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const t = dictionaries[locale];
  return { title: { default: t.brand, template: `%s · ${t.brand}` }, description: t.metadataDescription };
}
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const t = dictionaries[locale];
  const actor = await getPageActor(); const theme = readTheme((await cookies()).get("__Host-taskboard_theme")?.value);
  const unread = actor ? await (await getServices()).notifications.unreadCount(actor) : 0;
  return <><a className="skip-link" href="#main">{t.skip}</a><header className="site-header"><div className="shell header-inner"><Link className="brand" href={`/${locale}/tasks`}>{t.brand}</Link>
    <nav aria-label={t.mainNavigation} className="main-nav"><Link href={`/${locale}/tasks`}>{t.board}</Link>{actor ? <><Link href={`/${locale}/transfers`}>{t.transfers}</Link><Link href={`/${locale}/notifications`}>{t.notifications}{unread > 0 && <span className="count">{unread}</span>}</Link><Link href={`/${locale}/activity`}>{t.activity}</Link><Link href={`/${locale}/account`}>{t.account}</Link>{actor.role === "ADMIN" && <Link href={`/${locale}/admin/users`}>{t.users}</Link>}<Logout locale={locale} /></> : <><Link href={`/${locale}/login`}>{t.login}</Link><Link href={`/${locale}/register`}>{t.register}</Link></>}</nav>
    <Suspense><Preferences locale={locale} theme={theme} /></Suspense></div></header><main className="shell main" id="main">{children}</main><footer className="shell footer"><Link href={`/${locale}/privacy`}>{t.privacy}</Link><Link href={`/${locale}/terms`}>{t.terms}</Link></footer></>;
}
