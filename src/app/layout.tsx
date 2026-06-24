import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "איתן ברון - קורות חיים",
  description: "קורות החיים האינטראקטיביים של איתן ברון",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
