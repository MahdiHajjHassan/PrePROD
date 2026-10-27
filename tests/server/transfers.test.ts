import { afterEach, expect, test } from "vitest";
import { createTestDb } from "../helpers/db";
import { seedUser } from "../helpers/fixtures";
const cleanup: Array<() => Promise<void>> = [];
afterEach(async () => { for (const close of cleanup.splice(0).reverse()) await close(); });
const row = { title: "Imported", description: "Description", status: "OPEN", priority: "NORMAL" };
const bytes = (input: unknown) => new TextEncoder().encode(JSON.stringify(input));
async function fixture() {
  const { db, close } = await createTestDb(); cleanup.push(close); const user = await seedUser(db);
  const { createTransferService } = await import("@/server/transfers/service");
  return { db, actor: user.actor, transfers: createTransferService(db) };
}
test("invalid rows/extra fields/oversized and malformed imports create zero records", async () => {
  const { db, actor, transfers } = await fixture();
  for (const input of [bytes(Array.from({ length: 201 }, () => row)), bytes([{ ...row }, { ...row, title: " " }]), bytes([{ ...row, ownerId: actor.id }]), bytes([{ ...row, priority: "URGENT" }]), bytes([{ title: "Missing columns" }]), bytes({ rows: [row] }), new Uint8Array(256 * 1024 + 1), new Uint8Array([0xff, 0xfe]), new TextEncoder().encode("{")]) {
    await expect(transfers.import(actor, input, "json")).rejects.toMatchObject({ code: "VALIDATION" });
  }
  for (const csv of ["title,description,status,ownerId\nx,,OPEN,another", "title,title,status,priority\nx,y,OPEN,NORMAL", "title,description,status,priority\n\"unclosed", "title,description,status,priority\nx,,INVALID,NORMAL"]) await expect(transfers.import(actor, new TextEncoder().encode(csv), "csv")).rejects.toMatchObject({ code: "VALIDATION" });
  expect(await db.task.count()).toBe(0);
});
test("valid imports append duplicates as the current owner; deleted actors cannot import", async () => {
  const { db, actor, transfers } = await fixture();
  expect(await transfers.import(actor, bytes([row, row]), "json")).toEqual({ created: 2 });
  expect(await transfers.import(actor, bytes([row]), "json")).toEqual({ created: 1 });
  expect(await db.task.count({ where: { ownerId: actor.id } })).toBe(3);
  await db.user.delete({ where: { id: actor.id } });
  await expect(transfers.import(actor, bytes([row]), "json")).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
});
test("JSON/CSV round-trip Unicode quotes/newlines; spreadsheet formulas are neutralized only in CSV", async () => {
  const { transfers, actor } = await fixture();
  const original = { ...row, title: "=1+1", description: "  @SUM(1,2)\nالعربية, \"quoted\"" };
  await transfers.import(actor, bytes([original]), "json");
  const json = await transfers.export({}, "json");
  expect(JSON.parse(new TextDecoder().decode(json.bytes))).toEqual([original]);
  const csv = await transfers.export({}, "csv"); const text = new TextDecoder().decode(csv.bytes);
  expect(text).toContain("'=1+1"); expect(text).toContain("'  @SUM");
  const { parseTaskImport } = await import("@/server/transfers/schema");
  expect(parseTaskImport(csv.bytes, "csv")[0]).toMatchObject({ title: "'=1+1", description: `'${original.description}` });
  expect(text).not.toContain("passwordHash"); expect(text).not.toContain("@example.test");
});
test("filtered export returns all 60 matches independent of displayed page", async () => {
  const { transfers, actor, db } = await fixture();
  for (let i = 0; i < 60; i++) await db.task.create({ data: { ownerId: actor.id, title: `Match ${i}`, priority: "HIGH" } });
  await db.task.create({ data: { ownerId: actor.id, title: "Excluded", priority: "LOW" } });
  const exported = await transfers.export({ q: "Match", priority: "HIGH", sort: "title_asc", page: 2 }, "json");
  const records = JSON.parse(new TextDecoder().decode(exported.bytes)); expect(records).toHaveLength(60);
  expect(Object.keys(records[0]).sort()).toEqual(["description", "priority", "status", "title"]);
});
