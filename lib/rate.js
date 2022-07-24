"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateModel = {
  id: {
    key: true,
    required: true,
    match: 'equal'
  },
  author: {
    key: true,
    required: true,
    match: 'equal'
  },
  rate: {
    type: 'integer',
    min: 1,
    max: 5
  },
  time: {
    type: 'datetime',
  },
  review: {
    q: true,
  },
  usefulCount: {
    type: 'integer',
    min: 0
  },
  replyCount: {
    type: 'integer',
    min: 0
  }
};
exports.infoModel = {
  id: {
    key: true,
  },
  viewCount: {
    type: 'number'
  },
  rate: {
    type: 'number'
  },
  rate1: {
    type: 'number',
  },
  rate2: {
    type: 'number',
  },
  rate3: {
    type: 'number',
  },
  rate4: {
    type: 'number',
  },
  rate5: {
    type: 'number',
  },
};
exports.rateCommentModel = {
  commentId: {
    key: true
  },
  id: {
    required: true,
    match: 'equal'
  },
  author: {
    required: true,
    match: 'equal'
  },
  userId: {
    required: true,
    match: 'equal'
  },
  comment: {
    length: 500
  },
  time: {
    type: 'datetime'
  }
};
