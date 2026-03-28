/**
 * Calculate a composite score for an opportunity
 * Based on: engagement, subreddit relevance, opportunity quality indicators
 * @param {Object} post - Raw post data
 * @param {Object} classification - Classified opportunity data
 * @returns {number} Score between 0-100
 */
export function calculateScore(post, classification) {
  let score = 30; // Lower base score for more variation

  // Engagement score (0-25 points) - logarithmic scale for better distribution
  const upvotes = post.upvotes || 0;
  const comments = post.numComments || 0;
  
  // Use logarithmic scale so high vote counts don't dominate
  if (upvotes > 0) {
    score += Math.min(25, Math.floor(Math.log10(upvotes) * 8));
  }

  // Comment engagement (0-15 points) - also logarithmic
  if (comments > 0) {
    score += Math.min(15, Math.floor(Math.log10(comments) * 7));
  }

  // Subreddit quality bonus (0-10 points)
  const qualityBonuses = {
    'SaaS': 10,
    'startups': 8,
    'indiehackers': 8,
    'sideproject': 6,
    'Entrepreneur': 5,
    'marketing': 5,
    'SmallBusiness': 4
  };
  
  score += qualityBonuses[post.subreddit] || 2;

  // Problem clarity bonus (0-10 points)
  if (classification.problem && classification.problem.length > 200) {
    score += 10;
  } else if (classification.problem && classification.problem.length > 100) {
    score += 7;
  } else if (classification.problem && classification.problem.length > 50) {
    score += 4;
  } else {
    score += 1;
  }

  // Market attractiveness (0-8 points)
  const marketScores = {
    'AI Tools': 8,
    'Fintech': 8,
    'SaaS': 7,
    'HealthTech': 7,
    'DevTools': 6,
    'E-commerce': 6,
    'EdTech': 5,
    'Marketplace': 5
  };
  score += marketScores[classification.market] || 3;

  // Horizon adjustment (±5 points)
  if (classification.horizon === 'short') score += 5;
  else if (classification.horizon === 'mid') score += 2;
  else if (classification.horizon === 'long') score -= 3;

  // Round to nearest integer and cap
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Generate validation data for storage
 */
export function generateValidationData(post, score) {
  return {
    source: 'reddit',
    subreddit: post.subreddit,
    upvotes: post.upvotes,
    comments: post.numComments,
    source_url: post.url,
    calculated_score: score,
    score_breakdown: {
      engagement: Math.min(30, (post.upvotes / 1000) * 30),
      discussion: Math.min(15, (post.numComments / 100) * 15),
      clarity: post.text?.length > 200 ? 10 : 5,
      market_fit: 10
    },
    analyzed_at: new Date().toISOString()
  };
}
