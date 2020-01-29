// run `tsc --target es2018 Calendar.ts`

interface Type {
  (obj: any): {
    isBoolean: boolean,
    isNumber: boolean,
    isString: boolean,
    isArray: boolean,
    isNull: boolean,
    isUndefined: boolean,
    isFunction: boolean,
    isObject: boolean,
    isDate: boolean,
  }
}

interface FillDigit {
  (num: number, digit?: number, fill?: string): string;
}

interface ParseDate {
  (date: any, separator?: string): string;
}


const type: Type = function(obj: any): any {
  const types = [
    'Boolean',
    'Number',
    'String',
    'Array',
    'Null',
    'Undefined',
    'Function',
    'Object',
    'Date',
  ];
  let result = {};

  types.map(
    (item) => {
      result[`is${item}`] = new RegExp(item)
        .test(Object.prototype.toString.call(obj));
    }
  );

  return result;
};

const fillDigit: FillDigit = function(
  num: number,
  digit: number = 2,
  fill: string = '0',
): string {
  return String(num).split('').length > digit
    ? String(num)
    : (fill.repeat((digit + 2)) + num).slice(parseInt(`-${digit}`));
};

const parseDate: ParseDate = function(
  date: any,
  separator: string = '-',
): string | null {
  if (!type(date).isDate)
    return date;
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ]
    .map((x) => fillDigit(x))
    .join(separator);
};

const getLocalDate: (date: Date | string) => Date
  = function(date: Date | string): Date | null {
  if (!(type(date).isDate || type(date).isString))
    return null;

  if (type(date).isDate)
    date = parseDate(date as Date);

  return new Date((date as string).replace(/-/g, '/'));
};


class Day {
  public date: Date;
  public dayType: string;
  public marked: boolean;

  private _separator: string = '-';

  public constructor(
    date: Date | null = null,
    marked: boolean = false,
  ) {
    this.date = date;
    this.marked = marked;
    this.dayType = date ? Calendar.dayType[date.getDay()] : '';
  };

  public get day (): number | null {
    return this.date
      ? this.date.getDate()
      : null;
  }

  public set separator (separator: string) {
    this._separator = separator;
  }

  public serialize(): any {
    const date: string = this.date
      ? parseDate(this.date, this._separator)
      : '';

    return {
      date,
      dayType: this.dayType,
      marked: this.marked,
      day: this.day,
    }
  }
}


class Calendar {
  public _currentDate: Date;
  public dayList: Array<Day>;

  // availableType: oneof ('docs', 'range')
  private availableType: string = 'docs';
  private availableRange: Array<string> = [];
  private availableDays: Array<number> = [0, 1, 2, 3, 4, 5, 6];
  private _firstDayOfAWeek: number = 1;

  public static readonly dayType: Array<string>
    = ['日', '一', '二', '三', '四', '五', '六'];

  public constructor(currentDate?: Date | string | undefined) {
    let _currentDate: Date | string | undefined = currentDate;

    // currentDate as String: '2020-02-20', '2020/02/20'
    if (type(currentDate).isUndefined)
      _currentDate = new Date();
    if (type(currentDate).isString)
      _currentDate = getLocalDate(currentDate);

    this._currentDate = _currentDate as Date;
  }

  public get year (): number {
    return this._currentDate.getFullYear();
  }

  public get month (): number {
    return this._currentDate.getMonth() + 1;
  }

  public get day (): number {
    return this._currentDate.getDate();
  }

  public set currentDate (date: Date | string) {
    this._currentDate = getLocalDate(date);
  }

  public set firstDayOfAWeek (index: number) {
    if ([0, 1].includes(index))
      this._firstDayOfAWeek = index;
    else
      console.error(`
        You can only set Sunday or Monday as First Day of a Week.
        Action WILL NOT take effect!
      `);
  }

  public generateDayList (): void {
    const nextMonthFirstDate: Date = new Date(this.year, this.month, 0);
    const thisMonthLastDay: number = nextMonthFirstDate.getDate();
    const thisMonthFirstDay: Date = new Date(this.year, this.month - 1, 1);

    let list: Array<Day> = [];

    for(let i: number = this._firstDayOfAWeek; i < thisMonthFirstDay.getDay(); i++)
      list.push(new Day());

    for(let i: number = 1; i <= thisMonthLastDay; i++) {
      const date: Date = new Date(this.year, this.month - 1, i);
      let marked: boolean = false;

      if (this.availableType === 'docs') {
        marked = this.availableRange.includes(parseDate(date))
          && this.availableDays.includes(date.getDay());
      }

      else if (this.availableType === 'range') {
        const [start, end] = this.availableRange
          .map((x) => (getLocalDate(x)));

        if (start && end)
          marked = (
            (date >= start && date < end)
            || (date > start && date <= end)
          );
        if (start && !end)
          marked = date >= start;
        if (!start && end)
          marked = date <= start;

        marked = marked && this.availableDays.includes(date.getDay());
      }

      list.push(new Day(date, marked));
    }

    let remains: number = 6 * 7 - list.length;

    for(let i: number = 1; i <= remains; i++)
      list.push(new Day());

    this.dayList = list;
  }

  public setAvailableRange (
    rangeStart: Array<Date> | Date,
    rangeEnd?: Date,
  ): void {
    let _availableRange: Array<Date> = [];

    // Input is an Array
    if (type(rangeStart).isArray)
      _availableRange = rangeStart as Array<Date>;
    // Input is a Start and an End Point
    else
      _availableRange = [rangeStart as Date, rangeEnd];

    this.availableRange = _availableRange.map((x) => (parseDate(x)));
  }

  public setAvailableDays (days: Array<number | string>) {
    if (days.length > 0)
      this.availableDays = Array.from(days).map((item) => (Number(item)));
    else
      this.availableDays = [0, 1, 2, 3, 4, 5, 6];
  }

  public enableDocsBasedRange (): void {
    this.availableType = 'docs';
  }

  public disableDocsBasedRange (): void {
    this.availableType = 'range';
  }

  public getNextMonth (): void {
    const currentMonth: number = this._currentDate.getMonth();
    this._currentDate.setMonth(currentMonth + 1, 1);
    this.generateDayList();
  }

  public getPrevMonth (): void {
    const currentMonth: number = this._currentDate.getMonth();
    this._currentDate.setMonth(currentMonth - 1, 1);
    this.generateDayList();
  }

  public serialize(): any {
    this.generateDayList();

    const dayList: Array<any> = this.dayList
      ? this.dayList.map((x) => (x.serialize()))
      : [];
    const availableDays: Array<string> = this.availableDays
      .map((item) => (Calendar.dayType[item]));

    return {
      currentDate: parseDate(this._currentDate),
      availableType: this.availableType,
      availableRange: this.availableRange,
      availableDays,
      firstDayOfAWeek: this._firstDayOfAWeek === 1 ? '一' : '日',
      dayList,
      year: fillDigit(this.year),
      month: fillDigit(this.month),
      day: fillDigit(this.day),
    }
  }
}


export default Calendar;
