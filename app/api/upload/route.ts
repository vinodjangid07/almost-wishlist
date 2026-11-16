import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || `wish_${Date.now()}.jpg`;

  if (!request.body) {
    return NextResponse.json({ error: "No file body provided" }, { status: 400 });
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn("BLOB_READ_WRITE_TOKEN is missing in environment variables.");
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN is missing" },
        { status: 500 }
      );
    }

    // Try private access since the store is configured as private
    let blob;
    try {
      blob = await put(filename, request.body, {
        access: "private",
      });
    } catch (privateErr) {
      // Fallback to public if user switches to a public store
      blob = await put(filename, request.body, {
        access: "public",
      });
    }

    // If private, route through our streaming endpoint
    const finalUrl = blob.url.startsWith("http") && !blob.pathname
      ? blob.url
      : `/api/view?pathname=${encodeURIComponent(blob.pathname)}`;

    return NextResponse.json({
      ...blob,
      url: finalUrl,
    });
  } catch (error) {
    console.error("Vercel Blob upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Upload failed" },
      { status: 500 }
    );
  }
}
