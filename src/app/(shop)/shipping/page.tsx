export default function ShippingPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl prose">
            <h1>Shipping Policy</h1>
            <p>We ship to India and Saudi Arabia.</p>
            <h2>Processing Time</h2>
            <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on holidays.</p>
            <h2>Delivery Estimates</h2>
            <ul>
                <li><strong>India:</strong> 3-5 Business Days</li>
                <li><strong>Saudi Arabia:</strong> 7-10 Business Days</li>
            </ul>
            <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
        </div>
    );
}
