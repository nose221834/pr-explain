import { geminiApiCreateReport } from "@/utils/deepwikiMcp/geminiApiCreateReport";
import type {
  SidepanelToBackgroundStartMessage,
  BackgroundToContentGetTextMessage,
  BackgroundToSidepanelTextMessage,
} from "@/utils/entrypoints";
import {
  SidepanelToBackgroundStartMessageSchema,
  ContentToBackgroundPrInfoMessageSchema,
} from "@/utils/entrypoints";

export default defineBackground(() => {
  // sidepanelからのメッセージを受け取る
  browser.runtime.onMessage.addListener(
    (msg: SidepanelToBackgroundStartMessage) => {
      // 型チェック
      const parseResult =
        SidepanelToBackgroundStartMessageSchema.safeParse(msg);
      if (!parseResult.success) return;

      const startMessage = parseResult.data;

      // contentとメッセージを送受信する
      const contentHandler = async () => {
        const tabId = startMessage.tabId;

        // background -> content（文字列要求）
        const getTextMessage: BackgroundToContentGetTextMessage = {
          type: "GET_TEXT",
        };
        // contentにメッセージを送信
        const res = await browser.tabs.sendMessage(tabId, getTextMessage);
        // contentからのメッセージをparse
        const parseResult =
          ContentToBackgroundPrInfoMessageSchema.safeParse(res);
        if (!parseResult.success) return;

        // contextResultを取得
        const contextResult = parseResult.data;
        // TODO: geminiにcontextResultを渡してreportを生成

        // geminiにreportを生成
        const report = await geminiApiCreateReport(
          contextResult.owner,
          contextResult.repo,
          contextResult.prNumber,
          contextResult.diffs
        );

        const textMessage: BackgroundToSidepanelTextMessage = {
          type: "TEXT_RESULT",
          text: report,
        };
        await browser.runtime.sendMessage(textMessage);
      };
      contentHandler();

      return false;
    }
  );

  // テスト用のURLを開く
  if (import.meta.env.DEV) {
    browser.tabs.create({
      url: "https://github.com/refined-github/refined-github/pull/8825/files",
    });
  }
});
