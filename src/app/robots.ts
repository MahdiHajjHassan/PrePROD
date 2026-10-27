import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { loadConfig } from "@/server/config";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", ...locales.flatMap((locale) => ["account", "admin", "notifications", "activity", "transfers", "login", "register"].map((path) => `/${locale}/${path}`))] }, sitemap: `${loadConfig(process.env).appOrigin}/sitemap.xml` }; }
