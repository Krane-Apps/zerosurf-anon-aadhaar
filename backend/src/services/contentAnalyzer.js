const axios = require('axios');
const cheerio = require('cheerio');

// domains blocked for unverified users
const BLOCKED_DOMAINS = [
  'facebook.com',
  'fb.com', 
  'instagram.com',
  'reddit.com',
  'twitter.com',
  'x.com',
  'tiktok.com',
  'pornhub.com',
  'xvideos.com',
  'xnxx.com',
  'redtube.com',
  'youporn.com'
];

// nsfw keywords for basic text analysis
const NSFW_KEYWORDS = [
  'porn', 'sex', 'nude', 'naked', 'adult', 'xxx', 'explicit', 
  'sexual', 'erotic', 'mature', 'nsfw', '18+', 'dating'
];

/**
 * check if domain is in blocked list
 */
function checkBlockedDomains(url) {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    const blocked = BLOCKED_DOMAINS.some(blockedDomain => 
      domain.includes(blockedDomain)
    );
    
    return { blocked, domain };
  } catch (error) {
    return { blocked: false, domain: null };
  }
}

/**
 * scrape and analyze website content
 */
async function analyzeUrl(url) {
  try {
    // fetch website content
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ZeroSurf/1.0; +https://zerosurf.app/bot)'
      }
    });

    // parse html content
    const $ = cheerio.load(response.data);
    
    // extract text content
    const title = $('title').text().toLowerCase();
    const description = $('meta[name="description"]').attr('content') || '';
    const keywords = $('meta[name="keywords"]').attr('content') || '';
    const bodyText = $('body').text().toLowerCase();
    
    const allText = `${title} ${description} ${keywords} ${bodyText}`.toLowerCase();

    // check for nsfw keywords
    const nsfwDetected = NSFW_KEYWORDS.some(keyword => 
      allText.includes(keyword)
    );

    // check for age restrictions in meta tags
    const ageRating = $('meta[name="rating"]').attr('content') || '';
    const mature = ageRating.includes('mature') || ageRating.includes('adult');

    // simple confidence scoring
    let nsfwScore = 0;
    NSFW_KEYWORDS.forEach(keyword => {
      const matches = (allText.match(new RegExp(keyword, 'g')) || []).length;
      nsfwScore += matches;
    });

    const confidence = Math.min(nsfwScore / 10, 1);
    const isUnsafe = nsfwDetected || mature || confidence > 0.3;

    return {
      safe: !isUnsafe,
      reason: isUnsafe ? 'nsfw_content_detected' : 'content_safe',
      confidence: confidence,
      details: {
        nsfwKeywords: nsfwDetected,
        ageRating: mature,
        score: nsfwScore
      }
    };

  } catch (error) {
    console.error('url analysis error:', error.message);
    
    // fail safe - allow access if analysis fails
    return {
      safe: true,
      reason: 'analysis_failed',
      confidence: 0,
      error: error.message
    };
  }
}

/**
 * placeholder for future ai-powered nsfw detection
 */
async function detectNSFWWithAI(content) {
  // TODO: integrate with external NSFW detection API
  // examples: Sightengine, Google Vision AI, or custom model
  
  /*
  const response = await axios.post('https://api.sightengine.com/1.0/check.json', {
    models: 'nudity-2.0,wad-v1',
    text: content,
    api_user: process.env.SIGHTENGINE_USER,
    api_secret: process.env.SIGHTENGINE_SECRET
  });
  
  return response.data.nudity.safe < 0.5;
  */
  
  return false; // placeholder
}

module.exports = {
  checkBlockedDomains,
  analyzeUrl,
  detectNSFWWithAI
};