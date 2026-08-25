import { Metadata } from "next";
import CategoryServicesPage from "./CategoryServicesPage";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://home-services-backend-b6v4.onrender.com";
    const res = await fetch(
      `${apiBase}/category/${id}`,
      { next: { revalidate: 3600 } }
    );
    const json = await res.json();
    const cat = json?.data || json;
    const name = cat?.name || "Category";
    return {
      title: `${name} Services - Rajseba`,
      description: cat?.description || `Browse and book expert ${name} services in Bangladesh.`,
    };
  } catch {
    return {
      title: "Category Services - Rajseba",
      description: "Browse professional home services.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF6014]" />
        </div>
      }
    >
      <CategoryServicesPage categoryId={id} />
    </Suspense>
  );
}
