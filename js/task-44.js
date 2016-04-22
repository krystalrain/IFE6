_CalF = {
    // 选择元素
    $: function (arg, context) {
        var tagAll,
            n,
            eles = [],
            i,
            sub = arg.substring(1); // 除去第一个字符，取剩下的字符串
        context = context || document; // 上下文是否存在，不存在就使用document
        if(typeof arg === 'string'){
            switch(arg.charAt(0)){ // 取第一个字符
                case '#':
                    return document.getElementById(sub);
                    break;
                case '.':
                    if (context.getElementsByClassName) { // 如果浏览器支持getElementsByClassName方法
                        return context.getElementsByClassName(sub);
                    }
                    tagAll = _CalF.$('*', context); // 获取所有元素
                    n = tagAll.length;
                    for (i = 0; i < n; i++) { // 如果浏览器不支持getElementsByClassName方法，那么检查所有元素的className
                        if (tagAll[i].className.indexOf(sub) > -1) {
                            eles.push(tagAll[i]);
                        }
                    }
                    return eles;
                    break;
                default: // 默认是通过标签名获取元素
                    return context.getElementsByTagName(arg);
                    break;
            }
        }
    },
    // 绑定事件
    bind: function (node, type, handler) {
        if (node.addEventListener) {
            node.addEventListener(type, handler, false);
        } else if (node.attachEvent) {
            node.attachEvent('on' + type, handler);
        } else {
            node['on' + type] = handler;
        }
    },
    // 获取元素位置
    getPos: function (node) {
        var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
            scrollt = document.documentElement.scrollTop || document.body.scrollTop;
        pos = node.getBoundingClientRect();
        return {
            top: pos.top + scrollt,
            right: pos.right + scrollx,
            bottom: pos.bottom + scrollt,
            left: pos.left + scrollx
        };
    },
    // 添加样式名
    addClass: function (c, node) {
        node.className = node.className + ' ' + c;
    },
    // 移除样式名
    removeClass: function (c, node) {
        var reg = new RegExp('(^|\\s+)' + c + '(\\s+|$)','g');
        node.className = node.className.replace(reg, '');
    },
    // 阻止冒泡
    stopPropagation: function (event) {
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    },
    createXHR: function (undefined) {
        if (typeof XMLHttpRequest !== "undefined") {
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject !== "undefined") {
            if (typeof arguments.callee.activeXString !== "string") {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
                    i,
                    len;
                for (i = 0, len = versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        break;
                    } catch (ex) {

                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        } else {
            throw new Errpr("No XHR object available.");
        }
    },
    ajax: function (method, url, data, callback) {
        var xhr = new _CalF.createXHR();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    callback(xhr.responseText);
                } else {
                    alert("Request was unsuccessful: " + xhr.status);
                }
            }
        };
        if (method === "get" && data) {
            url += "?" + data;
        }
        xhr.open(method, url, true);
        if (method === "get") {
            xhr.send(null);
        } else {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(data);
        }
    }
};
(function (window, undefined) {
    function WaterfallLayout(param) {
        return new WaterfallLayout.prototype.init(param);
    }
    WaterfallLayout.prototype = {
        init: function (param) {
            this.columnNumer = param.columnNumber;
            this.id = param.id;
            this.createContainer(this.id);
            this.renderColumn(this.columnNumer);
        },
        getClientWidth: function () {
            return document.documentElement.clientWidth || document.body.clientWidth;
        },
        createContainer: function (id) {
            if (!!document.querySelector("#" + id)) {
                console.warn(id + " has already existed");
                return;
            }
            this.container = document.createElement("div");
            this.container.id = id;
            this.container.style.width = "100%";
            this.container.style.padding = "16px 8px 0";
            this.container.className = "clearFloat";
            document.querySelector("body").appendChild(this.container);
        },
        renderColumn: function (columnNumer) {
            var columnDOM = null,
                i = 0,
                that = this;
            this.columnArray = [];
            for (; i < columnNumer; i++) {
                columnDOM = document.createElement("div");
                columnDOM.className = "column";
                columnDOM.style.padding = "0 8px";
                columnDOM.style.width = this.getWidth(columnNumer) + "px";
                this.columnArray.push(columnDOM);
                this.container.appendChild(columnDOM);
            }
            _CalF.bind(window, "resize", function () {
                var len = that.columnArray.length,
                    newWidth = that.getWidth(columnNumer);
                for (i = 0; i < len; i++) {
                    that.columnArray[i].style.width = newWidth + "px";
                }
            });
            _CalF.ajax("get", "getPics.php", "cpage=1", function (data) {
                data = JSON.parse(data);
                that.addContent(data);
            });
        },
        getWidth: function (columnNumer) {
            return (this.getClientWidth() - 16) / columnNumer;
        },
        addContent: function (data) {
            for (var i = 0; i < data.length; i++) {
                var columnItem = document.createElement("div"),
                    imgOfItem = document.createElement("img"),
                    pOfItem = document.createElement("p");
                columnItem.className = "columnItem";
                imgOfItem.src = data[i].preview;
                imgOfItem.style.display = "block";
                pOfItem.innerHTML = data[i].title;
                columnItem.appendChild(imgOfItem);
                columnItem.appendChild(pOfItem);
                that.getShortestColumn(that.columnArray).appendChild(columnItem);
            }
        },
        getShortestColumn: function (columnArray) {
            var min = columnArray[0];
            for (var i = 1; i < columnArray.length; i++) {
                if (columnArray[i].offsetHeight < min.offsetHeight) {
                    min = columnArray[i];
                }
            }
            return min;
        }
    };
    WaterfallLayout.prototype.init.prototype = WaterfallLayout.prototype;
    window.WaterfallLayout = WaterfallLayout;
})(window, undefined);