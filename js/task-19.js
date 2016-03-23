window.onload = function () {
    function $(id) {
        return document.getElementById(id);
    }
    var text = $("text");
    var leftIn = $("left-in");
    var leftOut = $("left-out");
    var rightIn = $("right-in");
    var rightOut = $("right-out");
    var display = $("display");
    var arrLi = display.getElementsByTagName("li");
    var sort = $("sort");
    var reset = $("reset");
    var random = $("random");
    var num = [];
    var count = 0;
    var complete = false;

    function addEvent(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }

    addEvent(leftIn, "click", function () {
        if (text.value !== "") {
            if (!/^\d+$/.test(text.value) || parseInt(text.value) < 10 || parseInt(text.value) > 100) {
                alert("请输入10-100以内的数字！");
                text.value = "";
            } else {
                if (count < 60) {
                    num.unshift(parseInt(text.value));
                    var li = document.createElement("li");
                    li.style.height = parseInt(text.value) + "%";
                    li.innerHTML = text.value;
                    count++;
                    display.insertBefore(li, display.firstChild);
                } else {
                    alert("输入数据太多啦！不能超过60个！")
                }
            }
        } else {
            alert("输入不能为空！");
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
        if (text.value !== "") {
            if (!/^\d+$/.test(text.value) || parseInt(text.value) < 10 || parseInt(text.value) > 100) {
                alert("请输入10-100以内的数字！");
                text.value = "";
            } else {
                if (count < 60) {
                    num.push(parseInt(text.value));
                    var li = document.createElement("li");
                    li.style.height = parseInt(text.value) + "%";
                    li.innerHTML = text.value;
                    count++;
                    display.appendChild(li);
                } else {
                    alert("输入数据太多啦！不能超过60个！")
                }
            }
        } else {
            alert("输入不能为空！");
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

    addEvent(random, "click", function () {
        randomQueue();
    });

    addEvent(reset, "click", function () {
        text.value = "";
        num = [];
        display.innerHTML = "";
        complete = false;
    });

    addEvent(sort, "click", function () {
        if (!complete) {
            if (arrLi[0]) {
                startBubbleSort(num);
                complete = true;
            } else {
                alert("通过左侧入或者右侧入输入一些要排序的数据！");
            }
        } else {
            alert("请点击重置数据按钮才能开始新的排序！");
        }
    });

    function flashDOM(array) {
        var html = "";
        for (var i = 0; i < array.length; i++) {
            html += "<li style='height: " + array[i] + "%;'><p>" + array[i] + "</p></li>";
        }
        display.innerHTML = html;
    }

    function startBubbleSort(array) {
        var i = 0,
            j = 1,
            temp,
            len = array.length;
        run();
        function run() {
            if (i < len) {
                if (j < len) {
                    if (array[i] > array[j]) {
                        temp = array[i];
                        array[i] = array[j];
                        array[j] = temp;
                        arrLi[i].style.height = array[i] + "%";
                        arrLi[i].innerHTML = "<p>" + array[i] + "</p>";
                        arrLi[j].style.height = array[j] + "%";
                        arrLi[j].innerHTML = "<p>" + array[j] + "</p>";
                    }
                    j++;
                } else {
                    i++;
                    j = i + 1;
                }
                setTimeout(run, 60);
            } else {
                return;
            }
        }
    }

    function randomQueue() {
        num= [];
        for(var i = 0; i < 60; i++) {
            num.push(parseInt(Math.random() * 91) + 10);
        }
        count = 60;
        flashDOM(num);
    }

};
