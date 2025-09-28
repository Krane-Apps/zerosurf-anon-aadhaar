const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');

// initialize openai with gpt-5-nano
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  'youporn.com',
  'onlyfans.com',
  'chaturbate.com',
  'stripchat.com',
  'cam4.com'
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
 * extract comprehensive data from website
 */
async function extractWebsiteData(url) {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      maxContentLength: 10 * 1024 * 1024, // 10mb max
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    const $ = cheerio.load(response.data);
    
    // comprehensive data extraction
    const extractedData = {
      // basic page info
      title: $('title').text().trim(),
      description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content') || '',
      
      // open graph data
      ogTitle: $('meta[property="og:title"]').attr('content') || '',
      ogDescription: $('meta[property="og:description"]').attr('content') || '',
      ogType: $('meta[property="og:type"]').attr('content') || '',
      ogImage: $('meta[property="og:image"]').attr('content') || '',
      
      // twitter card data
      twitterTitle: $('meta[name="twitter:title"]').attr('content') || '',
      twitterDescription: $('meta[name="twitter:description"]').attr('content') || '',
      twitterImage: $('meta[name="twitter:image"]').attr('content') || '',
      
      // content rating and age restrictions
      contentRating: $('meta[name="rating"]').attr('content') || '',
      ageRating: $('meta[name="age-rating"]').attr('content') || '',
      maturityRating: $('meta[name="maturity"]').attr('content') || '',
      
      // page content
      headings: {
        h1: $('h1').map((i, el) => $(el).text().trim()).get(),
        h2: $('h2').map((i, el) => $(el).text().trim()).get(),
        h3: $('h3').map((i, el) => $(el).text().trim()).get()
      },
      
      // images with alt text
      images: $('img').map((i, el) => ({
        src: $(el).attr('src'),
        alt: $(el).attr('alt') || '',
        title: $(el).attr('title') || ''
      })).get().slice(0, 20), // limit to first 20 images
      
      // links
      links: $('a').map((i, el) => ({
        href: $(el).attr('href'),
        text: $(el).text().trim()
      })).get().slice(0, 50), // limit to first 50 links
      
      // body text content (first 5000 chars)
      bodyText: $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000),
      
      // page language
      language: $('html').attr('lang') || $('meta[http-equiv="content-language"]').attr('content') || '',
      
      // canonical url
      canonical: $('link[rel="canonical"]').attr('href') || '',
      
      // viewport and responsive info
      viewport: $('meta[name="viewport"]').attr('content') || '',
      
      // favicon
      favicon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || '',
      
      // page analytics/tracking
      hasGoogleAnalytics: response.data.includes('googletagmanager') || response.data.includes('google-analytics'),
      hasFacebookPixel: response.data.includes('connect.facebook.net'),
      
      // technical details
      generator: $('meta[name="generator"]').attr('content') || '',
      charset: $('meta[charset]').attr('charset') || response.headers['content-type'] || '',
      
      // response metadata
      statusCode: response.status,
      contentType: response.headers['content-type'],
      contentLength: response.headers['content-length'],
      lastModified: response.headers['last-modified'],
      server: response.headers['server'],
      
      // extracted timestamp
      extractedAt: new Date().toISOString(),
      url: url
    };
    
    return extractedData;
    
  } catch (error) {
    console.error('data extraction error:', error.message);
    throw new Error(`failed to extract data from ${url}: ${error.message}`);
  }
}

/**
 * analyze content using openai gpt-5-nano for nsfw detection
 */
