var main = (function () {
    var wrapper, canvas, ctx, // 变量--html结构
        canWidth, canHeight, // 变量--画布宽高，地图单元格大小
        deltaTime, lateTime, loop, // 变量--两次绘制的时间差，动画名
        block, // 变量--blockObj类的对象实例
        hero, // 变量--heroObj类的对象实例
        target, // 变量--targetObj类的对象实例
        defender, // 变量--defenderObj类的对象实例
        map, // 变量--二维数组记录虚拟地图
        Level, // 变量--设定关卡难度
        canRow, // 变量--地图行数
        canCol, // 变量--地图列数
        cellWidth, // 变量--单元格宽度
        cellHeight, // 变量--单元格高度
        requestAnimationFrame;
    // 各变量初始化
    wrapper = document.getElementById('wrapper');
    canWidth = wrapper.clientWidth;
    canHeight = wrapper.clientHeight;
    canvas = document.createElement('canvas');
    canvas.width = canWidth;
    canvas.height = canHeight;
    wrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');
    canRow = 30;
    canCol = 25;
    cellWidth = canWidth / canCol;
    cellHeight = canHeight / canRow;
    map = [];
    Level = 1;
    // 获取requestAnimationFrame函数
    requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    // 游戏初始化
    var init = function () {
        // 创建实例对象
        block = new blockObj();
        hero = new heroObj();
        target = new targetObj();
        defender = new defenderObj();
        // 添加点击事件
        addEvent(canvas, 'click', function (event) {
            event = event || window.event;
            var bbox = canvas.getBoundingClientRect(),
                coordinates = {
                    row: Math.floor((event.clientY - bbox.top * (canHeight / bbox.height)) / cellHeight),
                    col: Math.floor((event.clientX - bbox.left * (canWidth / bbox.width)) / cellWidth)
                },
                path,
                timer,
                i;
            if (map[coordinates.row][coordinates.col] != 'wall' && map[coordinates.row][coordinates.col] != 'guard') {
                path = findway([hero.coordinates.col, hero.coordinates.row], [coordinates.col, coordinates.row], block.blockCoordinates, canCol, canRow);
                if (path[0]) {
                    i = 0;
                    timer = setInterval(function(){
                        hero.move(path[1][i][0], path[1][i][1]);
                        if (path[1][i][0] == target.coordinates.row && path[1][i][1] == target.coordinates.col) {
                            reset();
                            clearInterval(timer);
                        }
                        i++;
                        if(i >= path[1].length){
                            clearInterval(timer);
                        }
                    }, deltaTime);
                }
            }
        });
        initObj();
    };
    // 生成虚拟地图
    var virsualMap = function () {
        var i,
            j;
        for(i = 0; i < canRow; i++){
            map[i] = [];
            for (j = 0; j < canCol; j++) {
                map[i][j] = 'empty';
            }
        }
    }; 
    // 更新游戏场景
    var initObj = function () {
        lateTime = Date.now();
        deltaTime = 0;
        virsualMap();
        hero.init();
        target.init();
        defender.init();
        defender.buildMap();
        block.buildMap();
    };
    // 事件添加函数
    var addEvent = function (elem, type, handler) {
        if (window.addEventListener) {
            addEvent = function (elem, type, handler) {
                elem.addEventListener(type, handler, false);
            };
        } else if (window.attachEvent) {
            addEvent = function (elem, type, handler) {
                elem.attachEvent('on' + type, handler);
            };
        } else {
            addEvent = function (elem, type, handler) {
                elem['on' + type] = handler;
            };
        }
        addEvent(elem, type, handler);
    };
    // 游戏主循环
    var gameLoop = function () { // 画布循环绘制函数
        deltaTime = Date.now() - lateTime;
        lateTime = Date.now();
        ctx.clearRect(0, 0, canWidth, canHeight);
        hero.draw();
        target.draw();
        defender.draw();
        block.draw();
        loop = requestAnimationFrame(gameLoop);
    };
    // 开始游戏入口
    var startGame = function () { // 调用函数
        init();
        gameLoop();
    };
    // 重置
    var reset = function () { // 重置函数
        cancelAnimationFrame(loop);
        Level++;
        initObj();
        gameLoop();
    };
    // 返回接口
    return {
        ctx: ctx,
        canRow: canRow, 
        canCol: canCol,
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        map: map,
        startGame: startGame
    };
})();