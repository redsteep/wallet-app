const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*\.[^\s]{2,}$/i;

export function createGoogleSearchURL(query: string) {
  const url = new URL("https://www.google.com/search?");
  url.searchParams.append("q", query);
  return url;
}

export function createNormalizedURL(input: string) {
  let url = input.trim();

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  if (urlRegex.test(input)) {
    return new URL(url);
  }
}
