import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import type { SidepanelToBackgroundStartMessage } from "@/utils/entrypoints";
import { BackgroundToSidepanelTextMessageSchema } from "@/utils/entrypoints";

export function App() {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const handler = (message: any) => {
      // 型チェック
      const parseResult =
        BackgroundToSidepanelTextMessageSchema.safeParse(message);
      if (!parseResult.success) return;

      const textMessage = parseResult.data;
      setText(textMessage.text);
    };
    browser.runtime.onMessage.addListener(handler);
    return () => {
      browser.runtime.onMessage.removeListener(handler);
    };
  }, []);

  const handleClick = async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) return;

    // sidepanel -> background（起動依頼）
    const startMessage: SidepanelToBackgroundStartMessage = {
      type: "START",
      tabId: tab.id,
    };
    await browser.runtime.sendMessage(startMessage);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>PR explain</CardTitle>
        <CardDescription>gitの差分情報を解析して説明する</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="w-full"
          onClick={handleClick}
          disabled={text !== ""}
        >
          start explain
        </Button>
      </CardFooter>
      <CardContent>
        <p>{text}</p>
      </CardContent>
    </Card>
  );
}

export default App;
