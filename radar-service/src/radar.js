import { fetchAllSources } from './ingestion/reddit.js';
import { classifyOpportunity } from './ai/classifier.js';
import { calculateScore, generateValidationData } from './scoring/composite.js';
import { supabase } from './db/supabaseClient.js';

/**
 * Main radar scanning function
 * 1. Fetch posts from all sources
 * 2. Classify each with AI
 * 3. Calculate scores
 * 4. Store top opportunities in Supabase
 */
export async function runRadar() {
  console.log('\n🔍 Starting Opportunity Radar scan...\n');
  
  try {
    // Step 1: Fetch raw data
    console.log('Step 1: Fetching data from sources...');
    const posts = await fetchAllSources();
    
    if (posts.length === 0) {
      console.log('No posts found. Exiting.');
      return { success: false, error: 'No posts fetched' };
    }
    
    console.log(`✓ Fetched ${posts.length} posts\n`);
    
    // Step 2: Process and classify
    console.log('Step 2: Classifying opportunities with AI...');
    const opportunities = [];
    
    // Process in batches to avoid rate limits
    const BATCH_SIZE = 5;
    for (let i = 0; i < posts.length; i += BATCH_SIZE) {
      const batch = posts.slice(i, i + BATCH_SIZE);
      
      const batchResults = await Promise.all(
        batch.map(async (post) => {
          try {
            // Classify with AI
            const classification = await classifyOpportunity(post);
            
            // Calculate score
            const score = calculateScore(post, classification);
            
            // Generate validation data
            const validationData = generateValidationData(post, score);
            
            return {
              title: classification.title,
              market: classification.market,
              niche: classification.niche,
              sub_niche: classification.sub_niche,
              angle: classification.angle,
              problem: classification.problem,
              score: score,
              horizon: classification.horizon,
              validation_data: validationData,
              is_active: true,
              source_post: {
                title: post.title,
                url: post.url,
                subreddit: post.subreddit
              }
            };
          } catch (error) {
            console.error(`Error processing post: ${post.title?.substring(0, 50)}`, error.message);
            return null;
          }
        })
      );
      
      opportunities.push(...batchResults.filter(Boolean));
      
      // Small delay between batches
      if (i + BATCH_SIZE < posts.length) {
        await sleep(1000);
      }
    }
    
    console.log(`✓ Classified ${opportunities.length} opportunities\n`);
    
    if (opportunities.length === 0) {
      console.log('No valid opportunities found.');
      return { success: false, error: 'No opportunities classified' };
    }
    
    // Step 3: Sort by score and take top 10
    console.log('Step 3: Ranking opportunities...');
    opportunities.sort((a, b) => b.score - a.score);
    const topOpportunities = opportunities.slice(0, 10);
    
    console.log(`Top opportunity: "${topOpportunities[0].title}" (Score: ${topOpportunities[0].score})\n`);
    
    // Step 4: Upsert to Supabase
    console.log('Step 4: Saving to database...');
    const results = await upsertOpportunities(topOpportunities);
    
    console.log(`\n✓ Radar scan complete!`);
    console.log(`  - Inserted: ${results.inserted}`);
    console.log(`  - Updated: ${results.updated}`);
    console.log(`  - Errors: ${results.errors}`);
    
    return {
      success: true,
      opportunitiesFound: opportunities.length,
      topOpportunities: topOpportunities.map(o => ({
        title: o.title,
        score: o.score,
        market: o.market
      })),
      saved: results
    };
    
  } catch (error) {
    console.error('\n✗ Radar scan failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Upsert opportunities to Supabase
 * Uses title + niche as unique key to avoid duplicates
 */
async function upsertOpportunities(opportunities) {
  let inserted = 0;
  let updated = 0;
  let errors = 0;
  
  for (const opp of opportunities) {
    try {
      // Create a unique key based on title and niche
      const uniqueKey = `${opp.title}-${opp.niche}`.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Check if opportunity already exists
      const { data: existing } = await supabase
        .from('opportunities')
        .select('id, score')
        .eq('title', opp.title)
        .eq('niche', opp.niche)
        .maybeSingle();
      
      if (existing) {
        // Update if new score is higher
        if (opp.score > existing.score) {
          const { error } = await supabase
            .from('opportunities')
            .update({
              score: opp.score,
              updated_at: new Date().toISOString(),
              validation_data: opp.validation_data
            })
            .eq('id', existing.id);
          
          if (error) throw error;
          updated++;
          console.log(`  Updated: "${opp.title}" (${opp.score} > ${existing.score})`);
        } else {
          console.log(`  Skipped: "${opp.title}" (existing score: ${existing.score})`);
        }
      } else {
        // Insert new opportunity
        const { error } = await supabase
          .from('opportunities')
          .insert({
            title: opp.title,
            market: opp.market,
            niche: opp.niche,
            sub_niche: opp.sub_niche,
            angle: opp.angle,
            problem: opp.problem,
            score: opp.score,
            horizon: opp.horizon,
            validation_data: opp.validation_data,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
        inserted++;
        console.log(`  Inserted: "${opp.title}" (Score: ${opp.score})`);
      }
      
    } catch (error) {
      console.error(`  Error saving "${opp.title}":`, error.message);
      errors++;
    }
  }
  
  return { inserted, updated, errors };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
