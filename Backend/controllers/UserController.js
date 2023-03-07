import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;                     // This and next 2 lines for encrypting password 
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({ // Create new instance of model
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      password: req.body.password,
      passwordHash: hash,
    })

    const user = await doc.save(); // Send doc to the db using mongoose save method and return saved information from the db
    const token = jwt.sign( // And then we put id of the user generated in the the db
      {
        _id: user._id,
      },
      'secret123', // Second parameter of jwt.sign, there is any random character set for encryption
      {
        expiresIn: '30d', // Third parameter of jwt.sign, there is experation time of token
      }
    );
    
    // Using destructurization we get all necessary data, but separate info about passwordHash which we will not send in res
    const { passwordHash, ...userData } = user._doc; // _doc is mongoose raw data contain all from user model + _id
    res.json({
      ...userData,
      token,
    });
  } catch (error) { // In case there are any problems with registration, for example not unique email
    console.log(error);
    res.status(500).json({
      message: 'Registration failed'
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }); // Find user in db by email

    if (!user) { // If such user does nor exist
      return res.status(404).json({
        message: 'Check login or password',
      })
    }

    // Check if password match with password in the db
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(404).json({
        message: 'Check login or password',
      })
    }

    const token = jwt.sign( // And then we put id of the user generated in the the db
      {
        _id: user._id,
      },
      'secret123', // Second parameter of jwt.sign, there is any random character set for encryption
      {
        expiresIn: '30d', // Third parameter of jwt.sign, there is experation time of token
      }
    );
    
    // Using destructurization we get all necessary data, but separate info about passwordHash which we will not send in res
    const { passwordHash, ...userData } = user._doc; // _doc is mongoose raw data contain all from user model + _id
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Authorization failed'
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId); // Find user in db by Id

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const { passwordHash, ...userData } = user._doc; // _doc is mongoose raw data contain all from user model + _id
    res.json({
      ...userData
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Access denied'
    });
  }
};