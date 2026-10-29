# Recipix 🍳

**Your personal AI-powered recipe generator.**

Recipix helps you discover recipes based on the ingredients you have at home. Generate personalized recipes, explore cooking ideas, and make meal planning easier with the power of AI.

## ✨ Features

- **AI Recipe Generation:** Generate recipes based on your available ingredients.
- **Image Ingredient Scanner:** Upload a food image to identify ingredients using AI.
- **Personalized Recipes:** Customize recipes according to your preferences.
- **Recipe Details:** Explore ingredients, quantities, and cooking instructions.
- **Recipe Discovery:** Browse recipes and find inspiration for your next meal.
- **Responsive Interface:** Enjoy a clean and user-friendly experience.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, Python, Flask
- **AI Integration:** Google Gemini API
- **Styling:** Tailwind CSS

## 🚀 Run Locally

### Prerequisites

- Node.js and npm
- Python 3
- A Gemini API key

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd recipix
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Install dependencies

```bash
npm install
```

Install the Python backend dependencies:

```bash
python -m pip install -r backend/requirements.txt
```

On Windows, you can use `py` instead of `python` if required.

### 3. Configure your API key

Create a `.env.local` file in the project root and add:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder with your own Gemini API key. Never commit your API key to GitHub.

### 4. Start the application

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | API key used for Gemini AI features |

Keep API keys private and configure them securely when deploying the application.

## 🌐 Deployment

Recipix can be deployed using a hosting platform that supports Node.js applications, such as Render.

Configure the required environment variables and production build and start commands in your hosting dashboard.

## 📁 Project Structure

```text
recipix/
├── backend/          # Python Flask API
├── public/           # Static assets and images
├── src/
│   ├── components/   # Reusable UI components
│   ├── data/         # Recipe data
│   ├── services/     # API integration
│   └── types/        # TypeScript types
├── server.ts         # Express server
├── package.json      # Node.js dependencies and scripts
├── vite.config.ts    # Vite configuration
└── README.md         # Project documentation
```

## 🎯 Project Goal

Recipix aims to reduce food waste and make everyday cooking easier by helping users turn available ingredients into delicious meal ideas.

---

**Made with ❤️ for food lovers.**
