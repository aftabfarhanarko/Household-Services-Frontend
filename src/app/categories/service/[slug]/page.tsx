import { Metadata } from "next";
import CategoryDetailClientPage from "./CategoryDetailClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://home-services-backend-b6v4.onrender.com";
    const allRes = await fetch(`${apiBase}/services/public`, {
      next: { revalidate: 3600 },
    });
    const allJson = await allRes.json();
    const serviceObj = allJson?.data?.find((s: any) => s.slug === slug);
    if (!serviceObj) {
      return {
        title: "Category Details - Rajseba",
        description: "Professional service category details.",
      };
    }

    const res = await fetch(`${apiBase}/services/${serviceObj.id}`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const service = json?.data;

    if (!service) {
      return {
        title: "Category Details - Rajseba",
        description: "Professional service category details.",
      };
    }

    return {
      title: `${service.name} - Expert Service Category | Rajseba`,
      description: service.description || `Book expert ${service.name} services in Bangladesh. Professional and trusted technicians at your service.`,
      openGraph: {
        title: `${service.name} - Rajseba`,
        description: service.description || `Book expert ${service.name} services in Bangladesh.`,
        url: `https://rajseba.com/categories/service/${slug}`,
        siteName: "Rajseba",
        locale: "en_US",
        type: "website",
      },
    };
  } catch {
    return {
      title: "Category Details - Rajseba",
      description: "Professional service category details.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryDetailClientPage slug={slug} />;
}
