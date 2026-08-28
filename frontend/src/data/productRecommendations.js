// Product Recommendation Mappings
// Maps concerns/bundles/skin types to actual product IDs from PRODUCTS array

export const concernToProducts = {
  acne: ['tone-texture', 'super-glow'],
  darkspots: ['super-glow', 'day-cream', 'radiance-cream'],
  dullness: ['super-glow', 'radiance-cream', 'day-cream'],
  dryness: ['day-cream', 'radiance-cream', 'saffron-oil'],
  oiliness: ['tone-texture', 'super-glow'],
  finelines: ['radiance-cream', 'day-cream'],
  sensitive: ['day-cream', 'saffron-oil'],
  texture: ['tone-texture', 'radiance-cream'],
  sundamage: ['day-cream', 'super-glow'],
  general: ['day-cream', 'super-glow', 'saffron-oil'],
  lipcare: ['lip-butter'],
  haircare: ['hair-serum']
}

export const bundleToProducts = {
  starter: ['day-cream', 'super-glow'],
  hydration: ['day-cream', 'saffron-oil'],
  brightening: ['super-glow', 'radiance-cream', 'day-cream'],
  acnecare: ['tone-texture', 'super-glow', 'day-cream'],
  pigmentation: ['super-glow', 'day-cream'],
  antiaging: ['radiance-cream', 'day-cream'],
  complete: ['day-cream', 'super-glow', 'tone-texture']
}

export const skinTypeToProducts = {
  oily: ['tone-texture', 'super-glow'],
  dry: ['day-cream', 'saffron-oil'],
  combination: ['day-cream', 'tone-texture'],
  sensitive: ['day-cream', 'saffron-oil'],
  normal: ['day-cream', 'super-glow']
}

export const productDatabase = {
  'glow-essence': {
    id: 1, // Glow Essence Face Serum
    name: 'Glow Essence Face Serum',
    size: '30 ml',
    ingredients: 'Vitamin C & Niacinamide',
    purpose: 'Brightens, hydrates and evens skin tone',
    routine: 'morning'
  },
  'day-cream': {
    id: 4, // The Day Cream SPF 30 - CORRECTED ID
    name: 'The Day Cream SPF 30',
    size: '50 G',
    ingredients: 'Hyaluronic Acid, SPF 30, Vitamin E',
    purpose: 'Daytime hydration, moisturization, daily sun protection',
    routine: 'morning'
  },
  'super-glow': {
    id: 8, // Super Glow Face Serum - CORRECTED ID
    name: 'Super Glow Face Serum',
    size: '30 ml',
    ingredients: 'Hyaluronic Acid & Peptide blend',
    purpose: 'Plump, dewy skin - glow, brightening, dull skin',
    routine: 'morning'
  },
  'tone-texture': {
    id: 12, // Tone & Texture Serum - CORRECTED ID
    name: 'Tone & Texture Serum',
    size: '30 ml',
    ingredients: 'Niacinamide & Acetyl Glucosamine',
    purpose: 'Smooth, even-toned skin - uneven tone, texture',
    routine: 'morning'
  },
  'radiance-cream': {
    id: 14, // Radiance Cream - CORRECTED ID
    name: 'Radiance Cream',
    size: '50 G',
    ingredients: 'Vitamin C 20% & Kojic Acid',
    purpose: 'Night brightening cream for radiant, glowing skin',
    routine: 'evening'
  },
  'moisture-lotion': {
    id: 6, // Deep Moisture Lotion
    name: 'Deep Moisture Lotion',
    size: '100 ml',
    ingredients: 'Ceramides and Aloe Vera',
    purpose: 'All-day hydration, fragrance-free',
    routine: 'optional'
  },
  'tattoo-balm': {
    id: 7, // Tattoo Protect Balm
    name: 'Tattoo Protect Balm',
    size: '50 G',
    ingredients: 'Petroleum-free formula',
    purpose: 'Keeps ink vibrant and skin moisturised',
    routine: 'special'
  },
  'lip-butter': {
    id: 17, // Lip Butter 8g - CORRECTED ID
    name: 'Lip Butter',
    size: '8-15 G',
    ingredients: 'Shea butter, Cocoa butter & Vitamin E',
    purpose: 'Lip treatment - heals, softens, protects',
    routine: 'special'
  },
  'hair-serum': {
    id: 16, // Hair Therapy Serum - CORRECTED ID
    name: 'Total Hair Therapy Serum',
    size: '50 ml',
    ingredients: 'Redensyl 5%, Anagain 5% & Biotin',
    purpose: 'Hair growth, strength and healthy shine',
    routine: 'special'
  },
  'glow-ritual-kit': {
    id: 10, // Glow Ritual Kit
    name: 'Glow Ritual Kit',
    size: '3-Step Kit',
    ingredients: 'Complete ritual: Cleanse, Treat, Moisturise',
    purpose: 'Complete 3-step skincare ritual',
    routine: 'optional'
  },
  'saffron-oil': {
    id: 6, // Saffron Face Oil - CORRECTED ID
    name: 'Saffron Face Oil',
    size: '30 ml',
    ingredients: 'Pure Saffron & Vitamin E',
    purpose: 'Radiant, nourished skin - nourishment, hydration, glow',
    routine: 'evening'
  }
}
