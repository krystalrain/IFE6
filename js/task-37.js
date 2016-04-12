(function (window, undefined) {
    function Popup(para) {
        return new Popup.prototype.init(para);
    }
    Popup.prototype = {
        addEvent: function (element, event, listener) {
            if (element.addEventListener) { //标准
                element.addEventListener(event, listener, false);
            } else if (element.attachEvent) { //低版本ie
                element.attachEvent("on" + event, listener);
            } else { //都不行的情况
                element["on" + event] = listener;
            }
        },
        removeEvent: function (element, event, listener) {
            if (element.removeEventListener) { //标准
                element.removeEventListener(event, listener, false);
            } else if (element.detachEvent) { //低版本ie
                element.detachEvent("on" + event, listener);
            } else { //都不行的情况
                element["on" + event] = null;
            }
        },
        init: function (para) {
            this.container = para.wrap;
            this.wrap = this.container.querySelector(".pop-wrap");
            //设置弹出层的宽和高
            this.wrap.style.width = para.width + "px";
            this.wrap.style.height = para.height + "px";
            this.header = this.container.querySelector(".pop-header");
            this.header.querySelector("h3").innerHTML = para.title;//给标题区添加内容
            this.container.querySelector(".pop-content").querySelector("p").innerHTML = para.content;//给内容区添加内容
            this.type = para.type;
            this.container.className += " " + this.type;//设置提示框类型
            this.status = false;
            this.allowPageWheel = para.pageWheel;//能否滚动的标志
            //给确认和取消按钮添加回调事件
            var that = this,
                confirm = this.container.querySelector(".confirm"),//这里注意，如果每次点击按钮都新创建一个对象的话，那么这里的事件会重复绑定，导致alert多次
                cancel = this.container.querySelector(".cancel");
            this.addEvent(confirm, "click", function () {
                para.confirm();
                that.hide();
            });
            this.addEvent(cancel, "click", function () {
                para.cancel();
                that.hide();
            });
            //给遮盖层添加点击事件
            this.addEvent(this.container, "click", function (event) {
                event = event || window.event;
                if (event.target.className === that.container.className) { //判断event.target是不是遮盖层
                    that.hide();
                }
            });
            //看是否能拖拽
            if (para.drag) {
                this.drag();
            }
            return this;
        },
        drag: function () {
            var that = this.wrap;
            this.header.style.cursor = "move";
            this.addEvent(this.header, "mousedown", function (event) {
                var disY,
                    disX;
                event = event || window.event;
                disX = event.clientX - (that.offsetLeft + that.offsetWidth / 2);
                disY = event.clientY - (that.offsetTop + that.offsetHeight / 2);
                document.onmousemove = function (event) {
                    event = event || window.event;
                    var tempX = event.clientX - disX,
                        tempY = event.clientY - disY;
                    //拖拽时不能超过视窗边界
                    if (tempX > document.documentElement.offsetWidth - that.offsetWidth + that.offsetWidth / 2) {
                        tempX = document.documentElement.offsetWidth - that.offsetWidth + that.offsetWidth / 2;
                    } else if (tempX < that.offsetWidth / 2) {
                        tempX = that.offsetWidth / 2;
                    }
                    if (tempY > document.documentElement.offsetHeight - that.offsetHeight + that.offsetHeight / 2) {
                        tempY = document.documentElement.offsetHeight - that.offsetHeight + that.offsetHeight / 2;
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
        stopScroll: function (event) {
            event = event || window.event;
            event.preventDefault();
        },
        pageWheel: function () {
            this.addEvent(window, "mousewheel", this.stopScroll);
            this.addEvent(window, "DOMMouseScroll", this.stopScroll);//兼容FF
        },
        show: function () {
            this.container.className += " show";
            this.status = true;
            this.wrap.style.marginLeft = -(this.wrap.clientWidth / 2) + "px";
            this.wrap.style.marginTop = -(this.wrap.clientHeight / 2) + "px";
            if (!this.allowPageWheel) {
                this.pageWheel();
            }
            return this;
        },
        hide: function () {
            this.container.className = this.container.className.replace(/show/g, "").trim();
            this.wrap.style.cssText = "";
            this.status = false;
            if (!this.allowPageWheel) {
                this.removeEvent(window, "mousewheel", this.stopScroll);
                this.removeEvent(window, "DOMMouseScroll", this.stopScroll);//兼容FF
            }
            return this;
        },
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

