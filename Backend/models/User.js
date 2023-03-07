import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({ // Schema is main fiture of Mongoose, does not exist in pure Mongo
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,  // If property is not necessary we define it whithout object curly brackets
  }, 
  {
    timestamps: true // Date of creation and update
  }
);

export default mongoose.model('User', UserSchema); // Create model which based on mongoose schema