const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGN_KEY //change to stripe cli signing key when testing locally
//'whsec_eN6TtdCq7DOvNsHEMLhAJ8wqbsjpu65a'; //this is from stripe cli; 
const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET })
var errmsg
exports.handler = async ({ body, headers }) => {
    //console.log('got it')
    try {
        const item = "Vue"
        const quantity = 1

        client.query(
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
                let name = result.data.name
                let nov = result.data.nov
                return client.query(
                    q.Update(
                        q.Select("ref",
                            q.Get(
                                q.Match(q.Index("items_by_title"), name)
                            )
                        ),
                        {
                            data: { "nov": nov + quantity }
                        }
                    )
                )
            }
        ).catch((err) => { errmsg=err})
        return {
            statusCode: 200,
            body: JSON.stringify({ received: true, msg: errmsg }),
        };
    } catch (err) {
        return {
            statusCode: 400,
            body: `Webhook Error: ${err.message}`,
        };
    }
};