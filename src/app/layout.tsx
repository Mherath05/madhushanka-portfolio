import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Madhushanka Herath | Full Stack Software Engineer",
  description: "Portfolio of Madhushanka Herath - Associate Software Engineer specializing in React, Next.js, PHP, React Native, and Supabase.",
  keywords: [
    "Madhushanka Herath",
    "Software Engineer",
    "Full Stack Engineer",
    "React Developer",
    "Next.js Developer",
    "PHP Developer",
    "Sri Lanka Developer",
    "Rabbit Solutions",
  ],
  authors: [{ name: "Madhushanka Herath" }],
  openGraph: {
    title: "Madhushanka Herath | Full Stack Software Engineer",
    description: "Personal portfolio and technical showcase of Madhushanka Herath.",
    url: "https://madhushanka.dev",
    siteName: "Madhushanka Herath Portfolio",
    images: [
      {
        url: "/img/my_img.png",
        width: 1200,
        height: 630,
        alt: "Madhushanka Herath Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Madhushanka Herath | Full Stack Software Engineer",
    description: "Associate Software Engineer at Rabbit Solutions Pvt Ltd.",
    images: ["/img/my_img.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body suppressHydrationWarning className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
