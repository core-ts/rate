import { Attributes, Filter, Repository, SearchResult, ViewRepository } from './core';

export interface RateId {
  id: string;
  author: string;
}
export interface BaseRate {
  author: string;
  authorURL?: string;
  rate: number;
}
export interface Rate extends BaseRate {
  id: string;
  time: Date;
  review: string;
  usefulCount: number;
  replyCount: number;
  histories?: ShortRate[];
}
export interface ShortRate {
  rate: number;
  time: Date;
  review: string;
}
export interface RateFilter extends Filter {
  id?: string;
  author?: string;
  rate: number;
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
}
export interface RateInfo {
  id: string;
  rate: number;
  count: number;
  score: number;
}
export interface ShortRates {
  rates: number[];
  time: Date;
  review: string;
}
export interface Rates extends BaseRate {
  id: string;
  rates: number[];
  time: Date;
  review: string;
  usefulCount: number;
  replyCount: number;
  histories?: ShortRates[];
}
export interface RatesFilter extends RateFilter {
  rates?: number[];
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  rate6: number;
  rate7: number;
  rate8: number;
  rate9: number;
  rate10: number;
}
export interface BaseRepository<R> {
  // save(obj: Rate, info?: T, ctx?: any): Promise<number>;
  insert(rate: R, newInfo?: boolean): Promise<number>;
  update(rate: R, oldRate: number): Promise<number>;
  load(id: string, author: string): Promise<R | null>;
}
export interface Rater<R, F extends Filter> {
  search(s: F, limit?: number, offset?: number | string, fields?: string[], ctx?: any): Promise<SearchResult<R>>;
  load(id: string, author: string): Promise<R | null>;
  rate(rate: R): Promise<number>;
  setUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  removeUseful(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  comment(comment: Comment): Promise<number>;
  removeComment(id: string, author: string, ctx?: any): Promise<number>;
  updateComment(comment: Comment): Promise<number>;
  getComments(id: string, author: string, limit?: number): Promise<Comment[]>;
  getComment(id: string): Promise<Comment | null>;
}
export interface RateReactionRepository {
  remove(id: string, author: string, userId: string, ctx?: any): Promise<number>;
  save(id: string, author: string, userId: string, type: number): Promise<number>;
}

export interface RateCommentRepository extends Repository<Comment, string> {
  remove(commentId: string, id: string, author: string): Promise<number>;
  getComments(id: string, author: string, limit?: number): Promise<Comment[]>;
}

export interface Query<T, ID, S> {
  search: (s: S, limit?: number, skip?: number | string, fields?: string[]) => Promise<SearchResult<T>>;
  metadata?(): Attributes | undefined;
  load(id: ID, ctx?: any): Promise<T | null>;
}
export interface RateCommentQuery extends Query<Comment, string, CommentFilter> {
  getComments(id: string, author: string, limit?: number): Promise<Comment[]>;
}
export const rateHistoryModel: Attributes = {
  rate: {
    type: 'integer'
  },
  time: {
    type: 'datetime',
  },
  review: {
  },
};
export const rateModel: Attributes = {
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
    typeof: rateHistoryModel
  }
};

export const infoModel: Attributes = {
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
export const info10Model: Attributes = {
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
export interface Info {
  id: string;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  count: number;
  score: number;
}
export interface Info10 {
  id: string;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  rate6: number;
  rate7: number;
  rate8: number;
  rate9: number;
  rate10: number;
  count: number;
  score: number;
}
export interface InfoRepository<T> extends ViewRepository<T, string> {
}

export interface CommentId {
  id: string;
  author: string;
  userId: string;
}

export interface Comment {
  commentId: string;
  id: string;
  author: string;
  userId: string;
  comment: string;
  time: Date;
  updatedAt?: Date;
  histories?: ShortComment[];
  userURL?: string;
  authorURL?: string;
}
export interface ShortComment {
  comment: string;
  time: Date;
}

export interface CommentFilter extends Filter {
  commentId?: string;
  id?: string;
  author?: string;
  userId?: string;
  comment?: string;
  time?: Date;
  updatedAt?: Date;
}

export const rateInfoModel: Attributes = {
  id: {
    key: true
  },
  rate: {
    type: 'number',
  },
  count: {
    type: 'integer',
  },
  score: {
    type: 'number',
  }
};

export const ratesModel: Attributes = {
  id: {
    key: true,
    match: 'equal'
  },
  author: {
    key: true,
    match: 'equal'
  },
  rate: {
    type: 'number'
  },
  rates: {
    required: true,
    type: 'integers'
  },
  time: {
    type: 'datetime'
  },
  review: {},
};
