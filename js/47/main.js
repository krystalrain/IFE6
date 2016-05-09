var main = (function () {

    var wrapper, canvas, ctx, // 变量--html结构
        canWidth, canHeight, // 变量--画布宽高，地图单元格大小
        lastTime, // 变量--两次绘制的时间差，动画名
        block, // 变量--blockObj类的对象实例
        hero, // 变量--heroObj类的对象实例
        target, // 变量--targetObj类的对象实例
        defender, // 变量--defenderObj类的对象实例
        map, // 变量--二维数组记录虚拟地图
        bullets, // 子弹池
        path, // 路径
        timer, // 特工运动定时器
        checkAgentTimer, // 特工位置检查定时器
        Level, // 变量--表示第几关
        canRow, // 变量--地图行数
        canCol, // 变量--地图列数
        cellWidth, // 变量--单元格宽度
        isGameOver, // 游戏是否结束
        cellHeight; // 变量--单元格高度

    // 各变量初始化
    wrapper = document.getElementById('wrapper');
    canWidth = wrapper.clientWidth;
    canHeight = wrapper.clientHeight;
    canvas = document.createElement('canvas');
    canvas.width = canWidth;
    canvas.height = canHeight;
    canvas.innerHTML = 'Canvas not supported';
    wrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');
    canRow = 30;
    canCol = 25;
    cellWidth = canWidth / canCol;
    cellHeight = canHeight / canRow;
    map = [];
    lastTime = 0;
    bullets = [];
    path = [];
    Level = 1;

    // 游戏初始化
    var init = function () {

        // 创建实例对象
        block = new blockObj();
        hero = new heroObj();
        target = new targetObj();
        defender = new defenderObj();

        // 添加点击事件
        addEvent(canvas, 'click', handler);

        // 每隔400ms对特工位置进行检查，看是否处在某个守卫的射击范围之内
        checkAgentTimer = setInterval(function () {
            defender.detectAgent(hero);
        }, 400);

    };

    // 点击事件回调函数
    var handler = function (event) {

        var bbox,
            coordinates;

        // 获取鼠标点击位置的坐标
        event = event || window.event;
        bbox = canvas.getBoundingClientRect();
        coordinates = {
            row: Math.floor((event.clientY - bbox.top * (canvas.height / bbox.height)) / cellHeight),
            col: Math.floor((event.clientX - bbox.left * (canvas.width / bbox.width)) / cellWidth)
        };

        // 如果鼠标点击的地方是地面或者目标，英雄进行移动
        if (map[coordinates.row][coordinates.col] == 'empty' || map[coordinates.row][coordinates.col] == 'target') {
            heroMove(coordinates.row, coordinates.col);
        }

        // 如果鼠标点击的地方是守卫，则判断英雄能否开枪
        if (map[coordinates.row][coordinates.col] == 'guard') {
            hero.detectGuard(coordinates.row, coordinates.col);
        }

    };

    // 根据路径更新英雄坐标位置
    var heroMove = function (row, col) {
        var temp;
        if (path.length != 0 ) { // 上次移动未完成之前不允许生成新的路径
            return;
        }
        path = aStar([hero.coordinates.col, hero.coordinates.row], [col, row], block.n_path); // 生成路径
        if (path.length != 0) {
            // 每隔50ms更新特工位置
            timer = setInterval(function () {
                temp = path.shift();
                hero.move(temp[1], temp[0]);
                if (temp[0] == target.coordinates.col && temp[1] == target.coordinates.row) {
                    reset();
                    clearInterval(timer);
                }
                if (path.length == 0) {
                    clearInterval(timer);
                }
            }, 50);
        }
    };

    // 生成虚拟地图，初始地面都是empty
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

    // 事件移除函数
    var removeEvent = function (elem, type, handler) {
        if (window.removeEventListener) {
            removeEvent = function (elem, type, handler) {
                elem.removeEventListener(type, handler, false);
            };
        } else if (window.detachEvent) {
            removeEvent = function (elem, type, handler) {
                elem.detachEvent('on' + type, handler);
            };
        } else {
            removeEvent = function (elem, type, handler) {
                elem['on' + type] = null;
            };
        }
        addEvent(elem, type, handler);
    };

    // 更新游戏初始内容
    var update = function () {
        virsualMap();
        hero.init();
        target.init();
        defender.init();
        defender.buildMap();
        block.buildMap();
    };

    // 更新子弹位置并且绘制
    var updateAndDrawBullet = function () {
        var row,
            col;
        for (var bullet of bullets) {
            bullet.posX = bullet.posX + bullet.speed * bullet.dirX;
            bullet.posY = bullet.posY + bullet.speed * bullet.dirY;
            row = Math.floor(bullet.posY / cellHeight);
            col = Math.floor(bullet.posX / cellWidth);
            // 子弹打在墙上或者边界上
            if (row < 0 || row > canRow - 1 || col < 0 || col > canCol - 1 || map[row][col] == 'wall') {
                bullets.splice(bullets.indexOf(bullet), 1);
                continue;
            }
            // 来自守卫的子弹
            if (bullet.shooter.name == 'defender' && row == hero.coordinates.row && col == hero.coordinates.col) {
                isGameOver = true;
                return;
            }
            // 来自特工的子弹
            if (bullet.shooter.name == 'hero') {
                for (var defenderObj of defender.defenders) { // 检查特工射击的是哪一个守卫
                    if (defenderObj.row == row && defenderObj.col == col) { // 子弹命中守卫
                        bullets.splice(bullets.indexOf(bullet), 1); // 清除子弹
                        defender.defenders.splice(defender.defenders.indexOf(defenderObj), 1); // 清除守卫
                        break;
                    }
                }
            }
            bullet.draw();
        }
    };

    // 绘制
    var draw = function () {
        ctx.clearRect(0, 0, canWidth, canHeight);
        hero.draw();
        target.draw();
        defender.draw();
        block.draw();
        updateAndDrawBullet();
    };

    // 游戏结束
    var gameOver = function () {
        clearInterval(checkAgentTimer); // 清除特工位置检查定时器
        removeEvent(canvas, 'click', handler); // 移除点击事件
        ctx.clearRect(0, 0, canWidth, canHeight); // 清除画布
        ctx.textAlign = "center";
        ctx.font = "25px Arial";
        ctx.fillStyle = 'cornflowerblue';
        ctx.fillText('胜败乃兵家常事，大侠请重新来过', canWidth * 0.5, canHeight * 0.5 - 25);
    };

    // 游戏主循环
    var animate = function () { // 画布循环绘制函数
        draw();
        ctx.fillStyle = 'cornflowerblue';
        ctx.fillText(calculateFps().toFixed() + 'fps', 10, 20);
        ctx.fillText('第' + Level + '关', 50, 20);
        if (!isGameOver) { // 如果游戏没结束，继续动画循环
            requestAnimationFrame(animate);
        } else { // 游戏结束
            gameOver();
        }
    };

    // 计算帧率
    var calculateFps = function () {
        var now = (+new Date),
            fps = 1000 / (now - lastTime);
        lastTime = now;
        return fps;
    };

    // 开始游戏入口
    var startGame = function () { // 调用函数
        isGameOver = false;
        init();
        update();
        animate();
    };

    // 下一关重置函数
    var reset = function () { // 重置函数
        Level++;
        update();
    };

    // 返回接口
    return {
        bullets: bullets,
        ctx: ctx,
        canRow: canRow, 
        canCol: canCol,
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        map: map,
        startGame: startGame
    };

})();