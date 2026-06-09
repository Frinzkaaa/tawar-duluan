// lib/midtrans.ts
// Helper untuk Midtrans Snap API

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';

const MIDTRANS_BASE_URL = IS_PRODUCTION
    ? 'https://app.midtrans.com/snap/v1'
    : 'https://app.sandbox.midtrans.com/snap/v1';

export async function createSnapToken(params: {
    orderId: string;
    grossAmount: number;
    firstName: string;
    email: string;
    itemName: string;
    itemId: string;
}): Promise<{ token: string; redirectUrl: string }> {
    const { orderId, grossAmount, firstName, email, itemName, itemId } = params;

    const authString = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64');

    const payload = {
        transaction_details: {
            order_id: orderId,
            gross_amount: grossAmount,
        },
        customer_details: {
            first_name: firstName,
            email: email,
        },
        item_details: [
            {
                id: itemId,
                price: grossAmount,
                quantity: 1,
                name: itemName.slice(0, 50), // Midtrans max 50 chars
            },
        ],
        callbacks: {
            finish: `${process.env.NEXTAUTH_URL}/koleksi-saya/bid-saya`,
            error: `${process.env.NEXTAUTH_URL}/koleksi-saya/bid-saya`,
            pending: `${process.env.NEXTAUTH_URL}/koleksi-saya/bid-saya`,
        },
    };

    const res = await fetch(`${MIDTRANS_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Midtrans error: ${res.status} - ${errBody}`);
    }

    const data = await res.json();
    return {
        token: data.token,
        redirectUrl: data.redirect_url,
    };
}

export async function getMidtransStatus(orderId: string): Promise<{
    transaction_status: string;
    fraud_status?: string;
    payment_type?: string;
}> {
    const MIDTRANS_API_BASE = IS_PRODUCTION
        ? 'https://api.midtrans.com/v2'
        : 'https://api.sandbox.midtrans.com/v2';

    const authString = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64');

    const res = await fetch(`${MIDTRANS_API_BASE}/${orderId}/status`, {
        headers: {
            Authorization: `Basic ${authString}`,
        },
    });

    if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Midtrans status error: ${res.status} - ${errBody}`);
    }

    return res.json();
}
