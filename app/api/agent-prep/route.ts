import { ClientLead, Offer } from '@/lib/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AgentPrepRequest {
  lead: ClientLead;
  offers: Offer[];
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { lead, offers } = (await req.json()) as AgentPrepRequest;

    if (!lead || !offers) {
      return Response.json(
        { data: null, error: 'Lead and offers are required' },
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

    // Get the liked offers
    const likedOffers = offers.filter((o) => lead.likedOfferIds.includes(o.id));
    const likedOffersList = likedOffers
      .map((o) => `- ${o.title} (${o.maxAmount} EUR, ${o.interestRate}%)`)
      .join('\n');

    // Get all offers for context
    const allOffersList = offers
      .map((o) => `- ${o.title}: ${o.description}`)
      .join('\n');

    const prompt = `Du bist ein erfahrener Finanzberater, der einen Makler bei der Vorbereitung auf ein Kundengespräch unterstützt.

Kundeninformation:
- Name: ${lead.firstName} ${lead.lastName}
- Gewünschter Kreditbetrag: ${lead.desiredAmount.toLocaleString('de-DE')} EUR
- Telefon: ${lead.phone}
- E-Mail: ${lead.email}
- Besprechungsdatum & Uhrzeit: ${lead.bookedDate} um ${lead.bookedTime}

Bevorzugte Angebote des Kunden:
${likedOffersList}

Unser Gesamtportfolio:
${allOffersList}

Bitte geben Sie eine KURZE Vorbereitung für den Makler an (3-4 Sätze auf Deutsch), die Folgendes enthält:
1. SCHWERPUNKTBEREICHE: Was Sie während des Gesprächs basierend auf ihrem Interesse betonen sollten
2. CROSS-SELL-GELEGENHEIT: Mindestens eine Empfehlung aus unserem Portfolio, die ihre Interessen ergänzt
3. GESPRÄCHSPUNKTE: 1-2 spezifische Vorteile, die hervorzuheben sind

Halten Sie es prägnant und handlungsorientiert. KEINE Einführungen oder Unterschriften - nur die Vorbereitung.`;

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
