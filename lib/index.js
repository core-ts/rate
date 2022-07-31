"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./rate"));
var RateService = (function () {
  function RateService(find, repository, infoRepository, commentRepository, rateReactionRepository, queryURL) {
    this.find = find;
    this.repository = repository;
    this.infoRepository = infoRepository;
    this.commentRepository = commentRepository;
    this.rateReactionRepository = rateReactionRepository;
    this.queryURL = queryURL;
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
  RateService.prototype.rate = function (rate) {
    return __awaiter(this, void 0, void 0, function () {
      var info, r0, exist, r1, sr, history, res;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            rate.time = new Date();
            return [4, this.infoRepository.load(rate.id)];
          case 1:
            info = _a.sent();
            if (!!info) return [3, 3];
            return [4, this.repository.insert(rate, true)];
          case 2:
            r0 = _a.sent();
            return [2, r0];
          case 3: return [4, this.repository.load(rate.id, rate.author)];
          case 4:
            exist = _a.sent();
            if (!!exist) return [3, 6];
            return [4, this.repository.insert(rate)];
          case 5:
            r1 = _a.sent();
            return [2, r1];
          case 6:
            sr = { review: exist.review, rate: exist.rate, time: exist.time };
            if (exist.histories && exist.histories.length > 0) {
              history = exist.histories;
              history.push(sr);
              rate.histories = history;
            }
            else {
              rate.histories = [sr];
            }
            return [4, this.repository.update(rate, exist.rate)];
          case 7:
            res = _a.sent();
            return [2, res];
        }
      });
    });
  };
  RateService.prototype.search = function (s, limit, offset, fields) {
    var _this = this;
    return this.find(s, limit, offset, fields).then(function (res) {
      if (!_this.queryURL) {
        return res;
      }
      else {
        if (res.list && res.list.length > 0) {
          var ids = [];
          for (var _i = 0, _a = res.list; _i < _a.length; _i++) {
            var rate = _a[_i];
            ids.push(rate.author);
          }
          return _this.queryURL(ids).then(function (urls) {
            for (var _i = 0, _a = res.list; _i < _a.length; _i++) {
              var rate = _a[_i];
              var i = binarySearch(urls, rate.author);
              if (i >= 0) {
                rate.authorURL = urls[i].url;
              }
            }
            return res;
          });
        }
        else {
          return res;
        }
      }
    });
  };
  RateService.prototype.load = function (id, author) {
    return this.repository.load(id, author);
  };
  RateService.prototype.getRate = function (id, author) {
    return this.repository.load(id, author);
  };
  RateService.prototype.setUseful = function (id, author, userId) {
    return this.rateReactionRepository.save(id, author, userId, 1);
  };
  RateService.prototype.removeUseful = function (id, author, userId) {
    return this.rateReactionRepository.remove(id, author, userId);
  };
  RateService.prototype.comment = function (comment) {
    var _this = this;
    return this.repository.load(comment.id, comment.author).then(function (checkRate) {
      if (!checkRate) {
        return -1;
      }
      else {
        comment.time ? comment.time = comment.time : comment.time = new Date();
        return _this.commentRepository.insert(comment);
      }
    });
  };
  RateService.prototype.removeComment = function (commentId, userId) {
    var _this = this;
    return this.commentRepository.load(commentId).then(function (comment) {
      if (comment) {
        if (userId === comment.author || userId === comment.userId) {
          return _this.commentRepository.remove(commentId, comment.id, comment.author);
        }
        else {
          return -2;
        }
      }
      else {
        return -1;
      }
    });
  };
  RateService.prototype.updateComment = function (comment) {
    var _this = this;
    return this.commentRepository.load(comment.commentId).then(function (exist) {
      if (!exist) {
        return -1;
      }
      else {
        if (exist.userId !== comment.userId) {
          return -2;
        }
        exist.updatedAt = new Date();
        var c = { comment: exist.comment, time: exist.time };
        if (exist.histories && exist.histories.length > 0) {
          exist.histories.push(c);
        }
        else {
          exist.histories = [c];
        }
        exist.comment = comment.comment;
        var res = _this.commentRepository.update(exist);
        return res;
      }
    });
  };
  RateService.prototype.getComments = function (id, author, limit) {
    return this.commentRepository.getComments(id, author, limit);
  };
  RateService.prototype.getComment = function (id) {
    return this.commentRepository.load(id);
  };
  return RateService;
}());
exports.RateService = RateService;
var CommentQuery = (function () {
  function CommentQuery(find, repository, queryURL) {
    this.find = find;
    this.repository = repository;
    this.queryURL = queryURL;
    this.load = this.load.bind(this);
    this.search = this.search.bind(this);
    this.getComments = this.getComments.bind(this);
  }
  CommentQuery.prototype.load = function (id, ctx) {
    return this.repository.load(id, ctx);
  };
  CommentQuery.prototype.getComments = function (id, author, limit) {
    return this.repository.getComments(id, author, limit);
  };
  CommentQuery.prototype.search = function (s, limit, offset, fields) {
    var _this = this;
    return this.find(s, limit, offset, fields).then(function (res) {
      if (!_this.queryURL) {
        return res;
      }
      else {
        if (res.list && res.list.length > 0) {
          var ids = [];
          for (var _i = 0, _a = res.list; _i < _a.length; _i++) {
            var rate = _a[_i];
            ids.push(rate.userId);
          }
          return _this.queryURL(ids).then(function (urls) {
            for (var _i = 0, _a = res.list; _i < _a.length; _i++) {
              var rate = _a[_i];
              var i = binarySearch(urls, rate.userId);
              if (i >= 0) {
                rate.userURL = urls[i].url;
              }
            }
            return res;
          });
        }
        else {
          return res;
        }
      }
    });
  };
  return CommentQuery;
}());
exports.CommentQuery = CommentQuery;
function binarySearch(ar, el) {
  var m = 0;
  var n = ar.length - 1;
  while (m <= n) {
    var k = (n + m) >> 1;
    var cmp = compare(el, ar[k].id);
    if (cmp > 0) {
      m = k + 1;
    }
    else if (cmp < 0) {
      n = k - 1;
    }
    else {
      return k;
    }
  }
  return -m - 1;
}
function compare(s1, s2) {
  return s1.localeCompare(s2);
}
var CommentValidator = (function () {
  function CommentValidator(attributes, check) {
    this.attributes = attributes;
    this.check = check;
    this.validate = this.validate.bind(this);
  }
  CommentValidator.prototype.validate = function (comment) {
    var errs = this.check(comment, this.attributes);
    return Promise.resolve(errs);
  };
  return CommentValidator;
}());
exports.CommentValidator = CommentValidator;
var RateValidator = (function () {
  function RateValidator(attributes, check, max) {
    this.attributes = attributes;
    this.check = check;
    this.max = max;
    this.validate = this.validate.bind(this);
  }
  RateValidator.prototype.validate = function (rate) {
    var errs = this.check(rate, this.attributes);
    if (rate.rate > this.max) {
      var err = createError('rate', 'max', this.max);
      if (errs) {
        errs.push(err);
        return Promise.resolve(errs);
      }
      else {
        return Promise.resolve([err]);
      }
    }
    else {
      return Promise.resolve(errs);
    }
  };
  return RateValidator;
}());
exports.RateValidator = RateValidator;
function createError(field, code, param) {
  if (!code) {
    code = 'string';
  }
  var error = { field: field, code: code };
  if (param) {
    error.param = param;
  }
  return error;
}