async function analyzeWithOpenAI(extractedData) {
  try {
    // prepare content for analysis
    const contentToAnalyze = {
      title: extractedData.title,
      description: extractedData.description,
      ogDescription: extractedData.ogDescription,
      headings: extractedData.headings,
      bodyText: extractedData.bodyText.substring(0, 2000), // limit for token usage
      images: extractedData.images.map(img => ({ alt: img.alt, title: img.title })).slice(0, 10),
      links: extractedData.links.map(link => link.text).slice(0, 20),
      contentRating: extractedData.contentRating,
      ageRating: extractedData.ageRating,
      maturityRating: extractedData.maturityRating
    };

    const prompt = `Analyze this website content for NSFW (Not Safe For Work) material that would be inappropriate for users under 18 years old.

Website Data:
${JSON.stringify(contentToAnalyze, null, 2)}

Please analyze this content and respond with a JSON object containing:
1. "isNSFW": boolean (true if content contains adult/sexual material, violence, drugs, gambling, or other 18+ content)
2. "confidence": number between 0-1 (how confident you are in this assessment)
3. "reasons": array of specific reasons why this content might be inappropriate
4. "categories": array of NSFW categories detected (e.g., "adult", "violence", "gambling", "drugs", "profanity")
5. "severity": string ("low", "medium", "high") indicating severity of NSFW content
6. "recommendation": string ("allow", "warn", "block") - recommendation for content filtering

Be thorough but conservative - err on the side of safety for content that might be inappropriate for minors.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: "You are an expert content moderation system that analyzes websites for NSFW content to protect minors. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    const analysisResult = JSON.parse(completion.choices[0].message.content);
    
    return {
      openaiAnalysis: analysisResult,
      usage: completion.usage,
      model: "gpt-5-nano"
    };

  } catch (error) {
    console.error('openai analysis error:', error.message);
    
    // fallback analysis if openai fails
    return {
      openaiAnalysis: {
        isNSFW: false,
        confidence: 0,
        reasons: [`openai analysis failed: ${error.message}`],
        categories: [],
        severity: "unknown",
        recommendation: "allow"
      },
      usage: null,
      model: "fallback",
      error: error.message
    };
  }
}

/**
 * main function to analyze url with comprehensive data extraction and ai analysis
 */
async function analyzeUrl(url) {
  try {
    console.log(`starting comprehensive analysis for: ${url}`);
    
    // step 1: extract all possible data from the website
    const extractedData = await extractWebsiteData(url);
    console.log(`extracted data for ${extractedData.title || 'untitled page'}`);
    
    // step 2: analyze with openai gpt-5-nano
    const aiAnalysis = await analyzeWithOpenAI(extractedData);
    console.log(`ai analysis complete - nsfw: ${aiAnalysis.openaiAnalysis.isNSFW}, confidence: ${aiAnalysis.openaiAnalysis.confidence}`);
    
    // step 3: combine results and return structured response
    const result = {
      safe: !aiAnalysis.openaiAnalysis.isNSFW,
      confidence: aiAnalysis.openaiAnalysis.confidence,
      recommendation: aiAnalysis.openaiAnalysis.recommendation,
      reasons: aiAnalysis.openaiAnalysis.reasons,
      categories: aiAnalysis.openaiAnalysis.categories,
      severity: aiAnalysis.openaiAnalysis.severity,
      
      // extracted website data
      websiteData: {
        title: extractedData.title,
        description: extractedData.description,
        domain: new URL(url).hostname,
        language: extractedData.language,
        contentType: extractedData.contentType,
        statusCode: extractedData.statusCode,
        hasAnalytics: extractedData.hasGoogleAnalytics || extractedData.hasFacebookPixel
      },
      
      // analysis metadata
      analysis: {
        model: aiAnalysis.model,
        tokensUsed: aiAnalysis.usage ? aiAnalysis.usage.total_tokens : 0,
        analysisTime: new Date().toISOString(),
        extractedDataSize: JSON.stringify(extractedData).length
      },
      
      // for debugging - include full extracted data in development
      ...(process.env.NODE_ENV === 'development' && { 
        fullExtractedData: extractedData,
        fullAiResponse: aiAnalysis 
      })
    };
    
    return result;

  } catch (error) {
    console.error('comprehensive analysis error:', error.message);
    
    // fail safe - allow access if analysis fails completely
    return {
      safe: true,
      confidence: 0,
      recommendation: "allow",
      reasons: [`analysis failed: ${error.message}`],
      categories: [],
      severity: "unknown",
      websiteData: {
        title: "analysis failed",
        description: "",
        domain: new URL(url).hostname,
        language: "",
        contentType: "",
        statusCode: 0,
        hasAnalytics: false
      },
      analysis: {
        model: "none",
        tokensUsed: 0,
        analysisTime: new Date().toISOString(),
        extractedDataSize: 0
      },
      error: error.message
    };
  }
}

module.exports = {
  checkBlockedDomains,
  analyzeUrl,
  extractWebsiteData,
  analyzeWithOpenAI
};