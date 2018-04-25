'use strict';

const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
  title: { type: String },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Taskme' }]
});

workflowSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Workflow', workflowSchema);
