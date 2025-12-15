import type { Diffs } from "@/utils/githubPrDiff/githubPrDiff.shema";

export type Message = {
  owner: string;
  repo: string;
  prNumber: number;
  diffs: Diffs;
};

export default defineBackground(() => {
  if (import.meta.env.DEV) {
    browser.tabs.create({
      url: "https://github.com/refined-github/refined-github/pull/8825/files",
    });

    console.log("background started");

    browser.runtime.onMessage.addListener(async (message: Message, sender) => {
      console.log("message:", message);
    });
  }
});
