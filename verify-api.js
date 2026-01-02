/**
 * API Verification Script
 * 
 * Tests if the API server is running and can fetch players
 */

const http = require('http');

const API_URL = 'http://localhost:3000/api/players';

console.log('🔍 Verifying API Server...\n');

// Check if server is running
const req = http.get(API_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      
      if (json.success && json.data) {
        console.log('✅ API Server is RUNNING');
        console.log(`✅ Players endpoint is WORKING`);
        console.log(`📊 Found ${json.count || json.data.length} players\n`);
        
        if (json.data.length > 0) {
          console.log('Sample players:');
          json.data.slice(0, 3).forEach((player, i) => {
            console.log(`  ${i + 1}. ${player.name} - ${player.team} (£${player.current_price})`);
          });
        } else {
          console.log('⚠️  No players found in database');
          console.log('   Make sure you have seeded the players table in Supabase');
        }
      } else {
        console.log('⚠️  API responded but format is unexpected');
        console.log('Response:', json);
      }
    } catch (error) {
      console.log('❌ Failed to parse API response');
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  if (error.code === 'ECONNREFUSED') {
    console.log('❌ API Server is NOT RUNNING');
    console.log('\nTo start the server, run:');
    console.log('  npm run dev');
    console.log('\nThen wait a few seconds and run this script again.');
  } else {
    console.log('❌ Error:', error.message);
  }
});

req.setTimeout(5000, () => {
  req.destroy();
  console.log('❌ Request timeout - server may not be running');
});

