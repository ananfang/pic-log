import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pic Log",
  description: "Capture your words in the pic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
