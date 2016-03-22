window.onload = function () {
    var text = document.getElementById("text");
    var leftIn = document.getElementById("left-in");
    var leftOut = document.getElementById("left-out");
    var rightIn = document.getElementById("right-in");
    var rightOut = document.getElementById("right-out");
    var display = document.getElementById("display");
    var arrLi = display.getElementsByTagName("li");
    var sort = document.getElementById("sort");
    var num = [];
    var result = [];
    var count = 0;
    var isCompleted = false;
    function addEvent(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
    function isLegal() {
        if (text.value !== "") {
            var temp = parseInt(text.value);
            if (temp < 10 || temp > 100) {
                alert("请输入10-100以内的数字！");
                text.value = "";
                return false;
            }
            return true;
        }
        alert("输入不能为空！");
        return false;
    }
    addEvent(leftIn, "click", function () {
        if (isLegal() && count <= 60) {
            num.unshift(parseInt(text.value));
            var li = document.createElement("li");
            li.style.height = parseInt(text.value) * 3 + "px";
            li.style.lineHeight = parseInt(text.value) * 3 + "px";
            li.innerHTML = text.value;
            count++;
            display.insertBefore(li, display.firstChild);
        }
    });
    addEvent(leftOut, "click", function () {
        if (display.firstChild !== null) {
            num.shift();
            display.removeChild(display.firstChild);
        } else {
            alert("已经空了，没有可以移除的了！");
        }
    });
    addEvent(rightIn, "click", function () {
        if (isLegal() && count <= 60) {
            num.push(parseInt(text.value));
            var li = document.createElement("li");
            li.style.height = parseInt(text.value) * 3 + "px";
            li.style.lineHeight = parseInt(text.value) * 3 + "px";
            li.innerHTML = text.value;
            count++;
            display.appendChild(li);
        }
    });
    addEvent(rightOut, "click", function () {
        if (display.lastChild !== null) {
            num.pop();
            display.removeChild(display.lastChild);
        } else {
            alert("已经空了，没有可以移除的了！");
        }
    });
    addEvent(text, "focus", function () {
        text.value = "";
    });
    addEvent(reset, "click", function () {
        text.value = "";
        result = [];
        num = [];
        display.innerHTML = "";
        isCompleted = false;
    });
    addEvent(sort, "click", function () {
        if (!isCompleted) {
            for (var i = 0, len = arrLi.length; i < len; i++) {
                arrLi[i].style.order = i;
                num[i] = [num[i], i];
            }
            mergeSort(num);
            for (i = 0; i < num.length; i++) {
                for (var j = 0; j < len; j++) {
                    if (parseInt(css(arrLi[j], "order")) === num[i][1]) {
                        result[num[i][1]] = i;
                        break;
                    }
                }
            }
            for (i = 0; i < result.length; i++) {
                arrLi[i].style.order = result[i];
            }
            isCompleted = true;
        } else {
            alert("请点击重置按钮！");
        }
    });
    function mergeSort(array) {
        var temp = null;
        for (var i = 0, len = array.length; i < len - 1; i++) {
            for (var j = i + 1; j < len; j++) {
                if (array[i][0] > array[j][0]) {
                    temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
        }
    }
    function css(obj, attribute) {
        if (obj.currentStyle) {
            return obj.currentStyle[attribute];
        } else {
            return getComputedStyle(obj, false)[attribute];
        }
    }
};