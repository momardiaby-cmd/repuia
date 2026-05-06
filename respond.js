export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { review, rating, restaurantName, restaurantType } = req.body

  const tone = rating >= 4 ? 'chaleureux et reconnaissant' : rating === 3 ? 'professionnel et constructif' : 'empathique, professionnel et solution-oriented'

  const prompt = `Tu es le gérant de "${restaurantName}", un ${restaurantType || 'restaurant'}.
Un client a laissé cet avis Google avec une note de ${rating}/5 étoiles :

"${review}"

Rédige une réponse professionnelle, ${tone}, en français.
La réponse doit :
- Remercier le client (si avis positif) ou s'excuser sincèrement (si négatif)
- Être personnalisée par rapport au contenu de l'avis
- Inviter à revenir
- Faire entre 50 et 100 mots maximum
- Ne pas être générique
- Être signée par "L'équipe ${restaurantName}"

Réponds UNIQUEMENT avec le texte de la réponse, sans guillemets ni introduction.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )
    const data = await response.json()
    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(500).json({ error: JSON.stringify(data) })
    }
    const text = data.candidates[0].content.parts[0].text
    res.status(200).json({ response: text })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
