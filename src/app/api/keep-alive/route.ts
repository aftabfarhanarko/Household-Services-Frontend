import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://home-services-backend-b6v4.onrender.com";

  try {
    const res = await fetch(`${apiUrl}/health`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    const data = await res.json().catch(() => null);

    return NextResponse.json({
      status: "success",
      message: "Render backend pinged successfully",
      backendStatusCode: res.status,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to ping Render backend",
        error: error?.message || String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
