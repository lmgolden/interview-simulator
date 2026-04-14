import { NextRequest } from 'next/server';
import anthropic from '@/lib/anthropic';
import { GenerateQuestionSchema } from '@/lib/validators';
import { buildQuestionPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = GenerateQuestionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { system, user } = buildQuestionPrompt(parsed.data);
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 512,
      system,
      messages: [{ role: 'user', content: user }],
    });

    const question = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim();

    return Response.json({ question });
  } catch (err) {
    console.error('generate-question error:', err);
    return Response.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}
