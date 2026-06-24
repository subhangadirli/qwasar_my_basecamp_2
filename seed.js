const db = require('./config/database');
const bcrypt = require('bcrypt');

async function seed() {
  const password_hash = await bcrypt.hash('admin123', 10);

  db.run(
    'INSERT OR IGNORE INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, ?)',
    ['admin', 'admin@basecamp.com', password_hash, 1],
    function(err) {
      if (err) {
        console.error('Error:', err.message);
      } else {
        console.log('Admin user created');
        console.log('Email: admin@basecamp.com');
        console.log('Password: admin123');
      }
      db.close();
    }
  );
}

seed();