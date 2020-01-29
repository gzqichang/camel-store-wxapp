// run `tsc --target es2018 Calendar.ts`
const type = function (obj) {
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
    types.map((item) => {
        result[`is${item}`] = new RegExp(item)
            .test(Object.prototype.toString.call(obj));
    });
    return result;
};
const fillDigit = function (num, digit = 2, fill = '0') {
    return String(num).split('').length > digit
        ? String(num)
        : (fill.repeat((digit + 2)) + num).slice(parseInt(`-${digit}`));
};
const parseDate = function (date, separator = '-') {
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
const getLocalDate = function (date) {
    if (!(type(date).isDate || type(date).isString))
        return null;
    if (type(date).isDate)
        date = parseDate(date);
    return new Date(date.replace(/-/g, '/'));
};
class Day {
    constructor(date = null, marked = false) {
        this._separator = '-';
        this.date = date;
        this.marked = marked;
        this.dayType = date ? Calendar.dayType[date.getDay()] : '';
    }
    ;
    get day() {
        return this.date
            ? this.date.getDate()
            : null;
    }
    set separator(separator) {
        this._separator = separator;
    }
    serialize() {
        const date = this.date
            ? parseDate(this.date, this._separator)
            : '';
        return {
            date,
            dayType: this.dayType,
            marked: this.marked,
            day: this.day,
        };
    }
}
class Calendar {
    constructor(currentDate) {
        // availableType: oneof ('docs', 'range')
        this.availableType = 'docs';
        this.availableRange = [];
        this.availableDays = [0, 1, 2, 3, 4, 5, 6];
        this._firstDayOfAWeek = 1;
        let _currentDate = currentDate;
        // currentDate as String: '2020-02-20', '2020/02/20'
        if (type(currentDate).isUndefined)
            _currentDate = new Date();
        if (type(currentDate).isString)
            _currentDate = getLocalDate(currentDate);
        this._currentDate = _currentDate;
    }
    get year() {
        return this._currentDate.getFullYear();
    }
    get month() {
        return this._currentDate.getMonth() + 1;
    }
    get day() {
        return this._currentDate.getDate();
    }
    set currentDate(date) {
        this._currentDate = getLocalDate(date);
    }
    set firstDayOfAWeek(index) {
        if ([0, 1].includes(index))
            this._firstDayOfAWeek = index;
        else
            console.error(`
        You can only set Sunday or Monday as First Day of a Week.
        Action WILL NOT take effect!
      `);
    }
    generateDayList() {
        const nextMonthFirstDate = new Date(this.year, this.month, 0);
        const thisMonthLastDay = nextMonthFirstDate.getDate();
        const thisMonthFirstDay = new Date(this.year, this.month - 1, 1);
        let list = [];
        for (let i = this._firstDayOfAWeek; i < thisMonthFirstDay.getDay(); i++)
            list.push(new Day());
        for (let i = 1; i <= thisMonthLastDay; i++) {
            const date = new Date(this.year, this.month - 1, i);
            let marked = false;
            if (this.availableType === 'docs') {
                marked = this.availableRange.includes(parseDate(date))
                    && this.availableDays.includes(date.getDay());
            }
            else if (this.availableType === 'range') {
                const [start, end] = this.availableRange
                    .map((x) => (getLocalDate(x)));
                if (start && end)
                    marked = ((date >= start && date < end)
                        || (date > start && date <= end));
                if (start && !end)
                    marked = date >= start;
                if (!start && end)
                    marked = date <= start;
                marked = marked && this.availableDays.includes(date.getDay());
            }
            list.push(new Day(date, marked));
        }
        let remains = 6 * 7 - list.length;
        for (let i = 1; i <= remains; i++)
            list.push(new Day());
        this.dayList = list;
    }
    setAvailableRange(rangeStart, rangeEnd) {
        let _availableRange = [];
        // Input is an Array
        if (type(rangeStart).isArray)
            _availableRange = rangeStart;
        // Input is a Start and an End Point
        else
            _availableRange = [rangeStart, rangeEnd];
        this.availableRange = _availableRange.map((x) => (parseDate(x)));
    }
    setAvailableDays(days) {
        if (days.length > 0)
            this.availableDays = Array.from(days).map((item) => (Number(item)));
        else
            this.availableDays = [0, 1, 2, 3, 4, 5, 6];
    }
    enableDocsBasedRange() {
        this.availableType = 'docs';
    }
    disableDocsBasedRange() {
        this.availableType = 'range';
    }
    getNextMonth() {
        const currentMonth = this._currentDate.getMonth();
        this._currentDate.setMonth(currentMonth + 1, 1);
        this.generateDayList();
    }
    getPrevMonth() {
        const currentMonth = this._currentDate.getMonth();
        this._currentDate.setMonth(currentMonth - 1, 1);
        this.generateDayList();
    }
    serialize() {
        this.generateDayList();
        const dayList = this.dayList
            ? this.dayList.map((x) => (x.serialize()))
            : [];
        const availableDays = this.availableDays
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
        };
    }
}
Calendar.dayType = ['日', '一', '二', '三', '四', '五', '六'];
export default Calendar;
