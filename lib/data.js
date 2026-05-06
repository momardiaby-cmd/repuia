export const REVIEWS = [
  {
    id: 1, author: 'Sophie Martin', avatar: 'SM', rating: 5,
    date: '2026-05-04', dateLabel: 'Il y a 2 jours', platform: 'Google',
    text: "Une expérience absolument fantastique ! Le service était irréprochable, les plats sublimes et l'ambiance feutrée nous a transportés. Je recommande vivement ce restaurant à tous les amateurs de gastronomie.",
    responded: false,
  },
  {
    id: 2, author: 'Thomas Dubois', avatar: 'TD', rating: 2,
    date: '2026-05-01', dateLabel: 'Il y a 5 jours', platform: 'Google',
    text: "Déçu par l'attente excessive (45 min) malgré une réservation. Le plat était tiède à l'arrivée et le serveur peu attentionné. Je m'attendais à bien mieux pour ce prix.",
    responded: false,
  },
  {
    id: 3, author: 'Camille Rousseau', avatar: 'CR', rating: 4,
    date: '2026-04-29', dateLabel: 'Il y a 1 semaine', platform: 'Google',
    text: "Très bon restaurant dans l'ensemble. La cuisine est raffinée et généreuse. Seul bémol : la carte des vins aurait pu être plus développée. Nous reviendrons !",
    responded: false,
  },
  {
    id: 4, author: 'Marc Lefebvre', avatar: 'ML', rating: 1,
    date: '2026-04-22', dateLabel: 'Il y a 2 semaines', platform: 'Google',
    text: "Expérience catastrophique. Nous avons trouvé un cheveu dans notre plat, le manager n'a pas jugé utile de s'excuser. Jamais plus. Évitez cet endroit à tout prix.",
    responded: false,
  },
  {
    id: 5, author: 'Isabelle Moreau', avatar: 'IM', rating: 5,
    date: '2026-04-15', dateLabel: 'Il y a 3 semaines', platform: 'Google',
    text: "Le coup de cœur de l'année ! Chef talentueux, accueil chaleureux et cadre magnifique. Le menu dégustation était un véritable voyage culinaire. Bravo à toute l'équipe !",
    responded: false,
  },
  {
    id: 6, author: 'Jean-Paul Blanc', avatar: 'JB', rating: 3,
    date: '2026-04-10', dateLabel: 'Il y a 1 mois', platform: 'Google',
    text: "Honnêtement, un restaurant correct mais sans grande surprise. Les prix me semblent un peu élevés pour ce que c'est. À améliorer.",
    responded: true,
  },
  {
    id: 7, author: 'Lucie Fontaine', avatar: 'LF', rating: 5,
    date: '2026-04-05', dateLabel: 'Il y a 1 mois', platform: 'Google',
    text: "Soirée parfaite ! Tout était impeccable, du champagne d'accueil au dessert. Notre table d'anniversaire a été décorée avec soin. Merci infiniment.",
    responded: true,
  },
  {
    id: 8, author: 'Antoine Girard', avatar: 'AG', rating: 2,
    date: '2026-03-28', dateLabel: 'Il y a 5 semaines', platform: 'Google',
    text: "Service lent et désorganisé. Deux plats sur quatre sont arrivés froids. Dommage car l'endroit est joli. Pas sûr de revenir.",
    responded: false,
  },
];

export function generateAIResponse(review) {
  const firstName = review.author.split(' ')[0];
  const { rating } = review;

  if (rating === 5) {
    const opts = [
      `Chère ${firstName}, vos mots nous touchent profondément. Chez nous, chaque détail compte et nous sommes heureux que cela transparaisse dans votre expérience. Nous vous attendons avec impatience pour de nouvelles émotions culinaires !`,
      `Merci infiniment pour ce magnifique témoignage, ${firstName} ! Votre satisfaction est notre plus belle récompense. Nous transmettons vos compliments à toute notre équipe qui sera ravie de vous accueillir à nouveau très bientôt.`,
      `${firstName}, merci pour ces mots si généreux ! Votre avis est une source de motivation immense pour toute notre brigade. Nous espérons avoir le plaisir de vous retrouver pour de nouvelles découvertes gastronomiques.`,
    ];
    return opts[review.id % opts.length];
  } else if (rating === 4) {
    return `Merci pour votre retour très positif, ${firstName} ! Nous sommes ravis que vous ayez apprécié votre expérience chez nous. Nous prenons note de votre remarque et travaillons constamment à nous améliorer. À très bientôt !`;
  } else if (rating === 3) {
    return `Cher(e) ${firstName}, merci pour votre retour honnête. Nous sommes désolés que votre expérience n'ait pas été entièrement à la hauteur de vos attentes. Vos remarques sont précieuses et nous les transmettrons à nos équipes. Nous espérons pouvoir vous surprendre lors d'une prochaine visite.`;
  } else {
    return `Cher(e) ${firstName}, nous vous remercions sincèrement d'avoir pris le temps de partager votre expérience. Nous sommes navrés que votre visite n'ait pas été à la hauteur de vos attentes — ni des nôtres. Votre retour est précieux et nous allons y remédier immédiatement. Nous aimerions vous offrir une nouvelle expérience à la hauteur de ce que vous méritez. N'hésitez pas à nous contacter directement. Cordialement, L'équipe.`;
  }
}
