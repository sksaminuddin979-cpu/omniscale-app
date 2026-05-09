import { NextResponse } from 'next/server';
import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { variantId, userEmail } = await req.json();

    if (!variantId) {
      return NextResponse.json({ error: 'Variant ID is required' }, { status: 400 });
    }

    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    if (!apiKey) {
      // Graceful error handling for missing API key
      return NextResponse.json({ 
        error: 'Lemon Squeezy API key is not configured. Please add it to your environment variables.' 
      }, { status: 500 });
    }

    // Configure the Lemon Squeezy SDK
    lemonSqueezySetup({ apiKey });

    // Ensure we have a valid store ID configured
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    if (!storeId) {
       return NextResponse.json({ 
        error: 'Lemon Squeezy Store ID is not configured.' 
      }, { status: 500 });
    }

    // Create the checkout
    const { error, data } = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: userEmail || undefined,
        custom: {
          user_id: userEmail // Or actual user ID
        }
      },
      productOptions: {
        redirectUrl: `${new URL(req.url).origin}/dashboard?checkout=success`,
      },
      testMode: true // Force test mode for safe development/testing
    });

    if (error) {
      console.error('Lemon Squeezy API Error:', error);
      return NextResponse.json({ error: error.message || 'Failed to create checkout' }, { status: 500 });
    }

    if (data?.data?.attributes?.url) {
      return NextResponse.json({ checkoutUrl: data.data.attributes.url });
    }

    return NextResponse.json({ error: 'Checkout URL not returned from provider' }, { status: 500 });
    
  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}