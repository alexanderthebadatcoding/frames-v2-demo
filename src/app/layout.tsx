import type { Metadata } from "next";

import "~/app/globals.css";
import { Providers } from "~/app/providers";

const frame = {
  version: "next",
  imageUrl: "https://www.scoreb.site/og-image.png",
  button: {
    title: "See CFB Scores",
    action: {
      type: "launch_frame",
      name: "Scoreboard Demo",
      url: "https://scoreframe.vercel.app",
      splashImageUrl: "https://www.scoreb.site/og-image.png",
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Golf Score",
    openGraph: {
      title: "Golf Score",
      description: "A Farcaster Frames v2 Golf Score app.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
