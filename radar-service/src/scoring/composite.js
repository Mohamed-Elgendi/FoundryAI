/**
 * Calculate a composite score for an opportunity
 * Based on: engagement, subreddit relevance, opportunity quality indicators
 * @param {Object} post - Raw post data
 * @param {Object} classification - Classified opportunity data
 * @returns {number} Score between 0-100
 */
export function calculateScore(post, classification) {
  let score = 50; // Base score

  // Engagement score (0-30 points)
  const upvotes = post.upvotes || 0;
  const comments = post.numComments || 0;
  
  if (upvotes > 1000) score += 30;
  else if (upvotes > 500) score += 25;
  else if (upvotes > 100) score += 20;
  else if (upvotes > 50) score += 15;
  else if (upvotes > 10) score += 10;
  else score += 5;

  // Comment engagement (0-15 points)
  if (comments > 100) score += 15;
  else if (comments > 50) score += 12;
  else if (comments > 20) score += 8;
  else if (comments > 5) score += 5;
  else score += 2;

  // Subreddit quality multiplier
  const qualityMultipliers = {
    'SaaS': 1.2,
    'startups': 1.15,
    'indiehackers': 1.15,
    'sideproject': 1.1,
    'Entrepreneur': 1.05
  };
  
  const multiplier = qualityMultipliers[post.subreddit] || 1.0;
  score = Math.floor(score * multiplier);

  // Problem clarity bonus (0-10 points)
  if (classification.problem && classification.problem.length > 100) {
    score += 10;
  } else if (classification.problem && classification.problem.length > 50) {
    score += 5;
  }

  // Market attractiveness (0-10 points)
  const attractiveMarkets = ['AI Tools', 'Fintech', 'SaaS', 'HealthTech'];
  if (attractiveMarkets.includes(classification.market)) {
    score += 10;
  }

  // Horizon adjustment - short-term is easier to validate
  if (classification.horizon === 'short') score += 5;
  else if (classification.horizon === 'long') score -= 5;

  // Cap at 100
  return Math.min(100, Math.max(0, score));
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
