import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BizConnect Cameroun — Trouvez les meilleures entreprises",
    template: "%s | BizConnect Cameroun",
  },
  description:
    "La plateforme qui connecte clients et professionnels au Cameroun. Trouvez et contactez les meilleures entreprises de services à Douala et dans tout le Cameroun.",
  keywords: [
    "entreprises",
    "Cameroun",
    "Douala",
    "services",
    "professionnels",
    "BizConnect",
  ],
  openGraph: {
    type: "website",
    locale: "fr_CM",
    siteName: "BizConnect Cameroun",
    title: "BizConnect Cameroun — Trouvez les meilleures entreprises",
    description:
      "La plateforme qui connecte clients et professionnels au Cameroun.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakartaSans.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
