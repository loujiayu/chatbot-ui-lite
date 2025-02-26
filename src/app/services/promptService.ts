import { get, post } from './api';

interface PromptResponse {
  content: string;
}

export async function fetchPrompt() {
  const response = await get<PromptResponse>('https://prompts-85352025976.us-central1.run.app?key=patient');
  
  return {
    success: response.success,
    content: response.data?.content || '',
    error: response.error
  };
}

export async function savePrompt(prompt: string) {
  const response = await post<{}, { prompt: string }>(
    'https://prompts-85352025976.us-central1.run.app?key=patient',
    { prompt }
  );
  
  return {
    success: response.success,
    error: response.error
  };
}
