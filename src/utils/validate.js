const toString = Object.prototype.toString
const objectProto = Object.prototype
const hasOwnProperty = Object.prototype.hasOwnProperty
let isIPhoneX = false;
/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function getTag(value) {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]'
    }
    return toString.call(value)
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
    const Ctor = value && value.constructor
    const proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto

    return value === proto
}


class validate {
    /**
     * 判断函数
     * @param {*} value 
     */
    isFunction(value) {
        return toString.call(value) === '[object Function]'
    }
    /**
     * 判断对象
     * @param {*} value 
     */
    isNull(value) {
        return value === null
    }
    /**
     * 判断对象
     * @param {*} value 
     */
    isObject(value) {
        return toString.call(value) === '[object Object]'
    }
    /**
     * 
     * @param {*} value 
     */
    isObjectLike(value) {
        return typeof value === 'object' && value !== null
    }
    /**
     * 
     * @param {*} value 
     */
    isError(value) {
        return toString.call(value) === '[object Error]'
    }
    /**
     * 
     * @param {*} value 
     */
    isNumber(value) {
        return typeof value === 'number' && !isNaN(value)
    }
    /**
     * 
     * @param {*} value 
     */
    isString(value) {
        return toString.call(value) === '[object String]'
    }
    /**
     * 
     * @param {*} value 
     */
    isBoolean(value) {
        return value === true || value === false
    }
    /**
     * 
     * @param {*} value 
     */
    isArrayBuffer(value) {
        return toString.call(value) === '[object ArrayBuffer]'
    }
    /**
     * 
     * @param {*} value 
     */
    isArray(value) {
        return toString.call(value) === '[object Array]'
    }
    /**
     * 
     * @param {*} value 
     */
    isUndefined(value) {
        return typeof value === 'undefined'
    }
    /**
     * 数组中是否包含某一项
     * @param {*} array 
     * @param {*} item 
     */
    isincludes(array, item) {
        return array && array.length && array.indexOf(item) > -1
    }
    /**
     * 手机号
     * @param {*} txt 
     */
    isMobile(txt) {
        return /^1[3-9]\d{9}$/.test(txt);
    }
    /**
     * 电子邮箱
     * @param {*} txt 
     */
    isEmail(txt) {
        return /^\w+([-+.\']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(txt);
    }
    /**
     * 常旅姓名
     * @param {*} txt 
     */
    isTravelName(txt) {
        return /^[a-z·\u4e00-\u9fa5]+$/i.test(txt);
    }
    /**
     * 护照
     * @param {*} txt 
     */
    isPassport(txt) {
        return /^[a-zA-Z0-9]{5,17}$/.test(txt);
    }
    /**
     * 港澳通行证（回乡证）
     * @param {*} txt 
     */
    isHVPS(txt) {
        return /^(m|M|h|H)(\d{8}|\d{10})$/.test(txt);
    }
    /**
     * 验证台胞证
     * @param {*} txt 
     */
    isMTP(txt) {
        return /^(\d{8}|[a-zA-Z][0-9]{9})$/.test(txt);
    }

    /**
     * 验证身份证
     * @param {*} txt 身份证号
     * @param {*} allow15Bit  进行15位身份证的验证  
     */
    isIdCard(txt, allow15Bit) {
        //return /(^[0-9]{17}([0-9]|X|x)$)|(^[0-9]{15}$)/.test(txt);

        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子   
        var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X   
        var idCard = txt;
        idCard = trim(idCard.replace(/ /g, "")); //去掉字符串头尾空格                     
        if (allow15Bit && idCard.length == 15) {
            return isValidityBrithBy15IdCard(idCard); //进行15位身份证的验证    
        } else if (idCard.length == 18) {
            var a_idCard = idCard.split(""); // 得到身份证数组   
            if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) { //进行18位身份证的基本验证和第18位的验证
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

        /**  
         * 判断身份证号码为18位时最后的验证位是否正确  
         * @param a_idCard 身份证号码数组  
         * @return  
         */
        function isTrueValidateCodeBy18IdCard(a_idCard) {
            var sum = 0; // 声明加权求和变量   
            if (a_idCard[17].toLowerCase() == 'x') {
                a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作   
            }
            for (var i = 0; i < 17; i++) {
                sum += Wi[i] * a_idCard[i]; // 加权求和   
            }
            var valCodePosition = sum % 11; // 得到验证码所位置   
            if (a_idCard[17] == ValideCode[valCodePosition]) {
                return true;
            } else {
                return false;
            }
        }
        /**  
         * 验证18位数身份证号码中的生日是否是有效生日  
         * @param idCard 18位书身份证字符串  
         * @return  
         */
        function isValidityBrithBy18IdCard(idCard18) {
            var year = idCard18.substring(6, 10);
            var month = idCard18.substring(10, 12);
            var day = idCard18.substring(12, 14);
            var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 这里用getFullYear()获取年份，避免千年虫问题   
            if (temp_date.getFullYear() != parseFloat(year) ||
                temp_date.getMonth() != parseFloat(month) - 1 ||
                temp_date.getDate() != parseFloat(day)) {
                return false;
            } else {
                return true;
            }
        }
        /**  
         * 验证15位数身份证号码中的生日是否是有效生日  
         * @param idCard15 15位书身份证字符串  
         * @return  
         */
        function isValidityBrithBy15IdCard(idCard15) {
            var year = idCard15.substring(6, 8);
            var month = idCard15.substring(8, 10);
            var day = idCard15.substring(10, 12);
            var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
            if (temp_date.getYear() != parseFloat(year) ||
                temp_date.getMonth() != parseFloat(month) - 1 ||
                temp_date.getDate() != parseFloat(day)) {
                return false;
            } else {
                return true;
            }
        }
        //去掉字符串头尾空格   
        function trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    }

    /**
     * 检测两个数组是否相等
     * @param {Array} arr1 数组1
     * @param {Array} arr2 数组2
     */
    isEqualArray(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false
        }

        if (arr1.length === 0) {
            return arr2.length === 0
        }

        return arr1.every((item, i) => {
            if (!item) {
                // TODO: 此处逻辑不太严谨，会导致 [0], [null] 为 true
                return !arr2[i]
            }

            if (item instanceof Array) {
                if (!(arr2[i] instanceof Array)) {
                    return false
                }

                return this.isEqualArray(arr1[i], arr2[i])
            }

            if (typeof item === 'object') {
                if (typeof arr2[i] !== 'object') {
                    return false
                }

                return this.isEqualObject(item, arr2[i])
            }

            return item === arr2[i]
        })
    }

    /**
     * 检测两个对象是否相等
     * @param {Object} o1 对象1
     * @param {Object} o2 对象2
     */
    isEqualObject(o1, o2) {
        if (!o1) {
            return !o2
        }

        const o1Key = Object.keys(o1)
        const o2Key = Object.keys(o2)

        if (o1Key.length !== o2Key.length) {
            return false
        }
        return o1Key.every(key => {
            if (o1[key] instanceof Array) {
                if (!(o2[key] instanceof Array)) {
                    return false
                }

                return this.isEqualArray(o1[key], o2[key])
            }

            if (typeof o1[key] === 'object') {
                if (typeof o2[key] !== 'object') {
                    return false
                }

                return this.isEqualObject(o1[key], o2[key])
            }

            return o1[key] === o2[key]
        })
    }

    /**
     * 检测是否为空
     * @param  {Mixed} value 要检测的数据
     * @return {Boolean}    如果空字符串、空数组、空对象、空集合，空映射或者set返回true，其余返回false
     */
    isempty(value) {
        if (value == null) {
            return true
        }
        if (typeof value == 'object' && (value).constructor == Array && value.length == 0) {
            return true;
        }
        const tag = getTag(value)
        if (tag == '[object Map]' || tag == '[object Set]') {
            return !value.size
        }
        if (isPrototype(value)) {

            return !Object.keys(value).length
        }
        for (const key in value) {
            if (hasOwnProperty.call(value, key)) {
                return false
            }
        }
        return true;
    }

}
export default new validate()