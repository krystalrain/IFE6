var defenderObj = function () { // defenderObj类声明
    this.defenders = [];
};
defenderObj.prototype.init = function () { // 成员函数--初始化
    var i;
    this.num = Math.floor(Math.random() * 5); // 随机生成0-4个守卫
    this.field = 2 * (main.cellWidth + main.cellHeight); // 侦察半径
    for (i = 0; i < this.num; i++) {
        this.defenders.push({
            row: Math.floor(Math.random() * (main.canRow - 8) + 4),
            col: Math.floor(Math.random() * main.canCol / this.num + i / this.num * main.canCol)
        });
    }
};
defenderObj.prototype.draw = function () {//成员函数--绘制
    for(var i = 0 ; i < this.num ; i++) {
        main.ctx.save();

        main.ctx.fillStyle = '#F05F48';
        main.ctx.beginPath();
        main.ctx.rect(this.defenders[i].col * main.cellWidth, this.defenders[i].row * main.cellHeight, main.cellWidth, main.cellHeight);
        main.ctx.fill();
        main.ctx.closePath();

        main.ctx.strokeStyle = '#F05F48';
        main.ctx.lineWidth = 1;
        main.ctx.beginPath();
        main.ctx.arc((this.defenders[i].col + 0.5) * main.cellWidth, (this.defenders[i].row + 0.5) * main.cellHeight, this.field, 0, Math.PI * 2);
        main.ctx.stroke();
        main.ctx.closePath();

        main.ctx.restore();
    }
};
defenderObj.prototype.buildMap = function () {//成员函数--修改虚拟地图
    for(var i = 0 ; i < this.num ; i++) {
        main.map[this.defenders[i].row][this.defenders[i].col] = 'guard';
    }
};