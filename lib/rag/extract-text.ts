import { PageText } from './extract';

// Convert raw plain text input into structured PageText blocks
export function extractTextFromRaw(
  title: string,
  rawText: string
): { title: string; pages: PageText[] } {
  const clean = rawText.trim();
  if (!clean) {
    return { title: title.trim() || 'Plain Text Document', pages: [] };
  }

  // Split into paragraphs
  const paragraphs = clean.split(/\n{2,}|\r\n\r\n/);
  const pages: PageText[] = [];
  let currentPageText = '';
  let pageNum = 1;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (currentPageText.length + trimmed.length > 2000 && currentPageText.length > 0) {
      pages.push({
        pageNumber: pageNum++,
        text: currentPageText.trim(),
      });
      currentPageText = trimmed;
    } else {
      currentPageText = currentPageText ? `${currentPageText}\n\n${trimmed}` : trimmed;
    }
  }

  if (currentPageText.trim()) {
    pages.push({
      pageNumber: pageNum,
      text: currentPageText.trim(),
    });
  }

  return {
    title: title.trim() || 'Plain Text Document',
    pages,
  };
}
