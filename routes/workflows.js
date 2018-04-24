'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/task');
const Workflow = require('../models/workflow');

const router = express.Router();

router.get('/workflows', (req, res, next) => {
  return Workflow.find()
    .then(result => {
      res.json(result);
    });
});

router.post('/workflows', (req, res, next) => {
  const { title } = req.body;
  const newWorkflow = { title };

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  Workflow.create(newWorkflow)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Workflow title already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/workflows/:id', (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updateWorkflow = { title, id };

  Tag.findByIdAndUpdate(id, updateWorkflow, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag title already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/workflows/:id', (req, res, next) => {
  const { id } = req.params;

  Workflow.findOneAndRemove({ _id: id })
      .then(Task.findOneAndRemove({ _id: id }))
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