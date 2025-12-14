import type { Diffs, FileDiff, LineItem } from "./githubPrDiff.shema";

export function getGithubPrDiff(fileBlocks: NodeListOf<Element>): Diffs {
  const diffs: Record<string, FileDiff> = {};

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

  return diffs;
}
