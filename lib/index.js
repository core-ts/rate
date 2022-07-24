"use strict";
var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
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
var core_1 = require("./core");
__export(require("./rate"));
var RateManager = (function (_super) {
  __extends(RateManager, _super);
  function RateManager(search, repository, infoRepository, rateCommentRepository, rateReactionRepository) {
    var _this = _super.call(this, search, repository) || this;
    _this.repository = repository;
    _this.infoRepository = infoRepository;
    _this.rateCommentRepository = rateCommentRepository;
    _this.rateReactionRepository = rateReactionRepository;
    _this.rate = _this.rate.bind(_this);
    _this.update = _this.update.bind(_this);
    _this.save = _this.save.bind(_this);
    _this.comment = _this.comment.bind(_this);
    _this.load = _this.load.bind(_this);
    _this.removeComment = _this.removeComment.bind(_this);
    _this.updateComment = _this.updateComment.bind(_this);
    _this.updateRate = _this.updateRate.bind(_this);
    return _this;
  }
  RateManager.prototype.rate = function (rate) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
      var info, exist, r, sumRate, count;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0: return [4, this.infoRepository.load(rate.id)];
          case 1:
            info = _b.sent();
            if (!info) {
              info = {
                'id': rate.id,
                'rate': 0,
                'rate1': 0,
                'rate2': 0,
                'rate3': 0,
                'rate4': 0,
                'rate5': 0,
                'viewCount': 0,
              };
            }
            return [4, this.repository.getRate(rate.id, rate.author)];
          case 2:
            exist = _b.sent();
            r = (exist ? exist.rate : 0);
            info['rate' + ((_a = rate.rate) === null || _a === void 0 ? void 0 : _a.toString())] += 1;
            sumRate = info.rate1 +
              info.rate2 * 2 +
              info.rate3 * 3 +
              info.rate4 * 4 +
              info.rate5 * 5 - r;
            count = info.rate1 +
              info.rate2 +
              info.rate3 +
              info.rate4 +
              info.rate5 + (exist ? 0 : 1);
            info.rate = sumRate / count;
            info.viewCount = count;
            rate.usefulCount = 0;
            return [4, this.infoRepository.save(info)];
          case 3:
            _b.sent();
            return [4, this.repository.save(rate)];
          case 4:
            _b.sent();
            return [2, true];
        }
      });
    });
  };
  RateManager.prototype.getRate = function (id, author) {
    return this.repository.getRate(id, author);
  };
  RateManager.prototype.setUseful = function (id, author, userId) {
    return this.rateReactionRepository.save(id, author, userId, 1);
  };
  RateManager.prototype.removeUseful = function (id, author, userId) {
    return this.rateReactionRepository.remove(id, author, userId);
  };
  RateManager.prototype.comment = function (comment) {
    var _this = this;
    return this.repository.getRate(comment.id, comment.author).then(function (checkRate) {
      if (!checkRate) {
        return 0;
      }
      else {
        comment.time ? comment.time = comment.time : comment.time = new Date();
        return _this.rateCommentRepository.insert(comment);
      }
    });
  };
  RateManager.prototype.removeComment = function (commentId, userId) {
    var _this = this;
    return this.rateCommentRepository.load(commentId).then(function (comment) {
      if (comment) {
        if (userId === comment.author || userId === comment.userId) {
          return _this.rateCommentRepository.remove(commentId, comment.id, comment.author);
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
  RateManager.prototype.updateComment = function (comment) {
    var _this = this;
    return this.rateCommentRepository.load(comment.commentId).then(function (exist) {
      if (!exist) {
        return 0;
      }
      else {
        comment.updatedAt = new Date();
        return _this.rateCommentRepository.update(comment);
      }
    });
  };
  RateManager.prototype.updateRate = function (rate) {
    var _this = this;
    return this.repository.getRate(rate.id, rate.author).then(function (exist) {
      if (exist) {
        rate.time ? rate.time = rate.time : rate.time = new Date();
        return _this.repository.update(rate);
      }
      else {
        return 0;
      }
    });
  };
  return RateManager;
}(core_1.Manager));
exports.RateManager = RateManager;
var RateCommentManager = (function (_super) {
  __extends(RateCommentManager, _super);
  function RateCommentManager(search, replyRepository) {
    var _this = _super.call(this, search, replyRepository) || this;
    _this.replyRepository = replyRepository;
    return _this;
  }
  return RateCommentManager;
}(core_1.Manager));
exports.RateCommentManager = RateCommentManager;
