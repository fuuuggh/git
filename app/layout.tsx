import { TailwindIndicator } from "@/components/main";
import { seoData } from "@/config/root/seo";
import { getUrl } from "@/lib/utils";
import "@/styles/tailwind.css";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { LocaleProvider } from "@/components/shared/locale-provider";
import { getRequestLocale } from "@/lib/i18n-server";

const fontSans = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | nook",
    default: seoData.title,
    absolute: seoData.absoluteTitle,
  },
  generator: seoData.author.name,
  applicationName: seoData.title,
  description: seoData.description,
  referrer: "origin-when-cross-origin",
  keywords: seoData.keywords,
  authors: [
    {
      name: seoData.author.name,
      url: seoData.author.twitterUrl,
    },
  ],
  creator: seoData.author.name,
  publisher: seoData.author.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(getUrl()),
  alternates: {
    canonical: "/",
  },
  // viewport: {
  //   width: "device-width",
  //   initialScale: 1,
  //   maximumScale: 1,
  //   userScalable: false,
  //   viewportFit: "cover",
  // },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/favicons/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    shortcut: ["/favicons/favicon-32x32.png"],
    apple: [
      { url: "/favicons/apple-icon.png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/favicons/apple-icon-precomposed.png",
      },
    ],
  },

  manifest: `${getUrl()}/favicons/manifest.json`,

  openGraph: {
    type: "website",
    locale: "en_US",
    url: getUrl(),
    title: seoData.title,
    description: seoData.description,
    siteName: seoData.title,
    images: [
      {
        // url: getOgImageUrl(metaData.title, metaData.subTitle, metaData.tags, '/'),
        url: `${getUrl()}/images/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: seoData.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoData.ogTitle,
    description: seoData.description,
    // images: [getOgImageUrl(metaData.title, metaData.subTitle, metaData.tags, '/')],
    images: `${getUrl()}/images/twitter-image.png`,
    creator: seoData.author.twitterAddress,
  },
  appleWebApp: {
    capable: true,
    title: seoData.title,
    statusBarStyle: "black-translucent",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"} suppressHydrationWarning>
      <body className={fontSans.variable}>
        <LocaleProvider locale={locale}>
          <div className="min-h-screen bg-background font-sans text-foreground">
            {children}
            <VercelAnalytics />
            <Toaster position="top-center" />
            <TailwindIndicator />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
