import jwt from 'jsonwebtoken';

// Check token sending from client
export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); // Delete word 'Bearer' from req
  console.log(token);
  if (token) {
    try {
      const decodedToken = jwt.verify(token, 'secret123'); // Decode token contained id and password
      req.userId = decodedToken._id; // Extract id of user and embed to req
      next(); // Run next function in functions sequence for auth, required in each middleware 
    } catch (error) {
      return res.status(403).json({
        message: 'Access denied'
      })
    }
  } else {
    return res.status(403).json({
      message: 'Access denied'
    })
  }
}