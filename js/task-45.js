(function (window, undefined) {
    function Barrel() {
        return new Barrel.prototype.init();
    }
    Barrel.prototype = {
        init: function(param) {
            this.loadNumber = 50; // 一次性加载的图片数量
            this.baseUrl = "http://placehold.it/";
            this.minHeight = 200;
            this.sourceImages = [];
            this.createContainer();
            this.getImage();
            this.renderRows(this.calcRow());
        },
        createContainer: function() {
            this.container = document.createElement("div");
            this.container.className = "rowphotoContainer";
            document.body.appendChild(this.container);
        },
        getImage: function () {
            var i,
                width,
                height;
            for (i = 0; i < this.loadNumber; i++) {
                width = Math.floor(Math.random() * 300 + 300);
                height = Math.floor(Math.random() * 30 + 300);
                this.sourceImages.push({
                    width: width,
                    height: height,
                    url: this.baseUrl + width + "x" + height + "/" + this.randomColor() + "/fff",
                    ratio: width / height
                });
            }
        },
        randomColor: function () {
            var rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
            if (rand.length === 6) {
                return rand;
            } else {
                return this.randomColor();
            }
        },
        calcRow: function() {
            var height = this.minHeight,
                width = 0,
                ratio,
                totalHeight,
                rows = [],
                startIndex = 0,
                endIndex = 0,
                i;
            for (i = 0; i < this.sourceImages.length; i++) {
                this.sourceImages[i].height = height;
                this.sourceImages[i].width = height * this.sourceImages[i].ratio;
                width += this.sourceImages[i].width;
                endIndex = i;
                if (width > this.container.clientWidth) {
                    totalWidth = width - this.sourceImages[i].width;
                    ratio = height / totalWidth;
                    totalHeight = (this.container.clientWidth - (endIndex - startIndex - 1) * 8) * ratio;
                    rows.push({
                        start: startIndex,
                        end: endIndex - 1,
                        height: totalHeight
                    });
                    width = this.sourceImages[i].width;
                    startIndex = i;
                }
            }
            rows.push({
                start: startIndex,
                end: endIndex,
                height: height
            });
            return rows;
        },
        renderRows: function (rows) {
            var i,
                j,
                rowDOM,
                boxDOM,
                img;
            for (i = 0; i < rows.length; i++) {
                rowDOM = document.createElement("div");
                rowDOM.className = "rowphotoRow";
                rowDOM.style.height = rows[i].height + "px";
                for (j = rows[i].start; j <= rows[i].end; j++) {
                    boxDOM = document.createElement("div");
                    boxDOM.className = "rowphotoBox";
                    img = document.createElement("img");
                    img.src = this.sourceImages[j].url;
                    img.style.height = rows[i].height + "px";
                    boxDOM.appendChild(img);
                    rowDOM.appendChild(boxDOM);
                }
                this.container.appendChild(rowDOM);
            }
        },
        addEvent: function (element, event, handler) {
            if (element.addEventListener) {
                element.addEventListener(event, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent(event, handler);
            } else {
                element["on" + event] = handler;
            }
        }
    };
    Barrel.prototype.init.prototype = Barrel.prototype;
    window.Barrel = Barrel;
})(window, undefined);