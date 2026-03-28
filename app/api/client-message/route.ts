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

      const noLikesPrompt = `You are a friendly financial advisor for a German lending platform. A client has reviewed all available loan offers but didn't select any specific offer to like. 

Generate a SHORT, warm, and encouraging message (2-3 sentences in German) that:
1. Thanks them for reviewing the offers
2. Acknowledges that every client has unique needs
3. Warmly invites them to book a consultation with a real financial broker who can discuss their specific situation and find the perfect lending solution

Keep it friendly and professional. Do NOT include greetings or signatures—just the main message.`;

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

    const prompt = `You are a friendly financial advisor assistant for the German lending market. A client has shown interest in the following loan offers:

${offersList}

  Write a short, engaging personalized message (2-3 sentences in German) that:
1. Acknowledges their interest in these specific loan types
2. Summarizes what financial needs they seem to have
3. Invites them to book a meeting with one of our financial brokers to discuss their options

Keep the tone warm, professional, and encouraging. Do NOT include any greetings or signatures—just the main message.`;

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
