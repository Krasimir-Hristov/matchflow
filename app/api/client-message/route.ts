import { mockOffers } from '@/lib/mockOffers';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ClientMessageRequest {
  likedOfferIds: string[];
}

interface ClientMessageResponse {
  data?: string;
  error?: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { likedOfferIds } = (await req.json()) as ClientMessageRequest;

    if (!likedOfferIds || likedOfferIds.length === 0) {
      return Response.json(
        { data: null, error: 'No liked offers provided' },
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

    // Build the prompt
    const offersList = likedOffers
      .map((o) => `- ${o.title}: ${o.description}`)
      .join('\n');

    const prompt = `You are a friendly financial advisor assistant. A client has shown interest in the following loan offers:

${offersList}

Write a short, engaging personalized message (2-3 sentences in Bulgarian) that:
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
