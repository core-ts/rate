import { Attributes } from './core';
import { BaseRepository, InfoRepository, Rate, Rater, Rates, ShortRate, ShortRates } from './rate';

export * from './rate';

// tslint:disable-next-line:max-classes-per-file
export class RateService implements Rater<Rate> {
  constructor(
    protected rateRepository: BaseRepository<Rate>,
    protected infoRepository: InfoRepository) {
    this.rate = this.rate.bind(this);
  }
  async rate(rate: Rate): Promise<number> {
    rate.time = new Date();
    const info = await this.infoRepository.exist(rate.id);
    if (!info) {
      const res = await this.rateRepository.create(rate, true);
      return res;
    }
    const exist = await this.rateRepository.load(rate.id, rate.author);
    if (!exist) {
      const res = await this.rateRepository.create(rate);
      return res;
    }
    const history: ShortRate = { review: exist.review, rate: exist.rate, time: exist.time };
    if (exist.histories && exist.histories.length > 0) {
      const histories = exist.histories;
      histories.push(history);
      rate.histories = histories;
    } else {
      rate.histories = [history];
    }
    const count = await this.rateRepository.update(rate, exist.rate);
    return count;
  }
}
export function avg(n: number[]): number {
  let sum = 0;
  for (const s of n) {
    sum = sum + s;
  }
  return sum / n.length;
}
// tslint:disable-next-line:max-classes-per-file
export class RatesService implements Rater<Rates> {
  constructor(
    protected rateRepository: BaseRepository<Rates>,
    protected infoRepository: InfoRepository) {
    this.rate = this.rate.bind(this);
  }
  async rate(rate: Rates): Promise<number> {
    const info = await this.infoRepository.exist(rate.id);
    if (rate.rates && rate.rates.length > 0) {
      rate.rate = avg(rate.rates);
    }
    rate.time = new Date();
    if (!info) {
      const res = await this.rateRepository.create(rate, true);
      return res;
    }
    const exist = await this.rateRepository.load(rate.id, rate.author);
    if (!exist) {
      const res = await this.rateRepository.create(rate);
      return res;
    }
    const history: ShortRates = { review: exist.review, rates: exist.rates, time: exist.time };
    if (exist.histories && exist.histories.length > 0) {
      const histories = exist.histories;
      histories.push(history);
      rate.histories = histories;
    } else {
      rate.histories = [history];
    }
    const count = await this.rateRepository.update(rate, exist.rate);
    return count;
  }
}
interface ErrorMessage {
  field: string;
  code: string;
  param?: string | number | Date;
  message?: string;
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
// tslint:disable-next-line:max-classes-per-file
export class RatesValidator {
  constructor(protected attributes: Attributes, protected check: (obj: any, attributes: Attributes) => ErrorMessage[], protected max: number, protected length: number) {
    this.validate = this.validate.bind(this);
  }
  validate(rate: Rates): Promise<ErrorMessage[]> {
    const errs = this.check(rate, this.attributes);
    if (!rate.rates || rate.rates.length === 0) {
      const err = createError('rates', 'required');
      errs.push(err);
      return Promise.resolve(errs);
    }
    if (rate.rates.length !== this.length) {
      const err = createError('rates', 'length', this.length);
      errs.push(err);
      return Promise.resolve(errs);
    }
    for (const r of rate.rates) {
      if (r > this.max) {
        const err = createError('rates', 'max', this.max);
        errs.push(err);
      }
    }
    return Promise.resolve(errs);
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
