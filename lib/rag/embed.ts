import { pipeline, env, FeatureExtractionPipeline } from '@huggingface/transformers';

// Set transformers environment options
env.allowLocalModels = false;

declare global {
  // eslint-disable-next-line no-var
  var __transformersPipelinePromise: Promise<FeatureExtractionPipeline> | undefined;
}

// Singleton pipeline loader for multilingual embedding model (stored on globalThis)
export async function getExtractor(): Promise<FeatureExtractionPipeline | null> {
  const isInitial = !globalThis.__transformersPipelinePromise;
  const start = performance.now();

  try {
    if (!globalThis.__transformersPipelinePromise) {
      globalThis.__transformersPipelinePromise = pipeline(
        'feature-extraction',
        'Xenova/multilingual-e5-small',
        {
          dtype: 'q8',
        }
      );
    }

    const extractor = await globalThis.__transformersPipelinePromise;
    const duration = (performance.now() - start).toFixed(2);
    console.log(
      `[Timing] 1. Embedding model ready (${duration}ms${
        isInitial ? ' - initial load' : ' - cached'
      })`
    );
    return extractor;
  } catch (err: any) {
    console.warn('[Embedding] HuggingFace model download unavailable on this network:', err.message);
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

