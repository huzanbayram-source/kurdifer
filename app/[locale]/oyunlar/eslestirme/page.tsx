import { LOCALES, type Locale } from "@/lib/i18n";
import { EslestirmeOyun } from "./EslestirmeOyun";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function EslestirmePage({
  params,
}: {
  params: { locale: Locale };
}) {
  return <EslestirmeOyun locale={params.locale} />;
}
