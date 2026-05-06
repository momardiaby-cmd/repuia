export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { review } = req.body;
  if (!review) return res.status(400).json({ message: 'Review data is required' });

  // Simulation d'un appel à l'API OpenAI (GPT-4)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const firstName = review.author.split(' ')[0];
  let generatedResponse = "";

  if (review.rating === 5) {
    generatedResponse = `Cher(e) ${firstName}, merci infiniment pour ce magnifique témoignage ! Toute notre équipe est ravie de lire que votre expérience a été à la hauteur de vos attentes. Au plaisir de vous revoir très vite !`;
  } else if (review.rating >= 3) {
    generatedResponse = `Merci pour votre retour, ${firstName}. Nous sommes heureux que vous ayez passé un bon moment, et nous prenons bien note de vos remarques pour continuer à nous améliorer.`;
  } else {
    generatedResponse = `Cher(e) ${firstName}, nous sommes navrés d'apprendre que votre expérience n'a pas été satisfaisante. Nous prenons cela très au sérieux et aimerions en discuter avec vous. N'hésitez pas à nous contacter directement.`;
  }

  res.status(200).json({ response: generatedResponse });
}
