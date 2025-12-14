export default defineContentScript({
  matches: ["https://github.com/*/*/pull/*/files"],
  main() {
    const html = document.documentElement.outerHTML;
    console.log("HTML length:", html.length);

    const title = document.querySelector("title")?.textContent;
    console.log("title:", title);
  },
});
