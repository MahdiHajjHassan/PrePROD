import { afterEach, expect, test, vi } from "vitest";
import { POST } from "@/app/api/preferences/route";

afterEach(() => vi.unstubAllEnvs());

function request(input: unknown, origin = "https://localhost") {
  vi.stubEnv("APP_ORIGIN", "https://localhost");
  vi.stubEnv("ADMIN_EMAIL", "admin@example.test");
  vi.stubEnv("ADMIN_PASSWORD", "test-only-admin-password");
  return new Request("https://localhost/api/preferences", {
    method: "POST", headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(input),
  });
}

test("preferences issue secure, host-only game cookies for locale and theme", async () => {
  const response = await POST(request({ locale: "ar", theme: "dark" }));
  expect(response.status).toBe(204);
  expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  const cookies = response.headers.getSetCookie();
  expect(cookies).toHaveLength(2);
  expect(cookies.some(cookie => cookie.startsWith("__Host-tictactoe_locale=ar;"))).toBe(true);
  expect(cookies.some(cookie => cookie.startsWith("__Host-tictactoe_theme=dark;"))).toBe(true);
  for (const cookie of cookies) {
    for (const attribute of ["Path=/", "HttpOnly", "Secure", "SameSite=lax"]) expect(cookie).toContain(attribute);
    expect(cookie).not.toContain("Domain=");
  }
});

test("invalid preferences and cross-origin changes cannot set cookies", async () => {
  for (const input of [{ locale: "invalid" }, { theme: "invalid" }, { extra: "value" }]) {
    const response = await POST(request(input));
    expect(response.status).toBe(400);
    expect(response.headers.getSetCookie()).toHaveLength(0);
  }
  const response = await POST(request({ theme: "dark" }, "https://another.example"));
  expect(response.status).toBe(403);
  expect(response.headers.getSetCookie()).toHaveLength(0);
});
