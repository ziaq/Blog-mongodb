import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';

// We can use ES6 import due to "type": "module" in package.json (specificity of node.js)
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';
import { LOGINPASSWORDCOLLECTION } from './mongoapikey.js';

mongoose
  .set('strictQuery', false)
  .connect('mongodb+srv:' + LOGINPASSWORDCOLLECTION)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

// Fn describe how we will save uploading files
const storage = multer.diskStorage({
  destination: (req, file, cb) => { // Directory for upload
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Extract original filename from uploading file
  },
});
const upload = multer({ storage }); // Define var with multer with settings in 'storage'

app.use(express.json()); // Allow Express to process json from post requests
app.use(cors()); // Allow to send requests from frontend to port 4444 from port 3000
app.use('/uploads', express.static('uploads')); // Explain to Express that we need to create route for images in 'uploads'

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => { // 'image' is name in multipart form sending with file
  res.json({
    url: `/uploads/${req.file.originalname}` // We can return file.originalname because use middleware 'upload.single'
  });
}); // Use multer middleware for uploading file

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne); // ':' is dynemic parameter, we extract this 'id' in PostController.getOne
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err)
  }

  console.log('Server OK');
});