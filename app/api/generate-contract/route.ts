import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Validate input
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Prepare the request to the LLama 8B endpoint
    const response = await fetch('https://llama8b.gaia.domains/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers
      },
      body: JSON.stringify({
        model: "llama",
        messages: [
          {
            role: "system",
            content: `You are an expert Solidity smart contract developer specializing in Mantle blockchain contracts. 
            Generate a production-ready Solidity smart contract based on the user's requirements. 
            Ensure the contract:
            - Is compatible with Solidity ^0.8.19
            - Follows Mantle blockchain best practices
            - Includes appropriate comments
            - Implements necessary security checks
            - Optimizes for gas efficiency`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Contract generation failed');
    }

    const data = await response.json();
    const generatedContract = data.choices[0].message.content;

    return NextResponse.json({ 
      contract: generatedContract 
    });

  } catch (error) {
    console.error('Contract generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate contract' 
    }, { status: 500 });
  }
}

// Ensure this is a dynamic route
export const dynamic = 'force-dynamic';