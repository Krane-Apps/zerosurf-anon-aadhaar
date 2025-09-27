const express = require('express');
const { analyzeUrl, checkBlockedDomains } = require('../services/contentAnalyzer');

const router = express.Router();

// check if url is safe for under 18
router.post('/check', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'url is required',
        safe: false 
      });
    }

    // quick domain check first
    const domainBlocked = checkBlockedDomains(url);
    if (domainBlocked.blocked) {
      return res.json({
        safe: false,
        reason: 'blocked_domain',
        domain: domainBlocked.domain,
        url
      });
    }

    // detailed content analysis
    const analysis = await analyzeUrl(url);
    
    res.json({
      safe: analysis.safe,
      reason: analysis.reason,
      confidence: analysis.confidence,
      url
    });

  } catch (error) {
    console.error('content check error:', error);
    res.status(500).json({ 
      error: 'analysis failed',
      safe: true, // fail open for better UX
      url: req.body.url
    });
  }
});

// get blocked domains list
router.get('/blocked-domains', (req, res) => {
  const blockedDomains = [
    'facebook.com',
    'instagram.com',
    'reddit.com/r/nsfw',
    'pornhub.com',
    'xvideos.com',
    'xnxx.com'
  ];

  res.json({ domains: blockedDomains });
});

module.exports = router;