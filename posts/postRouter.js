const express = require('express');
const postDB = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  postDB.get()
    .then(posts => {
      return res.status(200).json(posts)
    })
    .catch(err => {
      next(err)
    })
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
  postDB.remove(req.params.id)
    .then(() => {
      return res.status(204).end()
    })
    .catch(err => {
      next(err)
    })
});

router.put('/:id', validatePostId, (req, res) => {
  if(!req.body.text) {
    return res.status(400).json({
      message: "missing updated text field"
    })
  }
  postDB.update(req.params.id, req.body)
    .then(post => {
      return res.status(200).json(post)
    })
    .catch(err => {
      next(err)
    })
});

// custom middleware

function validatePostId(req, res, next) {
  postDB.getById(req.params.id)
  .then(post => {
    if(post) {
      req.post = post;
      next()
    }
    else {
      res.status(404).json({
        message: 'post not found'
      })
    }
  })
  .catch(err => {
    next(err);
  })
}

module.exports = router;
