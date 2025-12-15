import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function App() {
  const handleStartExplain = async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id) {
      return;
    }

    await browser.tabs.sendMessage(tab.id, {
      type: "START_EXPLAIN",
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>PR explain</CardTitle>
        <CardDescription>gitの差分情報を解析して説明する</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleStartExplain}>
          start explain
        </Button>
      </CardFooter>
    </Card>
  );
}

export default App;
