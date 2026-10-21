import type { Paper } from '../types/content';

export const PAPERS: Paper[] = [
  {
    slug: 'quantization-explainability-sentiment',
    title: 'Quantization Effects on Explainability in Indonesian Transformer-Based Sentiment Analysis',
    year: '2026',
    authors: ['Helena Aurelia Sanjaya', 'Marvel Collin', 'Bertrand Geraldo Tjahyadi', 'Prof. Derwin Suhartono'],
    summary: 'Research on applying model quantization techniques to sentiment analysis tasks. Includes multi-seed evaluation, explainable AI (XAI) analysis, statistical testing, and NusaX benchmark evaluation. Investigates how quantized models perform compared to full-precision baselines on Indonesian language sentiment data. Published in Procedia Computer Science (ICCSCI 2026).',
    url: 'https://www.sciencedirect.com/science/article/pii/S1877050926029649',
    repo: 'https://github.com/Wenfuuu/model-quantization-sentiment-analysis',
    tags: ['NLP', 'Quantization', 'Sentiment Analysis', 'XAI', 'ICCSCI'],
    photos: [
      { src: '/shots/paper-quantization-team.jpg', alt: 'The authors with their supervisor and the published paper' },
      { src: '/shots/paper-quantization-article.jpg', alt: 'The paper on ScienceDirect' },
    ],
  },
  {
    slug: 'distillation-quantization-competitive-programming',
    title: 'Efficient Reasoning for Competitive Programming: Precision Limits of Knowledge Distillation and Post-Training Quantization of Large Language Models',
    year: '2026',
    authors: ['Marvel Collin', 'Bertrand Geraldo Tjahyadi', 'Helena Aurelia Sanjaya', 'Prof. Derwin Suhartono'],
    summary: 'Distills a DeepSeek-R1-Distill-Qwen-7B teacher into a 1.5B student on unit-test-verified LeetCode reasoning traces, then tests whether the distillation gain survives post-training quantization. The gain holds at INT8 but not at 4 bits, and weight-space measurements of kurtosis, tail mass and quantization error explain why. Under review at IEEE Access.',
    repo: 'https://github.com/MarvelCollin/knowledge-distillation-quantization',
    tags: ['LLM', 'Knowledge Distillation', 'Quantization', 'Reasoning', 'IEEE Access'],
  },
];
  