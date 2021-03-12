const faunadb = require('faunadb')
const q = faunadb.query
const client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET })


exports.handler = async () => {
  const out=await client.query(
    // q.Get(q.Ref(q.Collection("posts"), "292749554163384841"))

    q.Map(
      q.Paginate(
        q.Match(q.Index("all_items"))
      ),
      q.Lambda("X", q.Get(q.Var("X")))
    )

  )
      
  return {
    statusCode: 200,
    body: JSON.stringify(out.data)
  };
}