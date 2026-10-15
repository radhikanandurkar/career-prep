const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    branch: {
      type: String,
      default: 'Computer Science and Engineering',
      trim: true,
    },
    academicYear: {
      type: String,
      default: '3rd Year',
      trim: true,
    },
    graduationYear: {
      type: Number,
      default: 2026,
    },
    skills: [
      {
        name: { type: String, required: true, trim: true },
        level: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
          default: 'Intermediate',
        },
        category: { type: String, default: 'Technical' },
      },
    ],
    interests: [{ type: String, trim: true }],
    targetRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoleSkillProfile',
    },
    targetRoleTitle: {
      type: String,
      default: '',
    },
    profileSummary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
