# AI Product Insights Suite

A comprehensive dashboard for Product Managers to analyze customer feedback sentiment and prioritize feature requests using Google's Gemini AI.

**Who is this for?** Product Managers, UX Researchers, and Support Leads who need quick, AI-driven insights from raw text data.

## Features
- **Feedback Analyzer**: Sentiment analysis, pain point extraction, and actionable recommendations.
- **Feature Prioritizer**: Impact vs. Urgency scoring (RICE-style) for roadmap planning.
- **Visual Reports**: Interactive charts and data visualizations.

## Local Development

1. **Clone the repository**
2. **Setup Environment**
   This app uses ES Modules directly in the browser. You need a simple static file server.
   
   Create a `.env` file (or just manually set the key in `index.html` for local testing, but strictly revert before committing):
   ```
   API_KEY=your_gemini_api_key_here
   ```

3. **Run**
   You can use `serve`, `http-server`, or VS Code's "Live Server" extension.
   ```bash
   npx serve .
   ```

## Production Deployment (Google Cloud Run)

This app is containerized using NGINX.

1. **Build the Container**
   ```bash
   docker build -t ai-product-insights .
   ```

2. **Run Locally (Test)**
   ```bash
   docker run -p 8080:80 -e API_KEY=your_actual_api_key ai-product-insights
   ```

3. **Deploy to Cloud Run**
   The included GitHub Action (`.github/workflows/deploy.yml`) handles this automatically on push to `main`.
   
   **Manual Steps:**
   ```bash
   gcloud run deploy ai-product-insights \
     --image gcr.io/YOUR_PROJECT_ID/ai-product-insights \
     --platform managed \
     --allow-unauthenticated \
     --set-env-vars API_KEY=your_actual_api_key
   ```

## Security Note
This is a client-side application. The `API_KEY` is injected into the frontend code.
**Mandatory:** Go to Google Cloud Console > APIs & Services > Credentials and **restrict your API key** to:
- HTTP Referrers (Websites): Add your Cloud Run URL (e.g., `https://ai-insights-xyz.a.run.app/*`)
"# ai-product-insights-suite-app" 
