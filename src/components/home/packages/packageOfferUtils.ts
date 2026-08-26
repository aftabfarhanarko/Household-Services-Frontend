export interface DisplayPackage {
  id: number;
  title: string;
  price: string | null;
  image: string | null;
  features: string[];
  buttonText: string;
  variant: "light" | "popular" | "dark";
  badge?: string;
  description?: string;
  serviceId?: number;
  serviceName?: string;
  vendorId?: number;
  bookingsCount?: number;
}

function normalizePackageFeatures(pkg: any): string[] {
  // 1. Check features if it's a non-empty array
  if (Array.isArray(pkg.features) && pkg.features.length > 0) {
    const list = pkg.features
      .map((f: unknown) => String(f).trim())
      .filter((f: string) => f.length > 0);
    if (list.length > 0) return list;
  }

  // 2. Check features if it's a comma/newline separated string
  if (typeof pkg.features === "string" && pkg.features.trim()) {
    const list = pkg.features
      .split(/[,;\n]/)
      .map((f: string) => f.trim())
      .filter((f: string) => f.length > 0);
    if (list.length > 0) return list;
  }

  // 3. Check nested items / packageItems / nestedServices
  const itemsArray = pkg.items || pkg.packageItems || pkg.nestedServices || pkg.services || [];
  if (Array.isArray(itemsArray) && itemsArray.length > 0) {
    const list = itemsArray
      .map((it: any) => it.nestedService?.name || it.name || it.title || it.service?.name)
      .filter(Boolean);
    if (list.length > 0) return list;
  }

  // 4. Fallback: Extract short sentences from description if available
  if (typeof pkg.description === "string" && pkg.description.trim()) {
    const sentences = pkg.description
      .split(/(?<=[.!?])\s+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 8 && s.length < 80);
    if (sentences.length > 1) {
      return sentences.slice(0, 3);
    }
  }

  return [];
}

export function mapPackagesToDisplay(
  rawPackages: any[],
  options?: {
    serviceId?: number;
    serviceName?: string;
    serviceImage?: string;
    vendorId?: number;
    startIndex?: number;
  }
): DisplayPackage[] {
  const startIndex = options?.startIndex ?? 0;

  return rawPackages.map((pkg, idx) => {
    const globalIdx = startIndex + idx;
    const variant =
      globalIdx % 3 === 1 ? "popular" : globalIdx % 3 === 2 ? "dark" : "light";
    const features = normalizePackageFeatures(pkg);
    const idVal = typeof pkg.id === "number" ? pkg.id : globalIdx;
    let bookingsCount = 0;
    if (Array.isArray(pkg.bookings)) {
      bookingsCount = pkg.bookings.length;
    } else if (typeof pkg.bookings_count === "number") {
      bookingsCount = pkg.bookings_count;
    }

    return {
      id: pkg.id,
      title: (pkg.name || "Package").toUpperCase(),
      price: pkg.price != null && pkg.price !== ""
        ? Number(pkg.price).toLocaleString()
        : null,
      image: pkg.image || options?.serviceImage || null,
      features,
      buttonText: "Book Package",
      variant,
      badge: variant === "popular" ? "POPULAR" : undefined,
      description: pkg.description?.trim() || undefined,
      serviceId: options?.serviceId ?? pkg.service?.id,
      serviceName: options?.serviceName ?? pkg.service?.name ?? "",
      vendorId: options?.vendorId ?? pkg.vendor_id ?? pkg.service?.vendor?.id ?? pkg.service?.vendor_id,
      bookingsCount,
    };
  });
}
