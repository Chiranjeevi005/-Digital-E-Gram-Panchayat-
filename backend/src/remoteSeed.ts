// Script to remotely seed the database with sample schemes
// This script should be run locally to seed the deployed database

import fetch from 'node-fetch';

const API_BASE_URL = 'https://digital-e-gram-panchayat-rjkb.onrender.com/api';

interface SeedResponse {
  message: string;
  count?: number;
  schemes?: string[];
}

async function seedSchemes() {
  try {
    console.log('Seeding schemes to the deployed database...');
    
    // Make request to seed endpoint
    const response = await fetch(`${API_BASE_URL}/seed/schemes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if needed (would need to be configured in environment)
        // 'X-Seed-Auth': process.env.SEED_AUTH_KEY || ''
      }
    });
    
    const result = await response.json() as SeedResponse;
    console.log('Seeding response:', result);
    
    if (response.ok) {
      console.log('✅ Schemes seeded successfully!');
      console.log(`📊 ${result.count || 0} schemes added to the database`);
      console.log('Schemes:', result.schemes || []);
    } else {
      console.error('❌ Failed to seed schemes:', result.message);
    }
  } catch (error) {
    console.error('❌ Error seeding schemes:', error);
  }
}

// Run the seeding function
seedSchemes();