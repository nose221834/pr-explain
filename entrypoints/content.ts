import { getGithubPrDiff } from "@/utils/githubPrDiff/githubPrDiff";

export default defineContentScript({
  matches: ["https://github.com/*/*/pull/*/files*"],
  main() {
    const fileBlocks = document.querySelectorAll(
      '[data-details-container-group="file"]'
    );

    const diffs = getGithubPrDiff(fileBlocks);

    console.log("diffs:", diffs);
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
