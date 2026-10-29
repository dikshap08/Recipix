"""
Python Flask Backend for Recipix - Smart Recipe Generator
=========================================================
Handles AI-powered ingredient detection using the Google Gemini Multimodal API.

To run this backend locally:
1. pip install -r requirements.txt
2. export GEMINI_API_KEY="your_api_key_here"
3. python app.py (runs on http://localhost:5000)
"""

import os
import re
import json
import uuid
import urllib.request
import urllib.parse
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable Cross-Origin Resource Sharing
CORS(app)

# In-memory recipe store
RECIPES = []

def find_recipe_image(recipe_name, cuisine="Any"):
    """
    Finds an authentic food photograph corresponding to the recipe name using Wikimedia Commons.
    1. Evaluates search candidates with exact recipe name and cleaned core dish keywords.
    2. Filters out diagrams, icons, logos, flags, maps, PDFs, books, and non-photo media.
    3. Scores candidate image titles against the recipe name and core culinary terms.
    4. Only returns images with high relevance to the specific dish.
    5. Returns empty string if no relevant image is found, avoiding displaying incorrect dishes.
    """
    clean_name = re.sub(r'\(.*?\)', '', recipe_name).strip()
    qualifiers = {
        'classic', 'homemade', 'crispy', 'spicy', 'creamy', 'easy', 'quick',
        'delicious', 'fresh', 'rustic', 'style', 'special', 'simple', 'best',
        'traditional', 'authentic', 'tasty', 'flavorful', 'gourmet', 'dry',
        'pan-fried', 'stir-fry', 'stir', 'fry', 'delight', 'recipe'
    }

    words = [w for w in re.split(r'[\s\-]+', clean_name) if w.lower() not in qualifiers and len(w) > 1]

    queries = [clean_name]
    if len(words) >= 2 and ' '.join(words) != clean_name:
        queries.append(' '.join(words))

    # Core multi-word fallback without reducing to a generic single ingredient
    if len(words) >= 3:
        lower_words = [w.lower() for w in words]
        if 'bhurji' in lower_words:
            queries.append('Paneer Bhurji')
        queries.append(f"{words[0]} {words[-1]}")

    bad_tokens = {
        'svg', 'pdf', 'ogg', 'ogv', 'webm', 'mp4', 'djvu', 'tif', 'tiff',
        'map', 'flag', 'icon', 'logo', 'diagram', 'chart', 'symbol', 'stamp', 'coin',
        'book', 'page', 'text', 'cover', 'sign', 'building', 'street', 'portrait', 'poster',
        'statue', 'temple', 'market', 'packet', 'box', 'label', 'cartoon', 'drawing',
        'screenshot', 'newspaper', 'advertisement', 'raw', 'plant', 'tree', 'leaf', 'flower', 'seed'
    }

    core_tokens = [w.lower() for w in words if len(w) > 2]
    best_candidate = None
    best_score = -1

    for q in queries:
        try:
            endpoint = 'https://commons.wikimedia.org/w/api.php'
            params = {
                'action': 'query',
                'generator': 'search',
                'gsrsearch': q,
                'gsrnamespace': 6,
                'gsrlimit': 15,
                'prop': 'imageinfo',
                'iiprop': 'url|mime',
                'iiurlwidth': 1000,
                'format': 'json'
            }
            url = endpoint + '?' + urllib.parse.urlencode(params)
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'RecipixApp/1.0 (culinary-recipe-finder; mailto:contact@recipix.app)'}
            )
            with urllib.request.urlopen(req, timeout=4.0) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                pages = data.get('query', {}).get('pages', {})
                for page_id, page in pages.items():
                    raw_title = page.get('title', '')
                    title_clean = re.sub(r'^File:', '', raw_title, flags=re.IGNORECASE)
                    title_clean = re.sub(r'\.[a-zA-Z0-9]+$', '', title_clean).replace('_', ' ').strip()
                    title_lower = title_clean.lower()

                    if any(bad in title_lower for bad in bad_tokens):
                        continue

                    imageinfo = page.get('imageinfo', [])
                    if not imageinfo:
                        continue
                    info = imageinfo[0]
                    mime = info.get('mime', '')
                    if not mime.startswith('image/') or 'svg' in mime or 'gif' in mime:
                        continue

                    score = 0
                    q_lower = q.lower()
                    if q_lower in title_lower:
                        score += 100
                    if clean_name.lower() in title_lower:
                        score += 120

                    matched_tokens = 0
                    for token in core_tokens:
                        if re.search(r'\b' + re.escape(token) + r'\b', title_lower):
                            score += 35
                            matched_tokens += 1

                    if matched_tokens == len(core_tokens) and len(core_tokens) > 1:
                        score += 50

                    # Key dish word checks (e.g. bhurji, arrabbiata, palak, chilli)
                    key_dish_terms = [
                        'bhurji', 'arrabbiata', 'carbonara', 'bolognese', 'biryani',
                        'tikka', 'palak', 'fried rice', 'dosa', 'idli', 'chilli', 'pasta', 'curry'
                    ]
                    for key_word in key_dish_terms:
                        if key_word in clean_name.lower():
                            synonyms = [key_word]
                            if key_word == 'bhurji':
                                synonyms.append('burji')
                            if key_word == 'chilli':
                                synonyms.extend(['chili', 'chilly'])
                            if not any(syn in title_lower for syn in synonyms):
                                score -= 150

                    # Heavy penalty if a conflicting, distinct dish appears in candidate title
                    conflicting_dishes = [
                        'dosa', 'idli', 'vada', 'tikka', 'seekh', 'seek', 'biryani', 'pulao',
                        'paratha', 'parantha', 'naan', 'kulcha', 'roti', 'chapati', 'bhature', 'bhatura',
                        'puri', 'poori', 'samosa', 'pakora', 'pakoda', 'roll', 'sandwich', 'burger', 'pizza',
                        'soup', 'salad', 'patty', 'patties', 'cutlet', 'wrap', 'taco', 'burrito', 'chaat',
                        'noodles', 'macaroni', 'lasagna', 'gnocchi', 'croissant', 'cake', 'pastry', 'cookie', 'bread'
                    ]
                    for cd in conflicting_dishes:
                        if cd in title_lower and cd not in clean_name.lower():
                            score -= 200

                    if len(title_clean) > 80:
                        score -= 20

                    thumb = info.get('thumburl') or info.get('url')
                    if score > best_score and score >= 50:
                        best_score = score
                        best_candidate = thumb

        except Exception as img_err:
            print(f"[Recipix Image] Wikimedia search for '{q}' encountered: {img_err}")
            continue

    if best_candidate:
        print(f"[Recipix Image] Selected matching Wikimedia image for '{recipe_name}' (score {best_score}): {best_candidate}")
        return best_candidate

    print(f"[Recipix Image] No high-confidence image found for '{recipe_name}'. Returning empty to avoid incorrect dish photo.")
    return ""

