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
            len = array.length,
            timer = null;
        timer = setInterval(run, 30);
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
            } else {
                clearInterval(timer);
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

    function startMoveTimeVersion(obj, json, duringTime, type, sonType, callBack) {
        var iCur = {},
            result,
            t,
            startTime = getCurrentTime(),
            finishTime;
        function css(obj, attribute) {
            if (obj.currentStyle) {//只有IE支持currentStyle，先判断是否是IE浏览器。IE8及以下不认opacity，IE9及以上、FF和Chrome可以使用opacity。filter: alpha(opacity=30)属性IE10及以上、FF和Chrome都不认识。IE9及以下支持
                return obj.currentStyle[attribute];//是IE浏览器则返回当前元素的对应属性的值
            } else {
                return getComputedStyle(obj, false)[attribute];//IE9及以上或者非IE浏览器例如FF和Chrome支持getComputedStyle
            }
        }
        function getCurrentTime() {
            return (new Date()).getTime();
        }
        for (var attribute in json) {
            if (json.hasOwnProperty(attribute)) {
                if (attribute == "opacity") {
                    iCur[attribute] = Math.round(css(obj, attribute) * 100);//Chrome低版本取不到准确的0.3，于是需要四舍五入
                } else {
                    iCur[attribute] = parseInt(css(obj, attribute));//其他属性提取出来会有px，去掉px，只取出数值
                }
            }
        }
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            finishTime = getCurrentTime();
            t = duringTime - Math.max(0, (startTime - finishTime) + duringTime);
            for (var attr in json) {
                if (json.hasOwnProperty(attr)) {
                    if (attr == "opacity") {
                        result = Tween[type][sonType](t, iCur[attr], json[attr] * 100 - iCur[attr], duringTime);
                        obj.style.opacity = result / 100;
                        obj.style.filter = "alpha(opacity=" + result + ")";
                    } else {
                        result = Tween[type][sonType](t, iCur[attr], json[attr] - iCur[attr], duringTime);
                        obj.style[attr] = result + "%";
                    }
                }
            }
            if (t == duringTime) {
                clearInterval(obj.timer);
                callBack && callBack.call(obj);
            }
        }, 13);
        var Tween = {
            Linear: function(t,b,c,d){ return c*t/d + b; },
            Quad: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t + b;
                },
                easeOut: function(t,b,c,d){
                    return -c *(t/=d)*(t-2) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                }
            },
            Cubic: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return c*((t=t/d-1)*t*t + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                }
            },
            Quart: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                }
            },
            Quint: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                }
            },
            Sine: {
                easeIn: function(t,b,c,d){
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },
                easeOut: function(t,b,c,d){
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },
                easeInOut: function(t,b,c,d){
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                }
            },
            Expo: {
                easeIn: function(t,b,c,d){
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },
                easeOut: function(t,b,c,d){
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                }
            },
            Circ: {
                easeIn: function(t,b,c,d){
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },
                easeOut: function(t,b,c,d){
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                }
            },
            Elastic: {
                easeIn: function(t,b,c,d,a,p){
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                easeOut: function(t,b,c,d,a,p){
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
                },
                easeInOut: function(t,b,c,d,a,p){
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                }
            },
            Back: {
                easeIn: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                easeOut: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                easeInOut: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                }
            },
            Bounce: {
                easeIn: function(t,b,c,d){
                    return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
                },
                easeOut: function(t,b,c,d){
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                    }
                },
                easeInOut: function(t,b,c,d){
                    if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
                    else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
                }
            }
        };
    }

};
