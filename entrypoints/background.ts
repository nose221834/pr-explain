export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  if (import.meta.env.DEV) {
    browser.tabs.create({
      url: "https://github.com/nose221834/pr-explain/pull/1/changes",
    });
  }
});
