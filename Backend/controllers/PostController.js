import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    // Find all articles
    const posts = await PostModel.find().populate('user').exec(); // Use 'populate' for connection to collection users,
      // due to 'await' there is need call 'exec()' after 'populate'
  
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't get the articles"
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; // extract 'id' from app.get '/post/:id' in index.js 
    
    PostModel.findOneAndUpdate(
      {
        _id: postId, // First parameter describe property by which we will search
      }, 
      {
        $inc: { viewsCount: 1 } // Use Increment for update viewCount
      }, 
      {
        returnDocument: 'after', // Return updated document
      },
      (error, doc) => { // Fourth parameter is fn for catch errors or return article for getOne query
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "Couldn't get the article"
          })
        }

        if (!doc) { // If document don't exist (doc == undefined)
          return res.status(404).json({
            message: 'Article not found'
          })
        }

        res.json(doc); // If there is no problem return doc for getOne query
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't get the articles"
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId,
    }, (error, doc) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Article deletion failded"
        })
      }
      
      if (!doc) { // If document don't exist (doc == undefined)
        return res.status(404).json({
          message: 'Article not found'
        })
      }

      res.json({
        message: 'Article deleted' 
      })
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't get the articles"
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId, // userId embeded in req in checkAuth.js
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Article creation failed'
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    
    await PostModel.updateOne({ // 'await' is necessary here
      _id: postId
    }, {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId, // userId embeded in req in checkAuth.js
    });

    res.json({
      message: 'Article updated'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Article update failed'
    })
  }
}