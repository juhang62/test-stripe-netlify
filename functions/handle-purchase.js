const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGN_KEY //change to stripe cli signing key when testing locally
//'whsec_eN6TtdCq7DOvNsHEMLhAJ8wqbsjpu65a'; //this is from stripe cli; 
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET })

exports.handler = async ({ body, headers }) => {
  //console.log('got it')
  try {
    // check the webhook to make sure it’s valid
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      endpointSecret
    );
    // only do stuff if this is a successful Stripe Checkout purchase
    if (stripeEvent.type === 'checkout.session.completed') {
      //console.log(stripeEvent.data.object.id)
        await stripe.checkout.sessions.listLineItems(
        stripeEvent.data.object.id,
        { limit: 5 },
        function(err, lineItems) {
          // asynchronously called
          if (err==null){
            //console.log(lineItems)
            const item=lineItems.data[0].description
            const quantity=lineItems.data[0].quantity

            await client.query(
              // q.Get(q.Ref(q.Collection("posts"), "292749554163384841"))
          
              q.Get(
                  q.Match(
                    q.Index("items_by_title"),
                    item
                  )
                )
          
            ).then(
              (result) => {
                  //console.log(result.data)
                  let name=result.data.name
                  let nov=result.data.nov
                  return client.query(
                      q.Update(
                          q.Select("ref",
                            q.Get(
                              q.Match(q.Index("items_by_title"), name)
                            )
                          ),
                          {
                            data: { "nov": nov+quantity}
                          }
                        )
                  )
              }
            ).catch(err=> console.log(err));

           }else {
            console.log(err)
          }
          
        }
      );
    }

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