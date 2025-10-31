import dotenv from 'dotenv';

dotenv.config();

const accessToken = process.env.HYPERBOLIC_ACCESS_TOKEN;

const url = 'https://api.hyperbolic.xyz/v1/chat/completions';

interface Location {
	address: string;
	city: string;
	latitude: number;
	longitude: number;
}

interface Characteristics {
	surface: number;
	rooms: number;
	bedrooms: number;
	bathrooms: number;
	equipment: string[];
	rules: string[];
	energyRating?: string;
}

async function llmfetch(location: Location, characteristics: Characteristics) {
	const systemPrompt = `You are a professional real-estate valuation assistant. You will receive a single property record (location + characteristics).
Return JSON only, no explanation, no markup, no markdown, no code fences. Use the schema below and put the final numeric estimated price as "totale-price" and the cost per meter as "cost-per-meter".

{
    "totale-price": <numeric_price>,
    "cost-per-meter": <number>
}

Compute an evidence-based estimate, round to nearest whole unit, keep JSON compact and valid.

location: ${JSON.stringify(location)}
characteristics: ${JSON.stringify(characteristics)}
`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({
			model: 'openai/gpt-oss-20b',
			messages: [
				{
					role: 'user',
					content: systemPrompt,
				},
			],
			max_tokens: 512,
			temperature: 0.1,
			top_p: 0.9,
			stream: false,
		}),
	});
	const json = await response.json();
	const output = json.choices[0].message.content;
	console.log(output);
	return output;
}

export default llmfetch;
