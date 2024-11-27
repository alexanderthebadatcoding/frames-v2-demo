export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    config: {
      version: "0.0.0",
      name: "College Football v2 Frame",
      icon: "https://www.scoreb.site/og-image.png",
      splashImage: "https://www.scoreb.site/og-image.png",
      splashBackgroundColor: "#0F172A",
      homeUrl: appUrl,
      fid: 319054,
      key: "",
      signature: "",
    },
  };

  return Response.json(config);
}
