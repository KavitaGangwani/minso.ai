import { PageText } from './extract';

// Clean and decode common HTML entities
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

// Convert raw HTML page into clean structured text sections
export function parseHtmlToText(html: string): { title: string; pages: PageText[] } {
  // 1. Extract title
  let title = 'Web Page';
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch && titleMatch[1].trim()) {
    title = decodeHtmlEntities(titleMatch[1].replace(/[\r\n\t]+/g, ' ').trim());
  }

  // 2. Remove scripts, styles, iframes, SVGs, navs, headers, footers
  let cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // 3. Format headings with distinct markdown-like indicators
  cleanHtml = cleanHtml
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_, text) => {
      const hText = decodeHtmlEntities(text.replace(/<[^>]+>/g, '')).trim();
      return hText ? `\n\nSection: ${hText}\n\n` : '';
    })
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, text) => {
      const liText = decodeHtmlEntities(text.replace(/<[^>]+>/g, '')).trim();
      return liText ? `\n• ${liText}` : '';
    })
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, text) => {
      const pText = decodeHtmlEntities(text.replace(/<[^>]+>/g, '')).trim();
      return pText ? `\n\n${pText}\n\n` : '';
    })
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n');

  // Strip any remaining tags
  const rawText = decodeHtmlEntities(cleanHtml.replace(/<[^>]+>/g, ' '));

  // Normalize whitespace and multiple line breaks
  const normalizedText = rawText
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  if (!normalizedText) {
    return { title, pages: [] };
  }

  // Split into virtual pages of ~2000 characters along paragraph boundaries for RAG chunking
  const paragraphs = normalizedText.split(/\n{2,}/);
  const pages: PageText[] = [];
  let currentPageText = '';
  let pageNum = 1;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (currentPageText.length + trimmed.length > 2200 && currentPageText.length > 0) {
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

  return { title, pages };
}

// Fetch a website URL and extract structured page texts
export async function extractTextFromUrl(url: string): Promise<{ title: string; pages: PageText[] }> {
  let targetUrl = url.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  // Validate URL structure
  try {
    new URL(targetUrl);
  } catch {
    throw new Error(`Invalid URL format: "${url}"`);
  }

  console.log(`[WebExtract] Fetching URL: ${targetUrl}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MINSO-AI-Bot/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch web page: HTTP ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain') && !contentType.includes('application/xhtml')) {
      throw new Error(`Unsupported content-type: "${contentType}". Only HTML or text web pages can be scraped.`);
    }

    const html = await response.text();
    const result = parseHtmlToText(html);

    if (result.pages.length === 0) {
      throw new Error('Web page returned empty or non-extractable text content.');
    }

    return result;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error(`Timeout fetching URL (${targetUrl}) after 12 seconds`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
