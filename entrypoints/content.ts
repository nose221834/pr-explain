export default defineContentScript({
  matches: ["https://github.com/*/*/pull/*/files"],
  main() {
    const html = document.documentElement.outerHTML;
    console.log("HTML length:", html.length);

    const fileNameElements = document.querySelectorAll(
      ".Link--primary.Truncate-text"
    );

    const fileNames = Array.from(fileNameElements).map((el) =>
      el.textContent?.trim()
    );

    console.log("fileNames:", fileNames);

    const oldLineElements = document.querySelectorAll(
      ".blob-num.blob-num-deletion.js-linkable-line-number"
    );

    const oldLines = Array.from(oldLineElements).map((el) => ({
      line: Number(el.getAttribute("data-line-number")),
      text: el.closest("tr")?.querySelector(".blob-code")?.textContent ?? "",
    }));

    console.log("oldLines:", oldLines);

    const newLineElements = document.querySelectorAll(
      ".blob-num.blob-num-addition.js-linkable-line-number.js-blob-rnum"
    );
    const newLines = Array.from(newLineElements).map((el) => ({
      line: Number(el.getAttribute("data-line-number")),
      text: el.closest("tr")?.querySelector(".blob-code")?.textContent ?? "",
    }));

    console.log("newLines:", newLines);
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
