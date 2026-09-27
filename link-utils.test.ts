import { describe, expect, it } from "vitest";
import { filterLinks, isValidAlias, linksToCsv, normalizeAlias, type ShortLink } from "../link-utils";

const links: ShortLink[] = [
  {
    id: "1",
    url: "https://example.com/launch",
    shortUrl: "https://aro.li/summer-sale",
    alias: "summer-sale",
    title: "Summer launch",
    description: "Limited-time offer",
    advertisingType: "Interstitial",
    createdAt: "Yesterday",
    clicks: 120,
    earnings: 1.2,
    status: "Active",
  },
  {
    id: "2",
    url: "https://example.com/guide",
    shortUrl: "https://aro.li/creator-guide",
    alias: "creator-guide",
    title: "Creator guide",
    description: "Publishing tips",
    advertisingType: "Banner",
    createdAt: "Today",
    clicks: 420,
    earnings: 4.2,
    status: "Active",
  },
];

describe("link helpers", () => {
  it("normalizes aliases and enforces the vanity URL format", () => {
    expect(normalizeAlias("  Summer Sale  ")).toBe("summer-sale");
    expect(isValidAlias("summer-sale")).toBe(true);
    expect(isValidAlias("ab")).toBe(false);
    expect(isValidAlias("bad_alias")).toBe(false);
    expect(isValidAlias("-starts-with-dash")).toBe(false);
  });

  it("filters by alias, metadata, and advertising type without mutating the source", () => {
    expect(filterLinks(links, { alias: "creator" }).map((link) => link.id)).toEqual(["2"]);
    expect(filterLinks(links, { search: "publishing tips" }).map((link) => link.id)).toEqual(["2"]);
    expect(filterLinks(links, { advertisingType: "Interstitial" }).map((link) => link.id)).toEqual(["1"]);
    expect(links.map((link) => link.id)).toEqual(["1", "2"]);
  });

  it("sorts filtered links by clicks and earnings", () => {
    expect(filterLinks(links, { sort: "clicks" }).map((link) => link.id)).toEqual(["2", "1"]);
    expect(filterLinks(links, { sort: "earnings" }).map((link) => link.id)).toEqual(["2", "1"]);
    expect(filterLinks(links, { tab: "hidden" })).toEqual([]);
  });

  it("serializes link metadata and escapes CSV values", () => {
    const csv = linksToCsv([{ ...links[0], title: 'Summer, "launch"' }]);
    expect(csv.split("\n")).toHaveLength(2);
    expect(csv).toContain('"Short link","Alias","Title"');
    expect(csv).toContain('"Summer, ""launch"""');
    expect(csv).toContain('"120","$1.20"');
  });
});
