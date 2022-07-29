"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateHistoryModel = {
  rate: {
    type: 'integer'
  },
  time: {
    type: 'datetime',
  },
  review: {},
};
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
  },
  histories: {
    type: 'array',
    typeof: exports.rateHistoryModel
  }
};
exports.infoModel = {
  id: {
    key: true,
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
  count: {
    type: 'number',
  },
  score: {
    type: 'number',
  }
};
exports.info10Model = {
  id: {
    key: true,
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
  rate6: {
    type: 'number',
  },
  rate7: {
    type: 'number',
  },
  rate8: {
    type: 'number',
  },
  rate9: {
    type: 'number',
  },
  rate10: {
    type: 'number',
  },
  count: {
    type: 'number',
  },
  score: {
    type: 'number',
  }
};
exports.commentModel = {
  comment: {
    length: 500
  },
  time: {
    type: 'datetime'
  }
};
exports.rateCommentModel = {
  commentId: {
    key: true
  },
  id: {
    required: true,
    noupdate: true,
    match: 'equal'
  },
  author: {
    required: true,
    noupdate: true,
    match: 'equal'
  },
  userId: {
    required: true,
    noupdate: true,
    match: 'equal'
  },
  comment: {
    length: 500
  },
  time: {
    type: 'datetime',
    noupdate: true,
  },
  updatedAt: {
    type: 'datetime'
  },
  histories: {
    type: 'array',
    typeof: exports.commentModel
  }
};
