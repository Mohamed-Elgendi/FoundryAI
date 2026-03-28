import axios from 'axios';

const REDDIT_SUBREDDITS = ['SaaS', 'startups', 'sideproject', 'Entrepreneur', 'indiehackers'];
const LIMIT_PER_SUBREDDIT = 25;

/**
 * Fetch hot posts from Reddit
 * @returns {Promise<Array<{title: string, text: string, subreddit: string, score: number, url: string}>>}
 */
export async function fetchRedditPosts() {
  const allPosts = [];
  
  for (const subreddit of REDDIT_SUBREDDITS) {
    try {
      console.log(`Fetching from r/${subreddit}...`);
      
      // Reddit JSON API (no auth required for public posts)
      const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${LIMIT_PER_SUBREDDIT}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'FoundryAI-Radar/1.0 (Business Opportunity Discovery)'
        },
        timeout: 15000
      });
      
      const posts = response.data?.data?.children || [];
      
      for (const post of posts) {
        const data = post.data;
        
        // Skip stickied posts and low engagement posts
        if (data.stickied || data.score < 5) continue;
        
        allPosts.push({
          title: data.title,
          text: data.selftext || '',
          subreddit: subreddit,
          score: data.score,
          url: `https://reddit.com${data.permalink}`,
          upvotes: data.ups,
          numComments: data.num_comments,
          created: data.created_utc
        });
      }
      
      // Rate limiting - be nice to Reddit
      await sleep(500);
      
    } catch (error) {
      console.error(`Error fetching r/${subreddit}:`, error.message);
    }
  }
  
  console.log(`Fetched ${allPosts.length} posts from Reddit`);
  return allPosts;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Alternative: Fetch from multiple sources (expandable)
 */
export async function fetchAllSources() {
  const posts = await fetchRedditPosts();
  
  // Future: Add Twitter, Hacker News, Indie Hackers, etc.
  // const twitterPosts = await fetchTwitterPosts();
  // const hnPosts = await fetchHackerNews();
  
  return posts;
}