INGREDIENT_DETECTION_PROMPT = """You are an ingredient detection assistant for Recipix.

Analyze the uploaded image and identify the visible edible food ingredients.

Only identify ingredients that are actually visible in the image.
Do not invent ingredients that cannot reasonably be identified.

Ignore plates, bowls, utensils, packaging, furniture, hands, and background objects.

Return only a JSON array containing the ingredient names.

Example:
[
  "Tomato",
  "Onion",
  "Potato"
]

If no food ingredients can be identified, return an empty array."""


def get_gemini_client():
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return None
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Error initializing Gemini client: {e}")
        return None


@app.route('/api/health', methods=['GET'])
def health():
    has_key = bool(os.environ.get('GEMINI_API_KEY'))
    return jsonify({
        "status": "healthy",
        "service": "Recipix Flask API",
        "gemini_configured": has_key
    }), 200


@app.route('/api/analyze-ingredients', methods=['POST'])
@app.route('/api/scan-ingredients', methods=['POST'])
def analyze_ingredients():
    """
    Receives an image as multipart/form-data and uses the Gemini API
    to analyze visible food ingredients in the image.
    """
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    if not image_file or image_file.filename == '':
        return jsonify({"error": "Empty or invalid image file"}), 400

    image_bytes = image_file.read()
    if not image_bytes:
        return jsonify({"error": "Image file is empty"}), 400

    # Determine MIME type
    mime_type = image_file.content_type or 'image/jpeg'
    if not mime_type.startswith('image/'):
        mime_type = 'image/jpeg'

    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return jsonify({
            "error": "Gemini API key is not configured on the server",
            "ingredients": []
        }), 500

    client = get_gemini_client()
    if not client:
        return jsonify({
            "error": "Unable to initialize Gemini client",
            "ingredients": []
        }), 500

    from google.genai import types

    # Models to try in order of preference (prioritize available quotas)
    models_to_try = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']
    last_error = None
    response_text = None

    for model_name in models_to_try:
        try:
            print(f"[Recipix] Calling Gemini model '{model_name}' for ingredient detection...")
            response = client.models.generate_content(
                model=model_name,
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    INGREDIENT_DETECTION_PROMPT
                ]
            )
            if response and response.text:
                response_text = response.text.strip()
                print(f"[Recipix] Received response from '{model_name}'")
                break
        except Exception as e:
            last_error = e
            print(f"[Recipix] Warning: model {model_name} failed: {e}. Trying next...")

    if not response_text:
        print(f"[Recipix] All models failed. Last error: {last_error}")
        return jsonify({
            "error": "Unable to analyze the image. Please try again.",
            "ingredients": []
        }), 502

    # Clean and parse the JSON response from Gemini
    cleaned = response_text
    # Strip markdown code fences if present (e.g. ```json ... ```)
    cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r'\s*```$', '', cleaned, flags=re.MULTILINE)
    cleaned = cleaned.strip()

    # Extract JSON array if surrounded by other text
    array_match = re.search(r'\[[\s\S]*\]', cleaned)
    if array_match:
        cleaned = array_match.group(0)

    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, list):
            # Clean, format and deduplicate ingredient names
            formatted_ingredients = []
            seen = set()
            for item in parsed:
                if isinstance(item, str):
                    clean_name = item.strip()
                    if clean_name and clean_name.lower() not in seen:
                        # Capitalize first letter of each word
                        display_name = clean_name.title()
                        formatted_ingredients.append(display_name)
                        seen.add(clean_name.lower())

            return jsonify({"ingredients": formatted_ingredients}), 200
        else:
            return jsonify({"ingredients": []}), 200
    except Exception as parse_err:
        print(f"[Recipix] Failed to parse JSON response '{response_text}': {parse_err}")
        return jsonify({"ingredients": []}), 200


