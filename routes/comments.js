'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/task');
const Comment = require('..models/comment');
const router = express.Router();

router.get('/comments', (req,res,next) => {
  return Comment.find()
    .then(result => {
      res.json(result);
    });

});

router.post('/comments', (req, res, next) => {
  const { comment } = req.body;

  Comment.create(comment)
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

  Comment.findByIdAndUpdate(id, updateComment)
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

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/comments/:id', (req, res, next) => {
  const { id } = req.params;

  Comment.findByIdAndRemove(id)
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
