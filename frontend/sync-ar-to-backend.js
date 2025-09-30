// This script syncs all translations from ar.json to the backend translation API.
// Usage: node sync-ar-to-backend.js

import fs from 'fs';
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5001/api/translations';
const AR_JSON_PATH = './src/translations/ar.json';

async function syncTranslations() {
  const raw = fs.readFileSync(AR_JSON_PATH, 'utf8');
  const translations = JSON.parse(raw);
  for (const [key, value] of Object.entries(translations)) {
    try {
      // Try to create or update translation
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      if (res.status === 201) {
        console.log(`Created: ${key}`);
      } else if (res.status === 400) {
        // If already exists, try update (find by key)
        // Get all translations to find the ID
        const allRes = await fetch(API_URL);
        const all = await allRes.json();
        const found = all.find(t => t.key === key);
        if (found) {
          const updateRes = await fetch(`${API_URL}/${found._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value })
          });
          if (updateRes.ok) {
            console.log(`Updated: ${key}`);
          } else {
            console.error(`Failed to update: ${key}`);
          }
        } else {
          console.error(`Key not found for update: ${key}`);
        }
      } else {
        console.error(`Failed to create: ${key} (${res.status})`);
      }
    } catch (e) {
      console.error(`Error syncing key ${key}:`, e.message);
    }
  }
}

syncTranslations();
