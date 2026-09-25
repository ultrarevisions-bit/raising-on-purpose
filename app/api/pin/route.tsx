import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// Renders a Pinterest-style pin (1200x1800, 2:3):
// cover photo on top + sage brand panel with category eyebrow + serif title.
// Used by the n8n Pinterest workflow via:
//   /api/pin?title=...&eyebrow=...&img=...&badge=...

const SAGE_DARK = "#5D6B50";
const CREAM = "#FAF6EF";
const TERRA_LIGHT = "#E2A98C";
const TERRA = "#C96F4A";
const INK = "#3B2E26";

async function loadFont(
  family: string,
  weight: number
): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(
      `https://cdn.jsdelivr.net/fontsource/fonts/${family}@latest/latin-${weight}-normal.woff`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Raising On Purpose").slice(
    0,
    140
  );
  const eyebrow = (searchParams.get("eyebrow") || "Parenting")
    .toUpperCase()
    .slice(0, 48);
  const img = searchParams.get("img") || "";
  const badge = (searchParams.get("badge") || "").slice(0, 32);

  const [cormorant, dmSans] = await Promise.all([
    loadFont("cormorant-garamond", 600),
    loadFont("dm-sans", 700),
  ]);

  const fonts: {
    name: string;
    data: ArrayBuffer;
    weight: 600 | 700;
    style: "normal";
  }[] = [];
  if (cormorant)
    fonts.push({ name: "Cormorant", data: cormorant, weight: 600, style: "normal" });
  if (dmSans)
    fonts.push({ name: "DM Sans", data: dmSans, weight: 700, style: "normal" });

  // Shrink long titles so they fit the panel without overflow.
  const titleSize = title.length > 95 ? 70 : title.length > 65 ? 82 : 94;

  // Verify the cover actually exists; otherwise render the text-only variant
  // (satori throws on unresolvable image URLs, so never pass a dead link).
  let imgOk = false;
  if (img) {
    try {
      const check = await fetch(img, { next: { revalidate: 3600 } });
      const ct = check.headers.get("content-type") || "";
      imgOk = check.ok && ct.startsWith("image/");
    } catch {
      imgOk = false;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 1800,
          display: "flex",
          flexDirection: "column",
          backgroundColor: INK,
          position: "relative",
        }}
      >
        {imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            width={1200}
            height={1120}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            style={{ width: 1200, height: 1120, backgroundColor: "#7A8B69" }}
          />
        )}

        {/* Brand pill */}
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 48,
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(59,46,38,0.62)",
            borderRadius: 999,
            padding: "14px 30px",
            color: CREAM,
            fontFamily: dmSans ? "'DM Sans', sans-serif" : "sans-serif",
            fontWeight: 700,
            fontSize: 29,
            letterSpacing: 5,
          }}
        >
          RAISING ON PURPOSE
        </div>

        {/* Title panel */}
        <div
          style={{
            width: 1200,
            height: 680,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: SAGE_DARK,
            padding: "64px 84px",
          }}
        >
          <div
            style={{
              display: "flex",
              color: TERRA_LIGHT,
              fontFamily: dmSans ? "'DM Sans', sans-serif" : "sans-serif",
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: 7,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              color: CREAM,
              fontFamily: cormorant ? "Cormorant, serif" : "serif",
              fontWeight: 600,
              fontSize: titleSize,
              lineHeight: 1.08,
              marginTop: 26,
            }}
          >
            {title}
          </div>
          {badge ? (
            <div
              style={{
                display: "flex",
                marginTop: 34,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: TERRA,
                  borderRadius: 999,
                  padding: "12px 30px",
                  color: CREAM,
                  fontFamily: dmSans ? "'DM Sans', sans-serif" : "sans-serif",
                  fontWeight: 700,
                  fontSize: 30,
                  letterSpacing: 3,
                }}
              >
                {"\u2022  " + badge.toUpperCase()}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    ),
    { width: 1200, height: 1800, fonts }
  );
}
