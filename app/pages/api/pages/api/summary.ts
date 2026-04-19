export default async function handler(req, res) {
  const { text } = JSON.parse(req.body)

  const summary = text.slice(0,150) + '...'

  res.json({ summary })
}
