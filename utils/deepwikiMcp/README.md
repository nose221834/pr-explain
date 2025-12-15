# Gemini API Create Report

This module integrates with Google's Gemini API and DeepWiki MCP to analyze GitHub Pull Request diffs and generate comprehensive analysis reports.

## Features

- **DeepWiki Integration**: Fetches existing repository information using MCP (Model Context Protocol)
- **Gemini AI Analysis**: Uses Google's Gemini 2.0 Flash model for intelligent PR analysis
- **Comprehensive Reports**: Generates structured analysis including summary, changes, impact, and recommendations

## Prerequisites

1. **Environment Variable**: Set `GEMINI_API_KEY` with your Google AI API key
2. **Dependencies**: Ensure `@google/genai` and `@modelcontextprotocol/sdk` are installed

## Usage

```typescript
import { geminiApiCreateReport } from './geminiApiCreateReport';
import type { Diffs } from '../githubPrDiff/githubPrDiff.shema';

// Example usage
const owner = 'facebook';
const repo = 'react';
const diffs: Diffs = {
  'src/components/Button.tsx': {
    status: 'modified',
    old: [
      { line: 10, text: '  const handleClick = () => {', type: 'delete' },
      { line: 11, text: '    console.log("clicked");', type: 'delete' }
    ],
    new: [
      { line: 10, text: '  const handleClick = useCallback(() => {', type: 'add' },
      { line: 11, text: '    onClickHandler?.();', type: 'add' },
      { line: 12, text: '  }, [onClickHandler]);', type: 'add' }
    ]
  }
};

try {
  const report = await geminiApiCreateReport(owner, repo, diffs);
  console.log('PR Analysis Report:', report);
} catch (error) {
  console.error('Failed to generate report:', error);
}
```

## Return Type

```typescript
interface PRAnalysisReport {
  summary: string;           // 変更の概要（200文字程度）
  changes: string[];         // 主要な変更点のリスト
  impact: string;           // システムへの影響分析（300文字程度）
  recommendations: string[]; // 推奨事項のリスト
}
```

## Error Handling

The function includes comprehensive error handling for:
- Missing API key
- MCP connection failures
- Gemini API errors
- Response parsing errors

All errors are logged and re-thrown with descriptive messages.
