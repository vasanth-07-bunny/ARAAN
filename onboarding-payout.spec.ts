import { expect, test } from "@playwright/test";

test.describe("onboarding payout flow", () => {
  test("completes the payout checklist and shows the connected method", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("1/3 complete")).toBeVisible();
    await page.getByRole("button", { name: /Add a payout method/ }).click();
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

    const withdrawalMethod = page.locator("label").filter({ hasText: "Withdrawal Method" }).locator("select");
    await withdrawalMethod.selectOption({ label: "UPI" });
    await expect(page.getByText("Payout method complete")).toBeVisible();
    await expect(page.getByText("UPI is connected and ready for your first withdrawal.")).toBeVisible();

    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Payout method saved")).toBeVisible();

    await page.getByRole("button", { name: "Dashboard", exact: true }).click();
    await expect(page.getByText("2/3 complete")).toBeVisible();
    await expect(page.getByText("Payout method connected")).toBeVisible();
    await expect(page.getByText("UPI is ready for withdrawals.")).toBeVisible();

    await page.getByRole("button", { name: "Withdraw", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Withdraw funds" })).toBeVisible();
    await expect(page.getByText("UPI connected")).toBeVisible();
  });
});
