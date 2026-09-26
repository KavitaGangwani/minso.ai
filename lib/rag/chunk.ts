import { PageText } from './extract';

export interface DocumentChunk {
  text: string;
  section: string;
  page: number;
}

// Regex to identify rule/section headings (like "Rule 12.", "12. Grant of licence", "Section 5.", etc.)
const LEGAL_HEADING_REGEX =
  /^(?:(?:Rule|Section|Sec\.?|Clause|Article|Chapter|Part|Order)\s+\d+[A-Za-z0-9\.\-\s:]*|\d+\.\s+[A-Za-z][^\n]{2,100})/i;

// Split text into sentences safely
function splitIntoSentences(text: string): string[] {
  // Match sentences ending in punctuation while avoiding split within common abbreviations
  const sentences = text.match(/[^.!?\n]+[.!?]+(?:\s+|$)|[^.!?\n]+$/g);
  if (!sentences) return [text];
  return sentences.map((s) => s.trim()).filter(Boolean);
}

// Helper to prepend heading to chunk text if not already present
function prepareChunkText(text: string, heading: string): string {
  const cleanText = text.trim();
  if (
    heading &&
    !heading.startsWith('Page ') &&
    !cleanText.toLowerCase().startsWith(heading.toLowerCase())
  ) {
    return `${heading}\n\n${cleanText}`;
  }
  return cleanText;
}

export interface ChunkOptions {
  chunkSize?: number;
  chunkOverlap?: number;
}

// Split page text into chunks respecting legal structure or configurable char windows with overlap
export function chunkPage(
  page: PageText,
  initialSection?: string,
  options?: ChunkOptions
): { chunks: DocumentChunk[]; lastSection: string } {
  const chunkSize = options?.chunkSize ?? 800;
  const chunkOverlap = options?.chunkOverlap ?? 100;
  const maxOverlapAllowance = Math.max(chunkOverlap, Math.round(chunkOverlap * 1.5));

  const chunks: DocumentChunk[] = [];
  let currentSection = initialSection || `Page ${page.pageNumber}`;

  // Split by lines / paragraphs
  const paragraphs = page.text
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0 && page.text.trim()) {
    paragraphs.push(page.text.trim());
  }

  let accumulatedText = '';

  for (const para of paragraphs) {
    // Check if paragraph starts with or contains a legal heading
    const firstLine = para.split('\n')[0].trim();
    if (LEGAL_HEADING_REGEX.test(firstLine)) {
      // Flush previous accumulated text before starting new section
      if (accumulatedText.trim().length > 0) {
        chunks.push({
          text: prepareChunkText(accumulatedText, currentSection),
          section: currentSection,
          page: page.pageNumber,
        });
        accumulatedText = '';
      }
      currentSection =
        firstLine.length > 100 ? firstLine.slice(0, 100).trim() + '...' : firstLine;
    }

    // If adding this paragraph fits comfortably under chunkSize
    if ((accumulatedText + ' ' + para).trim().length <= chunkSize) {
      accumulatedText = accumulatedText ? `${accumulatedText}\n\n${para}` : para;
    } else {
      // Paragraph is large or accumulation exceeded chunkSize -> chunk by sentence
      const sentences = splitIntoSentences(
        accumulatedText ? `${accumulatedText}\n\n${para}` : para
      );
      let windowText = '';

      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];

        if ((windowText + ' ' + sentence).trim().length > chunkSize && windowText.length > 0) {
          chunks.push({
            text: prepareChunkText(windowText, currentSection),
            section: currentSection,
            page: page.pageNumber,
          });

          // Calculate character sentence overlap
          let overlap = '';
          if (chunkOverlap > 0) {
            for (let j = i - 1; j >= 0; j--) {
              if ((sentences[j] + ' ' + overlap).length <= maxOverlapAllowance) {
                overlap = sentences[j] + (overlap ? ' ' + overlap : '');
              } else {
                break;
              }
            }
          }
          windowText = overlap ? `${overlap} ${sentence}` : sentence;
        } else {
          windowText = windowText ? `${windowText} ${sentence}` : sentence;
        }
      }

      accumulatedText = windowText;
    }
  }

  // Flush remaining text
  if (accumulatedText.trim().length > 0) {
    chunks.push({
      text: prepareChunkText(accumulatedText, currentSection),
      section: currentSection,
      page: page.pageNumber,
    });
  }

  return { chunks, lastSection: currentSection };
}

// Chunk all pages of a document
export function chunkDocumentPages(
  pages: PageText[],
  options?: ChunkOptions
): DocumentChunk[] {
  const allChunks: DocumentChunk[] = [];
  let runningSection = 'Page 1';

  for (const page of pages) {
    if (!page.text || page.text.trim().length === 0) continue;
    const { chunks, lastSection } = chunkPage(page, runningSection, options);
    allChunks.push(...chunks);
    runningSection = lastSection;
  }

  return allChunks;
}
