export function generateMockReviews(restaurantName = "Le Bon Goût") {
  return [
    {
      id: 1, author: 'Sophie Martin', avatar: 'SM', rating: 5,
      date: '2026-05-04', dateLabel: 'Il y a 2 jours', platform: 'Google',
      text: `Une expérience absolument fantastique chez ${restaurantName} ! Le service était irréprochable, les plats sublimes et l'ambiance feutrée nous a transportés. Je recommande vivement ce restaurant à tous les amateurs de gastronomie.`,
      status: 'pending',
    },
    {
      id: 2, author: 'Thomas Dubois', avatar: 'TD', rating: 2,
      date: '2026-05-01', dateLabel: 'Il y a 5 jours', platform: 'TripAdvisor',
      text: "Déçu par l'attente excessive (45 min) malgré une réservation. Le plat était tiède à l'arrivée et le serveur peu attentionné. Je m'attendais à bien mieux pour ce prix.",
      status: 'needs_review',
      riskReason: "Mention de 'attente excessive' et basse note",
    },
    {
      id: 3, author: 'Camille Rousseau', avatar: 'CR', rating: 4,
      date: '2026-04-29', dateLabel: 'Il y a 1 semaine', platform: 'Google',
      text: "Très bon restaurant dans l'ensemble. La cuisine est raffinée et généreuse. Seul bémol : la carte des vins aurait pu être plus développée. Nous reviendrons !",
      status: 'auto_published',
      response: `Merci pour votre retour très positif, Camille ! Nous sommes ravis que vous ayez apprécié votre expérience chez ${restaurantName}. Nous prenons note de votre remarque concernant la carte des vins et travaillons constamment à nous améliorer. À très bientôt !`,
    },
    {
      id: 4, author: 'Marc Lefebvre', avatar: 'ML', rating: 1,
      date: '2026-04-22', dateLabel: 'Il y a 2 semaines', platform: 'TheFork',
      text: "Expérience catastrophique. J'ai été malade toute la nuit après avoir mangé le poisson. Honteux !",
      status: 'needs_review',
      riskReason: "Alerte Sécurité Sanitaire (mot-clé: malade)",
    },
    {
      id: 5, author: 'Isabelle Moreau', avatar: 'IM', rating: 5,
      date: '2026-04-15', dateLabel: 'Il y a 3 semaines', platform: 'Google',
      text: `Le coup de cœur de l'année ! Chef talentueux, accueil chaleureux et cadre magnifique. Le menu dégustation de ${restaurantName} était un véritable voyage culinaire. Bravo à toute l'équipe !`,
      status: 'manual_published',
      response: "Chère Isabelle, vos mots nous touchent profondément. Chez nous, chaque détail compte et nous sommes heureux que cela transparaisse dans votre expérience. Nous vous attendons avec impatience pour de nouvelles émotions culinaires !",
    },
    {
      id: 6, author: 'Jean-Paul Blanc', avatar: 'JB', rating: 3,
      date: '2026-04-10', dateLabel: 'Il y a 1 mois', platform: 'Google',
      text: "Honnêtement, un restaurant correct mais sans grande surprise. Les prix me semblent un peu élevés pour ce que c'est. À améliorer.",
      status: 'manual_published',
      response: "Cher Jean-Paul, merci pour votre retour honnête. Nous sommes désolés que votre expérience n'ait pas été entièrement à la hauteur de vos attentes. Vos remarques sont précieuses.",
    },
    {
      id: 7, author: 'Lucie Fontaine', avatar: 'LF', rating: 5,
      date: '2026-04-05', dateLabel: 'Il y a 1 mois', platform: 'TripAdvisor',
      text: "Soirée parfaite ! Tout était impeccable, du champagne d'accueil au dessert. Notre table d'anniversaire a été décorée avec soin. Merci infiniment.",
      status: 'auto_published',
      response: "Merci infiniment pour ce magnifique témoignage, Lucie ! Votre satisfaction est notre plus belle récompense. Toute notre équipe sera ravie de vous accueillir à nouveau très bientôt.",
    },
    {
      id: 8, author: 'Antoine Girard', avatar: 'AG', rating: 2,
      date: '2026-03-28', dateLabel: 'Il y a 5 semaines', platform: 'Google',
      text: "Service lent et désorganisé. Deux plats sur quatre sont arrivés froids. Dommage car l'endroit est joli. Pas sûr de revenir.",
      status: 'pending',
    },
  ];
}

export function getStatusLabel(status) {
  switch (status) {
    case 'pending': return 'En attente';
    case 'auto_published': return 'Publié (Auto)';
    case 'manual_published': return 'Publié (Manuel)';
    case 'needs_review': return 'Action Requise';
    default: return status;
  }
}

export const REVIEWS = generateMockReviews(); // Fallback backward compatibility
