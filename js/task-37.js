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
        preventDefault: function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
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
            var a = document.createElement("a");
            a.className = "close";
            a.innerHTML = "X";
            a.href = "javascript:;";
            header.appendChild(a);
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
            /**
             * 如果允许缩放
             */
            if (para.allowResize) {
                var div = document.createElement("div");
                div.className = "resizeL";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeT";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeR";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeB";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeLT";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeTR";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeBR";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeLB";
                section.appendChild(div);
            }
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
            this.close = this.cover.querySelector(".close");
            //设置弹出层的宽和高
            this.wrap.width = para.width;
            this.wrap.height = para.height;
            this.wrap.style.width = para.width + "px";
            this.wrap.style.height = para.height + "px";
            //设置边距的时候不能直接offsetWidth或offsetHeight，会导致结果为0，因为此时弹出层没有显示出来，offsetWidth或offsetHeight是计算值，结果为0
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
            //设置弹出层拖拽标志
            this.allowDrag = para.allowDrag;
            //设置弹出层缩放标志
            this.allowResize = para.allowResize;
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
            //给关闭按钮添加点击事件
            this.addEvent(this.close, "click", function (event) {
                event = event || window.event;
                that.hide();
            });
            //是否允许拖拽
            if (this.allowDrag) {
                this.drag();
            }
            if (this.allowResize) {
               this.popupResize();
            }
            return this;
        },
        /**
         * 弹出层缩放
         */
        popupResize: function () {
            var oL = document.getElementsByClassName("resizeL")[0];
            var oT = document.getElementsByClassName("resizeT")[0];
            var oR = document.getElementsByClassName("resizeR")[0];
            var oB = document.getElementsByClassName("resizeB")[0];
            var oLT = document.getElementsByClassName("resizeLT")[0];
            var oTR = document.getElementsByClassName("resizeTR")[0];
            var oBR = document.getElementsByClassName("resizeBR")[0];
            var oLB = document.getElementsByClassName("resizeLB")[0];
            //四角
            this.resize(this.wrap, oLT, true, true, false, false);
            this.resize(this.wrap, oTR, false, true, false, false);
            this.resize(this.wrap, oBR, false, false, false, false);
            this.resize(this.wrap, oLB, true, false, false, false);
            //四边
            this.resize(this.wrap, oL, true, false, false, true);
            this.resize(this.wrap, oT, false, true, true, false);
            this.resize(this.wrap, oR, false, false, false, true);
            this.resize(this.wrap, oB, false, false, true, false);
        },
        resize: function (oParent, handle, isLeft, isTop, lockX, lockY) {
            var that = this;
            this.addEvent(handle, "mousedown", function (event) {
                event = event || window.event;
                var disX = event.clientX - handle.offsetLeft;//初始X
                var disY = event.clientY - handle.offsetTop;//初始Y
                var iParentTop = oParent.offsetTop;//浮出层相对于父容器的上边距
                var iParentLeft = oParent.offsetLeft;//浮出层相对于父容器的左边距
                var iParentWidth = oParent.offsetWidth;//浮出层的宽度
                var iParentHeight = oParent.offsetHeight;//浮出层的高度
                document.onmousemove = function (event) {
                    event = event || window.event;
                    var iL = event.clientX - disX;
                    var iT = event.clientY - disY;
                    var maxW = document.documentElement.clientWidth - oParent.offsetLeft - 2;//设置最大宽度
                    var maxH = document.documentElement.clientHeight - oParent.offsetTop - 2;//设置最大高度
                    var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;//判断是否是可以左右伸缩
                    var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;//判断是否可以上下伸缩
                    var dragMinWidth = that.wrap.width;//将弹出层的宽度设置为缩放最小宽度
                    var dragMinHeight = that.wrap.height;//将弹出层的高度设置为缩放最小高度
                    isLeft && (oParent.style.left = iParentLeft + iL + that.wrap.width / 2 + "px");
                    isTop && (oParent.style.top = iParentTop + iT + that.wrap.height / 2 + "px");
                    iW < dragMinWidth && (iW = dragMinWidth);//判断最小宽度
                    iW > maxW && (iW = maxW);
                    lockX || (oParent.style.width = iW + "px");
                    iH < dragMinHeight && (iH = dragMinHeight);//判断最小高度
                    iH > maxH && (iH = maxH);
                    lockY || (oParent.style.height = iH + "px");
                    if((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) document.onmousemove = null;
                    return false;
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
                return false;
            });
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
            var that = this;
            this.header.style.cursor = "move";
            this.addEvent(this.header, "mousedown", function (event) {
                event = event || window.event;
                var disY,
                    disX;
                disX = event.clientX - that.wrap.offsetLeft;
                disY = event.clientY - that.wrap.offsetTop;
                document.onmousemove = function (event) {
                    event = event || window.event;
                    var tempX = event.clientX - disX + that.wrap.width / 2,
                        tempY = event.clientY - disY + that.wrap.height / 2;
                    //拖拽时不能超过视窗边界
                    if (tempX > document.documentElement.offsetWidth - that.wrap.offsetWidth + that.wrap.width / 2) {
                        tempX = document.documentElement.offsetWidth - that.wrap.offsetWidth + that.wrap.width / 2;
                    } else if (tempX < that.wrap.width / 2) {
                        tempX = that.wrap.width / 2;
                    }
                    if (tempY > document.documentElement.offsetHeight - that.wrap.offsetHeight + that.wrap.height / 2) {
                        tempY = document.documentElement.offsetHeight - that.wrap.offsetHeight + that.wrap.height / 2;
                    } else if (tempY < that.wrap.height / 2) {
                        tempY = that.wrap.height / 2;
                    }
                    that.wrap.style.left = tempX + "px";
                    that.wrap.style.top = tempY + "px";
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
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

