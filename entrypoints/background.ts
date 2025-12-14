import { geminiApiCreateReport } from "@/utils/deepwikiMcp/geminiApiCreateReport";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  if (import.meta.env.DEV) {
    browser.tabs.create({
      url: "https://github.com/refined-github/refined-github/pull/8825/changes",
    });
  }

  browser.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.type === "FETCH_DEEPWIKI") {
      const { owner, repo } = msg.payload;
      try {
        const wikiData = await geminiApiCreateReport(
          owner,
          repo,
          msg.payload.diffs
        );
        // 取得した情報をそのまま送り返す
        sendResponse({ success: true, wikiData });
      } catch (err) {
        sendResponse({ success: false, error: (err as Error).message });
      }
      // async sendResponse を使うため true を返す
      return true;
    }
  });
});
