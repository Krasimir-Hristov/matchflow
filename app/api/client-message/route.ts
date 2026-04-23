import { QuestionAnswer } from '@/lib/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ClientMessageRequest {
  answers: QuestionAnswer[];
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { answers } = (await req.json()) as ClientMessageRequest;

    // Get the API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { data: null, error: 'GEMINI_API_KEY is not configured' },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build profile from YES answers
    const yesAnswers = (answers ?? []).filter((a) => a.answer === 'yes');

    const profileLines =
      yesAnswers.length > 0
        ? yesAnswers.map((a) => `- ${a.category}: ${a.questionText}`).join('\n')
        : 'Keine spezifischen Angaben gemacht.';

    const prompt = `Du bist ein überzeugender, warmer Finanzberater für eine deutsche Premium-Finanzierungsplattform namens Finder.

Ein Kunde hat gerade seinen persönlichen Speedcheck abgeschlossen. Hier sind seine JA-Antworten (sein Profil):

${profileLines}

Schreibe einen kurzen, PERSÖNLICHEN und ÜBERZEUGENDEN Call-to-Action Text auf Deutsch (3-4 Sätze), der:
1. Das Profil des Kunden direkt anspricht (z.B. seinen Familienstand, Wohnsituation, Einkommen)
2. Erklärt, warum sein spezifisches Profil SEHR GUTE Finanzierungsmöglichkeiten bietet
3. Den Kunden MOTIVIERT und BEGEISTERT, jetzt einen kostenlosen Beratungstermin zu buchen
4. Einen klaren Handlungsaufruf enthält (Termin buchen)

Ton: warm, professionell, persönlich und optimistisch — kein Fachjargon. KEINE Begrüßung oder Unterschrift, nur die Nachricht selbst.`;

    const result = await model.generateContent(prompt);
    const responseText =
      result.response.text() || 'Unable to generate message. Please try again.';

    return Response.json({
      data: responseText,
      error: null,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in client-message API:', errorMessage);
    return Response.json({ data: null, error: errorMessage }, { status: 500 });
  }
}
