var targetObj = function () { // target类声明
    this.x;
    this.y;
    this.radius;
};
targetObj.prototype.init = function () {//成员函数--初始化
    this.x = Math.floor(Math.random() * Math.floor(main.canWidth / main.cellLength)) * main.cellLength;
    this.y = Math.floor(Math.random() * Math.floor(main.canHeight / 120) + Math.floor(main.canHeight / 24)) * main.cellLength;
    this.coordinates = {
        row: Math.floor(this.y / main.cellLength),
        col: Math.floor(this.x / main.cellLength)
    };
    this.radius = main.cellLength / 2;
};
targetObj.prototype.draw = function () {//成员函数--绘制
    main.ctx.save();
    main.ctx.fillStyle = '#F4AF29';
    main.ctx.beginPath();
    main.ctx.arc(this.x + main.cellLength / 2, this.y + main.cellLength / 2, this.radius, 0, Math.PI * 2);
    main.ctx.closePath();
    main.ctx.fill();
    main.ctx.restore();
};