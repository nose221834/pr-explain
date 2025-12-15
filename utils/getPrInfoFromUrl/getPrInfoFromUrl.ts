export function getPrInfoFromUrl(pathname: string): {
  owner: string;
  repo: string;
  prNumber: number;
} {
  // /owner/repo/pull/123/files
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length < 4 || parts[2] !== "pull") {
    throw new Error(`Unexpected GitHub PR URL: ${pathname}`);
  }

  return {
    owner: parts[0],
    repo: parts[1],
    prNumber: Number(parts[3]),
  };
}
