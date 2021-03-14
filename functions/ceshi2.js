const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const endpointSecret = process.env.STRIPE_SIGN_KEY //change to stripe cli signing key when testing locally
//const endpointSecret = 'whsec_eN6TtdCq7DOvNsHEMLhAJ8wqbsjpu65a'; //this is from stripe cli; 
// const faunadb = require('faunadb')
// const q = faunadb.query
// const client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET })

exports.handler = async () => {
  //console.log('got it')
  try {
    const session = await stripe.checkout.sessions.retrieve(
        'cs_test_a1HnHRdYQTwHyllgqea5HwumTJcIuNxnpb2jhHTIZ0SLhXCbVVdCPMHMek',
        { expand: ['line_items'], }
      );
    console.log(session.line_items.data[0].description) 
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.log(`Stripe webhook failed with ${err}`);

    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
};