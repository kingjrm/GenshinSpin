import { NextRequest, NextResponse } from "next/server";

// In-memory cache: filename → actual CDN URL
const urlCache = new Map<string, string>();

// MediaWiki API: resolve File: → actual static CDN URL
async function resolveWikiImageUrl(filename: string): Promise<string | null> {
  const encoded = encodeURIComponent(`File:${filename}`);
  const apiUrl = `https://genshin-impact.fandom.com/api.php?action=query&titles=${encoded}&prop=imageinfo&iiprop=url&format=json&origin=*`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return null;
    const data = await res.json();

    // Navigate the MediaWiki response structure
    const pages = data?.query?.pages ?? {};
    for (const pageId of Object.keys(pages)) {
      const page = pages[pageId];
      const imageUrl = page?.imageinfo?.[0]?.url;
      if (imageUrl && typeof imageUrl === "string") {
        return imageUrl;
      }
    }
  } catch {
    // timeout or network error
  }
  return null;
}

// Fetch and stream the image with proper headers to bypass hotlink protection
async function fetchImage(imageUrl: string): Promise<Response | null> {
  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://genshin-impact.fandom.com/",
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return res;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const file = searchParams.get("file");

  if (!file || typeof file !== "string") {
    return new NextResponse("Missing file parameter", { status: 400 });
  }

  // Sanitize filename — only allow alphanumeric, underscores, hyphens, dots, spaces
  const sanitized = file.replace(/[^a-zA-Z0-9 _\-.()]/g, "");
  if (!sanitized) {
    return new NextResponse("Invalid filename", { status: 400 });
  }

  // Check cache
  let cdnUrl = urlCache.get(sanitized);

  if (!cdnUrl) {
    // Resolve via MediaWiki API
    cdnUrl = (await resolveWikiImageUrl(sanitized)) ?? undefined;
    if (cdnUrl) {
      urlCache.set(sanitized, cdnUrl);
    }
  }

  if (!cdnUrl) {
    return new NextResponse("Image not found", { status: 404 });
  }

  // Fetch the actual image server-side with Referer header
  const imageRes = await fetchImage(cdnUrl);
  if (!imageRes) {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }

  const contentType = imageRes.headers.get("content-type") ?? "image/png";
  const buffer = await imageRes.arrayBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
