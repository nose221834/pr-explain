import { getGithubPrDiff } from "@/utils/githubPrDiff/githubPrDiff";
import { getPrInfoFromUrl } from "@/utils/getPrInfoFromUrl/getPrInfoFromUrl";
import type { Message, GetTextMessage } from "./background";
import { GetTextMessageSchema } from "./background";

export default defineContentScript({
  matches: ["https://github.com/*/*/pull/*/files*"],
  async main() {
    // UIからの起動依頼を受け入れるお試しコード
    browser.runtime.onMessage.addListener(
      (msg: GetTextMessage, sender, sendResponse) => {
        const parseResult = GetTextMessageSchema.safeParse(msg);
        if (!parseResult.success) return;

        const fileBlocks = document.querySelectorAll(
          '[data-details-container-group="file"]'
        );
        console.log("fileNumber:", fileBlocks.length);

        // 同期的にレスポンスを返す
        sendResponse(`hello from content. files=${fileBlocks.length}`);
      }
    );

    // 以下、実際の処理
    const fileBlocks = document.querySelectorAll(
      '[data-details-container-group="file"]'
    );

    const { owner, repo, prNumber } = getPrInfoFromUrl(location.pathname);

    const diffs = getGithubPrDiff(fileBlocks);

    console.log("diffs", diffs);

    const message: Message = {
      owner,
      repo,
      prNumber,
      diffs,
    };

    await browser.runtime.sendMessage(message);
  },
});

// PRの差分をこんな感じで持てたら後から使いやすようと妄想中
// {
//   "src/foo.js": {
//     "old": [
//       { "line": 10, "text": "function foo() {", "type": "context" },
//       { "line": 11, "text": "  return 1;", "type": "delete" },
//       { "line": 12, "text": "}", "type": "context" }
//     ],
//     "new": [
//       { "line": 10, "text": "function foo() {", "type": "context" },
//       { "line": 11, "text": "  return 2;", "type": "change" },
//       { "line": 12, "text": "}", "type": "context" }
//     ]
//   }
// }
//
