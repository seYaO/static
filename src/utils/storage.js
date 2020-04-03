const storage = {}

storage.get = function (name, isOnce = false) {

    let result = '',
        getItemObj = window.sessionStorage.getItem(name);
    try {
        result = JSON.parse(getItemObj);
    } catch (error) {
        result = getItemObj
    }
    if (isOnce) {
        window.sessionStorage.setItem(name, '');
    }
    return result;
}

storage.set = function (name, val) {
    if (!name) return;
    if (typeof val !== 'string') {
        val = JSON.stringify(val);
    }
    window.sessionStorage.setItem(name, val);
}

storage.setList = function (item = {}, key = '', type = 'add', id = 'id') {
    let list = window.sessionStorage.getItem(key) || [];
    if (type == 'add') {
        item[id] = `${new Date().getTime()}`;
        list.unshift(item);
    } else {
        let tempIndex = -1
        list.map((elem, index) => {
            if (elem[id] == item[id]) {
                tempIndex = index
            }
        })
        item[id] = list[tempIndex][id];
        list[tempIndex] = item;
    }
    storage.set(key, list);
}
storage.getList = (key) => {
    let value = storage.get(key) || [];
    return value;
}

storage.getLocal = function (name, isOnce = false) {

    let result = '',
        getItemObj = window.localStorage.getItem(name);
    try {
        result = JSON.parse(getItemObj);
    } catch (error) {
        result = getItemObj
    }
    if (isOnce) {
        window.localStorage.setItem(name, '');
    }
    return result;
}

storage.setLocal = function (name, val) {
    if (!name) return;
    if (typeof val !== 'string') {
        val = JSON.stringify(val);
    }
    window.localStorage.setItem(name, val);
}

export default storage