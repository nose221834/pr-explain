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
