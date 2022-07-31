import { Attributes, Search, SearchResult } from './core';
import {
  Comment, CommentFilter, InfoRepository, Rate, RateCommentQuery, RateCommentRepository, RateFilter, Rater,
  RateReactionRepository, RateRepository, ShortComment, ShortRate
} from './rate';

export * from './rate';

export interface URL {
  id: string;
  url: string;
}
export class RateService<O> implements Rater {
  constructor(protected find: Search<Rate, RateFilter>,
    public repository: RateRepository,
    private infoRepository: InfoRepository<O>,
    private commentRepository: RateCommentRepository,
    private rateReactionRepository: RateReactionRepository,
    private queryURL?: (ids: string[]) => Promise<URL[]>) {
    this.rate = this.rate.bind(this);
    this.search = this.search.bind(this);
    this.load = this.load.bind(this);
    this.getRate = this.getRate.bind(this);
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    this.comment = this.comment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.getComment = this.getComment.bind(this);
  }
  async rate(rate: Rate): Promise<number> {
    rate.time = new Date();
    const info = await this.infoRepository.load(rate.id);
    if (!info) {
      const r0 = await this.repository.insert(rate, true);
      return r0;
    }
    const exist = await this.repository.load(rate.id, rate.author);
    if (!exist) {
      const r1 = await this.repository.insert(rate);
      return r1;
    }
    const sr: ShortRate = { review: exist.review, rate: exist.rate, time: exist.time };
    if (exist.histories && exist.histories.length > 0) {
      const history = exist.histories;
      history.push(sr);
      rate.histories = history;
    } else {
      rate.histories = [sr];
    }
    const res = await this.repository.update(rate, exist.rate);
    return res;
  }
  search(s: RateFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<Rate>> {
    return this.find(s, limit, offset, fields).then(res => {
      if (!this.queryURL) {
        return res;
      } else {
        if (res.list && res.list.length > 0) {
          const ids: string[] = [];
          for (const rate of res.list) {
            ids.push(rate.author);
          }
          return this.queryURL(ids).then(urls => {
            for (const rate of res.list) {
              const i = binarySearch(urls, rate.author);
              if (i >= 0) {
                rate.authorURL = urls[i].url;
              }
            }
            return res;
          });
        } else {
          return res;
        }
      }
    });
  }
  load(id: string, author: string): Promise<Rate | null> {
    return this.repository.load(id, author);
  }
  getRate(id: string, author: string): Promise<Rate | null> {
    return this.repository.load(id, author);
  }
  setUseful(id: string, author: string, userId: string): Promise<number> {
    return this.rateReactionRepository.save(id, author, userId, 1);
  }
  removeUseful(id: string, author: string, userId: string): Promise<number> {
    return this.rateReactionRepository.remove(id, author, userId);
  }
  comment(comment: Comment): Promise<number> {
    return this.repository.load(comment.id, comment.author).then(checkRate => {
      if (!checkRate) {
        return -1;
      } else {
        comment.time ? comment.time = comment.time : comment.time = new Date();
        return this.commentRepository.insert(comment);
      }
    });
  }
  removeComment(commentId: string, userId: string): Promise<number> {
    return this.commentRepository.load(commentId).then(comment => {
      if (comment) {
        if (userId === comment.author || userId === comment.userId) {
          return this.commentRepository.remove(commentId, comment.id, comment.author);
        } else {
          return -2;
        }
      } else {
        return -1;
      }
    });
  }
  updateComment(comment: Comment): Promise<number> {
    return this.commentRepository.load(comment.commentId).then(exist => {
      if (!exist) {
        return -1;
      } else {
        if (exist.userId !== comment.userId) {
          return -2;
        }
        exist.updatedAt = new Date();
        const c: ShortComment = { comment: exist.comment, time: exist.time };
        if (exist.histories && exist.histories.length > 0) {
          exist.histories.push(c);
        } else {
          exist.histories = [c];
        }
        exist.comment = comment.comment;
        const res =  this.commentRepository.update(exist);
        return res;
      }
    });
  }
  getComments(id: string, author: string, limit?: number): Promise<Comment[]> {
    return this.commentRepository.getComments(id, author, limit);
  }
  getComment(id: string): Promise<Comment|null> {
    return this.commentRepository.load(id);
  }
}
export interface CommentRepository {
  load(commentId: string, ctx?: any): Promise<Comment|null>;
  getComments(id: string, author: string, limit?: number): Promise<Comment[]>;
}
// tslint:disable-next-line:max-classes-per-file
export class CommentQuery implements RateCommentQuery {
  constructor(protected find: Search<Comment, CommentFilter>, protected repository: CommentRepository, private queryURL?: (ids: string[]) => Promise<URL[]>) {
    this.load = this.load.bind(this);
    this.search = this.search.bind(this);
    this.getComments = this.getComments.bind(this);
  }
  load(id: string, ctx?: any): Promise<Comment|null> {
    return this.repository.load(id, ctx);
  }
  getComments(id: string, author: string, limit?: number): Promise<Comment[]> {
    return this.repository.getComments(id, author, limit);
  }
  search(s: CommentFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<Comment>> {
    return this.find(s, limit, offset, fields).then(res => {
      if (!this.queryURL) {
        return res;
      } else {
        if (res.list && res.list.length > 0) {
          const ids: string[] = [];
          for (const rate of res.list) {
            ids.push(rate.userId);
          }
          return this.queryURL(ids).then(urls => {
            for (const rate of res.list) {
              const i = binarySearch(urls, rate.userId);
              if (i >= 0) {
                rate.userURL = urls[i].url;
              }
            }
            return res;
          });
        } else {
          return res;
        }
      }
    });
  }
}
function binarySearch(ar: URL[], el: string): number {
  let m = 0;
  let n = ar.length - 1;
  while (m <= n) {
      // tslint:disable-next-line:no-bitwise
      const k = (n + m) >> 1;
      const cmp = compare(el, ar[k].id);
      if (cmp > 0) {
          m = k + 1;
      } else if (cmp < 0) {
          n = k - 1;
      } else {
          return k;
      }
  }
  return -m - 1;
}
function compare(s1: string, s2: string): number {
  return s1.localeCompare(s2);
}
interface ErrorMessage {
  field: string;
  code: string;
  param?: string|number|Date;
  message?: string;
}
// tslint:disable-next-line:max-classes-per-file
export class CommentValidator {
  constructor(protected attributes: Attributes, protected check: (obj: any, attributes: Attributes) => ErrorMessage[]) {
    this.validate = this.validate.bind(this);
  }
  validate(comment: Comment): Promise<ErrorMessage[]> {
    const errs = this.check(comment, this.attributes);
    return Promise.resolve(errs);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class RateValidator {
  constructor(protected attributes: Attributes, protected check: (obj: any, attributes: Attributes) => ErrorMessage[], protected max: number) {
    this.validate = this.validate.bind(this);
  }
  validate(rate: Rate): Promise<ErrorMessage[]> {
    const errs = this.check(rate, this.attributes);
    if (rate.rate > this.max) {
      const err = createError('rate', 'max', this.max);
      if (errs) {
        errs.push(err);
        return Promise.resolve(errs);
      } else {
        return Promise.resolve([err]);
      }
    } else {
      return Promise.resolve(errs);
    }
  }
}
function createError(field: string, code?: string, param?: string | number | Date): ErrorMessage {
  if (!code) {
    code = 'string';
  }
  const error: ErrorMessage = { field, code };
  if (param) {
    error.param = param;
  }
  return error;
}
