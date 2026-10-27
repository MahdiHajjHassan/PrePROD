"use client";
import { useParams } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
export default function Loading() { const { locale } = useParams(); const t = dictionaries[isLocale(locale) ? locale : "en"]; return <div className="stack" role="status" aria-busy="true"><p>{t.loading}</p><div className="loading-line" /><div className="loading-line" /><div className="loading-line" /></div>; }
