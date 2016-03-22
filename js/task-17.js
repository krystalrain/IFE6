window.onload = function () {
    var radio = document.getElementsByName("gra-time");
    var timeSelect = document.getElementById("form-gra-time");
    var citySlect = document.getElementById("city-select");
    var wrap = document.getElementsByClassName("aqi-chart-wrap")[0];
    var text = document.getElementById("text");

    function addEvent(element, event, listener) {
        if (element.addEventListener) { //标准
            element.addEventListener(event, listener, false);
        } else if (element.attachEvent) { //低版本ie
            element.attachEvent("on" + event, listener);
        } else { //都不行的情况
            element["on" + event] = listener;
        }
    }
    /* 数据格式演示
     var aqiSourceData = {
     "北京": {
     "2016-01-01": 10,
     "2016-01-02": 10,
     "2016-01-03": 10,
     "2016-01-04": 10
     }
     };
     */

// 以下两个函数用于随机模拟生成测试数据
    function getDateStr(dat) {
        var y = dat.getFullYear();
        var m = dat.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = dat.getDate();
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
    }
    function randomBuildData(seed) {
        var returnData = {};
        var dat = new Date("2016-01-01");
        var datStr = ''
        for (var i = 1; i < 92; i++) {
            datStr = getDateStr(dat);
            returnData[datStr] = Math.ceil(Math.random() * seed);
            dat.setDate(dat.getDate() + 1);
        }
        return returnData;
    }

    var aqiSourceData = {
        "北京": randomBuildData(500),
        "上海": randomBuildData(300),
        "广州": randomBuildData(200),
        "深圳": randomBuildData(100),
        "成都": randomBuildData(300),
        "西安": randomBuildData(500),
        "福州": randomBuildData(100),
        "厦门": randomBuildData(100),
        "沈阳": randomBuildData(500)
    };
// 用于渲染图表的数据
    var chartData = {};

// 记录当前页面的表单选项
    var pageState = {
        nowSelectCity: 0,
        nowGraTime: "day"
    }

    /**
     * 渲染图表
     */
    function renderChart() {
        wrap.innerHTML = "";
        text.innerHTML = "";
        var temp = null;
        var result = null;
        var pointer = 0;
        var weekTotal = 0;
        var i = 0;
        result = {
            "01": {day: 0, total: 0},
            "02": {day: 0, total: 0},
            "03": {day: 0, total: 0},
            "04": {day: 0, total: 0},
            "05": {day: 0, total: 0},
            "06": {day: 0, total: 0},
            "07": {day: 0, total: 0},
            "08": {day: 0, total: 0},
            "09": {day: 0, total: 0},
            "10": {day: 0, total: 0},
            "11": {day: 0, total: 0},
            "12": {day: 0, total: 0},
        };
        for (var attr in chartData) {//获取每个月的总天数和总污染指数
            if (chartData.hasOwnProperty(attr)) {
                temp = attr.split("-");
                result[temp[1]].total += chartData[attr];
                result[temp[1]].day += 1;
            }
        }
        for (attr in result) {//获取每个月的周数和每一周的天数
            if (result.hasOwnProperty(attr)) {
                var weekNum = result[attr].day / 7;
                var leave = result[attr].day % 7;
                temp = {};
                for (i = 1; i <= weekNum; i++) {
                    temp["0" + i] = {
                        day: 7
                    };
                }
                if (leave !== 0) {
                    temp["0" + i] = {
                        day: leave
                    };
                }
            }
            result[attr].week = temp;
        }
        temp = [];
        for (attr in chartData) {
            if (chartData.hasOwnProperty(attr)) {
                temp.push(chartData[attr]);
            }
        }
        for (attr in result) {//获取每一周的总污染指数
            if (result.hasOwnProperty(attr)) {
                for (var currentWeek in result[attr].week) {
                    if (result[attr].week.hasOwnProperty(currentWeek)) {
                        for (i = pointer; i < pointer + result[attr].week[currentWeek].day; i++) {
                            weekTotal += temp[i];
                        }
                        pointer = i;
                        result[attr].week[currentWeek].total = weekTotal;
                        weekTotal = 0;
                    }
                }
            }
        }
        function toChinese(text) {
            if (text === "day") {
                return "天";
            } else if (text === "week") {
                return "周";
            } else {
                return "月";
            }
        }
        text.innerHTML = "当前城市：" + citySlect.options[pageState.nowSelectCity].text + " 查询时间粒度：" + toChinese(pageState.nowGraTime);

        if (pageState.nowGraTime === "day") {
            for (var attr in chartData) {
                if (chartData.hasOwnProperty(attr)) {
                    var div = document.createElement("div");
                    div.style.width = "1%";
                    div.style.height = chartData[attr] + "px";
                    div.style.backgroundColor = "#" + randomColor();
                    div.title = "当前城市：" + citySlect.options[pageState.nowSelectCity].text + "，时间：" + attr + "，空气污染指数：" + chartData[attr];
                    wrap.appendChild(div);
                }
            }
        } else if (pageState.nowGraTime === "week") {
            for (attr in result) {
                if (result.hasOwnProperty(attr)) {
                    if (result[attr].day !== 0) {
                        for (currentWeek in result[attr].week) {
                            if (result[attr].week.hasOwnProperty(currentWeek)) {
                                var div = document.createElement("div");
                                div.style.width = "6%";
                                div.style.height = result[attr].week[currentWeek].total / result[attr].week[currentWeek].day + "px";
                                div.style.backgroundColor = "#" + randomColor();
                                div.title = "当前城市：" + citySlect.options[pageState.nowSelectCity].text + "，时间：" + parseInt(attr) + "月第" + parseInt(currentWeek) + "周" + "，空气平均污染指数：" + result[attr].week[currentWeek].total / result[attr].week[currentWeek].day;
                                wrap.appendChild(div);
                            }
                        }
                    }
                }
            }
        } else {
            for (attr in result) {
                if (result.hasOwnProperty(attr)) {
                    if (result[attr].day !== 0) {
                        var div = document.createElement("div");
                        div.style.width = "30%";
                        div.style.height = result[attr].total / result[attr].day + "px";
                        div.style.backgroundColor = "#" + randomColor();
                        div.title = "当前城市：" + citySlect.options[pageState.nowSelectCity].text + "，时间：" + parseInt(attr) + "月" + "，空气平均污染指数：" + result[attr].total / result[attr].day;
                        wrap.appendChild(div);
                    }
                }
            }
        }
    }
    /**
     * 生成随机16进制颜色
     */
    function randomColor() {
        var rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
        if (rand.length === 6) {
            return rand;
        } else {
            return randomColor();
        }
    }
    /**
     * 日、周、月的radio事件点击时的处理函数
     */
    function graTimeChange() {
        var current = selectRadio();
        if (current !== pageState.nowGraTime) {
            pageState.nowGraTime = current;
            renderChart();
        }
    }
    function selectRadio() {//获取单选框当前所选择的值
        for (i = 0, len = radio.length; i < len; i++) {
            if (radio[i].checked) {
                return radio[i].value;
            }
        }
    }
    /**
     * select发生变化时的处理函数
     */
    function citySelectChange() {
        var current = citySlect.selectedIndex;
        if (current !== pageState.nowSelectCity) {
            chartData = aqiSourceData[citySlect.options[current].text];
            pageState.nowSelectCity = current;
            chartData = aqiSourceData[citySlect.options[pageState.nowSelectCity].text];//当城市改变的时候才重新获取数据
            renderChart();
        }
    }
    /**
     * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
     */
    function initGraTimeForm() {
        addEvent(timeSelect, "click", graTimeChange);
    }
    /**
     * 初始化城市Select下拉选择框中的选项
     */
    function initCitySelector() {
        addEvent(citySlect, "change", citySelectChange);
    }
    /**
     * 初始化图表需要的数据格式
     */
    function initAqiChartData() {
        chartData = aqiSourceData[citySlect.options[pageState.nowSelectCity].text];
        renderChart();
    }
    /**
     * 初始化函数
     */
    function init() {
        initGraTimeForm()
        initCitySelector();
        initAqiChartData();
    }
    init();
};