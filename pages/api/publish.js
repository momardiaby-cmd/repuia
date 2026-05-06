export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { reviewId, responseText } = req.body;
  if (!reviewId || !responseText) return res.status(400).json({ message: 'Missing parameters' });

  // Simulation d'un appel API à Google Business Profile
  await new Promise(resolve => setTimeout(resolve, 1800));

  // Logique métier factice : si l'avis n'existe pas ou erreur Google
  if (reviewId === 999) {
    return res.status(500).json({ message: 'Erreur lors de la publication sur Google Maps' });
  }

  res.status(200).json({ success: true, publishedAt: new Date().toISOString() });
}
