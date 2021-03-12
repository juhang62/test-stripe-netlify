const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//const inventory = require('./data/products.json');

exports.handler = async (event) => {
  const { name, quantity } = JSON.parse(event.body);
  //const product = inventory.find((p) => p.sku === sku);
  const validatedQuantity = quantity > 0 && quantity < 11 ? quantity : 1;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    mode: 'payment',
    success_url: `${process.env.URL}/success.html`,
    cancel_url: process.env.URL,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: name,
            description: 'desc'
          },
          unit_amount: 100,
        },
        quantity: validatedQuantity,
      },
    ],
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      sessionId: session.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    }),
  };
};