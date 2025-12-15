import { getGithubPrDiff } from "@/utils/githubPrDiff/githubPrDiff";
import { getPrInfoFromUrl } from "@/utils/getPrInfoFromUrl/getPrInfoFromUrl";
import type {
  BackgroundToContentGetTextMessage,
  ContentToBackgroundPrInfoMessage,
} from "@/utils/entrypoints";
import { BackgroundToContentGetTextMessageSchema } from "@/utils/entrypoints";

export default defineContentScript({
  matches: ["https://github.com/*/*/pull/*/files*"],
  async main() {
    // backgroundからのメッセージを受け取る
    browser.runtime.onMessage.addListener(
      (msg: BackgroundToContentGetTextMessage, sender, sendResponse) => {
        // 型チェック
        const parseResult =
          BackgroundToContentGetTextMessageSchema.safeParse(msg);
        if (!parseResult.success) return;

        const fileBlocks = document.querySelectorAll(
          '[data-details-container-group="file"]'
        );

        // PRの情報を取得
        const { owner, repo, prNumber } = getPrInfoFromUrl(location.pathname);

        // PRの差分を取得
        const diffs = getGithubPrDiff(fileBlocks);

        // PRの情報をBackgroundに送信
        const message: ContentToBackgroundPrInfoMessage = {
          owner,
          repo,
          prNumber,
          diffs,
        };

        // sendResponseを使ってBackgroundに直接レスポンスを返す
        sendResponse(message);
      }
    );
  },
});
