export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { review } = req.body;
  if (!review) return res.status(400).json({ message: 'Review data is required' });

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `Vous êtes le manager d'un restaurant. Rédigez une réponse professionnelle et polie à cet avis client. 
Avis de ${review.author} (Note: ${review.rating}/5) : "${review.text}"
Réponse :`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: "Vous êtes un gérant de restaurant courtois et professionnel." }, { role: "user", content: prompt }],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedResponse = data.choices[0].message.content.trim();
      
      return res.status(200).json({ response: generatedResponse });
    } catch (error) {
      console.error("OpenAI API Error:", error);
      // Fallback to simulation if the API call fails
    }
  }

  // Fallback: Simulation d'un appel à l'API OpenAI si pas de clé ou si erreur
  await new Promise(resolve => setTimeout(resolve, 1500));

  const firstName = review.author.split(' ')[0];
  let generatedResponse = "";

  if (review.rating >= 4) {
    generatedResponse = `Cher(e) ${firstName}, merci infiniment pour ce magnifique témoignage ! Toute notre équipe est ravie de lire que votre expérience a été à la hauteur de vos attentes. Au plaisir de vous revoir très vite !`;
  } else if (review.rating === 3) {
    generatedResponse = `Merci pour votre retour, ${firstName}. Nous sommes heureux que vous ayez passé un bon moment, et nous prenons bien note de vos remarques pour continuer à nous améliorer.`;
  } else {
    generatedResponse = `Cher(e) ${firstName}, nous sommes navrés d'apprendre que votre expérience n'a pas été satisfaisante. Nous prenons cela très au sérieux et aimerions en discuter avec vous. N'hésitez pas à nous contacter directement.`;
  }

  res.status(200).json({ response: generatedResponse });
}
