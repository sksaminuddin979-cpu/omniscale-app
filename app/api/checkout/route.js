import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1. Initialize Lemon Squeezy SDK
    lemonSqueezySetup({
      apiKey: process.env.LEMON_SQUEEZY_API_KEY,
    });

    // 2. Parse request to optionally get user details
    // let userId = 'anonymous';
    // try {
    //   const body = await req.json();
    //   userId = body.user_id || userId;
    // } catch (e) {}

    // In a real environment, you'd fetch the Store ID and Variant ID dynamically or from ENV.
    // Replace '370463' with the Store ID verified earlier.
    const STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID || '370463'; 
    const VARIANT_ID = process.env.LEMON_SQUEEZY_VARIANT_ID || '12345'; // Replace with actual Enterprise plan variant ID

    // 3. Generate a Checkout URL
    const checkoutResult = await createCheckout(STORE_ID, VARIANT_ID, {
      checkoutOptions: {
        embed: false, // Set to true if using the Lemon.js embed script on the frontend
        media: true,
        logo: true,
      },
      checkoutData: {
        custom: {
          // This custom data is passed to the webhook so we can tie the subscription to the user in our Supabase DB
          user_id: 'dummy-uuid-from-supabase' 
        }
      },
      testMode: true // IMPORTANT: Enforce test mode for safe development
    });

    if (checkoutResult.error) {
       console.error('Lemon Squeezy API Error:', checkoutResult.error);
       return NextResponse.json({ error: 'Failed to generate checkout link' }, { status: 400 });
    }

    const checkoutUrl = checkoutResult.data.data.attributes.url;

    // 4. Return the checkout URL to the frontend
    return NextResponse.json({ 
      success: true,
      checkout_url: checkoutUrl 
    });

  } catch (error) {
    console.error('Checkout Endpoint Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
