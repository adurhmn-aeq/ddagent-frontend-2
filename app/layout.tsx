import "../styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neo VDD - AI-Powered Video Due Dilligence",
  openGraph: {
    title: "Neo VDD - AI-Powered Video Due Dilligence",
    description:
      "AI Video DD Agent.",
    images: [
      {
        url: "https://demo.useliftoff.com/opengraph-image",
      },
    ],
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Neo VDD - AI-Powered Video Due Dilligence",
  //   description:
  //     "Neo VDD - AI-Powered Video Due Dilligence",
  //   images: ["https://demo.useliftoff.com/opengraph-image"],
  //   creator: "@tmeyer_me",
  // },
  // metadataBase: new URL("https://demo.useliftoff.com"),
  // themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-sidebar">
      <body className="scroll-smooth antialiased [font-feature-settings:'ss01'">
        {children}
      </body>
    </html>
  );
}
