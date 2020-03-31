const SECONDS_A_MINUTE = 60
const SECONDS_A_HOUR = SECONDS_A_MINUTE * 60
const SECONDS_A_DAY = SECONDS_A_HOUR * 24
const SECONDS_A_WEEK = SECONDS_A_DAY * 7

const MILLISECONDS_A_SECOND = 1e3
const MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND
const MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND
const MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND
const MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND

const MS = 'millisecond'
const S = 'second'
const MIN = 'minute'
const H = 'hour'
const D = 'day'
const W = 'week'
const M = 'month'
const Q = 'quarter'
const Y = 'year'
const DATE = 'date'

const padStart = (string, length, pad) => {
    const s = String(string)
    if (!s || s.length >= length) return string
    return `${Array((length + 1) - s.length).join(pad)}${string}`
}
const isNumber = n => (!Number.isNaN(parseFloat(n)) && Number.isFinite(n))

const monthDiff = (a, b) => {
    // function from moment.js monthDiff
    const wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month())
    const anchor = a.clone().add(wholeMonthDiff, 'months')
    let anchor2
    let adjust
    if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months')
        adjust = (b - anchor) / (anchor - anchor2)
    } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months')
        adjust = (b - anchor) / (anchor2 - anchor)
    }
    return Number(-(wholeMonthDiff + adjust)) || 0
}

const absFloor = n => (n < 0 ? Math.ceil(n) || 0 : Math.floor(n))

const prettyUnit = (u) => {
    const special = {
        M: M,
        y: Y,
        w: W,
        d: D,
        h: H,
        m: MIN,
        s: S,
        ms: MS,
        Q: Q
    }
    return special[u] || String(u || '').toLowerCase().replace(/s$/, '')
}
const parseConfig = (date) => {
    if (!date) return new Date() // today
    if (date instanceof Date) return new Date(date)
    if(typeof date === 'string' && /^[0-9]+.?[0-9]*$/.test(date)){
        date = date*1
    }else if (typeof date === 'string' && !/Z$/i.test(date)) {
        const REGEX_PARSE = /^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/
        const d = date.match(REGEX_PARSE)
        if (d) {
            return new Date(d[1], d[2] - 1, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, d[7] || 0)
        }
    }
    return new Date(date) // everything else
}
const isUndefined = s => s === undefined

class tcDate {
    constructor(config) {
        this.$d = parseConfig(config)
        this.init()
    }

    init() {
        this.$zone = this.$d.getTimezoneOffset() / 60
        this.$zoneStr = padStart(String(this.$zone * -1).replace(/^(.)?(\d)/, '$10$200'), 5, '+')
        this.$y = this.$d.getFullYear()
        this.$M = this.$d.getMonth()
        this.$D = this.$d.getDate()
        this.$W = this.$d.getDay()
        this.$H = this.$d.getHours()
        this.$m = this.$d.getMinutes()
        this.$s = this.$d.getSeconds()
        this.$ms = this.$d.getMilliseconds()
    }

    isValid() {
        return !(this.$d.toString() === 'Invalid Date')
    }

    isLeapYear() {
        return ((this.$y % 4 === 0) && (this.$y % 100 !== 0)) || (this.$y % 400 === 0)
    }

    isSame(that, units='date') {
        const unit = prettyUnit(units)
        const other = new tcDate(that)
        return this.startOf(unit) <= other && other <= this.endOf(units)
    }

    isAfter(that, units) {
        const unit = prettyUnit(units)
        return new tcDate(that) < this.startOf(unit)
    }

    isBefore(that, units) {
        const unit = prettyUnit(units)
        return this.endOf(unit) < new tcDate(that)
    }

    $g(input, get, set) {
        if (isUndefined(input)) return this[get]
        return this.set(set, input)
    }

    year(input) {
        return this.$g(input, '$y', Y)
    }

    month(input) {
        return this.$g(input, '$M', M)
    }

    day(input) {
        return this.$g(input, '$W', D)
    }

    date(input) {
        return this.$g(input, '$D', DATE)
    }

    hour(input) {
        return this.$g(input, '$H', H)
    }

