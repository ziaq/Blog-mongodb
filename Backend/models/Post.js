import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({ // Schema is main fiture of Mongoose, does not exist in pure Mongo
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    imageUrl: String,  // If property is not necessary we define it whithout object curly brackets
    user: { // Author
      type: mongoose.Schema.Types.ObjectId, // Id in db
      ref: 'User', // Reference to collection 'users' in mongodb, 'User' automaticlly convert to 'users' by mongoose
      required: true,
    },
  }, 
  {
    timestamps: true // Date of creation and update
  }
);

export default mongoose.model('Post', PostSchema); // Create model which based on mongoose schema