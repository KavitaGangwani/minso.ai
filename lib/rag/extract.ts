import fs from 'fs';

export interface PageText {
  pageNumber: number;
  text: string;
}

// Extract page-by-page text from a PDF file or Buffer supporting both pdf-parse v2 and v1
export async function extractTextFromPdf(input: string | Buffer): Promise<PageText[]> {
  let dataBuffer: Buffer;
  if (Buffer.isBuffer(input)) {
    dataBuffer = input;
  } else {
    if (!fs.existsSync(input)) {
      throw new Error(`PDF file not found at path: ${input}`);
    }
    dataBuffer = fs.readFileSync(input);
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pdfModule = require('pdf-parse');

  // 1. Check for pdf-parse v2 class (PDFParse)
  if (pdfModule && pdfModule.PDFParse) {
    const parser = new pdfModule.PDFParse({ data: dataBuffer });
    try {
      const result = await parser.getText();
      const pages: PageText[] = [];

      if (result.pages && Array.isArray(result.pages) && result.pages.length > 0) {
        for (let i = 0; i < result.pages.length; i++) {
          const page = result.pages[i];
          const pageNum = Number(page.num || page.pageNumber || page.page || i + 1);
          pages.push({
            pageNumber: pageNum >= 1 ? pageNum : i + 1,
            text: (page.text || '').trim(),
          });
        }
      } else if (result.text) {
        // Handle PDF page separators (\f form-feed)
        const parts = result.text.split(/\f|\x0c/);
        for (let i = 0; i < parts.length; i++) {
          if (parts[i].trim()) {
            pages.push({
              pageNumber: i + 1,
              text: parts[i].trim(),
            });
          }
        }
        if (pages.length === 0 && result.text.trim()) {
          pages.push({
            pageNumber: 1,
            text: result.text.trim(),
          });
        }
      }
      return pages;
    } finally {
      await parser.destroy();
    }
  }

  // 2. Check for pdf-parse function (v1)
  const parseFn =
    typeof pdfModule === 'function' ? pdfModule : pdfModule?.default;
  if (typeof parseFn === 'function') {
    const data = await parseFn(dataBuffer);
    const pages: PageText[] = [];
    if (data.text) {
      const parts = data.text.split(/\f|\x0c/);
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].trim()) {
          pages.push({
            pageNumber: i + 1,
            text: parts[i].trim(),
          });
        }
      }
    }
    if (pages.length === 0) {
      pages.push({
        pageNumber: 1,
        text: (data.text || '').trim(),
      });
    }
    return pages;
  }

  throw new Error('Could not find a compatible PDF parser in pdf-parse module.');
}
