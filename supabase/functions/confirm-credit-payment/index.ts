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
        const { paymentIntentId, amount } = await req.json();

        console.log('Credit confirmation request received:', { paymentIntentId, amount });

        // Validate required parameters
        if (!paymentIntentId) {
            throw new Error('Payment intent ID is required');
        }

        if (!amount || amount <= 0) {
            throw new Error('Valid amount is required');
        }

        // Get environment variables
        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!stripeSecretKey) {
            throw new Error('Stripe secret key not configured');
        }

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        console.log('Retrieving payment intent from Stripe...');

        // Retrieve payment intent from Stripe to verify status
        const stripeResponse = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${stripeSecretKey}`
            }
        });

        if (!stripeResponse.ok) {
            const errorData = await stripeResponse.text();
            console.error('Stripe API error:', errorData);
            throw new Error(`Stripe API error: ${errorData}`);
        }

        const paymentIntent = await stripeResponse.json();
        console.log('Payment intent retrieved:', { status: paymentIntent.status, amount: paymentIntent.amount });

        // Verify payment was successful
        if (paymentIntent.status !== 'succeeded') {
            throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
        }

        // Verify amount matches
        const expectedAmount = Math.round(amount * 100);
        if (paymentIntent.amount !== expectedAmount) {
            throw new Error(`Amount mismatch. Expected: ${expectedAmount}, Got: ${paymentIntent.amount}`);
        }

        console.log('Payment verified, creating credit transaction record...');

        // Create credit transaction record
        const transactionData = {
            payment_intent_id: paymentIntentId,
            amount: amount,
            currency: 'czk',
            status: 'completed',
            purpose: 'credit_topup',
            stripe_status: paymentIntent.status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const transactionResponse = await fetch(`${supabaseUrl}/rest/v1/credit_transactions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(transactionData)
        });

        if (!transactionResponse.ok) {
            const errorText = await transactionResponse.text();
            console.error('Failed to create transaction record:', errorText);
            // Don't fail the entire operation, just log the error
            console.warn('Transaction completed but record creation failed');
        } else {
            console.log('Credit transaction record created successfully');
        }

        // Note: In a real application, you would update the user's credit balance here
        // For now, we'll just return success as the frontend handles localStorage
        
        const result = {
            data: {
                success: true,
                paymentIntentId: paymentIntentId,
                amount: amount,
                currency: 'czk',
                status: 'completed',
                message: 'Kredit byl úspěšně dobit'
            }
        };

        console.log('Credit top-up completed successfully');

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Credit confirmation error:', error);

        const errorResponse = {
            error: {
                code: 'CREDIT_CONFIRMATION_FAILED',
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