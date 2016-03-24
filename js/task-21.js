window.onload = function () {
    function $(id) {
        return document.getElementById(id);
    }
    function addEvent(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
    function delegateEvent(element, tag, eventName, listener) {
        addEvent(element, eventName, function () {
            var event = arguments[0] || window.event,
                target = event.target || event.srcElement;
            if (target && target.tagName === tag.toUpperCase()) {
                listener.call(target, event);
            }
        });
    }
    var tag = $("tagInput");
    var display = $("display");
    var arrLi = display.getElementsByTagName("li");
    var text = $("text");
    var reset = $("reset-left");
    var resetRight = $("reset-right");
    var hobby = $("hobby");
    var hobbyList = $("hobby-display");
    var hobbyLi = hobbyList.getElementsByTagName("li");
    var num = [];
    var hobbyNum = [];


    function getEvent(ev) {
        return ev ? ev : window.event;
    }
    function trim(str) {
        return str.replace(/^[\s\u00a0\u002c]+|[\s\u00a0\u002c]+&/g, "");
    }
    addEvent(reset, "click", function () {
        tag.value = "";
        display.innerHTML = "";
        num = [];
    });
    /*
     *全角逗号不知道该怎么判断
     */
    addEvent(tag, "keydown", function (ev) {
        var li = null;
        ev = getEvent(ev);
        if (ev.keyCode === 13 || ev.keyCode === 32 || ev.keyCode === 188) {//FF对于全角逗号无法获得keyCode值，Chrome和IE下是229，如果连续按两个全角逗号，第一个无法识别，会认为当前字符串长度为0
            if (tag.value.length !== 0) {
                if (arrLi.length >= 10) {
                    num.shift();
                    display.removeChild(display.firstChild);
                }
                li = document.createElement("li");
                li.innerHTML = trim(tag.value.substring(0, tag.value.length));
                num.push(trim(tag.value.substring(0, tag.value.length)));
                display.appendChild(li);
                tag.value = "";
            }
        }
    });
    /*
     *使用事件代理，当鼠标移入、移出和点击事件在ul上发生时，调用相应的事件处理函数
     */
    delegateEvent(display, "li", "mouseover", mouseOverTag);
    delegateEvent(display, "li", "click", removeTag);
    delegateEvent(display, "li", "mouseout", mouseOutTag);
    function mouseOverTag() {
        this.source = this.innerHTML;
        this.innerHTML = "点击删除" + this.innerHTML;
        this.style.background = "red";
        this.style.color = "white";
        this.style.cursor = "pointer";
    }
    function mouseOutTag() {
        this.innerHTML = this.source;
        this.style.background = "aqua";
        this.style.color = "black";
    }
    function removeTag() {
        for (var i = 0, len = arrLi.length; i < len; i++) {
            arrLi[i].index = i;
        }
        display.removeChild(display.childNodes[parseInt(this.index)]);
        num.splice(parseInt(this.index), 1);
    }

    function getResult(str) {
        return str.replace(/[^\d\u4e00-\u9fa5a-zA-Z]+/g, " ").split(" ");
    }
    addEvent(hobby, "click", function () {
        if (text.value !== "") {
            var result = getResult(text.value);
            for (var i = 0; i < result.length; i++) {
                if (hobbyLi.length >= 10) {
                    hobbyNum.shift();
                    hobbyList.removeChild(hobbyList.firstChild);
                }
                hobbyNum.push(trim(result[i]));
                li = document.createElement("li");
                li.innerHTML = trim(result[i]);
                hobbyList.appendChild(li);
            }
        } else {
            alert("输入不能为空！");
        }
    });
    addEvent(resetRight, "click", function () {
        text.value = "";
        hobbyList.innerHTML = "";
        hobbyNum = [];
    });
};