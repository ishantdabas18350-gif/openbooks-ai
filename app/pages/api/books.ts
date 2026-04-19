export default async function handler(req, res) {
  const q = req.query.q

  const gut = await fetch(`https://gutendex.com/books/?search=${q}`)
    .then(r=>r.json())

  const google = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}`)
    .then(r=>r.json())

  res.json({
    gut: gut.results,
    google: google.items
  })
}
