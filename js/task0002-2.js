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
        return str.replace(/^\s+|\s+$/g, '');
    }
    var timer = null;
    function showTime() {
        reset();
        var text = hu$(".myTextArea").value,
            timeArray = text.split("-"),
            len = timeArray.length;
        if (len < 3) {
            hu$(".error").innerHTML = "输入格式有误，请重新输入";
        } else {
            var endTime = new Date(),
                nowTime = new Date(),
                diff = 0,
                p_diffDay = 0,
                diffDay = 0,
                p_diffHour = 0,
                diffHour = 0,
                p_diffMin = 0,
                diffMin = 0,
                p_diffSec = 0,
                diffSec = 0,
                monthTrue = false,
                dayTrue = false;
            endTime.setFullYear(timeArray[0], timeArray[1] - 1, timeArray[2]);
            endTime.setHours(0, 0, 0, 0);
            diff = endTime - nowTime;
            if (diff < 0) {
                hu$(".error").innerHTML = "请输入一个未来的时间点";
            } else {
                for (var i = 0; i < len; i++) {
                    timeArray[i] = Number(timeArray[i]);
                }
                if (timeArray[1] < 1 || timeArray[1] > 12) {
                    monthTrue = true;
                }
                if (timeArray[2] < 1 || timeArray[2] > 31) {
                    dayTrue = true;
                }
                if (monthTrue && dayTrue) {
                    hu$(".error").innerHTML = "您的月份和天数输入有误";
                } else if (monthTrue) {
                    hu$(".error").innerHTML = "您的月份输入有误";
                } else if (dayTrue) {
                    hu$(".error").innerHTML = "您的天数输入有误";
                } else {
                    run();
                    timer = setInterval(run, 1000);
                }
            }
        }
        function run() {
            nowTime = new Date();
            diff = endTime - nowTime;
            if (diff == 0) {
                clearInterval(timer);
            } else {
                p_diffDay = diff / (24 * 60 * 60 * 1000);
                diffDay = Math.floor(p_diffDay);
                p_diffHour = (p_diffDay - diffDay) * 24;
                diffHour = Math.floor(p_diffHour);
                p_diffMin = (p_diffHour - diffHour) * 60;
                diffMin = Math.floor(p_diffMin);
                p_diffSec = (p_diffMin - diffMin) * 60;
                diffSec = Math.floor(p_diffSec);
                hu$(".time").innerHTML = '距离' + timeArray[0] + '年' + timeArray[1] + '月' + timeArray[2] + '日还有' + diffDay + '天' + diffHour + '小时' + diffMin + '分' + diffSec + '秒';
            }
        }
    }
    function reset() {
        clearInterval(timer);
        hu$(".error").innerHTML = "";
        hu$(".time").innerHTML = "";
    }
    hu$("#submit").onclick = function () {
        showTime();
    };
    hu$("#reset").onclick = function () {
        reset();
    };
};