    minute(input) {
        return this.$g(input, '$m', MIN)
    }

    second(input) {
        return this.$g(input, '$s', S)
    }

    millisecond(input) {
        return this.$g(input, '$ms', MS)
    }

    unix() {
        return Math.floor(this.valueOf() / 1000)
    }

    valueOf() {
        // timezone(hour) * 60 * 60 * 1000 => ms
        return this.$d.getTime()
    }

    startOf(units, isStartOf = true) { // isStartOf -> endOf
        const unit = prettyUnit(units)
        const instanceFactory = (d, m, y = this.$y) => {
            const ins = new tcDate(new Date(y, m, d))
            return isStartOf ? ins : ins.endOf(D)
        }
        const instanceFactorySet = (method, slice) => {
            const argumentStart = [0, 0, 0, 0]
            const argumentEnd = [23, 59, 59, 999]
            return new tcDate(new Date()[method].apply(
                this.toDate(),
                isStartOf ? argumentStart.slice(slice) : argumentEnd.slice(slice)
            ))
        }
        switch (unit) {
            case Y:
                return isStartOf ? instanceFactory(1, 0)
                    : instanceFactory(31, 11, this.$y)
            case M:
                return isStartOf ? instanceFactory(1, this.$M)
                    : instanceFactory(0, this.$M + 1, this.$y)
            case W:
                return isStartOf ? instanceFactory(this.$D - this.$W, this.$M)
                    : instanceFactory(this.$D + (6 - this.$W), this.$M, this.$y)
            case D:
            case DATE:
                return instanceFactorySet('setHours', 0)
            case H:
                return instanceFactorySet('setMinutes', 1)
            case MIN:
                return instanceFactorySet('setSeconds', 2)
            case S:
                return instanceFactorySet('setMilliseconds', 3)
            default:
                return this.clone()
        }
    }

    endOf(arg) {
        return this.startOf(arg, false)
    }

    mSet(units, int) {
        const unit = prettyUnit(units)
        switch (unit) {
            case DATE:
                this.$d.setDate(int)
                break
            case M:
                this.$d.setMonth(int)
                break
            case Y:
                this.$d.setFullYear(int)
                break
            default:
                break
        }
        this.init()
        return this
    }

    set(string, int) {
        if (!isNumber(int)) return this
        return this.clone().mSet(string, int)
    }

    get(unit) {
        return this[prettyUnit(unit)]()
    }

    add(number, units) {
        const unit = (units && units.length === 1) ? units : prettyUnit(units)
        if (['M', M].indexOf(unit) > -1) {
            let date = this.set(DATE, 1).set(M, this.$M + number)
            date = date.set(DATE, Math.min(this.$D, date.daysInMonth()))
            return date
        }
        if (['y', Y].indexOf(unit) > -1) {
            return this.set(Y, this.$y + number)
        }
        let step
        switch (unit) {
            case 'm':
            case MIN:
                step = MILLISECONDS_A_MINUTE
                break
            case 'h':
            case H:
                step = MILLISECONDS_A_HOUR
                break
            case 'd':
            case D:
                step = MILLISECONDS_A_DAY
                break
            case 'w':
            case W:
                step = MILLISECONDS_A_WEEK
                break
            default: // s seconds
                step = MILLISECONDS_A_SECOND
        }
        const nextTimeStamp = this.valueOf() + (number * step)
        return new tcDate(nextTimeStamp)
    }

    subtract(number, string) {
        return this.add(number * -1, string)
    }