@app.route('/api/generate-recipe', methods=['POST'])
def generate_recipe():
    """
    Receives user ingredients, cuisine, dietary preference, and servings.
    Uses real Gemini API to formulate an authentic, tailored recipe based primarily
    on the provided ingredients.
    Searches for an authentic recipe photograph from Wikimedia Commons.
    Returns structured recipe JSON.
    """
    # Support both JSON payloads and multipart/urlencoded form data
    if request.is_json:
        data = request.get_json() or {}
        ingredients_raw = data.get('ingredients', '') or data.get('ingredientsText', '')
        cuisine = data.get('cuisine', 'Any')
        dietary = data.get('dietary', 'No Preference') or data.get('dietaryPreference', 'No Preference')
        try:
            servings = int(data.get('servings', 2))
        except (ValueError, TypeError):
            servings = 2
    else:
        ingredients_raw = request.form.get('ingredients', '') or request.form.get('ingredientsText', '')
        cuisine = request.form.get('cuisine', 'Any')
        dietary = request.form.get('dietary', 'No Preference') or request.form.get('dietaryPreference', 'No Preference')
        try:
            servings = int(request.form.get('servings', 2))
        except (ValueError, TypeError):
            servings = 2

    # Parse ingredients into list
    if isinstance(ingredients_raw, list):
        ingredient_items = [str(item).strip() for item in ingredients_raw if str(item).strip()]
    else:
        ingredient_items = [item.strip() for item in str(ingredients_raw).split(',') if item.strip()]

    if not ingredient_items:
        return jsonify({"error": "Please provide at least one ingredient to generate a recipe."}), 400

    ingredients_text = ", ".join(ingredient_items)

    client = get_gemini_client()
    if not client:
        return jsonify({"error": "Unable to generate the recipe right now. Please try again."}), 500

    recipe_generation_prompt = f"""You are an expert master chef and recipe creator for Recipix.
Create an authentic, delicious recipe based primarily on the ingredients provided by the user.

User Inputs:
- Available Ingredients: {ingredients_text}
- Dietary Preference: {dietary}
- Cuisine Style: {cuisine}
- Number of Servings: {servings}

Strict Rules:
1. The recipe MUST be based primarily and strictly on the ingredients provided by the user: {ingredients_text}.
2. Under NO circumstances introduce unprovided major ingredients, meats, vegetables, starches, or legumes (for example: if user gave Paneer, Onion, Tomato, Capsicum, Coriander, DO NOT add mushrooms, broccoli, chicken, pasta, noodles, rice, potatoes, peas unless provided by user).
3. You may ONLY add basic cooking staples: cooking oil/butter/ghee, water, salt, black pepper, and standard dry spices appropriate for the cuisine (such as cumin seeds, turmeric, red chili powder, coriander powder, garam masala for Indian cuisine).
4. Name the dish using an authentic, recognized culinary dish name (such as 'Paneer Bhurji' or 'Paneer Capsicum Bhurji' for Paneer + Onion + Tomato + Capsicum; 'Penne Arrabbiata', 'Vegetable Fried Rice', 'Palak Paneer', 'Chilli Paneer', 'Masala Pasta', etc.) rather than an artificial compound title. Do NOT add decorative adjectives like 'Classic', 'Homemade', 'Delicious', 'Special' to the recipe name.
5. Strictly respect the dietary preference ({dietary}), cuisine style ({cuisine}), and adjust ingredient quantities accurately for {servings} servings.
6. Return ONLY a valid JSON object matching this schema without any markdown formatting, preamble, or commentary:
{{
  "name": "Specific Recipe Name (e.g. Paneer Bhurji)",
  "description": "Appetizing 2-3 sentence overview of the dish and flavors.",
  "ingredients": [
    {{
      "name": "Ingredient Name",
      "quantity": "Amount and unit adjusted for {servings} servings"
    }}
  ],
  "instructions": [
    "Step 1 instruction...",
    "Step 2 instruction...",
    "Step 3 instruction..."
  ],
  "prepTime": "10 mins",
  "cookTime": "15 mins",
  "servings": {servings},
  "dietaryInfo": "{dietary}",
  "difficulty": "Easy",
  "tips": [
    "Helpful chef cooking tip 1",
    "Helpful chef cooking tip 2"
  ],
  "nutrition": {{
    "calories": 350,
    "protein": "16g",
    "carbs": "15g",
    "fat": "18g",
    "fiber": "4g",
    "sodium": "380mg"
  }}
}}"""

    models_to_try = ['gemini-3.1-flash-lite', 'gemini-3.6-flash', 'gemini-2.5-flash']
    response_text = None
    last_error = None

    for model_name in models_to_try:
        try:
            print(f"[Recipix] Generating recipe with Gemini model '{model_name}'...")
            resp = client.models.generate_content(
                model=model_name,
                contents=recipe_generation_prompt
            )
            if resp and resp.text:
                response_text = resp.text.strip()
                print(f"[Recipix] Received recipe generation from '{model_name}'")
                break
        except Exception as e:
            last_error = e
            print(f"[Recipix] Warning: model {model_name} failed: {e}. Trying next...")

    if not response_text:
        print(f"[Recipix] All recipe models failed. Last error: {last_error}")
        return jsonify({"error": "Unable to generate the recipe right now. Please try again."}), 502

    # Clean JSON text
    cleaned = response_text
    cleaned = re.sub(r'^```(?:json)?\s*', '', cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r'\s*```$', '', cleaned, flags=re.MULTILINE).strip()
    match = re.search(r'\{[\s\S]*\}', cleaned)
    if match:
        cleaned = match.group(0)

    try:
        raw_recipe = json.loads(cleaned)
    except Exception as parse_err:
        print(f"[Recipix] Failed to parse recipe JSON: {parse_err}. Response was: {response_text}")
        return jsonify({"error": "Unable to generate the recipe right now. Please try again."}), 502

    recipe_name = raw_recipe.get("name") or f"{cuisine} Delight"
    description = raw_recipe.get("description") or f"A wonderful {cuisine} dish made with your selected ingredients."
    prep_time = raw_recipe.get("prepTime") or "10 mins"
    cook_time = raw_recipe.get("cookTime") or "20 mins"
    servings_res = int(raw_recipe.get("servings", servings))
    difficulty = raw_recipe.get("difficulty") or "Easy"
    if difficulty not in ["Easy", "Medium", "Hard"]:
        difficulty = "Easy"

    # Search for an authentic image of the recipe from Wikimedia Commons
    image_url = find_recipe_image(recipe_name, cuisine)

    # Format ingredients
    formatted_ingredients = []
    for i, ing in enumerate(raw_recipe.get("ingredients", [])):
        if isinstance(ing, dict):
            name = ing.get("name", "").strip()
            qty = ing.get("quantity") or ing.get("amount") or "1 portion"
            if name:
                formatted_ingredients.append({
                    "id": f"ing-{i+1}",
                    "name": name,
                    "amount": str(qty)
                })
        elif isinstance(ing, str) and ing.strip():
            formatted_ingredients.append({
                "id": f"ing-{i+1}",
                "name": ing.strip(),
                "amount": "As needed"
            })

    if not formatted_ingredients:
        for i, item in enumerate(ingredient_items):
            formatted_ingredients.append({
                "id": f"ing-{i+1}",
                "name": item,
                "amount": "1 portion"
            })

    # Format instructions
    formatted_instructions = []
    for i, step in enumerate(raw_recipe.get("instructions", [])):
        if isinstance(step, dict):
            step_text = step.get("text") or step.get("instruction") or ""
            step_title = step.get("title") or f"Step {i+1}"
            step_time = step.get("timeEstimate")
        else:
            step_text = str(step).strip()
            step_title = f"Step {i+1}"
            step_time = None

        if step_text:
            formatted_instructions.append({
                "step": i + 1,
                "title": step_title,
                "text": step_text,
                **( {"timeEstimate": step_time} if step_time else {} )
            })

    # Format tips
    tips = raw_recipe.get("tips") or [
        "Taste and adjust seasoning before serving.",
        "Serve fresh and warm for optimal flavor."
    ]

    # Nutrition
    raw_nutrition = raw_recipe.get("nutrition") or {}
    nutrition = {
        "calories": int(raw_nutrition.get("calories", 380)),
        "protein": str(raw_nutrition.get("protein", "15g")),
        "carbs": str(raw_nutrition.get("carbs", "35g")),
        "fat": str(raw_nutrition.get("fat", "14g")),
        "fiber": str(raw_nutrition.get("fiber", "4g")),
        "sodium": str(raw_nutrition.get("sodium", "380mg"))
    }

    # Dietary tags
    dietary_list = []
    if dietary and dietary != 'No Preference':
        dietary_list.append(dietary)
    diet_info = raw_recipe.get("dietaryInfo")
    if diet_info and diet_info not in dietary_list and diet_info != 'No Preference':
        dietary_list.append(diet_info)
    if not dietary_list:
        dietary_list = ['Vegetarian']

    recipe_id = f"recipe-{uuid.uuid4().hex[:8]}"

    recipe_payload = {
        # Structured fields
        "name": recipe_name,
        "description": description,
        "prepTime": prep_time,
        "cookTime": cook_time,
        "servings": servings_res,
        "dietaryInfo": dietary_list[0] if dietary_list else "Vegetarian",
        "imageUrl": image_url,

        # Standard Recipe interface fields for frontend components
        "id": recipe_id,
        "title": recipe_name,
        "image": image_url,
        "cookingTime": cook_time,
        "difficulty": difficulty,
        "calories": nutrition["calories"],
        "cuisine": cuisine if cuisine != 'Any' else 'Indian',
        "dietary": dietary_list,
        "shortDescription": description,
        "ingredients": formatted_ingredients,
        "instructions": formatted_instructions,
        "tips": tips,
        "nutrition": nutrition,
        "tags": ["AI Generated", cuisine if cuisine != 'Any' else 'Specialty', *dietary_list],
        "matchScore": 98,
        "authorOrSource": "Recipix Gemini AI Chef"
    }

    RECIPES.insert(0, recipe_payload)
    return jsonify(recipe_payload), 200


@app.route('/api/recipes', methods=['GET'])
def list_recipes():
    return jsonify(RECIPES), 200


if __name__ == '__main__':
    port = int(os.environ.get('FLASK_PORT', 5000))
    print(f"[Recipix] Starting Flask API server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
