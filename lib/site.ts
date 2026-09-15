export const siteConfig = {
  name: "Raising On Purpose",
  description:
    "Honest, unfiltered motherhood essays and practical, values-driven intentional parenting content. Connection-based discipline, family routines, toddler guidance, and free printables.",
  url: process.env.SITE_URL || "https://raisingonpurpose.vercel.app",
  author: {
    name: "Raising On Purpose",
    bio: "Honest motherhood. Purposeful parenting. No highlight reel.",
  },
  social: {
    pinterest: "https://pinterest.com/raisingonpurpose",
    instagram: "https://instagram.com/raisingonpurpose",
  },
  email: "hello@raisingonpurpose.com",
  mailerLiteFormAction: process.env.MAILERLITE_FORM_ACTION || "#",
};