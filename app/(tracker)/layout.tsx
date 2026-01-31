import { LanguageSelector } from "@/components/language-selector";

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LanguageSelector />
      {children}
    </>
  );
}
