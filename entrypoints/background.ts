export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  if (import.meta.env.DEV) {
    browser.tabs.create({
      url: "https://github.com/refined-github/refined-github/pull/8825/changes",
    });
  }
});
