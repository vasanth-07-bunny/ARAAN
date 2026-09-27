export type AdvertisingType = "Interstitial" | "Direct link" | "Banner";

export type ShortLink = {
  id: string;
  url: string;
  shortUrl: string;
  alias: string;
  title: string;
  description: string;
  advertisingType: AdvertisingType;
  createdAt: string;
  clicks: number;
  earnings: number;
  status: "Active";
};

export type LinkFilters = {
  tab?: "all" | "hidden";
  alias?: string;
  search?: string;
  advertisingType?: "All advertising types" | AdvertisingType;
  sort?: "newest" | "oldest" | "clicks" | "earnings";
};

export const normalizeAlias = (value: string) => value.trim().toLowerCase().replace(/\s+/g, "-");

export const isValidAlias = (alias: string) => /^[a-z0-9][a-z0-9-]{2,30}$/.test(alias);

export function filterLinks(links: ShortLink[], filters: LinkFilters = {}) {
  const {
    tab = "all",
    alias = "",
    search = "",
    advertisingType = "All advertising types",
    sort = "newest",
  } = filters;
  const normalizedAlias = alias.toLowerCase();
  const normalizedSearch = search.toLowerCase();

  return [...links]
    .filter((link) => {
      const query = `${link.shortUrl} ${link.url} ${link.title} ${link.description}`.toLowerCase();
      return tab === "all"
        && (!normalizedAlias || link.alias.toLowerCase().includes(normalizedAlias))
        && (!normalizedSearch || query.includes(normalizedSearch))
        && (advertisingType === "All advertising types" || link.advertisingType === advertisingType);
    })
    .sort((a, b) => sort === "clicks"
      ? b.clicks - a.clicks
      : sort === "earnings"
        ? b.earnings - a.earnings
        : sort === "oldest"
          ? a.id.localeCompare(b.id)
          : b.id.localeCompare(a.id));
}

const formatCsvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

export function linksToCsv(links: ShortLink[]) {
  const headers = ["Short link", "Alias", "Title", "Description", "Destination", "Advertising type", "Clicks", "Earnings", "Created", "Status"];
  const rows = links.map((link) => [
    link.shortUrl,
    link.alias,
    link.title,
    link.description,
    link.url,
    link.advertisingType,
    link.clicks,
    `$${link.earnings.toFixed(2)}`,
    link.createdAt,
    link.status,
  ].map(formatCsvCell).join(","));
  return [headers.map(formatCsvCell).join(","), ...rows].join("\n");
}
