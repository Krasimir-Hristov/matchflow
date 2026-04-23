import { mockOffers } from '@/lib/mockOffers';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ClientMessageRequest {
  likedOfferIds: string[];
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { likedOfferIds } = (await req.json()) as ClientMessageRequest;

    // Get the API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { data: null, error: 'GEMINI_API_KEY is not configured' },
        { status: 500 },
      );
    }

    // If no offers were liked, generate an encouraging message to book with an agent
    if (!likedOfferIds || likedOfferIds.length === 0) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const noLikesPrompt = `Du bist ein freundlicher Finanzberater für eine deutsche Kreditplattform. Ein Kunde hat alle verfügbaren Kreditangebote geprüft, aber kein bestimmtes Angebot ausgewählt.

Erstelle eine KURZE, warme und ermutigende Nachricht (2-3 Sätze auf Deutsch), die:
1. Sich für die Prüfung der Angebote bedankt
2. Anerkennt, dass jeder Kunde individuelle Bedürfnisse hat
3. Herzlich dazu einlädt, eine Beratung mit einem echten Finanzmakler zu buchen, der die spezifische Situation besprechen und die perfekte Finanzierungslösung finden kann

Halte den Ton freundlich und professionell. Füge KEINE Begrüßungen oder Unterschriften hinzu – nur die eigentliche Nachricht.`;

      const result = await model.generateContent(noLikesPrompt);
      const responseText =
        result.response.text() ||
        'Unable to generate message. Please try again.';

      return Response.json({
        data: responseText,
        error: null,
      });
    }

    // Find the liked offers
    const likedOffers = mockOffers.filter((offer) =>
      likedOfferIds.includes(offer.id),
    );

    if (likedOffers.length === 0) {
      return Response.json(
        { data: null, error: 'No matching offers found' },
        { status: 400 },
      );
    }

    // Build the prompt for clients with selected offers
    const offersList = likedOffers
      .map((o) => `- ${o.title}: ${o.description}`)
      .join('\n');

    const prompt = `Du bist ein freundlicher Finanzberater-Assistent für den deutschen Kreditmarkt. Ein Kunde hat Interesse an folgenden Kreditangeboten gezeigt:

${offersList}

Schreibe eine kurze, ansprechende und personalisierte Nachricht (2-3 Sätze auf Deutsch), die:
1. Das Interesse an diesen spezifischen Kreditarten anerkennt
2. Zusammenfasst, welche finanziellen Bedürfnisse der Kunde zu haben scheint
3. Dazu einlädt, einen Termin mit einem unserer Finanzmakler zu buchen, um die Optionen zu besprechen

Halte den Ton warm, professionell und ermutigend. Füge KEINE Begrüßungen oder Unterschriften hinzu – nur die eigentliche Nachricht.`;

    // Call Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
