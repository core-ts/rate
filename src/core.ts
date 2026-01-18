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
