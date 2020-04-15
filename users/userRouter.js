const express = require('express');

const router = express.Router();
const userDB = require('./userDb');
const postDB = require('../posts/postDb');

router.post('/', validateUser(), (req, res) => {
  userDB.insert(req.body)
    .then(user => {
      return res.status(201).json(user)
    })
    .catch(err => {
      next(err)
    })
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => { 
  postDB.insert(req.body)
  .then(post => {
    return res.status(201).json(post)
  })
  .catch(err => {
    next(err)
  })
});

router.get('/', (req, res) => {
  userDB.get()
    .then(users => {
      return res.status(200).json(users)
    })
    .catch(err => {
      next(err)
    })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

//
//why is the error for 0 posts not working
//
router.get('/:id/posts', validateUserId, (req, res) => {
  userDB.getUserPosts(req.params.id)
    .then(posts => {
      if(posts.lenth === 0) {
        return res.status(404).json({
          message: 'no posts found'
        })
      }
      else {
        return res.status(200).json(posts)
      }
    })
    .catch(err => {
      next(err)
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  userDB.remove(req.user.id)
    .then(() => {
      return res.status(204).end()
    })
    .catch(err => {
      next(err)
    })
});

router.put('/:id', validateUser(), validateUserId, (req, res) => {
  userDB.update(req.user.id, req.body)
    .then(user => {
      return res.status(200).json(user)
    })
    .catch(err => {
      next(err)
    })
});

//custom middleware

function validateUserId(req, res, next) {
  userDB.getById(req.params.id)
    .then(user => {
      if(user) {
        req.user = user;
        next()
      }
      else {
        res.status(404).json({
          message: 'user not found'
        })
      }
    })
    .catch(err => {
      next(err);
    })
}

function validateUser() {
  return (req, res, next) => {
    if(!req.body.name) {
      return res.status(400).json({
        message: 'missing user data'
      })
    }
    next()
  }
}

function validatePost(req, res, next) {
  if(!req.body.text) {
    return res.status(400).json({
      message: 'missing text field'
    })
  }
  if(!req.body.user_id) {
    return res.status(400).json({
      message: 'missing user_id field'
    })
  }
  next()
}

module.exports = router;
