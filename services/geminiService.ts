
import { GoogleGenAI } from '@google/genai';
import { DataRow } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DATA_SAMPLE_SIZE = 20;

export const analyzeDataWithGemini = async (data: DataRow[], userPrompt: string): Promise<string> => {
  try {
    // Take a sample of the data to avoid sending huge payloads
    const dataSample = data.slice(0, DATA_SAMPLE_SIZE);
    const dataString = JSON.stringify(dataSample, null, 2);
    
    const headers = data.length > 0 ? Object.keys(data[0]).join(', ') : 'No headers found';

    const fullPrompt = `
      You are an expert data analyst. Your task is to analyze the provided dataset based on the user's request.
      The data has the following columns: ${headers}.
      Here is a sample of the data in JSON format (up to ${DATA_SAMPLE_SIZE} rows):
      \`\`\`json
      ${dataString}
      \`\`\`
      The full dataset contains ${data.length} rows.

      User's request: "${userPrompt}"

      Based on this data, please provide a concise and insightful analysis. If the user asks for a calculation, perform it. If they ask for a summary, provide one. Present your answer clearly. If the data sample is insufficient to answer, state that and explain what information would be needed.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text;
  } catch (error) {
    console.error('Gemini API call failed:', error);
    // Provide a more user-friendly error message
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error('The Gemini API key is invalid. Please check your configuration.');
    }
    throw new Error('Failed to get analysis from Gemini. Please try again later.');
  }
};
