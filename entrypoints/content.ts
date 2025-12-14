// TODO:zodで定義しなおす
type LineType = "delete" | "add";

type LineItem = {
  line: number | null;
  text: string;
  type: LineType;
};

type FileDiff = {
  status: "modified" | "deleted";
  old: LineItem[];
  new: LineItem[];
};

export default defineContentScript({
  matches: ["https://github.com/*/*/pull/*/files*"],
  main() {
    const fileBlocks = document.querySelectorAll(
      '[data-details-container-group="file"]'
    );

    const diffs: Record<string, FileDiff> = {};

    // TODO:以下のコードはまだ確認してない。

    for (const fileBlock of Array.from(fileBlocks)) {
      const path = fileBlock.getAttribute("data-tagsearch-path")?.trim();
      if (!path) continue;

      // ファイル状態（GitHubが持っている属性から拾う）
      const isDeleted = fileBlock.getAttribute("data-file-deleted") === "true";
      const status: FileDiff["status"] = isDeleted ? "deleted" : "modified";

      const oldLines: LineItem[] = [];
      const newLines: LineItem[] = [];

      // この fileBlock の中だけを見る（混ざらない）
      const rows = fileBlock.querySelectorAll("tr");

      for (const row of Array.from(rows)) {
        // 行番号セル（old/new）
        const oldNumEl = row.querySelector<HTMLElement>(
          ".blob-num.blob-num-deletion.js-linkable-line-number"
        );
        const newNumEl = row.querySelector<HTMLElement>(
          ".blob-num.blob-num-addition.js-linkable-line-number"
        );

        const oldLineStr = oldNumEl?.getAttribute("data-line-number");
        const newLineStr = newNumEl?.getAttribute("data-line-number");
        const oldLine = oldLineStr ? Number(oldLineStr) : null;
        const newLine = newLineStr ? Number(newLineStr) : null;

        // コードセル（削除/追加/文脈で class が違うので広めに拾う）
        // old/new が両方ある行(=置換)の場合、厳密には deletion/addition の text が別セルになることがあるので分けて取る
        const oldCodeEl =
          row.querySelector<HTMLElement>(".blob-code.blob-code-deletion") ??
          row.querySelector<HTMLElement>(".blob-code"); // フォールバック
        const newCodeEl =
          row.querySelector<HTMLElement>(".blob-code.blob-code-addition") ??
          row.querySelector<HTMLElement>(".blob-code");

        const oldText = (oldCodeEl?.textContent ?? "")
          .replace(/\u00a0/g, " ")
          .trim();
        const newText = (newCodeEl?.textContent ?? "")
          .replace(/\u00a0/g, " ")
          .trim();

        // どっちも行番号が無い＆空ならスキップ（ヘッダ等）
        if (!oldLine && !newLine && !oldText && !newText) continue;

        // type 推定（diff表の性質を利用）
        if (oldLine && newLine) {
          // 置換っぽい（厳密には delete+add だがプロンプト用途なら change が便利）
          oldLines.push({
            line: oldLine,
            text: oldText || newText,
            type: "delete",
          });
          newLines.push({
            line: newLine,
            text: newText || oldText,
            type: "add",
          });
        } else if (oldLine) {
          oldLines.push({ line: oldLine, text: oldText, type: "delete" });
        } else if (newLine) {
          newLines.push({ line: newLine, text: newText, type: "add" });
        }
      }

      diffs[path] = { status, old: oldLines, new: newLines };
    }

    console.log("diffs:", diffs);
  },
});

// htmlの要素検索
// fileのブロック
//[data-details-container-group="file"]

// ファイル名
//↑のファイルのブロックに書いてある

// 差分のブロック

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
