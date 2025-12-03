import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      models: {
        'gemini-2.5-flash-preview-tts': {
          capabilities: ['text-to-speech'],
        },
      },
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
