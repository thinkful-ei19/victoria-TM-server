'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/task');
const CommentModel = require('../models/comment');
const Workflow = require('../models/workflow');
const router = express.Router();

router.get('/tasks', (req,res,next) => {
  return Task.find()
    .populate('comments')
    .then(result => {
      res.json(result);
    });

});

router.get('/tasks/:id', (req, res, next) => {
  const { id } = req.params;

  Task.findOne({ _id: id })
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

router.post('/tasks', (req,res,next) => {
  const {title, content, due, workflowId} = req.body;
  const newTask = {
    title,
    content,
    due
  }
  return Task.create(newTask)
    .then((task) => {
      Workflow.findByIdAndUpdate(workflowId, {$push: {tasks: task.id}})
      .then(workflow => { res.status(201).json({task, workflow}) })
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/tasks/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, content, due } = req.body;
  const updateTask = { title, content, due };

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

  Task.findByIdAndUpdate(id, updateTask, { new: true }).populate('comments')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/tasks/:id', (req, res, next) => {
  const { id } = req.params;

  Task.findOneAndRemove({ _id: id })
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
