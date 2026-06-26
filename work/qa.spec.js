const { test, expect } = require("playwright/test");

const viewports = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "tablet", width: 820, height: 1100 },
  { name: "mobile", width: 390, height: 1200 },
];

for (const viewport of viewports) {
  test(`proposal renders without layout regressions on ${viewport.name}`, async ({ page }) => {
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const metrics = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      h1: document.querySelector("h1")?.textContent.trim(),
      heroOpacity: getComputedStyle(document.querySelector(".hero-copy")).opacity,
      icons: document.querySelectorAll("svg.lucide").length,
      scrollWidth: document.documentElement.scrollWidth,
      sections: document.querySelectorAll("section").length,
    }));

    expect(consoleErrors).toEqual([]);
    expect(metrics.h1).toContain("Uma presença digital");
    expect(metrics.sections).toBe(10);
    expect(metrics.icons).toBeGreaterThan(5);
    expect(metrics.heroOpacity).toBe("1");
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  });
}
