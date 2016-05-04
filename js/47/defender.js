var defenderObj = function(){//defenderObj类声明
    this.x = [];
    this.y = [];
};
defenderObj.prototype.init = function(){//成员函数--初始化
    this.num = Math.floor(Math.random() * 5);
};
defenderObj.prototype.draw = function(){//成员函数--绘制
    for(var i = 0 ; i < this.num ; i ++){
        if(this.bool[i]){
            ctx.save();
            ctx.fillStyle = "#F05F48";
            ctx.strokeStyle = "#F05F48";
            ctx.beginPath();
            ctx.arc(this.x[i],this.y[i],this.radius,0,Math.PI*2);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x[i],this.y[i],this.field[i],0,Math.PI*2);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    }
};
defenderObj.prototype.buildMap = function(){//成员函数--修改虚拟地图
    for(var i = 0 ; i < this.num ; i ++){

        var x = (this.x[i] - cellLength/2)/cellLength;
        var y = (this.y[i] - cellLength/2)/cellLength;

        map[y][x] = "!";
    }
};