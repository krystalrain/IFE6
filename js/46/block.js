var blockObj = function () { // block类声明
    this.x = [];
    this.y = [];
    this.width = [];
    this.height = [];
    this.bool = [];
};
blockObj.prototype.num = 100; // 先随机生成100个障碍物
blockObj.prototype.init = function () { // 成员函数--初始化
    var i,
        j,
        nx1,
        nx2,
        ny1,
        ny2,
        ox1,
        ox2,
        oy1,
        oy2;
    for (i = 0; i < this.num; i++) {
        this.x[i] = Math.floor(Math.random() * Math.floor(main.canWidth / main.cellLength)) * main.cellLength;
        this.y[i] = Math.floor(Math.random() * Math.floor(main.canHeight / 40) + Math.floor(main.canHeight / 120)) * main.cellLength;
        this.width[i] = Math.floor(Math.random() * 5 + 5 - Math.floor(main.Level / 5)) * main.cellLength;
        this.height[i] = Math.floor(Math.random() * 5 + 5 - Math.floor(main.Level / 5)) * main.cellLength;
        this.bool[i] = true;
        nx1 = this.x[i];
        nx2 = this.x[i] + this.width[i];
        ny1 = this.y[i];
        ny2 = this.y[i] + this.height[i];
        if (nx2 <= main.canWidth && ny2 <= 5 * main.canHeight / 6) {
            for (j = 0; j < i; j++) {
                ox1 = this.x[j];
                ox2 = this.x[j] + this.width[j];
                oy1 = this.y[j];
                oy2 = this.y[j] + this.height[j];
                if (nx1 <= ox1 && ny1 <= oy1 && ny2 >= oy1 && nx2 >= ox1 ||
                    nx1 <= ox1 && ny1 >= oy1 && ny1 <= oy2 && nx2 >= ox1 ||
                    nx1 >= ox1 && nx1 <= ox2 && ny1 <= oy1 && ny2 >= oy1 ||
                    nx1 >= ox1 && nx1 <= ox2) {
                    this.bool[i] = false; // 不符合条件的障碍物去掉
                }
            }
        } else {
            this.bool[i] = false; // 不符合条件的障碍物去掉
        }
    }
};
blockObj.prototype.draw = function () { // 成员函数--绘制
    var i;
    main.ctx.save();
    main.ctx.fillStyle = '#2E1E1E';
    for (i = 0; i < this.num; i++) {
        if (this.bool[i]) { // 绘制障碍物
            main.ctx.fillRect(this.x[i], this.y[i], this.width[i], this.height[i]);
        }
    }
    main.ctx.restore();
};
blockObj.prototype.buildMap = function () { // 成员函数--生成虚拟地图
    var i,
        j,
        k;
    for(i = 0; i < Math.ceil(main.canHeight / main.cellLength); i++){
        main.map[i] = [];
        for (j = 0; j < Math.ceil(main.canWidth / main.cellLength); j++) {
            main.map[i][j] = {
                row: i,
                col: j,
                empty: true
            };
        }
    }
    for (i = 0; i < this.num; i++) {
        if (this.bool[i]) {
            for (j = this.y[i] / main.cellLength; j < (this.y[i] + this.height[i]) / main.cellLength; j++) {
                for (k = this.x[i] / main.cellLength; k < (this.x[i] + this.width[i]) / main.cellLength; k++) {
                    main.map[j][k].empty = false; // 如果当前小方块包含在障碍物内，则置为false
                }
            }
        }
    }
};