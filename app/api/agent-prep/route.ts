import { ClientLead } from '@/lib/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AgentPrepRequest {
  lead: ClientLead;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { lead } = (await req.json()) as AgentPrepRequest;

    if (!lead) {
      return Response.json(
        { data: null, error: 'Lead is required' },
        { status: 400 },
      );
    }

    // Get the API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { data: null, error: 'GEMINI_API_KEY is not configured' },
        { status: 500 },
      );
    }

    const answers = lead.questionAnswers ?? [];
    const yesAnswers = answers.filter((a) => a.answer === 'yes');
    const noAnswers = answers.filter((a) => a.answer === 'no');

    const yesLines =
      yesAnswers.length > 0
        ? yesAnswers
            .map((a) => `  ✓ [${a.category}] ${a.questionText}`)
            .join('\n')
        : '  (keine JA-Antworten)';

    const noLines =
      noAnswers.length > 0
        ? noAnswers
            .map((a) => `  ✗ [${a.category}] ${a.questionText}`)
            .join('\n')
        : '  (keine NEIN-Antworten)';

    const prompt = `Du bist ein erfahrener Finanzberater, der einen Makler bei der Vorbereitung auf ein Kundengespräch unterstützt.

Kundeninformation:
- Name: ${lead.firstName} ${lead.lastName}
- Gewünschter Betrag: ${lead.desiredAmount.toLocaleString('de-DE')} EUR
- Telefon: ${lead.phone}
- E-Mail: ${lead.email}
- Termin: ${lead.bookedDate} um ${lead.bookedTime}

Speedcheck-Ergebnisse — JA-Antworten (Profil des Kunden):
${yesLines}

Speedcheck-Ergebnisse — NEIN-Antworten:
${noLines}

Erstelle eine KURZE, handlungsorientierte Makler-Vorbereitung auf Deutsch (4-5 Sätze), die:
1. Das Kundenprofil basierend auf den JA-Antworten zusammenfasst
2. Die relevantesten Finanzierungsprodukte für dieses Profil nennt
3. Konkrete Gesprächspunkte und Empfehlungen für das Meeting gibt
4. Auf mögliche Bedenken oder Einschränkungen hinweist (z.B. befristeter Vertrag)

KEINE Begrüßung oder Unterschrift — nur die Vorbereitung.`;

    // Call Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const responseText =
      result.response.text() ||
      'Unable to generate preparation notes. Please try again.';

    return Response.json({
      data: responseText,
      error: null,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in agent-prep API:', errorMessage);
    return Response.json({ data: null, error: errorMessage }, { status: 500 });
  }
}
