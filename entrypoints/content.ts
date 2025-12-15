import { getGithubPrDiff } from "@/utils/githubPrDiff/githubPrDiff";
import { getPrInfoFromUrl } from "@/utils/getPrInfoFromUrl/getPrInfoFromUrl";
import type { Message } from "./background";

export default defineContentScript({
  matches: ["https://github.com/*/*/pull/*/files*"],
  async main() {
    browser.runtime.onMessage.addListener((message) => {
      if (message?.type === "START_EXPLAIN") {
        console.log("start explain clicked from UI");
        // ここで diff 収集や sendMessage(background) を開始
      }
    });

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
