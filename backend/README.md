# ZeroSurf Backend

AI-powered NSFW detection backend using OpenAI GPT-5 nano, deployed on Fluence Virtual Servers.

## Setup

```bash
# install dependencies
npm install

# add your openai api key
cp .env.example .env
# edit .env: OPENAI_API_KEY=your_key_here

# start server
npm run dev
```

## API

### POST /api/content/analyze

Analyzes any URL for NSFW content using AI.

Request:
```json
{
  "url": "https://google.com"
}
```

Response:
```json
{
  "success": true,
  "safe": true,
  "confidence": 0.95,
  "recommendation": "allow",
  "reasons": ["content appears safe for minors"],
  "categories": [],
  "severity": "low"
}
```

## How it works

1. Extracts all data from website (text, images, metadata)
2. Sends content to OpenAI GPT-5 nano for analysis
3. Returns structured response with confidence scores
4. Deployed on Fluence for decentralized hosting

## Environment Variables

- `OPENAI_API_KEY` (required) - Your OpenAI API key
- `PORT` (optional) - Server port, default 3000