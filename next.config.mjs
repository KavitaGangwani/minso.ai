/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      '@huggingface/transformers',
      '@xenova/transformers',
      'pdf-parse',
      'sharp',
      'onnxruntime-node',
    ],
  },
};

export default nextConfig;
