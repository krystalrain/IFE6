(function (window, undefined) {
    function Popup(para) {
        return new Popup.prototype.init(para);
    }
    Popup.prototype = {
        /**
         * 添加事件
         * @param element
         * @param event
         * @param listener
         */
        addEvent: function (element, event, listener) {
            if (element.addEventListener) { //标准
                element.addEventListener(event, listener, false);
            } else if (element.attachEvent) { //低版本ie
                element.attachEvent("on" + event, listener);
            } else { //都不行的情况
                element["on" + event] = listener;
            }
        },
        /**
         * 移除事件
         * @param element
         * @param event
         * @param listener
         */
        removeEvent: function (element, event, listener) {
            if (element.removeEventListener) { //标准
                element.removeEventListener(event, listener, false);
            } else if (element.detachEvent) { //低版本ie
                element.detachEvent("on" + event, listener);
            } else { //都不行的情况
                element["on" + event] = null;
            }
        },
        /**
         * 创建弹出层
         */
        createPopup: function (para) {
            var body = document.getElementsByTagName("body")[0];
            var section = document.createElement("section");
            section.className = "pop-wrap";
            var header = document.createElement("header");
            header.className = "pop-header";
            var h3 = document.createElement("h3");
            header.appendChild(h3);
            var article = document.createElement("article");
            article.className = "pop-content";
            var p = document.createElement("p");
            article.appendChild(p);
            var footer = document.createElement("footer");
            footer.className = "pop-control";
            var input = document.createElement("input");
            input.type = "button";
            input.className = "confirm";
            input.value = "确认";
            footer.appendChild(input);
            input = document.createElement("input");
            input.type = "button";
            input.className = "cancel";
            input.value = "取消";
            footer.appendChild(input);
            section.appendChild(header);
            section.appendChild(article);
            section.appendChild(footer);
            var cover = document.createElement("section");
            cover.className = "pop-up";
            cover.appendChild(section);
            body.appendChild(cover);
        },
        /**
         * 初始化
         * @param para
         * @returns {Popup}
         */
        init: function (para) {
            this.createPopup(para);
            this.cover = document.querySelector(".pop-up");
            this.wrap = this.cover.querySelector(".pop-wrap");
            //设置弹出层的宽和高
            this.width = para.width;
            this.height = para.height;
            this.wrap.style.width = para.width + "px";
            this.wrap.style.height = para.height + "px";
            //设置边距的时候不能直接offsetWidth或offsetWidth，会导致结果为0
            this.wrap.style.marginLeft = -parseInt(this.getCss(this.wrap, "width")) / 2 + "px";
            this.wrap.style.marginTop = -parseInt(this.getCss(this.wrap, "height")) / 2 + "px";
            //给标题区添加内容
            this.header = this.cover.querySelector(".pop-header");
            this.header.querySelector("h3").innerHTML = para.title;
            //给内容区添加内容
            this.cover.querySelector(".pop-content").querySelector("p").innerHTML = para.content;
            //设置提示框类型
            this.type = para.type;
            this.cover.className += " " + this.type;
            //设置状态
            this.status = false;
            //设置页面滚动标志
            this.allowPageWheel = para.allowPageWheel;
            //设置页面拖拽标志
            this.allowDrag = para.allowDrag;
            //给确认和取消按钮添加回调事件
            var that = this,
                confirm = this.cover.querySelector(".confirm"),//这里注意，如果每次点击按钮都新创建一个对象的话，那么这里的事件会重复绑定，导致alert多次
                cancel = this.cover.querySelector(".cancel");
            this.addEvent(confirm, "click", function () {
                para.confirm();
                that.hide();
            });
            this.addEvent(cancel, "click", function () {
                para.cancel();
                that.hide();
            });
            //给遮盖层添加点击事件
            this.addEvent(this.cover, "click", function (event) {
                event = event || window.event;
                if (event.target.className === that.cover.className) { //判断event.target是不是遮盖层
                    that.hide();
                }
            });
            //是否允许拖拽
            if (this.allowDrag) {
                this.drag();
            }
            return this;
        },
        /**
         * 获取样式
         * @param obj
         * @param attribute
         * @returns {*}
         */
        getCss: function (obj, attribute) {
            if (obj.currentStyle) {//只有IE支持currentStyle，先判断是否是IE浏览器。IE8及以下不认opacity，IE9及以上、FF和Chrome可以使用opacity。filter: alpha(opacity=30)属性IE10及以上、FF和Chrome都不认识。IE9及以下支持
                return obj.currentStyle[attribute];//是IE浏览器则返回当前元素的对应属性的值
            } else {
                return getComputedStyle(obj, false)[attribute];//IE9及以上或者非IE浏览器例如FF和Chrome支持getComputedStyle
            }
        },
        /**
         * 拖拽功能
         */
        drag: function () {
            var that = this.wrap;
            var self = this;
            this.header.style.cursor = "move";
            this.addEvent(this.header, "mousedown", function (event) {
                var disY,
                    disX;
                event = event || window.event;
                disX = event.clientX - parseInt(self.getCss(that, "left"));
                disY = event.clientY - parseInt(self.getCss(that, "top"));
                document.onmousemove = function (event) {
                    event = event || window.event;
                    var tempX = event.clientX - disX,
                        tempY = event.clientY - disY;
                    //拖拽时不能超过视窗边界
                    if (tempX > document.documentElement.offsetWidth - that.offsetWidth / 2) {
                        tempX = document.documentElement.offsetWidth - that.offsetWidth / 2;
                    } else if (tempX < that.offsetWidth / 2) {
                        tempX = that.offsetWidth / 2;
                    }
                    if (tempY > document.documentElement.offsetHeight - that.offsetHeight / 2) {
                        tempY = document.documentElement.offsetHeight - that.offsetHeight / 2;
                    } else if (tempY < that.offsetHeight / 2) {
                        tempY = that.offsetHeight / 2;
                    }
                    that.style.left = tempX + "px";
                    that.style.top = tempY + "px";
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
                return false;
            });
        },
        /**
         * 阻止页面滚动回调事件
         * @param event
         */
        stopScroll: function (event) {
            event = event || window.event;
            event.preventDefault();
        },
        /**
         * 阻止页面滚动
         */
        stopPageWheel: function () {
            this.addEvent(window, "mousewheel", this.stopScroll);
            this.addEvent(window, "DOMMouseScroll", this.stopScroll);//兼容FF
        },
        /**
         * 移除阻止页面滚动
         */
        removeStopPageWheel : function () {
            this.removeEvent(window, "mousewheel", this.stopScroll);
            this.removeEvent(window, "DOMMouseScroll", this.stopScroll);//兼容FF
        },
        /**
         * 显示弹出层
         * @returns {Popup}
         */
        show: function () {
            this.cover.className += " show";
            this.status = true;
            //是否允许页面滚动，在弹出层显示的时候才运行
            if (!this.allowPageWheel) {
                this.stopPageWheel();
            }
            return this;
        },
        /**
         * 隐藏弹出层
         * @returns {Popup}
         */
        hide: function () {
            this.cover.className = this.cover.className.replace(/show/g, "").trim();
            this.status = false;
            //弹出层消失后移除阻止页面滚动事件
            if (!this.allowPageWheel) {
                this.removeStopPageWheel();
            }
            return this;
        },
        /**
         * 触发
         * @returns {Popup}
         */
        toggle: function () {
            if (this.status) {
                this.hide();
            } else {
                this.show();
            }
            return this;
        }
    };
    Popup.prototype.init.prototype = Popup.prototype;//让init的实例能够通过原型链访问Popup.prototype
    window.Popup = Popup;//导出接口
})(window, undefined);

