import { DiffsSchema } from "@/utils/githubPrDiff/githubPrDiff.shema";
import * as z from "zod";
import { geminiApiCreateReport } from "@/utils/deepwikiMcp/geminiApiCreateReport";

export const MessageSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  prNumber: z.number(),
  diffs: DiffsSchema,
});

export type Message = z.infer<typeof MessageSchema>;

export default defineBackground(() => {
  //UIからの起動依頼を受け入れるお試しコード
  browser.runtime.onMessage.addListener((msg: any) => {
    if (msg?.type !== "START") return;

    (async () => {
      const tabId = msg.tabId as number;

      // background -> content（文字列要求）
      const res = await browser.tabs.sendMessage(tabId, { type: "GET_TEXT" });

      console.log("res:", res);

      // content から返ってきた string を sidepanel にブロードキャスト
      const text = typeof res === "string" ? res : String(res ?? "");

      console.log("text:", text);
      await browser.runtime.sendMessage(text);
    })();

    return false;
  });

  // geminiを叩くやつ
  if (import.meta.env.DEV) {
    browser.tabs.create({
      url: "https://github.com/refined-github/refined-github/pull/8825/files",
    });

    console.log("background started");

    browser.runtime.onMessage.addListener(async (message: Message, sender) => {
      console.log("message:", message);

      // geminiのAPIが勿体無いので一旦テスト用に固定値を返す
      // const report = await geminiApiCreateReport(
      //   message.owner,
      //   message.repo,
      //   message.prNumber,
      //   message.diffs
      // );
      const report = "test";

      console.log("report:", report);
    });
  }
});
