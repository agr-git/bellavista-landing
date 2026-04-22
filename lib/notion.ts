/**
 * Notion writer — BEST-EFFORT backup store for leads (ADR-003).
 *
 * Contract:
 *   - Never throws outside of this module.
 *   - Caller calls `writeLeadToNotion()` inside a try/catch and logs
 *     but does NOT fail the response on error.
 *   - Returns { ok: true } on success, { ok: false, reason } on failure.
 *
 * Missing creds = `{ ok: false, reason: 'not_configured' }` — normal in
 * dev. Shipping to prod without creds is intentional (Notion is optional).
 *
 * Schema assumption — the Resources DB must have at least:
 *   - a Title property called "Title" (or the default "Name")
 *   - a Select property called "Type" with b2b/waitlist/stay/subscribe
 *   - a rich_text property called "Payload" for the JSON dump
 *   - a Date property called "Received"
 * We do NOT probe the schema here — if the DB shape drifts, the write
 * errors and the email path still succeeds. Silent degradation.
 */

import { Client } from "@notionhq/client";

type LeadType = "b2b" | "waitlist" | "stay" | "subscribe";

export type NotionWriteResult =
  | { ok: true; id: string }
  | { ok: false; reason: string };

export async function writeLeadToNotion(args: {
  type: LeadType;
  title: string;
  fields: Record<string, unknown>;
}): Promise<NotionWriteResult> {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_RESOURCES_DB_ID;
  if (!token || !dbId) return { ok: false, reason: "not_configured" };

  try {
    const notion = new Client({ auth: token });
    const res = await notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        Title: {
          title: [{ text: { content: args.title } }],
        },
        Type: {
          select: { name: args.type },
        },
        Payload: {
          rich_text: [
            {
              text: {
                // Notion rich_text caps at 2000 chars per chunk — this fits.
                content: JSON.stringify(args.fields).slice(0, 1900),
              },
            },
          ],
        },
        Received: {
          date: { start: new Date().toISOString() },
        },
      },
    });
    return { ok: true, id: (res as { id: string }).id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return { ok: false, reason: msg };
  }
}
