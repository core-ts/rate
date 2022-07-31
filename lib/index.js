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
  function RateService(repository, infoRepository) {
    this.repository = repository;
    this.infoRepository = infoRepository;
    this.rate = this.rate.bind(this);
  }
  RateService.prototype.rate = function (rate) {
    return __awaiter(this, void 0, void 0, function () {
      var info, r0, exist, r1, sr, history, res;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            rate.time = new Date();
            return [4, this.infoRepository.exist(rate.id)];
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
  return RateService;
}());
exports.RateService = RateService;
function avg(n) {
  var sum = 0;
  for (var _i = 0, n_1 = n; _i < n_1.length; _i++) {
    var s = n_1[_i];
    sum = sum + s;
  }
  return sum / n.length;
}
exports.avg = avg;
var RatesService = (function () {
  function RatesService(repository, infoRepository) {
    this.repository = repository;
    this.infoRepository = infoRepository;
    this.rate = this.rate.bind(this);
  }
  RatesService.prototype.rate = function (rate) {
    return __awaiter(this, void 0, void 0, function () {
      var info, r0, exist, r1, sr, history, res;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4, this.infoRepository.exist(rate.id)];
          case 1:
            info = _a.sent();
            if (rate.rates && rate.rates.length > 0) {
              rate.rate = avg(rate.rates);
            }
            rate.time = new Date();
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
            sr = { review: exist.review, rates: exist.rates, time: exist.time };
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
  return RatesService;
}());
exports.RatesService = RatesService;
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
var RatesValidator = (function () {
  function RatesValidator(attributes, check, max, length) {
    this.attributes = attributes;
    this.check = check;
    this.max = max;
    this.length = length;
    this.validate = this.validate.bind(this);
  }
  RatesValidator.prototype.validate = function (rate) {
    var errs = this.check(rate, this.attributes);
    if (!rate.rates || rate.rates.length === 0) {
      var err = createError('rates', 'required');
      errs.push(err);
      return Promise.resolve(errs);
    }
    if (rate.rates.length !== this.length) {
      var err = createError('rates', 'length', this.length);
      errs.push(err);
      return Promise.resolve(errs);
    }
    for (var _i = 0, _a = rate.rates; _i < _a.length; _i++) {
      var r = _a[_i];
      if (r > this.max) {
        var err = createError('rates', 'max', this.max);
        errs.push(err);
      }
    }
    return Promise.resolve(errs);
  };
  return RatesValidator;
}());
exports.RatesValidator = RatesValidator;
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
