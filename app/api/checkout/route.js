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
      console.error('LEMON_SQUEEZY_API_KEY missing from Edge runtime!');
      return NextResponse.json({ 
        error: 'Payment gateway configuration error.' 
      }, { status: 500 });
    }

    lemonSqueezySetup({ apiKey });

    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    if (!storeId) {
       console.error('LEMON_SQUEEZY_STORE_ID missing from Edge runtime!');
       return NextResponse.json({ 
        error: 'Store configuration error.' 
      }, { status: 500 });
    }

    console.log('Creating checkout for:', { userEmail, variantId, storeId, testMode: true });

    const { error, data } = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: userEmail || undefined,
        custom: {
          user_id: userEmail
        }
      },
      productOptions: {
        redirectUrl: `${new URL(req.url).origin}/dashboard?checkout=success`,
      },
      testMode: true 
    });

    if (error) {
      console.error('Lemon Squeezy API Error:', error);
      return NextResponse.json({ error: error.message || 'Failed to create checkout' }, { status: 500 });
    }

    if (data?.data?.attributes?.url) {
      return NextResponse.json({ checkoutUrl: data.data.attributes.url });
    }

    return NextResponse.json({ error: 'Invalid response from payment provider' }, { status: 500 });
    
  } catch (error) {
    console.error('Checkout Edge Exception:', error);
    return NextResponse.json({ error: 'Internal edge error during checkout.' }, { status: 500 });
  }
}