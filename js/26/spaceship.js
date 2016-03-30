(function (window, undefined) {
    /*
    飞船类
     */
    var Spaceship = function (orbitId) {
        var that = this;
        this.orbitId = orbitId;
        this.status = 0;//0表示停止，1表示飞行
        this.energy = 100;
        this.destroyed = false;
        this.deg = 0;
        this.degTimer = null;
        this.energyTimer = null;
        this.powerSystem = {
            //开始飞行
            start: function () {
                /*
                防止定时器叠加
                 */
                clearInterval(that.degTimer);
                that.degTimer = null;
                clearInterval(that.energyTimer);
                that.energyTimer = null;
                /*
                能量足够，开始航行
                 */
                if(that.energy > 0) {
                    that.status = 1;
                }
                var ship = basicFunction.getElement("#spaceship" + that.orbitId);
                /*
                运动定时器，不同轨道速度不一样，外圈速度慢，内圈速度快
                 */
                that.degTimer = setInterval(function () {
                    //飞船飞行控制
                    that.powerSystem.changeDeg();
                    //修改飞船位置
                    ship.style.webkitTransform = "rotate(" + that.deg + "deg)";
                    ship.style.mozTransform = "rotate(" + that.deg + "deg)";
                    ship.style.msTransform = "rotate(" + that.deg + "deg)";
                    ship.style.oTransform = "rotate(" + that.deg + "deg)";
                    ship.style.transform = "rotate(" + that.deg + "deg)";
                }, 20 * (that.orbitId + 1));
                /*
                能量定时器，获取每秒能量变化量
                 */
                that.energyTimer = setInterval(function () {
                    //能量实时更新
                    that.energySystem.consumeEnergy();
                    that.energySystem.solarEnergy();
                    //能源显示
                    ship.firstElementChild.style.width = that.energySystem.getCurrentEnergy() + "px";
                    ship.lastElementChild.innerHTML = that.energySystem.getCurrentEnergy() + "%";
                }, 1000);
            },
            //停止飞行
            stop: function () {
                that.status = 0;
                clearInterval(that.degTimer);
                that.degTimer = null;
            },
            //由宇宙管理员操作的飞行功能
            changeDeg: function () {
                if(that.status == 1) {
                    that.deg += 1;
                }
                that.deg = that.deg % 360;
            }
        };
        this.energySystem = {
            solarEnergy: function () {
                that.energy += 2;
                if(that.energy > 100) {
                    that.energy = 100;
                }
            },
            consumeEnergy: function () {
                if(that.status == 1) {
                    that.energy -= 5;
                }
                if(that.energy <= 0) {
                    that.powerSystem.stop();
                    that.energy = 0;
                }
            },
            //取当前能源值
            getCurrentEnergy: function () {
                return that.energy;
            }
        };
        this.radioSystem = {
            recieveMessage: function (message) {
                //检查消息是否是发给自己的
                if(message.id !== that.orbitId) {
                    return;
                }
                //执行命令
                switch(message.command) {
                    //开始飞行
                    case 'start':
                        that.powerSystem.start();
                        break;
                    //停止飞行
                    case 'stop':
                        that.powerSystem.stop();
                        break;
                    //自爆
                    default:
                        that.destroySystem.destroy();
                        break;
                }
            }
        };
        /*
        自毁系统
         */
        this.destroySystem = {
            destroy: function () {
                var contain = basicFunction.getElement("#contain");
                var ship = basicFunction.getElement("#spaceship" + that.orbitId);
                that.destroyed = true;
                contain.removeChild(ship);
            }
        };
    };
    window.Spaceship = Spaceship;
})(window);