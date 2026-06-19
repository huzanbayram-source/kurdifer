import { LOCALES, type Locale } from "@/lib/i18n";
import { KelimeBulmacaOyun } from "./KelimeBulmacaOyun";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function KelimeBulmacaPage({
  params,
}: {
  params: { locale: Locale };
}) {
  return <KelimeBulmacaOyun locale={params.locale} />;
}
