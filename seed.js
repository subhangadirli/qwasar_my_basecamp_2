const bcrypt = require('bcrypt');
const { init, User } = require('./models');

async function seed() {
  try {
    await init();

    const password_hash = await bcrypt.hash('admin123', 10);
    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@basecamp.com' },
      defaults: { username: 'admin', password_hash, is_admin: 1 }
    });

    if (created) {
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
    console.log('Email: admin@basecamp.com');
    console.log('Password: admin123');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}

seed();
