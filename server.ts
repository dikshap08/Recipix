import express from "express";
import path from "path";
import http from "http";
import dotenv from "dotenv";
import { spawn } from "child_process";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

const PORT = 3000;
const FLASK_PORT = 5000;

let flaskProcess: any = null;
let isFlaskAlive = false;

// Memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

// Check if Flask is responding on port 5000
function checkFlaskHealth(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(
      {
        hostname: "127.0.0.1",
        port: FLASK_PORT,
        path: "/api/health",
        timeout: 1000,
      },
      (res) => {
        resolve(res.statusCode === 200);
      },
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

function startFlaskBackend() {
  const pythonCmd = process.platform === "win32" ? "py" : "python3";
  const flaskArgs = ["backend/app.py"];

  console.log(
    `[Recipix Server] Attempting to start Flask companion backend on port ${FLASK_PORT}...`,
  );
  try {
    flaskProcess = spawn(pythonCmd, flaskArgs, {
      env: { ...process.env, FLASK_PORT: String(FLASK_PORT) },
      stdio: "inherit",
    });

    flaskProcess.on("error", (err: any) => {
      console.warn(
        "[Recipix Server] Flask companion not started:",
        err.message,
      );
      isFlaskAlive = false;
    });

    flaskProcess.on("exit", (code: number, signal: string) => {
      console.log(
        `[Recipix Server] Flask process exited (code ${code}, signal ${signal})`,
      );
      isFlaskAlive = false;
    });

    // Check health after 2 seconds
    setTimeout(async () => {
      isFlaskAlive = await checkFlaskHealth();
      if (isFlaskAlive) {
        console.log("[Recipix Server] Flask backend is online and active.");
      } else {
        console.log(
          "[Recipix Server] Running in native Node.js + Gemini mode.",
        );
      }
    }, 2000);
  } catch (err: any) {
    console.warn("[Recipix Server] Flask spawn unavailable:", err.message);
    isFlaskAlive = false;
  }
}

/**
 * Searches Wikimedia Commons API for an authentic photograph of the recipe
 */
async function findRecipeImage(
  recipeName: string,
  cuisine: string,
): Promise<string> {
  const cleanName = recipeName.replace(/\(.*?\)/g, "").trim();
  const qualifiers = new Set([
    "classic",
    "homemade",
    "crispy",
    "spicy",
    "creamy",
    "easy",
    "quick",
    "delicious",
    "fresh",
    "rustic",
    "style",
    "special",
    "simple",
    "best",
    "traditional",
    "authentic",
    "tasty",
    "flavorful",
    "gourmet",
    "dry",
    "pan-fried",
    "stir-fry",
    "stir",
    "fry",
    "delight",
    "recipe",
  ]);

  const words = cleanName
    .split(/[\s\-]+/)
    .filter((w) => !qualifiers.has(w.toLowerCase()) && w.length > 1);

  const queries: string[] = [cleanName];
  if (words.length >= 2 && words.join(" ") !== cleanName) {
    queries.push(words.join(" "));
  }
  if (words.length >= 3) {
    const lowerWords = words.map((w) => w.toLowerCase());
    if (lowerWords.includes("bhurji")) {
      queries.push("Paneer Bhurji");
    }
    queries.push(`${words[0]} ${words[words.length - 1]}`);
  }

  const badTokens = [
    "svg",
    "pdf",
    "ogg",
    "ogv",
    "webm",
    "mp4",
    "djvu",
    "tif",
    "tiff",
    "map",
    "flag",
    "icon",
    "logo",
    "diagram",
    "chart",
    "symbol",
    "stamp",
    "coin",
    "book",
    "page",
    "text",
    "cover",
    "sign",
    "building",
    "street",
    "portrait",
    "poster",
    "statue",
    "temple",
    "market",
    "packet",
    "box",
    "label",
    "cartoon",
    "drawing",
    "screenshot",
    "newspaper",
    "advertisement",
    "raw",
    "plant",
    "tree",
    "leaf",
    "flower",
    "seed",
  ];

  const coreTokens = words
    .filter((w) => w.length > 2)
    .map((w) => w.toLowerCase());
  let bestCandidate: string | null = null;
  let bestScore = -1;

  for (const q of queries) {
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url|mime&iiurlwidth=1000&format=json&gsrsearch=${encodeURIComponent(
        q,
      )}`;
      const resp = await fetch(url, {
        headers: {
          "User-Agent":
            "RecipixRecipeApp/1.0 (culinary-assistant; mailto:contact@recipix.app)",
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        const pages = data.query?.pages || {};
        for (const key of Object.keys(pages)) {
          const rawTitle = pages[key].title || "";
          const titleClean = rawTitle
            .replace(/^File:/i, "")
            .replace(/\.[a-zA-Z0-9]+$/, "")
            .replace(/_/g, " ")
            .trim();
          const titleLower = titleClean.toLowerCase();

          if (badTokens.some((bad) => titleLower.includes(bad))) {
            continue;
          }

          const info = pages[key].imageinfo?.[0];
          if (
            !info ||
            !info.mime?.startsWith("image/") ||
            info.mime?.includes("svg") ||
            info.mime?.includes("gif")
          ) {
            continue;
          }

          let score = 0;
          const qLower = q.toLowerCase();
          if (titleLower.includes(qLower)) {
            score += 100;
          }
          if (titleLower.includes(cleanName.toLowerCase())) {
            score += 120;
          }

          let matchedTokens = 0;
          for (const token of coreTokens) {
            const regex = new RegExp(`\\b${token}\\b`, "i");
            if (regex.test(titleLower)) {
              score += 35;
              matchedTokens += 1;
            }
          }

          if (matchedTokens === coreTokens.length && coreTokens.length > 1) {
            score += 50;
          }

          const keyDishTerms = [
            "bhurji",
            "arrabbiata",
            "carbonara",
            "bolognese",
            "biryani",
            "tikka",
            "palak",
            "fried rice",
            "dosa",
            "idli",
            "chilli",
            "pasta",
            "curry",
          ];
          for (const keyWord of keyDishTerms) {
            if (cleanName.toLowerCase().includes(keyWord)) {
              const synonyms = [keyWord];
              if (keyWord === "bhurji") synonyms.push("burji");
              if (keyWord === "chilli") synonyms.push("chili", "chilly");
              if (!synonyms.some((syn) => titleLower.includes(syn))) {
                score -= 150;
              }
            }
          }

          const conflictingDishes = [
            "dosa",
            "idli",
            "vada",
            "tikka",
            "seekh",
            "seek",
            "biryani",
            "pulao",
            "paratha",
            "parantha",
            "naan",
            "kulcha",
            "roti",
            "chapati",
            "bhature",
            "bhatura",
            "puri",
            "poori",
            "samosa",
            "pakora",
            "pakoda",
            "roll",
            "sandwich",
            "burger",
            "pizza",
            "soup",
            "salad",
            "patty",
            "patties",
            "cutlet",
            "wrap",
            "taco",
            "burrito",
            "chaat",
            "noodles",
            "macaroni",
            "lasagna",
            "gnocchi",
            "croissant",
            "cake",
            "pastry",
            "cookie",
            "bread",
          ];
          for (const cd of conflictingDishes) {
            if (
              titleLower.includes(cd) &&
              !cleanName.toLowerCase().includes(cd)
            ) {
              score -= 200;
            }
          }

          if (titleClean.length > 80) {
            score -= 20;
          }

          const thumb = info.thumburl || info.url;
          if (score > bestScore && score >= 50 && thumb) {
            bestScore = score;
            bestCandidate = thumb;
          }
        }
      }
    } catch (e) {
      console.warn(`[Recipix Image] Wikimedia search for '${q}' error:`, e);
    }
  }

  if (bestCandidate) {
    console.log(
      `[Recipix Image] Selected matching Wikimedia image for '${recipeName}' (score ${bestScore}): ${bestCandidate}`,
    );
    return bestCandidate;
  }

  console.log(
    `[Recipix Image] No high-confidence image found for '${recipeName}'. Returning empty string to avoid showing incorrect food.`,
  );
  return "";
}

/**
 * Native server-side Gemini recipe generator
 */
async function generateRecipeWithGemini(
  ingredientsText: string,
  cuisine: string,
  dietary: string,
  servings: number,
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Unable to generate the recipe right now. Please try again.",
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are an expert master chef and recipe creator for Recipix.
Create an authentic, delicious recipe based primarily on the ingredients provided by the user.

User Inputs:
- Available Ingredients: ${ingredientsText}
- Dietary Preference: ${dietary}
- Cuisine Style: ${cuisine}
- Number of Servings: ${servings}

Strict Rules:
1. The recipe MUST be based primarily and strictly on the ingredients provided by the user: ${ingredientsText}.
2. Under NO circumstances introduce unprovided major ingredients, meats, vegetables, starches, or legumes (for example: if user gave Paneer, Onion, Tomato, Capsicum, Coriander, DO NOT add mushrooms, broccoli, chicken, pasta, noodles, rice, potatoes, peas unless provided by user).
3. You may ONLY add basic cooking staples: cooking oil/butter/ghee, water, salt, black pepper, and standard dry spices appropriate for the cuisine (such as cumin seeds, turmeric, red chili powder, coriander powder, garam masala for Indian cuisine).
4. Name the dish using an authentic, recognized culinary dish name (such as 'Paneer Bhurji' or 'Paneer Capsicum Bhurji' for Paneer + Onion + Tomato + Capsicum; 'Penne Arrabbiata', 'Vegetable Fried Rice', 'Palak Paneer', 'Chilli Paneer', 'Masala Pasta', etc.) rather than an artificial compound title. Do NOT add decorative adjectives like 'Classic', 'Homemade', 'Delicious', 'Special' to the recipe name.
5. Strictly respect the dietary preference (${dietary}), cuisine style (${cuisine}), and adjust ingredient quantities accurately for ${servings} servings.
6. Return ONLY a valid JSON object matching this schema without any markdown formatting, preamble, or commentary:
{
  "name": "Specific Recipe Name (e.g. Paneer Bhurji)",
  "description": "Appetizing 2-3 sentence overview of the dish and flavors.",
  "ingredients": [
    {
      "name": "Ingredient Name",
      "quantity": "Amount and unit adjusted for ${servings} servings"
    }
  ],
  "instructions": [
    "Step 1 instruction...",
    "Step 2 instruction...",
    "Step 3 instruction..."
  ],
  "prepTime": "10 mins",
  "cookTime": "15 mins",
  "servings": ${servings},
  "dietaryInfo": "${dietary}",
  "difficulty": "Easy",
  "tips": [
    "Helpful chef cooking tip 1",
    "Helpful chef cooking tip 2"
  ],
  "nutrition": {
    "calories": 350,
    "protein": "16g",
    "carbs": "15g",
    "fat": "18g",
    "fiber": "4g",
    "sodium": "380mg"
  }
}`;

  const models = ["gemini-3.1-flash-lite", "gemini-3.6-flash"];
  let lastErr: any = null;

  for (const model of models) {
    try {
      console.log(
        `[Recipix Server] Generating recipe with Gemini model '${model}'...`,
      );
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      if (response && response.text) {
        let cleaned = response.text.trim();
        cleaned = cleaned
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) cleaned = jsonMatch[0];
        const raw = JSON.parse(cleaned);

        const recipeName = raw.name || `${cuisine} Delight`;
        console.log(
          `[Recipix Server] Generated recipe: "${recipeName}". Searching authentic image...`,
        );
        const imageUrl = await findRecipeImage(recipeName, cuisine);

        const formattedIngredients = (raw.ingredients || []).map(
          (ing: any, i: number) => ({
            id: `ing-${i + 1}`,
            name: typeof ing === "string" ? ing : ing.name || "Ingredient",
            amount:
              typeof ing === "object"
                ? ing.quantity || ing.amount || "1 portion"
                : "1 portion",
          }),
        );

        const formattedInstructions = (raw.instructions || []).map(
          (step: any, i: number) => ({
            step: i + 1,
            title:
              typeof step === "object"
                ? step.title || `Step ${i + 1}`
                : `Step ${i + 1}`,
            text:
              typeof step === "object"
                ? step.text || step.instruction || ""
                : String(step),
            timeEstimate:
              typeof step === "object" ? step.timeEstimate : undefined,
          }),
        );

        const nutrition = {
          calories: Number(raw.nutrition?.calories) || 350,
          protein: String(raw.nutrition?.protein || "16g"),
          carbs: String(raw.nutrition?.carbs || "30g"),
          fat: String(raw.nutrition?.fat || "14g"),
          fiber: String(raw.nutrition?.fiber || "4g"),
          sodium: String(raw.nutrition?.sodium || "380mg"),
        };

        const dietaryList: string[] = [];
        if (dietary && dietary !== "No Preference") dietaryList.push(dietary);
        if (
          raw.dietaryInfo &&
          !dietaryList.includes(raw.dietaryInfo) &&
          raw.dietaryInfo !== "No Preference"
        ) {
          dietaryList.push(raw.dietaryInfo);
        }
        if (dietaryList.length === 0) dietaryList.push("Vegetarian");

        const recipeId = `recipe-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

        return {
          name: recipeName,
          description:
            raw.description ||
            "A delicious dish created from your ingredients.",
          prepTime: raw.prepTime || "10 mins",
          cookTime: raw.cookTime || "20 mins",
          servings: Number(raw.servings) || servings,
          dietaryInfo: dietaryList[0],
          imageUrl,

          // Full Recipe interface properties
          id: recipeId,
          title: recipeName,
          image: imageUrl,
          cookingTime: raw.cookTime || "20 mins",
          difficulty: raw.difficulty || "Easy",
          calories: nutrition.calories,
          cuisine: cuisine !== "Any" ? cuisine : "Indian",
          dietary: dietaryList,
          shortDescription:
            raw.description ||
            "A delicious dish created from your ingredients.",
          ingredients: formattedIngredients,
          instructions: formattedInstructions,
          tips: raw.tips || [
            "Taste and adjust seasoning before serving.",
            "Serve hot for optimal flavor.",
          ],
          nutrition,
          tags: [
            "AI Generated",
            cuisine !== "Any" ? cuisine : "Specialty",
            ...dietaryList,
          ],
          matchScore: 98,
          authorOrSource: "Recipix Gemini AI Chef",
        };
      }
    } catch (e: any) {
      lastErr = e;
      console.warn(`[Recipix Server] Model ${model} failed:`, e?.message);
    }
  }

  throw (
    lastErr ||
    new Error("Unable to generate the recipe right now. Please try again.")
  );
}

/**
 * Native server-side Gemini ingredient detection
 */
async function analyzeIngredientsWithGemini(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return [];

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are an ingredient detection assistant for Recipix.
Analyze the uploaded image and identify the visible edible food ingredients.
Only identify ingredients that are actually visible in the image.
Do not invent ingredients that cannot reasonably be identified.
Ignore plates, bowls, utensils, packaging, furniture, hands, and background objects.
Return only a JSON array containing the ingredient names.
Example: ["Tomato", "Onion", "Potato"]
If no food ingredients can be identified, return an empty array.`;

  const models = ["gemini-3.6-flash", "gemini-3.1-flash-lite"];
  for (const model of models) {
    try {
      console.log(
        `[Recipix Server] Detecting ingredients with Gemini model '${model}'...`,
      );
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            inlineData: {
              data: imageBuffer.toString("base64"),
              mimeType: mimeType || "image/jpeg",
            },
          },
          prompt,
        ],
      });
      if (response && response.text) {
        let cleaned = response.text.trim();
        cleaned = cleaned
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();
        const arrMatch = cleaned.match(/\[[\s\S]*\]/);
        if (arrMatch) cleaned = arrMatch[0];
        const raw = JSON.parse(cleaned);
        if (Array.isArray(raw)) {
          const seen = new Set<string>();
          const result: string[] = [];
          for (const item of raw) {
            const clean = String(item).trim();
            if (clean && !seen.has(clean.toLowerCase())) {
              seen.add(clean.toLowerCase());
              result.push(clean.charAt(0).toUpperCase() + clean.slice(1));
            }
          }
          return result;
        }
      }
    } catch (e: any) {
      console.warn(
        `[Recipix Server] Analyze ingredients with ${model} failed:`,
        e?.message,
      );
    }
  }
  return [];
}

async function startServer() {
  // Try starting companion Flask server in background
  startFlaskBackend();

  const app = express();

  // Middleware for body parsing
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // Health check
  app.get("/api/health", async (_req, res) => {
    res.json({
      status: "healthy",
      service: "Recipix Server",
      gemini_configured: !!process.env.GEMINI_API_KEY,
    });
  });

  // Recipe generation endpoint
  app.post("/api/generate-recipe", upload.any(), async (req, res) => {
    try {
      const ingredientsRaw =
        req.body.ingredients || req.body.ingredientsText || "";
      const cuisine = req.body.cuisine || "Any";
      const dietary =
        req.body.dietary || req.body.dietaryPreference || "No Preference";
      const servings = parseInt(req.body.servings || "2", 10) || 2;

      let ingredientsList: string[] = [];
      if (Array.isArray(ingredientsRaw)) {
        ingredientsList = ingredientsRaw
          .map((s) => String(s).trim())
          .filter(Boolean);
      } else {
        ingredientsList = String(ingredientsRaw)
          .split(/[,;\n]+/)
          .map((s) => s.trim())
          .filter(Boolean);
      }

      if (ingredientsList.length === 0) {
        res.status(400).json({
          error: "Please provide at least one ingredient to generate a recipe.",
        });
        return;
      }

      const ingredientsText = ingredientsList.join(", ");

      // If Flask backend is active, try Flask first
      const flaskAlive = await checkFlaskHealth();
      if (flaskAlive) {
        try {
          const form = new URLSearchParams();
          form.append("ingredients", ingredientsText);
          form.append("cuisine", cuisine);
          form.append("dietary", dietary);
          form.append("servings", String(servings));

          const flaskRes = await fetch(
            `http://127.0.0.1:${FLASK_PORT}/api/generate-recipe`,
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: form.toString(),
            },
          );

          if (flaskRes.ok) {
            const data = await flaskRes.json();
            res.json(data);
            return;
          }
        } catch (flaskErr) {
          console.warn(
            "[Recipix Server] Flask request failed, falling back to native Gemini:",
            flaskErr,
          );
        }
      }

      // Native Gemini generation
      const recipeData = await generateRecipeWithGemini(
        ingredientsText,
        cuisine,
        dietary,
        servings,
      );
      res.json(recipeData);
    } catch (err: any) {
      console.error("[Recipix Server] Generate recipe error:", err?.message);
      res.status(502).json({
        error: "Unable to generate the recipe right now. Please try again.",
      });
    }
  });

  // Ingredient detection endpoint
  app.post(
    ["/api/analyze-ingredients", "/api/scan-ingredients"],
    upload.single("image"),
    async (req, res) => {
      try {
        if (!req.file || !req.file.buffer) {
          res
            .status(400)
            .json({ error: "No image file provided.", ingredients: [] });
          return;
        }

        const ingredients = await analyzeIngredientsWithGemini(
          req.file.buffer,
          req.file.mimetype,
        );
        res.json({ ingredients });
      } catch (err: any) {
        console.error(
          "[Recipix Server] Analyze ingredients error:",
          err?.message,
        );
        res.status(502).json({
          error: "Unable to analyze the image. Please try again.",
          ingredients: [],
        });
      }
    },
  );

  // Recipes list
  app.get("/api/recipes", (_req, res) => {
    res.json([]);
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Recipix Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Recipix Server] Failed to start:", err);
  process.exit(1);
});
