'use strict';

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  created: { type: Date, default: Date.now },
  due: { type: Date },
  comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

taskSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Task', taskSchema);
