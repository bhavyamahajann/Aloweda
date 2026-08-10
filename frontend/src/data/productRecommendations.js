// Product Recommendation Mappings

export const concernToProducts = {
  acne: ['anti-acne-wash', 'smooth-perfection', 'tone-texture'],
  darkspots: ['pigment-control', 'complexion-cream', 'super-glow', 'radiance-cream'],
  dullness: ['super-glow', 'radiance-cream', 'complexion-cream', 'tone-texture'],
  dryness: ['day-cream', 'night-cream', 'saffron-oil'],
  oiliness: ['anti-acne-wash', 'smooth-perfection', 'tone-texture'],
  finelines: ['night-cream', 'wrinkles-cream', 'lines-serum'],
  sensitive: ['day-cream', 'night-cream', 'saffron-oil'],
  texture: ['tone-texture', 'smooth-perfection', 'night-cream'],
  sundamage: ['day-cream', 'super-glow', 'complexion-cream'],
  general: ['day-cream', 'night-cream', 'super-glow', 'saffron-oil'],
  lipcare: ['lip-butter-15', 'lip-butter-8'],
  haircare: ['hair-serum']
}

export const bundleToProducts = {
  starter: ['day-cream', 'night-cream', 'super-glow'],
  hydration: ['day-cream', 'night-cream', 'saffron-oil'],
  brightening: ['super-glow', 'radiance-cream', 'complexion-cream', 'day-cream'],
  acnecare: ['anti-acne-wash', 'smooth-perfection', 'tone-texture', 'day-cream'],
  pigmentation: ['pigment-control', 'complexion-cream', 'super-glow', 'day-cream'],
  antiaging: ['night-cream', 'wrinkles-cream', 'lines-serum', 'day-cream'],
  complete: ['anti-acne-wash', 'day-cream', 'night-cream', 'super-glow', 'pigment-control']
}

export const skinTypeToProducts = {
  oily: ['anti-acne-wash', 'smooth-perfection', 'tone-texture'],
  dry: ['day-cream', 'night-cream', 'saffron-oil'],
  combination: ['day-cream', 'night-cream', 'tone-texture'],
  sensitive: ['day-cream', 'saffron-oil'],
  normal: ['day-cream', 'night-cream', 'super-glow']
}

export const productDatabase = {
  'day-cream': {
    id: 4,
    name: 'Hyaluronic Acid, SPF 30 & Vitamin E: The Day Cream',
    size: '50 G',
    ingredients: 'Hyaluronic Acid, SPF 30, Vitamin E',
    purpose: 'Daytime hydration, moisturization, daily sun protection',
    routine: 'morning'
  },
  'night-cream': {
    id: 5,
    name: 'Retinol 1%, Niacinamide 10%, Aloe Vera Extract & Carrot Oil: The Night Cream',
    size: '50 G',
    ingredients: 'Retinol 1%, Niacinamide 10%, Aloe Vera Extract, Carrot Oil',
    purpose: 'Night-time skincare, skin renewal, fine lines, texture',
    routine: 'evening'
  },
  'saffron-oil': {
    id: 6,
    name: 'Saffron Face Oil',
    size: '30 ml',
    ingredients: 'Saffron Essential Oil, Sweet Almond Oil, Grape Seed Oil, Honey, Ghee',
    purpose: 'Nourishment, hydration, glow, skin conditioning',
    routine: 'optional'
  },
  'complexion-cream': {
    id: 7,
    name: 'Alpha Arbutin 2%, Vitamin C 15% & Micro Crystalline Wax: Complexion Cream',
    size: '50 G',
    ingredients: 'Alpha Arbutin 2%, Vitamin C 15%, Micro Crystalline Wax',
    purpose: 'Brightening, uneven complexion, dark spots',
    routine: 'morning'
  },
  'super-glow': {
    id: 8,
    name: 'Vitamin C 15%, Ferulic Acid 1% & Niacinamide 5%: Super Glow Serum',
    size: '30 ml',
    ingredients: 'Vitamin C 15%, Ferulic Acid 1%, Niacinamide 5%',
    purpose: 'Glow, brightening, dull skin, uneven skin tone',
    routine: 'morning'
  },
  'pigment-control': {
    id: 9,
    name: 'Alpha Arbutin 2%, Aloe Vera Extract, Ceramides & Kojic Acid 1%: Pigment Control Serum',
    size: '30 ml',
    ingredients: 'Alpha Arbutin 2%, Aloe Vera Extract, Ceramides, Kojic Acid 1%',
    purpose: 'Pigmentation, dark spots, uneven skin tone',
    routine: 'evening'
  },
  'wrinkles-cream': {
    id: 10,
    name: 'Retinol 0.3%, Copper Tripeptide, Alpha Arbutin & Niacinamide: Wrinkles & Lines Cream',
    size: '50 G',
    ingredients: 'Retinol 0.3%, Copper Tripeptide, Alpha Arbutin, Niacinamide',
    purpose: 'Fine lines, wrinkles, skin texture',
    routine: 'evening'
  },
  'lines-serum': {
    id: 11,
    name: 'Encapsulated Retinol 1%, Grape Seed Extract & Ceramides: Lines & Wrinkles Serum',
    size: '30 ml',
    ingredients: 'Encapsulated Retinol 1%, Grape Seed Extract, Ceramides',
    purpose: 'Fine lines, wrinkles, skin renewal',
    routine: 'evening'
  },
  'tone-texture': {
    id: 12,
    name: 'Niacinamide 10%, Acetyl Glucosamine & Ceramides: Tone & Texture Serum',
    size: '30 ml',
    ingredients: 'Niacinamide 10%, Acetyl Glucosamine, Ceramides',
    purpose: 'Uneven tone, skin texture, overall appearance',
    routine: 'morning'
  },
  'smooth-perfection': {
    id: 13,
    name: 'Salicylic Acid 2%, Witch Hazel Extract & Squalene: Smooth Perfection Serum',
    size: '30 ml',
    ingredients: 'Salicylic Acid 2%, Witch Hazel Extract, Squalene',
    purpose: 'Oily skin, acne-prone skin, pores, skin texture',
    routine: 'evening'
  },
  'radiance-cream': {
    id: 14,
    name: 'Vitamin C 20%, Kojic Acid, Avocado Extract & Argan Oil: Radiance Cream',
    size: '50 G',
    ingredients: 'Vitamin C 20%, Kojic Acid, Avocado Extract, Argan Oil',
    purpose: 'Radiance, brightening, dull skin',
    routine: 'morning'
  },
  'anti-acne-wash': {
    id: 15,
    name: 'Anti Acne Face Wash',
    size: '100 ml',
    ingredients: 'Salicylic Acid 2%',
    purpose: 'Oily skin, acne-prone skin, breakouts, cleansing',
    routine: 'morning,evening'
  },
  'hair-serum': {
    id: 16,
    name: 'Redensyl 5%, Anagain 5%, Rice Water & Biotin: Total Hair Therapy Serum',
    size: '50 ml',
    ingredients: 'Redensyl 5%, Anagain 5%, Rice Water, Biotin',
    purpose: 'Hair care',
    routine: 'special'
  },
  'lip-butter-15': {
    id: 18,
    name: 'Lip Butter',
    size: '15 Gram',
    ingredients: 'Butters, Oils, Honey',
    purpose: 'Lip care',
    routine: 'special'
  },
  'lip-butter-8': {
    id: 17,
    name: 'Lip Butter',
    size: '8 Gram',
    ingredients: 'Butters, Oils, Honey',
    purpose: 'Lip care',
    routine: 'special'
  }
}
