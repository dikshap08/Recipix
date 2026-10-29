import { Recipe } from '../types/recipe';

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'paneer-tikka-masala',
    title: 'Creamy Paneer Butter Masala',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1000&q=80',
    cookingTime: '30 mins',
    prepTime: '15 mins',
    difficulty: 'Medium',
    calories: 460,
    cuisine: 'Indian',
    dietary: ['Vegetarian', 'High Protein', 'Gluten Free'],
    shortDescription: 'Tender cottage cheese cubes simmered in a velvety tomato-cashew gravy with fragrant kasuri methi and aromatic spices.',
    servings: 4,
    ingredients: [
      { id: '1', name: 'Fresh Paneer (cottage cheese)', amount: '350g', unit: 'cubed' },
      { id: '2', name: 'Ripe Tomatoes', amount: '4 large', unit: 'pureed' },
      { id: '3', name: 'Cashew Nuts', amount: '15', unit: 'soaked & ground' },
      { id: '4', name: 'Ginger-Garlic Paste', amount: '1.5 tbsp' },
      { id: '5', name: 'Butter & Ghee', amount: '2 tbsp' },
      { id: '6', name: 'Heavy Cream', amount: '3 tbsp' },
      { id: '7', name: 'Kashmiri Chili Powder', amount: '1 tbsp' },
      { id: '8', name: 'Garam Masala', amount: '1 tsp' },
      { id: '9', name: 'Dried Fenugreek Leaves (Kasuri Methi)', amount: '1 tbsp' },
      { id: '10', name: 'Fresh Cilantro', amount: '2 tbsp', unit: 'chopped' }
    ],
    instructions: [
      { step: 1, title: 'Prepare Gravy Base', text: 'Sauté ginger-garlic paste in melted butter until fragrant. Add tomato puree and cook on medium heat until oil separates from the edges.', timeEstimate: '8 mins' },
      { step: 2, title: 'Spice Blend & Cashew Cream', text: 'Stir in Kashmiri red chili powder, turmeric, coriander powder, and the smooth cashew paste. Simmer gently with 1/2 cup warm water.', timeEstimate: '6 mins' },
      { step: 3, title: 'Add Paneer', text: 'Gently fold in fresh paneer cubes and heavy cream. Allow the paneer to absorb the rich flavors over a low flame.', timeEstimate: '5 mins' },
      { step: 4, title: 'Aromatics & Finishing', text: 'Crush dried fenugreek leaves between your palms and sprinkle on top along with garam masala. Garnish with fresh cilantro.', timeEstimate: '3 mins' }
    ],
    tips: [
      'Soak store-bought paneer in warm salted water for 10 minutes prior to cooking for exceptional softness.',
      'For a Jain version, omit onion and garlic, and substitute ginger paste with fresh crushed ginger or asafoetida.'
    ],
    nutrition: {
      calories: 460,
      protein: '22g',
      carbs: '18g',
      fat: '34g',
      fiber: '4g',
      sugar: '6g',
      sodium: '520mg'
    },
    tags: ['Comfort Food', 'Dinner Party', 'Rich Gravy', 'High Protein'],
    matchScore: 98,
    authorOrSource: 'AI Chef Genie'
  },
  {
    id: 'truffle-wild-mushroom-risotto',
    title: 'Artisan Wild Mushroom & Truffle Risotto',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1000&q=80',
    cookingTime: '35 mins',
    prepTime: '10 mins',
    difficulty: 'Medium',
    calories: 420,
    cuisine: 'Italian',
    dietary: ['Vegetarian', 'Gluten Free'],
    shortDescription: 'Slow-cooked creamy Arborio rice infused with sautéed cremini, shiitake mushrooms, aged Parmigiano-Reggiano, and white truffle oil.',
    servings: 3,
    ingredients: [
      { id: '1', name: 'Arborio or Carnaroli Rice', amount: '1.5 cups' },
      { id: '2', name: 'Assorted Mushrooms (Cremini & Shiitake)', amount: '300g', unit: 'sliced' },
      { id: '3', name: 'Warm Vegetable Broth', amount: '4.5 cups' },
      { id: '4', name: 'Dry White Wine (or broth)', amount: '1/2 cup' },
      { id: '5', name: 'Shallots', amount: '2', unit: 'finely minced' },
      { id: '6', name: 'Garlic cloves', amount: '3', unit: 'minced' },
      { id: '7', name: 'Parmigiano-Reggiano', amount: '1/2 cup', unit: 'freshly grated' },
      { id: '8', name: 'White Truffle Olive Oil', amount: '1 tsp' },
      { id: '9', name: 'Unsalted Butter', amount: '2 tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Sear the Mushrooms', text: 'In a heavy-bottomed skillet, brown mushrooms in 1 tablespoon of butter over high heat until caramelized. Set half aside for plating garnish.', timeEstimate: '7 mins' },
      { step: 2, title: 'Toast the Arborio Rice', text: 'In the same pan, soften minced shallots and garlic. Add Arborio rice and toast for 2 minutes until grains are translucent at the edges.', timeEstimate: '3 mins' },
      { step: 3, title: 'Simmer Broth Ladle by Ladle', text: 'Deglaze with white wine, letting it fully evaporate. Gradually ladle warm broth one scoop at a time, stirring constantly until absorbed.', timeEstimate: '18 mins' },
      { step: 4, title: 'Mantecatura (Enrichment)', text: 'Remove from heat. Vigorously beat in cold butter cubes, grated parmesan, and a gentle drizzle of truffle oil until silky and glossy.', timeEstimate: '2 mins' }
    ],
    tips: [
      'Always keep your broth simmering on a low back burner; pouring cold broth shocks the rice and stops even starch release.',
      'Do not wash Arborio rice before cooking—the surface starches create the quintessential creamy emulsion.'
    ],
    nutrition: {
      calories: 420,
      protein: '12g',
      carbs: '64g',
      fat: '14g',
      fiber: '3g',
      sugar: '3g',
      sodium: '490mg'
    },
    tags: ['Gourmet', 'Italian Classic', 'Date Night', 'Creamy'],
    matchScore: 94,
    authorOrSource: 'AI Chef Genie'
  },
  {
    id: 'crispy-tofu-szechuan-bowl',
    title: 'Szechuan Crispy Tofu & Edamame Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    cookingTime: '20 mins',
    prepTime: '15 mins',
    difficulty: 'Easy',
    calories: 380,
    cuisine: 'Chinese',
    dietary: ['Vegan', 'Vegetarian', 'High Protein', 'Gluten Free'],
    shortDescription: 'Golden cornstarch-crusted tofu tossed in a spicy, tingling Szechuan chili glaze with steamed edamame, bok choy, and toasted sesame.',
    servings: 2,
    ingredients: [
      { id: '1', name: 'Extra Firm Organic Tofu', amount: '400g', unit: 'pressed & cubed' },
      { id: '2', name: 'Cornstarch', amount: '3 tbsp' },
      { id: '3', name: 'Shelled Edamame', amount: '1 cup', unit: 'steamed' },
      { id: '4', name: 'Baby Bok Choy', amount: '2 heads', unit: 'quartered' },
      { id: '5', name: 'Tamari (Gluten-free Soy Sauce)', amount: '3 tbsp' },
      { id: '6', name: 'Szechuan Chili Crisp Oil', amount: '1.5 tbsp' },
      { id: '7', name: 'Pure Maple Syrup or Brown Sugar', amount: '1 tbsp' },
      { id: '8', name: 'Toasted Sesame Oil & Seeds', amount: '1 tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Crisp the Tofu', text: 'Toss pressed tofu cubes with cornstarch and a pinch of sea salt. Pan-sear in sesame oil on medium-high until golden and crunchy on all sides.', timeEstimate: '8 mins' },
      { step: 2, title: 'Whisk the Chili Glaze', text: 'In a small bowl, whisk tamari, chili crisp, rice vinegar, maple syrup, minced ginger, and a splash of water.', timeEstimate: '2 mins' },
      { step: 3, title: 'Flash Sauté Greens', text: 'Push tofu to one side of the wok, add bok choy and edamame, tossing quickly for 2 minutes to preserve vibrant crunch.', timeEstimate: '3 mins' },
      { step: 4, title: 'Glaze and Coat', text: 'Pour the sauce into the hot wok. Allow it to bubble and reduce into a glossy glaze coating every piece of crispy tofu.', timeEstimate: '3 mins' }
    ],
    tips: [
      'Press the tofu for at least 15 minutes between paper towels with a heavy skillet to remove excess moisture for maximum crispiness.',
      'Substitute bok choy with broccoli florets or snap peas based on your crisper drawer contents.'
    ],
    nutrition: {
      calories: 380,
      protein: '28g',
      carbs: '32g',
      fat: '16g',
      fiber: '7g',
      sugar: '5g',
      sodium: '610mg'
    },
    tags: ['Quick & Easy', 'Meal Prep', 'Plant Powered', 'Spicy'],
    matchScore: 96,
    authorOrSource: 'AI Chef Genie'
  },
  {
    id: 'smoky-black-bean-avocado-tacos',
    title: 'Smoky Chipotle Black Bean & Avocado Tacos',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80',
    cookingTime: '15 mins',
    prepTime: '10 mins',
    difficulty: 'Easy',
    calories: 350,
    cuisine: 'Mexican',
    dietary: ['Vegan', 'Vegetarian', 'Gluten Free', 'High Protein'],
    shortDescription: 'Warm stone-ground corn tortillas stacked with spiced chipotle black beans, charred corn, creamy hass avocado, and fresh lime salsa.',
    servings: 3,
    ingredients: [
      { id: '1', name: 'Black Beans', amount: '2 cans (15oz)', unit: 'drained & rinsed' },
      { id: '2', name: 'White Corn Tortillas', amount: '6 small' },
      { id: '3', name: 'Ripe Hass Avocados', amount: '2', unit: 'sliced' },
      { id: '4', name: 'Sweet Sweetcorn Kernels', amount: '1 cup', unit: 'charred' },
      { id: '5', name: 'Chipotle in Adobo', amount: '1 tbsp', unit: 'minced' },
      { id: '6', name: 'Ground Cumin & Smoked Paprika', amount: '1 tsp each' },
      { id: '7', name: 'Fresh Lime', amount: '2', unit: 'juiced' },
      { id: '8', name: 'Pickled Red Onions & Cilantro', amount: '1/3 cup' }
    ],
    instructions: [
      { step: 1, title: 'Simmer Chipotle Beans', text: 'Warm olive oil in a skillet, stir in minced garlic, chipotle in adobo, cumin, and black beans. Mash slightly with the back of a spoon with a splash of lime juice.', timeEstimate: '6 mins' },
      { step: 2, title: 'Char the Tortillas', text: 'Warm corn tortillas over an open flame or in a dry cast iron skillet for 30 seconds per side until lightly blistered.', timeEstimate: '4 mins' },
      { step: 3, title: 'Assemble Tacos', text: 'Spoon warm smoky beans generously onto each tortilla. Top with avocado slices, charred sweetcorn, and crisp pickled red onions.', timeEstimate: '3 mins' },
      { step: 4, title: 'Finishing Touches', text: 'Sprinkle chopped cilantro, sea salt flakes, and squeeze fresh lime wedges over top before serving.', timeEstimate: '2 mins' }
    ],
    tips: [
      'Toast tortillas right over a gas stove flame with tongs for authentic charred taqueria aroma.',
      'Add a dollop of cashew crema or Greek yogurt for extra cooling indulgence.'
    ],
    nutrition: {
      calories: 350,
      protein: '14g',
      carbs: '52g',
      fat: '12g',
      fiber: '14g',
      sugar: '4g',
      sodium: '430mg'
    },
    tags: ['Taco Tuesday', 'Fast Dinner', 'Heart Healthy', 'High Fiber'],
    matchScore: 95,
    authorOrSource: 'AI Chef Genie'
  },
  {
    id: 'classic-herb-grilled-chicken-quinoa',
    title: 'Lemon Herb Golden Chicken & Quinoa Harvest',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1000&q=80',
    cookingTime: '25 mins',
    prepTime: '15 mins',
    difficulty: 'Easy',
    calories: 490,
    cuisine: 'American',
    dietary: ['High Protein', 'Gluten Free'],
    shortDescription: 'Pan-seared lemon rosemary chicken breast served over fluffy tri-color quinoa, roasted cherry tomatoes, and shaved parmesan.',
    servings: 2,
    ingredients: [
      { id: '1', name: 'Boneless Skinless Chicken Breasts', amount: '2 (400g)' },
      { id: '2', name: 'Tri-Color Quinoa', amount: '1 cup', unit: 'cooked' },
      { id: '3', name: 'Fresh Rosemary & Thyme', amount: '2 tbsp', unit: 'chopped' },
      { id: '4', name: 'Lemon zest & juice', amount: '1 whole lemon' },
      { id: '5', name: 'Extra Virgin Olive Oil', amount: '2 tbsp' },
      { id: '6', name: 'Cherry Tomatoes', amount: '1 cup', unit: 'halved' },
      { id: '7', name: 'Baby Arugula', amount: '2 cups' },
      { id: '8', name: 'Dijon Mustard', amount: '1 tsp' }
    ],
    instructions: [
      { step: 1, title: 'Marinate Chicken', text: 'Whisk olive oil, lemon juice, zest, Dijon mustard, minced garlic, rosemary, thyme, salt, and black pepper. Coat chicken breasts evenly.', timeEstimate: '5 mins' },
      { step: 2, title: 'Pan-Sear to Perfection', text: 'Heat an oiled grill pan or skillet over medium-high heat. Sear chicken for 6-7 minutes per side until golden and internal temperature reads 165°F (74°C). Rest for 5 mins.', timeEstimate: '14 mins' },
      { step: 3, title: 'Warm the Quinoa & Tomatoes', text: 'Toss warm quinoa with baby arugula and blistered cherry tomatoes in the residual pan juices.', timeEstimate: '3 mins' },
      { step: 4, title: 'Carve and Plate', text: 'Slice chicken against the grain and fan out over the citrus quinoa bed. Drizzle pan vinaigrette on top.', timeEstimate: '3 mins' }
    ],
    tips: [
      'Pound the thick end of the chicken breast gently so it cooks uniformly without drying out the edges.',
      'Can be meal prepped for up to 4 days in airtight glass containers.'
    ],
    nutrition: {
      calories: 490,
      protein: '46g',
      carbs: '38g',
      fat: '16g',
      fiber: '6g',
      sugar: '3g',
      sodium: '480mg'
    },
    tags: ['Lean Muscle', 'Clean Eating', 'Dinner Prep', 'Fresh'],
    matchScore: 99,
    authorOrSource: 'AI Chef Genie'
  },
  {
    id: 'jain-dal-palak-khichdi',
    title: 'Sattvic Green Moong & Spinach Khichdi',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80',
    cookingTime: '25 mins',
    prepTime: '10 mins',
    difficulty: 'Easy',
    calories: 340,
    cuisine: 'Indian',
    dietary: ['Jain', 'Vegetarian', 'Gluten Free', 'High Protein'],
    shortDescription: 'Gentle, comforting yellow moong lentils and basmati rice slow-cooked with fresh baby spinach, cumin, and golden cow ghee without root vegetables.',
    servings: 4,
    ingredients: [
      { id: '1', name: 'Yellow Moong Dal', amount: '1/2 cup' },
      { id: '2', name: 'Aged Basmati Rice', amount: '1/2 cup' },
      { id: '3', name: 'Fresh Spinach Leaves', amount: '2 cups', unit: 'finely shredded' },
      { id: '4', name: 'Desi Ghee', amount: '1.5 tbsp' },
      { id: '5', name: 'Cumin Seeds (Jeera)', amount: '1 tsp' },
      { id: '6', name: 'Asafoetida (Hing, pure gluten-free)', amount: '1/4 tsp' },
      { id: '7', name: 'Green Chili (slit)', amount: '1' },
      { id: '8', name: 'Turmeric Powder', amount: '1/2 tsp' },
      { id: '9', name: 'Pink Himalayan Salt', amount: '1 tsp' }
    ],
    instructions: [
      { step: 1, title: 'Wash and Soak', text: 'Rinse rice and yellow moong dal together until water runs clear. Soak for 20 minutes to aid digestibility.', timeEstimate: '5 mins' },
      { step: 2, title: 'Tempering (Tadka)', text: 'Heat desi ghee in a pot. Add cumin seeds, asafoetida (hing), and slit green chili until seeds crackle with nutty aroma.', timeEstimate: '2 mins' },
      { step: 3, title: 'Pot Cooking with Spinach', text: 'Add drained rice, dal, chopped spinach, turmeric, salt, and 3.5 cups of water. Bring to a boil.', timeEstimate: '3 mins' },
      { step: 4, title: 'Simmer into Comfort', text: 'Cover tightly and simmer on low for 15 minutes until soft and creamy. Whisk lightly with a wooden ladle.', timeEstimate: '15 mins' }
    ],
    tips: [
      'Strictly adheres to Jain culinary guidelines: free from onion, garlic, potatoes, carrots, or underground roots.',
      'Serve steaming hot accompanied by spiced curd or roasted papad.'
    ],
    nutrition: {
      calories: 340,
      protein: '16g',
      carbs: '54g',
      fat: '8g',
      fiber: '7g',
      sugar: '2g',
      sodium: '380mg'
    },
    tags: ['Sattvic', 'Jain Diet', 'Gut Friendly', 'Comforting'],
    matchScore: 97,
    authorOrSource: 'AI Chef Genie'
  },
  {
    id: 'mediterranean-penne-arrabbiata',
    title: 'Sun-Ripened Tomato Penne Arrabbiata',
    image: '/images/penne-arrabbiata.jpg',
    cookingTime: '20 mins',
    prepTime: '8 mins',
    difficulty: 'Easy',
    calories: 390,
    cuisine: 'Italian',
    dietary: ['Vegan', 'Vegetarian'],
    shortDescription: 'Al dente bronze-cut penne tossed in a spicy San Marzano tomato sauce infused with toasted garlic, Calabrian chili flakes, and torn sweet basil.',
    servings: 2,
    ingredients: [
      { id: '1', name: 'Bronze-cut Penne Rigate', amount: '250g' },
      { id: '2', name: 'San Marzano Canned Tomatoes', amount: '400g', unit: 'crushed by hand' },
      { id: '3', name: 'Garlic Cloves', amount: '4', unit: 'thinly sliced' },
      { id: '4', name: 'Calabrian Red Chili Flakes', amount: '1.5 tsp' },
      { id: '5', name: 'Extra Virgin Olive Oil', amount: '3 tbsp' },
      { id: '6', name: 'Fresh Italian Basil', amount: '1 cup', unit: 'torn' },
      { id: '7', name: 'Sea Salt & Black Pepper', amount: 'to taste' }
    ],
    instructions: [
      { step: 1, title: 'Boil Pasta', text: 'Cook penne in a large pot of aggressively salted boiling water until 1 minute before al dente. Reserve 1/2 cup starchy pasta water.', timeEstimate: '9 mins' },
      { step: 2, title: 'Infuse Chili & Garlic', text: 'Gently heat olive oil in a wide skillet. Add sliced garlic and chili flakes, allowing garlic to turn pale golden without burning.', timeEstimate: '3 mins' },
      { step: 3, title: 'Simmer the Sauce', text: 'Pour in crushed San Marzano tomatoes. Simmer rapidly for 6-8 minutes until sweet and concentrated.', timeEstimate: '6 mins' },
      { step: 4, title: 'Emulsify & Finish', text: 'Transfer penne directly into sauce with a splash of pasta water. Toss vigorously for 2 minutes to create a glossy cling. Fold in fresh basil.', timeEstimate: '2 mins' }
    ],
    tips: [
      'The secret to Italian pasta is the pasta water emulsion—never rinse cooked pasta under cold water!',
      'For a gluten-free twist, substitute with high quality brown rice or chickpea penne.'
    ],
    nutrition: {
      calories: 390,
      protein: '11g',
      carbs: '68g',
      fat: '9g',
      fiber: '5g',
      sugar: '6g',
      sodium: '410mg'
    },
    tags: ['Quick 20-min', 'Spicy', 'Italian Classic', 'Plant Based'],
    matchScore: 93,
    authorOrSource: 'AI Chef Genie'
  },
  {
    id: 'veggie-enchiladas-verde',
    title: 'Roasted Poblano & Zucchini Enchiladas',
    image: 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?auto=format&fit=crop&w=1000&q=80',
    cookingTime: '30 mins',
    prepTime: '15 mins',
    difficulty: 'Medium',
    calories: 410,
    cuisine: 'Mexican',
    dietary: ['Vegetarian', 'Gluten Free'],
    shortDescription: 'Rolled corn tortillas packed with sautéed zucchini, pinto beans, and melted Monterey Jack, baked under vibrant tomatillo salsa verde.',
    servings: 4,
    ingredients: [
      { id: '1', name: 'Tomatillo Salsa Verde', amount: '2 cups' },
      { id: '2', name: 'Corn Tortillas', amount: '8' },
      { id: '3', name: 'Zucchini', amount: '2 medium', unit: 'diced' },
      { id: '4', name: 'Pinto Beans', amount: '1 can', unit: 'drained' },
      { id: '5', name: 'Monterey Jack / Queso Oaxaca', amount: '1.5 cups', unit: 'shredded' },
      { id: '6', name: 'Poblano Pepper', amount: '1', unit: 'roasted & diced' },
      { id: '7', name: 'Cumin & Mexican Oregano', amount: '1 tsp each' }
    ],
    instructions: [
      { step: 1, title: 'Sauté Veggie Filling', text: 'Sauté diced zucchini, roasted poblano, and pinto beans with cumin and oregano until tender.', timeEstimate: '6 mins' },
      { step: 2, title: 'Dip & Fill Tortillas', text: 'Flash-warm tortillas, dip lightly in warm salsa verde, spoon vegetable-bean filling down center with a pinch of cheese, and roll snug.', timeEstimate: '8 mins' },
      { step: 3, title: 'Bake in Casserole', text: 'Arrange seam-down in a baking dish. Pour remaining salsa verde over top and scatter remaining cheese.', timeEstimate: '4 mins' },
      { step: 4, title: 'Bake to Golden Bubble', text: 'Bake at 375°F (190°C) for 12 minutes until cheese is bubbly and edges are lightly crisp.', timeEstimate: '12 mins' }
    ],
    tips: [
      'Dipping tortillas briefly in warm salsa makes them pliable and prevents tearing when rolling.',
      'Top with fresh Mexican crema and radishes for contrast.'
    ],
    nutrition: {
      calories: 410,
      protein: '18g',
      carbs: '48g',
      fat: '17g',
      fiber: '9g',
      sugar: '5g',
      sodium: '530mg'
    },
    tags: ['Casserole', 'Family Friendly', 'Authentic', 'Flavorful'],
    matchScore: 92,
    authorOrSource: 'AI Chef Genie'
  }
];
