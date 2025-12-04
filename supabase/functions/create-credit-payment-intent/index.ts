Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { amount } = await req.json();

        console.log('Credit payment intent request received:', { amount });

        // Validate required parameters
        if (!amount || amount <= 0) {
            throw new Error('Valid amount is required');
        }

        // Validate amount limits (50 - 5000 CZK)
        if (amount < 50 || amount > 5000) {
            throw new Error('Amount must be between 50 and 5000 CZK');
        }

        // Get environment variables
        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
        
        if (!stripeSecretKey) {
            console.error('Stripe secret key not found in environment');
            throw new Error('Stripe secret key not configured');
        }

        console.log('Environment variables validated, creating credit payment intent...');

        // Prepare Stripe payment intent data for credit top-up
        const stripeParams = new URLSearchParams();
        stripeParams.append('amount', Math.round(amount * 100).toString()); // Convert to haléř (CZK doesn't have cents)
        stripeParams.append('currency', 'czk');
        stripeParams.append('payment_method_types[]', 'card');
        stripeParams.append('metadata[purpose]', 'credit_topup');
        stripeParams.append('metadata[amount_czk]', amount.toString());

        // Create payment intent with Stripe
        const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${stripeSecretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: stripeParams.toString()
        });

        console.log('Stripe API response status:', stripeResponse.status);

        if (!stripeResponse.ok) {
            const errorData = await stripeResponse.text();
            console.error('Stripe API error:', errorData);
            throw new Error(`Stripe API error: ${errorData}`);
        }

        const paymentIntent = await stripeResponse.json();
        console.log('Credit payment intent created successfully:', paymentIntent.id);

        const result = {
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                amount: amount,
                currency: 'czk',
                status: 'pending'
            }
        };

        console.log('Credit payment intent creation completed successfully');

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Credit payment intent creation error:', error);

        const errorResponse = {
            error: {
                code: 'CREDIT_PAYMENT_INTENT_FAILED',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});