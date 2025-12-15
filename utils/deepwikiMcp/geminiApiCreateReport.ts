// utils/deepwikiMcp/geminiApiCreateReport.ts

import { GoogleGenAI, mcpToTool } from "@google/genai";
import type { Diffs } from "../githubPrDiff/githubPrDiff.shema";

export async function geminiApiCreateReport(
  owner: string,
  repo: string,
  prNumber: number,
  diffs: Diffs
): Promise<string> {
  const apiKey = import.meta.env.WXT_GEMINI_API_KEY;
  const model = "gemini-2.5-flash";

  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is missing");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = [
    `あなたはソフトウェアエンジニアです。以下のPR差分からPRレポートを書いてください。`,
    `- 目的の推定`,
    `- 変更点の要約（ファイル単位）`,
    `- 影響範囲（破壊的変更の可能性、注意点）`,
    `- レビュー観点（懸念、テスト観点）`,
    ``,
    `Repo: ${owner}/${repo}`,
    `PR: #${prNumber}`,
    ``,
    `Diffs(JSON):`,
    JSON.stringify(diffs),
  ].join("\n");

  const res = await ai.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  console.log("res:", res);

  return res.text ?? "";
}
