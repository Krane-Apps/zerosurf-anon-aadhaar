const express = require('express');
const { analyzeUrl, checkBlockedDomains } = require('../services/contentAnalyzer');

const router = express.Router();

// ai-powered url analysis for nsfw detection
router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        error: 'url parameter is required',
        success: false
      });
    }

    // validate url format
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({
        error: 'invalid url format',
        success: false
      });
    }

    console.log(`analyzing url: ${url}`);

    // quick domain check first
    const domainBlocked = checkBlockedDomains(url);
    if (domainBlocked.blocked) {
      return res.json({
        success: true,
        safe: false,
        confidence: 1.0,
        recommendation: 'block',
        reasons: [`domain ${domainBlocked.domain} is in blocked list`],
        categories: ['blocked_domain'],
        severity: 'high'
      });
    }

    // ai analysis
    const analysis = await analyzeUrl(url);
    
    res.json({
      success: true,
      safe: analysis.safe,
      confidence: analysis.confidence,
      recommendation: analysis.recommendation,
      reasons: analysis.reasons,
      categories: analysis.categories,
      severity: analysis.severity
    });

  } catch (error) {
    console.error('content analysis error:', error);
    res.status(500).json({ 
      success: false,
      error: 'analysis failed',
      safe: true, // fail open for better ux
      confidence: 0,
      recommendation: 'allow'
    });
  }
});

module.exports = router;