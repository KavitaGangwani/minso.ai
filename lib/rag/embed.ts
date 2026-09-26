// Singleton pipeline holder
declare global {
  // eslint-disable-next-line no-var
  var __transformersPipelinePromise: Promise<any> | undefined;
}

// Singleton pipeline loader for multilingual embedding model (dynamic import for serverless resilience)
export async function getExtractor(): Promise<any | null> {
  const isInitial = !globalThis.__transformersPipelinePromise;
  const start = performance.now();

  try {
    if (!globalThis.__transformersPipelinePromise) {
      globalThis.__transformersPipelinePromise = (async () => {
        try {
          const { pipeline, env } = await import('@huggingface/transformers');
          if (env) {
            env.allowLocalModels = false;
          }
          return await pipeline('feature-extraction', 'Xenova/multilingual-e5-small', {
            dtype: 'q8',
          });
        } catch (err: any) {
          console.warn('[Embedding] Transformers initialization unavailable in this environment:', err?.message || err);
          return null;
        }
      })();
    }

    const extractor = await globalThis.__transformersPipelinePromise;
    if (!extractor) return null;

    const duration = (performance.now() - start).toFixed(2);
    console.log(
      `[Timing] 1. Embedding model ready (${duration}ms${
        isInitial ? ' - initial load' : ' - cached'
      })`
    );
    return extractor;
  } catch (err: any) {
    console.warn('[Embedding] HuggingFace model download unavailable:', err?.message || err);
    globalThis.__transformersPipelinePromise = undefined;
    return null;
  }
}


// Embed a document passage with "passage: " prefix and L2 normalization
export async function embedPassage(text: string): Promise<number[] | null> {
  try {
    const extractor = await getExtractor();
    if (!extractor) return null;
    const output = await extractor(`passage: ${text}`, {
      pooling: 'mean',
      normalize: true,
    });
    return Array.from(output.data as Float32Array);
  } catch (err: any) {
    console.warn('[Embedding] embedPassage failed:', err.message);
    return null;
  }
}

// Embed a search query with "query: " prefix and L2 normalization
export async function embedQuery(text: string): Promise<number[] | null> {
  try {
    const extractor = await getExtractor();
    if (!extractor) return null;

    const start = performance.now();
    const output = await extractor(`query: ${text}`, {
      pooling: 'mean',
      normalize: true,
    });
    const duration = (performance.now() - start).toFixed(2);
    console.log(`[Timing] 2. Query embedded (${duration}ms)`);

    return Array.from(output.data as Float32Array);
  } catch (err: any) {
    console.warn('[Embedding] embedQuery failed:', err.message);
    return null;
  }
}

