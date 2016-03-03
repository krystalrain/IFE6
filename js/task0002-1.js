window.onload = function () {
    function hu$(selector) {
        var selectorArray = trim(selector).replace(/\s+/, ' ').split(" "),//去除错误输入下前后多余的空格，然后再去除多余的空格，最后以空格为分隔符获取多个选择器
            result = document;
        for (var i = 0, len = selectorArray.length; i < len; i++) {
            switch (selectorArray[i][0]) {//看第一个字符是什么
                case "#":
                    result = result.getElementById(selectorArray[i].substring(1));
                    break;
                case ".":
                    result = result.getElementsByClassName(selectorArray[i].substring(1))[0];
                    break;
                case "[":
                    var equalLoc = selectorArray[i].indexOf("="),
                        temp = result.getElementsByTagName('*'),
                        tempLen = temp.length,
                        key,
                        value,
                        j;
                    if (equalLoc != -1) {
                        key = selectorArray[i].substring(1, equalLoc);
                        value = selectorArray[i].substring(equalLoc + 1, selectorArray[i].length - 1);
                        for (j = 0; j < tempLen; j++) {
                            if (temp[j][key] === value) {
                                result = temp[j];
                                break;
                            }
                        }
                    } else {
                        key = selectorArray[i].substring(1, selectorArray[i].length - 1);
                        for (j = 0; j < tempLen; j++) {
                            if (temp[j][key]) {
                                result = temp[j];
                                break;
                            }
                        }
                    }
                    break;
                default:
                    result = result.getElementsByTagName(selectorArray[i])[0];
                    break;
            }
        }
        if (!result) {//没有匹配到任何选择器
            result = null;
        }
        return result;
    }
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, "");
    }
    function uniqArray3(arr) {
        if (arr.length == 0) {//如果要去重的数组是一个空数组，则抛出一个错误
            throw {
                name: TypeError,
                message: "empty array"
            }
        }
        var obj = {};
        for (var i = 0, len = arr.length; i < len; i++) {
            obj[arr[i]] = true;
        }
        return Object.keys(obj);
    }
    function showHobby() {
        reset();
        var text = hu$(".myTextArea").value,
            count = 0,
            str = "";
        hobbyArray = [];
        text = text.replace(/[\s，;、；,]+/g, " ");
        hobbyArray = text.split(" ");
        hobbyArray = uniqArray3(hobbyArray);
        for (var i = 0, len = hobbyArray.length; i < len; i++) {
            if (hobbyArray[i] !== "") {
                count++;
            }
        }
        if (count == 0) {
            hu$(".error").innerHTML = "请至少输入一个爱好！";
        } else if (count > 10) {
            hu$(".error").innerHTML = "最多输入10个爱好！";
        } else {
            for (i = 0, len = hobbyArray.length; i < len; i++) {
                if (hobbyArray[i] !== "") {
                    str += "<input type='checkbox' />" + "<span>" + hobbyArray[i] + "</span>" + "<br />";
                }
            }
        }
        hu$(".hobby").innerHTML = str;
        hu$(".myTextArea").value = "";
    }
    function reset() {
        hu$(".error").innerHTML = "";
        hu$(".hobby").innerHTML = "";
    }
    hu$("#submit").onclick = function () {
        showHobby();
    };
    hu$("#reset").onclick = function () {
        reset();
    };
};