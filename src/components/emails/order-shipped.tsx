import * as React from 'react';

const main = {
    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    backgroundColor: '#ffffff',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '580px',
};

const heading = {
    fontSize: '32px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#484848',
};

const paragraph = {
    fontSize: '18px',
    lineHeight: '1.4',
    color: '#484848',
};

const button = {
    backgroundColor: '#5F51E8',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px',
    marginTop: '25px',
};

interface OrderShippedEmailProps {
    orderId: string;
    trackingNumber?: string;
    carrier?: string;
}

export const OrderShippedEmail: React.FC<OrderShippedEmailProps> = ({
    orderId,
    trackingNumber,
    carrier,
}) => (
    <div style={main}>
        <div style={container}>
            <h1 style={heading}>Your Order has Shipped! 🚀</h1>
            <p style={paragraph}>
                Great news! Your order #{orderId.slice(0, 8)} is on its way.
            </p>

            {trackingNumber && (
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', margin: '20px 0' }}>
                    <p style={{ ...paragraph, margin: 0 }}>
                        <strong>Carrier:</strong> {carrier}<br />
                        <strong>Tracking #:</strong> {trackingNumber}
                    </p>
                </div>
            )}

            <p style={paragraph}>
                You can track your package using the button below (or by visiting the carrier's website).
            </p>

            <a href={`https://teacom.com/account/orders/${orderId}`} style={button}>
                Track My Order
            </a>

            <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eaeaea' }} />
            <p style={{ ...paragraph, fontSize: '14px', color: '#999' }}>
                TeaCom Inc.
            </p>
        </div>
    </div>
);
