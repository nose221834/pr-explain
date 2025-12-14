import { getGithubPrDiff } from "@/utils/githubPrDiff/githubPrDiff";
import { getPrInfoFromUrl } from "@/utils/getPrInfoFromUrl/getPrInfoFromUrl";

export default defineContentScript({
  matches: ["https://github.com/*/*/pull/*/files*"],
  main() {
    const fileBlocks = document.querySelectorAll(
      '[data-details-container-group="file"]'
    );

    const { owner, repo, prNumber } = getPrInfoFromUrl(location.pathname);

    const diffs = getGithubPrDiff(fileBlocks);

    console.log("diffs:", diffs);

    // backgtoundにメッセージを送信
    browser.runtime.sendMessage(
      {
        type: "FETCH_DEEPWIKI",
        payload: { owner, repo },
      },
      (response) => {
        if (response && response.success) {
          console.log("DeepWiki data:", response.wikiData);
        } else if (response && !response.success) {
          console.error("Error fetching DeepWiki data:", response.error);
        } else {
          console.error("No response received from background script");
        }
      }
    );
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
// もっと発展させて、hunksを持ってもいいね（連続した行の変更を一つのhunkとして扱う）
// {
//   "file.js": {
//     "hunks": [
//       {
//         "oldStart": 12,
//         "oldEnd": 14,
//         "newStart": 12,
//         "newEnd": 15,
//         "lines": [
//           { "type": "context", "oldLine": 12, "newLine": 12, "text": "..." },
//           ...
//         ]
//       }
//     ]
//   }
// }