    format(formatStr = 'YYYY-MM-DD') {
        const weeks = [
            ['日', '一', '二', '三', '四', '五', '六'],
            ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        ];
        const months = [
            ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'], 
            ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
        ]
        const meridiemFunc = (hour, minute, isLowercase) => {
            const m = (hour < 12 ? 'AM' : 'PM')
            return isLowercase ? m.toLowerCase() : m
        }
        const get$H = num => (padStart(this.$H % 12 || 12, num, '0'))
        return formatStr.replace(/Y{2,4}|y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|S{3}|Z{1,2}/g, (match) => {

            switch (match) {
                case 'YY':
                case 'yy':
                    return String(this.$y).slice(-2)
                case 'YYYY':
                case 'yyyy':
                    return String(this.$y)
                case 'M':
                    return String(this.$M + 1)
                case 'MM':
                    return padStart(String(this.$M + 1), 2, '0')
                case 'MMM':
                    return months[this.$M].slice(0, 3)
                case 'MMMM':
                    return months[this.$M]
                case 'D':
                    return String(this.$D)
                case 'DD':
                    return padStart(String(this.$D), 2, '0')
                case 'd':
                    return String(this.$W)
                case 'dd':
                    return weeks[0][this.$W]
                case 'ddd':
                    return weeks[1][this.$W]
                case 'dddd':
                    return weeks[2][this.$W]
                case 'H':
                    return String(this.$H)
                case 'HH':
                    return padStart(String(this.$H), 2, '0')
                case 'h':
                    return get$H(1)
                case 'hh':
                    return get$H(2)
                case 'a':
                    return meridiemFunc(this.$H, this.$m, true)
                case 'A':
                    return meridiemFunc(this.$H, this.$m, false)
                case 'm':
                    return String(this.$m)
                case 'mm':
                    return padStart(String(this.$m), 2, '0')
                case 's':
                    return String(this.$s)
                case 'ss':
                    return padStart(String(this.$s), 2, '0')
                case 'SSS':
                    return padStart(String(this.$ms), 3, '0')
                case 'Z':
                    return `${this.$zoneStr.slice(0, -2)}:00`
                default: // 'ZZ'
                    return this.$zoneStr
            }
        })
    }

    diff(input, units, float = false) {
        const unit = prettyUnit(units)
        const that = input instanceof tcDate ? input : new tcDate(input)
        const diff = this - that
        let result = monthDiff(this, that)
        switch (unit) {
            case Y:
                result /= 12
                break
            case M:
                break
            case Q:
                result /= 3
                break
            case W:
                result = diff / MILLISECONDS_A_WEEK
                break
            case D:
                result = diff / MILLISECONDS_A_DAY
                break
            case H:
                result = diff / MILLISECONDS_A_HOUR
                break
            case MIN:
                result = diff / MILLISECONDS_A_MINUTE
                break
            case S:
                result = diff / MILLISECONDS_A_SECOND
                break
            default: // milliseconds
                result = diff
        }
        return float ? result : absFloor(result)
    }

    daysInMonth() {
        return this.endOf(M).$D
    }

    clone() {
        return new tcDate(this)
    }

    toDate() {
        return new Date(this.$d)
    }

    toArray() {
        return [
            this.$y,
            this.$M,
            this.$D,
            this.$H,
            this.$m,
            this.$s,
            this.$ms
        ]
    }

    toJSON() {
        return this.toISOString()
    }

    toISOString() {
        return this.toDate().toISOString()
    }

    toObject() {
        return {
            years: this.$y,
            months: this.$M,
            date: this.$D,
            hours: this.$H,
            minutes: this.$m,
            seconds: this.$s,
            milliseconds: this.$ms
        }
    }

    toString() {
        return this.$d.toUTCString()
    }

    getTimezoneDate() {
        const d = this.toDate()
        // 得到1970年一月一日到现在的秒数
        const len = d.getTime()
        // 本地时间与GMT时间的时间偏移差
        const offset = d.getTimezoneOffset() * 60000
        // 得到现在的格林尼治时间
        const utcTime = len + offset
        return new Date(utcTime + 3600000 * 8)
    }

    alias(short) {
        let today = new tcDate().startOf('day');
        if (this.startOf('day').isSame(today)) return '今天'
        if (this.startOf('day').isSame(today.add(1, 'day'))) return '明天'
        if (this.startOf('day').isSame(today.add(2, 'day'))) return '后天'
        return this.format(short ? 'ddd' : 'dddd')
    }

    clearTime(){
        this.$d.setHours(0);
        this.$d.setMinutes(0);
        this.$d.setSeconds(0);
        this.$d.setMilliseconds(0);
        return this.$d;
    }
}
export default config => (new tcDate(config))
