import * as z from "zod";
import { DiffsSchema } from "./githubPrDiff/githubPrDiff.shema";

// Sidepanel → Background: 処理開始指示
export const SidepanelToBackgroundStartMessageSchema = z.object({
  type: z.literal("START"),
  tabId: z.number(),
});

export type SidepanelToBackgroundStartMessage = z.infer<
  typeof SidepanelToBackgroundStartMessageSchema
>;

// Background → Content: テキスト要求
export const BackgroundToContentGetTextMessageSchema = z.object({
  type: z.literal("GET_TEXT"),
});

export type BackgroundToContentGetTextMessage = z.infer<
  typeof BackgroundToContentGetTextMessageSchema
>;

// Content → Background: PR情報送信
export const ContentToBackgroundPrInfoMessageSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  prNumber: z.number(),
  diffs: DiffsSchema,
});

export type ContentToBackgroundPrInfoMessage = z.infer<
  typeof ContentToBackgroundPrInfoMessageSchema
>;

// Background → Sidepanel: テキスト結果送信
export const BackgroundToSidepanelTextMessageSchema = z.object({
  type: z.literal("TEXT_RESULT"),
  text: z.string(),
});

export type BackgroundToSidepanelTextMessage = z.infer<
  typeof BackgroundToSidepanelTextMessageSchema
>;
