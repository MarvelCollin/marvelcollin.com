import type { Paper } from '../types';

export const PAPERS: Paper[] = [
  {
    slug: 'model-quantization-sentiment',
    title: 'Model Quantization for Sentiment Analysis',
    year: '2025',
    authors: ['Marvel Collin', 'Bertrand Geraldo Tjahyadi', 'et al.'],
    summary: 'Research on applying model quantization techniques to sentiment analysis tasks. Includes multi-seed evaluation, explainable AI (XAI) analysis, statistical testing, and NusaX benchmark evaluation. Investigates how quantized models perform compared to full-precision baselines on Indonesian language sentiment data.',
    repo: 'https://github.com/Wenfuuu/model-quantization-sentiment-analysis',
    tags: ['NLP', 'Quantization', 'Sentiment Analysis', 'XAI'],
  },
  {
    slug: 'knowledge-distillation-quantization',
    title: 'Knowledge Distillation with Quantization for Reasoning Tasks',
    year: '2025',
    authors: ['Marvel Collin', 'Bertrand Geraldo Tjahyadi'],
    summary: 'Knowledge distillation from large language models (DeepSeek, Qwen) with a focus on reasoning and competitive programming tasks, combined with quantization. Explores whether smaller quantized student models can retain the reasoning capabilities of their larger teacher models.',
    repo: 'https://github.com/MarvelCollin/knowledge-distillation-quantization',
    tags: ['LLM', 'Knowledge Distillation', 'Quantization', 'Reasoning'],
  },
];
