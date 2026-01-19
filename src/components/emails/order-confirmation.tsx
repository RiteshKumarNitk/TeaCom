import * as React from 'react';

// Common Styles
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

interface OrderConfirmationEmailProps {
    customerName: string;
    orderId: string;
    totalAmount: string;
    currency: string;
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
    customerName,
    orderId,
    totalAmount,
    currency,
}) => (
    <div style={main}>
        <div style={container}>
            <h1 style={heading}>Order Confirmed! 🍵</h1>
            <p style={paragraph}>Hi {customerName},</p>
            <p style={paragraph}>
                Thank you for your order. We've received it and are getting it ready for you.
            </p>
            <p style={paragraph}>
                <strong>Order ID:</strong> #{orderId.slice(0, 8)}<br />
                <strong>Total:</strong> {currency} {totalAmount}
            </p>
            <p style={paragraph}>
                We'll notify you once it ships!
            </p>
            <hr />
            <p style={{ ...paragraph, fontSize: '14px', color: '#999' }}>
                TeaCom Inc. | Premium Tea Selection
            </p>
        </div>
    </div>
);
