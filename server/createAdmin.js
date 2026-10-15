require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createOrPromoteAdmin = async () => {
  const email = process.argv[2];
  const password = process.argv[3] || 'Admin@12345';
  const name = process.argv[4] || 'System Administrator';

  if (!email) {
    console.log('Usage: node createAdmin.js <email> [password] [name]');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerprep');
    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`User ${email} has been successfully promoted to role 'admin'.`);
    } else {
      user = await User.create({
        name,
        email: email.toLowerCase().trim(),
        password,
        role: 'admin',
        branch: 'Administration',
        academicYear: 'Staff',
        graduationYear: 2026,
      });
      console.log(`Admin account created for ${email}.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createOrPromoteAdmin();
