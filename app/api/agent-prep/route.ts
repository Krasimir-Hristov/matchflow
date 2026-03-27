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

    const prompt = `You are an expert financial consultant advising a broker preparing for a client meeting.

Client Information:
- Name: ${lead.firstName} ${lead.lastName}
- Desired Loan Amount: ${lead.desiredAmount.toLocaleString('de-DE')} EUR
- Phone: ${lead.phone}
- Email: ${lead.email}
- Meeting Date & Time: ${lead.bookedDate} at ${lead.bookedTime}

Client's Liked Offers:
${likedOffersList}

Our Full Portfolio:
${allOffersList}

Please provide a SHORT preparation note for the broker (3-4 sentences in Bulgarian) that includes:
1. KEY FOCUS AREAS: What to emphasize during the meeting based on their interest
2. CROSS-SELL OPPORTUNITY: At least one recommendation from our portfolio that complements their interests
3. TALKING POINTS: 1-2 specific benefits to highlight

Keep it concise and actionable. Do NOT include introductions or signatures - just the preparation notes.`;

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
