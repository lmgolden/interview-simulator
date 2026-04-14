import type { QuestionConfig, QuestionType, Difficulty, AnalyzeAnswerRequest } from '@/types';

// ─── Question Generation ──────────────────────────────────────────────────────

const QUESTION_SYSTEM = `You are an expert behavioral interview coach. Generate a single, high-quality interview question. Output only the question text — no preamble, no numbering, no explanation, no quotes.`;

export function buildQuestionPrompt(config: QuestionConfig): { system: string; user: string } {
  const typeDefinitions = `
Question type definitions:
- behavioral: asks the candidate to describe a past experience using the STAR method (Situation, Task, Action, Result). Must begin with "Tell me about a time..." or "Describe a situation where..."
- open-ended: a realistic business or product scenario requiring structured thinking. Begins with "How would you approach..." or "Walk me through how you'd..."
- situational: a hypothetical future scenario testing values and judgment. Begins with "Imagine you are..." or "You just found out that..."

Difficulty guidelines:
- easy: junior-friendly, single concept, narrow scope
- medium: mid-level, multi-faceted, requires some trade-off discussion
- hard: senior/strategic, ambiguous, requires systems thinking
`.trim();

  const jdSection = config.jobDescription.trim()
    ? `\n\nThe candidate is interviewing for the following role. Tailor the question to be relevant to this role's responsibilities:\n---\n${config.jobDescription.trim()}\n---`
    : '';

  const user = `Generate one ${config.difficulty} difficulty ${config.questionType} interview question.\n\n${typeDefinitions}${jdSection}\n\nOutput only the question. No quotes. No line breaks within it.`;

  return { system: QUESTION_SYSTEM, user };
}

// ─── Multiple Choice Generation ──────────────────────────────────────────────

const CHOICES_SYSTEM = `You are an interview preparation expert. You generate realistic multiple-choice answer options. Respond with valid JSON only — no prose, no markdown fences, no explanation.`;

export function buildChoicesPrompt(
  questionText: string,
  questionType: QuestionType,
  difficulty: Difficulty
): { system: string; user: string } {
  const user = `For the following interview question, generate exactly 4 answer options.

Question: "${questionText}"
Question type: ${questionType}
Difficulty: ${difficulty}

Rules:
1. Option "a" must be a genuinely strong answer demonstrating clear competence.
2. Options "b", "c", and "d" must each be plausible but have a distinct weakness (e.g., vague, missing a key element, shows poor judgment, lacks quantification).
3. For behavioral questions, option "a" must follow the STAR structure.
4. Options should be similar in length to avoid length bias.
5. Do not label options as "correct" or include any hints.

Respond with this exact JSON:
{
  "choices": [
    { "id": "a", "text": "..." },
    { "id": "b", "text": "..." },
    { "id": "c", "text": "..." },
    { "id": "d", "text": "..." }
  ]
}`;

  return { system: CHOICES_SYSTEM, user };
}

// ─── Answer Analysis ──────────────────────────────────────────────────────────

const ANALYSIS_SYSTEM = `You are an expert interview coach evaluating candidate answers. Output structured JSON lines (one JSON object per line). Output ONLY JSON lines — no prose, no markdown, no explanation.`;

export function buildAnalysisPrompt(req: AnalyzeAnswerRequest): { system: string; user: string } {
  const starSection =
    req.questionType === 'behavioral'
      ? `
3. For each STAR component, output one line:
   {"type":"star","component":"situation","present":<true|false>,"notes":"<brief explanation>"}
   {"type":"star","component":"task","present":<true|false>,"notes":"<brief explanation>"}
   {"type":"star","component":"action","present":<true|false>,"notes":"<brief explanation>"}
   {"type":"star","component":"result","present":<true|false>,"notes":"<brief explanation>"}`
      : '';

  const mcNote =
    req.answerMode === 'multiple-choice'
      ? `\nNote: The candidate selected from pre-generated options. Evaluate the selected option on its own merit.`
      : '';

  const user = `Analyze the following interview answer.

Question: "${req.questionText}"
Question type: ${req.questionType}
Answer mode: ${req.answerMode}
Candidate's answer: "${req.userAnswer}"
${mcNote}
Output the following JSON lines in this exact order:

1. For each strength (2-4 items):
   {"type":"strength","text":"<one-sentence strength>"}

2. For each area for improvement (2-4 items):
   {"type":"improvement","text":"<one-sentence improvement>"}
${starSection}

${starSection ? '4' : '3'}. Output the overall score:
   {"type":"score","value":<integer 1-10>}

${starSection ? '5' : '4'}. Finally output exactly:
   {"type":"done"}

Scoring rubric:
- 9-10: Exceptional — thorough, specific, quantified, well-structured
- 7-8: Strong — addresses the question well, minor gaps
- 5-6: Adequate — hits key points but lacks specificity or structure
- 3-4: Developing — missing major elements or has fundamental issues
- 1-2: Insufficient — does not meaningfully address the question`;

  return { system: ANALYSIS_SYSTEM, user };
}
