# ZeroSurf Backend

Express.js backend for ZeroSurf Mobile app providing content filtering and NSFW detection services.

## Features

- **Domain Blocking**: Block known adult/social media sites for unverified users
- **Content Analysis**: Web scraping + keyword detection for NSFW content
- **AI Integration**: Ready for external NSFW detection APIs
- **Fluence Deployment**: Designed for decentralized compute deployment

## Quick Start

```bash
# install dependencies
npm install

# copy environment file
cp .env.example .env

# start development server
npm run dev

# start production server
npm start
```

## API Endpoints

### POST /api/content/check
Check if a URL is safe for under-18 users.

```json
{
  "url": "https://example.com"
}
```

Response:
```json
{
  "safe": true,
  "reason": "content_safe",
  "confidence": 0.1,
  "url": "https://example.com"
}
```

### GET /api/content/blocked-domains
Get list of blocked domains.

### GET /health
Health check endpoint.

## Deployment on Fluence

```bash
# create fluence vm
fvm-cli vm create zerosurf-backend --cpu 2 --memory 4 --wait

# deploy to vm
scp -r . user@vm-ip:/app
ssh user@vm-ip "cd /app && npm install && npm start"
```

## Content Filtering Logic

1. **Quick Domain Check**: Fast lookup against blocked domain list
2. **Content Scraping**: Fetch and parse HTML content
3. **Keyword Analysis**: Check for NSFW keywords in text
4. **Confidence Scoring**: Calculate risk score based on multiple factors
5. **AI Enhancement**: Optional integration with external NSFW APIs

## Security Features

- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Error handling with safe defaults