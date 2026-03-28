import axios from 'axios';

const REDDIT_SUBREDDITS = ['SaaS', 'startups', 'sideproject', 'Entrepreneur', 'indiehackers'];
const LIMIT_PER_SUBREDDIT = 25;

// Sample opportunities for fallback when Reddit blocks requests
const SAMPLE_POSTS = [
  {
    title: "I built a SaaS that helps freelancers track invoices",
    text: "Freelancers struggle with billing clients on time. Many lose thousands in unbilled hours. I built a tool that reads their emails and auto-generates invoices.",
    subreddit: "SaaS",
    score: 245,
    url: "https://reddit.com/r/SaaS/sample1",
    upvotes: 245,
    numComments: 42,
    created: Date.now() / 1000
  },
  {
    title: "Side project making $5K MRR - automated SEO content",
    text: "Small businesses need SEO content but can't afford agencies. My tool generates blog posts from their website data automatically.",
    subreddit: "sideproject",
    score: 189,
    url: "https://reddit.com/r/sideproject/sample2",
    upvotes: 189,
    numComments: 28,
    created: Date.now() / 1000
  },
  {
    title: "Developer tool for API documentation",
    text: "Teams waste hours keeping API docs updated. My tool auto-generates docs from code comments and keeps them in sync.",
    subreddit: "startups",
    score: 156,
    url: "https://reddit.com/r/startups/sample3",
    upvotes: 156,
    numComments: 19,
    created: Date.now() / 1000
  }
];

/**
 * Fetch hot posts from Reddit
 * @returns {Promise<Array<{title: string, text: string, subreddit: string, score: number, url: string}>>}
 */
export async function fetchRedditPosts() {
  const allPosts = [];
  let hasErrors = false;
  
  for (const subreddit of REDDIT_SUBREDDITS) {
    try {
      console.log(`Fetching from r/${subreddit}...`);
      
      const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${LIMIT_PER_SUBREDDIT}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        },
        timeout: 10000
      });
      
      const posts = response.data?.data?.children || [];
      
      for (const post of posts) {
        const data = post.data;
        
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
      
      await sleep(1000);
      
    } catch (error) {
      console.error(`Error fetching r/${subreddit}: ${error.response?.status || error.message}`);
      hasErrors = true;
    }
  }
  
  // If all requests failed, use sample data
  if (allPosts.length === 0 && hasErrors) {
    console.log('⚠️ Reddit API blocked, using sample data for testing');
    return SAMPLE_POSTS;
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
