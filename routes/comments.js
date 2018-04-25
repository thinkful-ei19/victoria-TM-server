'use strict';

const express = require('express');
const mongoose = require('mongoose');
const CommentModel = require('../models/comment');
const Task = require('../models/task');
const router = express.Router();

router.get('/comments', (req,res,next) => {
  return CommentModel.find()
    .then(result => {
      res.json(result);
    });
});

router.post('/comments', (req, res, next) => {
  const { comment } = req.body;
  const newComment = { comment };

  return CommentModel.create(newComment)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/comments/:id', (req, res, next) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updateComment = { comment };

  CommentModel.findByIdAndUpdate(id, updateComment)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


router.delete('/comments/:id', (req, res, next) => {
  const { id } = req.params;

  CommentModel.findByIdAndRemove(id)
  .then(result => {
    if (!result) {
      next();
    }
    res.status(204).end();
  })
  .catch(err => {
    next(err);
  });
});

module.exports = router;
