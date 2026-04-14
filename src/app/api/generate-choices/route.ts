import { NextRequest } from 'next/server';
import anthropic from '@/lib/anthropic';
import { GenerateChoicesSchema } from '@/lib/validators';
import { buildChoicesPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = GenerateChoicesSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const { system, user } = buildChoicesPrompt(
      parsed.data.questionText,
      parsed.data.questionType,
      parsed.data.difficulty
    );

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: user }],
    });

    const raw = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim()
      .replace(/^```json\n?/i, '')
      .replace(/^```\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    const data = JSON.parse(raw) as { choices: Array<{ id: string; text: string }> };
    return Response.json(data);
  } catch (err) {
    console.error('generate-choices error:', err);
    return Response.json({ error: 'Failed to generate choices' }, { status: 500 });
  }
}
