const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runSchema() {
  const schemaPath = path.join(__dirname, '../config/schema.sql');
  const raw = fs.readFileSync(schemaPath, 'utf8');

  // Strip comments, CREATE DATABASE, and USE lines
  const filtered = raw
    .split('\n')
    .filter(line => !line.match(/^--/) && !line.match(/^CREATE DATABASE/i) && !line.match(/^USE /i))
    .join('\n');

  // Split by semicolon and run each statement
  const statements = filtered
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`Running ${statements.length} SQL statements...`);

  await db.execute('SET FOREIGN_KEY_CHECKS=0');

  for (const stmt of statements) {
    try {
      await db.execute(stmt);
      console.log('OK:', stmt.substring(0, 60).replace(/\n/g, ' '));
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('Duplicate')) {
        console.log('SKIP (exists):', stmt.substring(0, 60).replace(/\n/g, ' '));
      } else {
        console.error('ERROR:', err.message);
        console.error('Statement:', stmt.substring(0, 120));
      }
    }
  }

  await db.execute('SET FOREIGN_KEY_CHECKS=1');
  console.log('\nSchema setup complete!');
  process.exit(0);
}

runSchema();
