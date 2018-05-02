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

router.get('/comments/:id', (req, res, next) => {
  const { id } = req.params;

  CommentModel.findOne({ _id: id })
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

router.post('/comments', (req, res, next) => {
  const { commentBody, taskId } = req.body;
  const newComment = { commentBody };

  return CommentModel.create(newComment)
    .then(comment => {
      return Task.findByIdAndUpdate(taskId, {$push: {comment: comment.id}})
      .then(task => {res.status(201).json({comment, task})})
    })
    .catch(err => {
      next(err);
    });
});

router.put('/comments/:id', (req, res, next) => {
  const { id } = req.params;
  const { commentBody } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updateComment = { commentBody };

  CommentModel.findByIdAndUpdate(id, updateComment, { new: true })
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
