import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import App from "../App";

describe("link management integration", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    window.innerWidth = 1200;
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:vitest");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
  });

  it("creates a link with a custom alias and surfaces it in Manage Links", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText("Paste a URL, e.g. yoursite.com/article"), "example.com/summer");
    await user.type(screen.getByPlaceholderText("my-campaign"), "Summer Sale");
    await user.type(screen.getByPlaceholderText("Campaign title"), "Summer launch");
    await user.click(screen.getByRole("button", { name: "Shorten" }));

    expect(await screen.findByText("https://aro.li/summer-sale")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Manage Links", exact: true }));

    expect(await screen.findByText("summer-sale · Created Just now")).toBeInTheDocument();
    expect(screen.getByText("Summer launch")).toBeInTheDocument();
  });

  it("filters the rendered table and exports only the filtered rows", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Manage Links", exact: true }));

    const aliasInput = screen.getByPlaceholderText("e.g. summer-offer");
    await user.type(aliasInput, "creator");
    expect(screen.getByText("1 visible links")).toBeInTheDocument();
    expect(screen.getByText("creator-playbook · Created 2 hours ago")).toBeInTheDocument();
    expect(screen.queryByText("weekly-brief · Created 5 days ago")).not.toBeInTheDocument();

    let exportedBlob: Blob | undefined;
    vi.mocked(URL.createObjectURL).mockImplementation((blob) => {
      exportedBlob = blob;
      return "blob:filtered-export";
    });
    await user.click(screen.getByRole("button", { name: "Export CSV" }));

    await waitFor(async () => {
      expect(exportedBlob).toBeDefined();
      expect(await exportedBlob!.text()).toContain("creator-playbook");
      expect(await exportedBlob!.text()).not.toContain("weekly-brief");
    });
    expect(screen.getByText("1 link exported")).toBeInTheDocument();
  });

  it("updates the visible count when the advertising type filter changes", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Manage Links", exact: true }));

    fireEvent.change(screen.getByDisplayValue("All advertising types"), { target: { value: "Banner" } });
    expect(screen.getByText("1 visible links")).toBeInTheDocument();
    expect(screen.getByText("social-growth · Created 3 days ago")).toBeInTheDocument();

    const table = screen.getByRole("table");
    expect(within(table).queryByText("creator-playbook · Created 2 hours ago")).not.toBeInTheDocument();
  });
});
