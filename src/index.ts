// core.ts
export type DataType = 'ObjectId' | 'date' | 'datetime' | 'time'
  | 'boolean' | 'number' | 'integer' | 'string' | 'text'
  | 'object' | 'array' | 'binary'
  | 'primitives' | 'booleans' | 'numbers' | 'integers' | 'strings' | 'dates' | 'datetimes' | 'times';
export type Operator = "=" | "like" | "!=" | "<>" | ">" | ">=" | "<" | "<="

export interface Attribute {
  field?: string;
  column?: string;
  type?: DataType;
  required?: boolean;
  operator?: Operator;
  key?: boolean;
  q?: boolean;
  min?: number;
  max?: number;
  typeof?: Attributes;
}
export interface Attributes {
  [key: string]: Attribute;
}

export interface Filter {
  page?: number;
  limit: number;
  fields?: string[];
  sort?: string;
  q?: string;
}

// rate.ts
export interface RateId {
  id: string;
  author: string;
}
export interface BaseRate {
  author: string;
  authorURL?: string;
  name: string;
  displayName: string;
  anonymous: boolean;
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
  create(rate: R, newInfo?: boolean): Promise<number>;
  update(rate: R, oldRate: number): Promise<number>;
  load(id: string, author: string): Promise<R | null>;
}

export interface Rater<R> {
  rate(rate: R): Promise<number>;
}

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
export interface InfoRepository {
  exist(id: string, ctx?: any): Promise<boolean>;
}

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
