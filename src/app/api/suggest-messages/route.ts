import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StreamingTextResponse } from 'ai';

export const runtime = 'edge';

// Strict validation function
const validateQuestions = (text: string): boolean => {
  const questions = text.split('||');
  return (
    questions.length === 3 &&
    questions.every(q => q.trim().endsWith('?')) &&
    !text.includes('\n') &&
    !text.includes('"')
  );
};

export async function POST() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate EXACTLY 3 questions  following these STRICT rules:
    1. Format as: "Question1?||Question2?||Question3?"
    2. Use exactly two vertical bars (||) as separators
    3. No numbering, quotes, markdown, or extra text
    4. Each question must end with a question mark
    5. Example valid response: "What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?".
    6. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.
    7. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
    8. Always Changes the questions, never repeat the same questions.
    YOUR OUTPUT MUST FOLLOW THESE RULES EXACTLY:`;

    const result = await model.generateContent(prompt);
    const generatedText = result.response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    console.log(generatedText)

    const cleanedText = generatedText
      ?.replaceAll('\n', ' ') // Remove newlines
      ?.replace(/ +/g, ' ') // Remove multiple spaces
      ?.replace(/["']/g, '') // Remove quotes
      ?.trim();

      const isValid = cleanedText && cleanedText.split('||').length === 3;

      return NextResponse.json({
        content: isValid && cleanedText
      });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      error:'Internal server error'
    });
  }
}