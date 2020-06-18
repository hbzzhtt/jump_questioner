require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"game":[function(require,module,exports){
"use strict";
cc._RF.push(module, '991ech8TmxLJqXDErIiRpNR', 'game');
// script/game.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        //游戏的得分
        score: {
            default: 0,
            displayName: "Score (player)",
            tooltip: "The score of player"
        },
        //游戏得分的显示
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },
        // 剩余时间显示
        timeDisplay: {
            default: null,
            type: cc.Label
        },
        // 给左右按钮传递玩家的引用
        leftButton: {
            default: null,
            type: cc.Node
        },
        rightButton: {
            default: null,
            type: cc.Node
        }

    },
    // use this for initialization
    onLoad: function onLoad() {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        // 生成一个新的星星
        this.spawnNewStar();
        // 生成一个新的星星
        this.spawnNewStar();
        // 用于二段跳的测试
        // this.player.getComponent('player').game=this;
        // 用于左右触控按钮传递信息给player 
        this.leftButton.on(cc.Node.EventType.TOUCH_START, this.onleftTouchStart, this);
        this.leftButton.on(cc.Node.EventType.TOUCH_END, this.onleftTouchEnd, this);
        this.rightButton.on(cc.Node.EventType.TOUCH_START, this.onrightTouchStart, this);
        this.rightButton.on(cc.Node.EventType.TOUCH_END, this.onrightTouchEnd, this);

        // 初始化星星消失时间的计时器
        this.timer = 0;
    },

    onleftTouchEnd: function onleftTouchEnd() {
        this.player.getComponent('player').onKeyout(cc.KEY.left);
    },

    onleftTouchStart: function onleftTouchStart() {
        this.player.getComponent('player').onKeyin(cc.KEY.left);
    },

    onrightTouchEnd: function onrightTouchEnd() {
        this.player.getComponent('player').onKeyout(cc.KEY.right);
    },

    onrightTouchStart: function onrightTouchStart() {
        this.player.getComponent('player').onKeyin(cc.KEY.right);
    },

    gainScore: function gainScore() {
        this.score += 1;
        this.scoreDisplay.string = 'Score:' + this.score;
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    spawnNewStar: function spawnNewStar() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 给星星提供game场景的引用，使得星星可以获取玩家的位置，判断自己是否被捕捉到了
        newStar.getComponent('star').game = this;
        // 重置星星消失的计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标 
        var randY = this.groundY + Math.random() * this.player.getComponent('player').jumpHeight;

        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        cc.log('randY is' + randY);
        cc.log('this.groundY is ' + this.groundY);
        // 返回星星坐标
        return cc.v2(randX, randY);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        // 如果主角的位置到了屏幕边界，就从屏幕另一边出来
        var maxX = this.node.width / 2;
        var minX = 0 - maxX;
        if (this.player.getComponent('player').node.x > maxX) this.player.getComponent('player').node.x = minX;else if (this.player.getComponent('player').node.x < minX) this.player.getComponent('player').node.x = maxX;

        // 如果主角一定时间没有捉到星星，游戏结束了
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
        this.timeDisplay.string = 'TimeLeft:' + parseInt(this.starDuration - this.timer);
    },

    gameOver: function gameOver() {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作

        cc.director.loadScene('game'); //管理游戏逻辑流程的单例对象，这里是游戏重新开始
    }
});

cc._RF.pop();
},{}],"player":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'ff3d7VufE9DJ50vM/DQ5pW+', 'player');
// script/player.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        // 摩擦力 
        disaccel: 0,
        // 跳跃音效资源
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.node.runAction(this.setJumpAction());
        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        this.firstJump = false;
        this.secondJump = false;
        this.firstJumpFinish = false;
        this.secondJumpFinish = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDestroy: function onDestroy() {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },


    setJumpAction: function setJumpAction() {
        //cc.log('jump to'+this.jumpHeight);
        //cc.log('player y is'+this.node.y);

        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 落下来之后播放落地的声音，然后取消二段跳的状态
        var callback = cc.callFunc(this.playJumpDownCallback, this);
        // 不断重复
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },

    playJumpDownCallback: function playJumpDownCallback() {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
        // 取消二段跳  
        //this.firstJump = false;
        //this.secondJump = false;
    },

    onKeyin: function onKeyin(keyCode) {
        switch (keyCode) {
            case cc.KEY.left:
                this.accLeft = true;
                break;
            case cc.KEY.right:
                this.accRight = true;
                break;
        }
    },
    onKeyout: function onKeyout(keyCode) {
        switch (keyCode) {
            case cc.KEY.left:
                this.accLeft = false;
                break;
            case cc.KEY.right:
                this.accRight = false;
                break;
        }
    },
    onKeyDown: function onKeyDown(event) {
        // set a flag when key pressed
        switch (event.keyCode) {
            case cc.KEY.left:
                this.accLeft = true;
                break;
            case cc.KEY.right:
                this.accRight = true;
                break;
            //case cc.KEY.space:
            ////一段跳和二段跳的起手应该在按键时候触发，结束则应该是落下地面时候结束
            //    if(this.firstJump && this.secondJump)
            //        ;
            //    else if(this.firstJump)
            //	{
            //        this.secondJump = true;
            //		this.secondJumpFinish = false;
            //	}
            //    else
            //	{
            //        this.firstJump = true;
            //		this.firstJumpFinish = false;
            //	}
            //    break;


        }
    },
    onKeyUp: function onKeyUp(event) {
        // set a flag when key pressed
        switch (event.keyCode) {
            case cc.KEY.left:
                this.accLeft = false;
                break;
            case cc.KEY.right:
                this.accRight = false;
                break;
        }
    },


    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        } else {
            //不操作应该逐渐减速
            if (this.xSpeed > 0 && this.xSpeed - this.disaccel > 0) this.xSpeed -= this.disaccel;else if (this.xSpeed < 0 && this.xSpeed + this.disaccel < 0) this.xSpeed += this.disaccel;else this.xSpeed = 0;
        }
        //if(this.secondJump)
        //{
        //	if(this.secondJumpFinish==false)
        //	{
        //		this.y += this.jumpHeight/4;//fixme
        //		this.game.gainScore();//fixme
        //		this.secondJumpFinish=true;
        //	} 
        //}
        //else if(this.firstJump)
        //{
        //	if(this.firstJumpFinish==false)
        //	{
        //		this.y += this.jumpHeight/2;//fixme
        //		this.game.gainScore();//fixme
        //		this.firstJumpFinish=true;
        //	} 
        //}
        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;
    }

});

cc._RF.pop();
},{}],"star":[function(require,module,exports){
"use strict";
cc._RF.push(module, '9eac9ueyXNEEIiDWl5jpgC/', 'star');
// script/star.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        // 星星和主角之间的距离小于这个数值时，就会完成收集
        pickRadius: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.getPlayerDistance() < this.pickRadius) this.onPicked();
        // ...
        // 根据 Game 脚本中的计时器更新星星的透明度
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    },

    getPlayerDistance: function getPlayerDistance() {
        // 根据 player 节点位置判断距离        
        var playerPos = this.game.player.getPosition();
        // 根据两点位置计算两点之间距离
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    },

    onPicked: function onPicked() {
        // 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
        this.game.spawnNewStar();
        // 玩家得分
        this.game.gainScore();
        // 然后销毁当前星星节点
        this.node.destroy();
    }
});

cc._RF.pop();
},{}]},{},["game","player","star"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvZ2FtZS5qcyIsImFzc2V0cy9zY3JpcHQvcGxheWVyLmpzIiwiYXNzZXRzL3NjcmlwdC9zdGFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFGUTtBQUlaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRkk7QUFJUjtBQUNBO0FBQ0k7QUFDQTtBQUZJO0FBSVI7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhHO0FBS2I7QUFDQTtBQUNVO0FBQ0E7QUFGSTtBQUlkO0FBQ007QUFDSTtBQUNBO0FBRlE7QUFJbEI7QUFDQTtBQUNDO0FBQ0E7QUFGWTtBQUliO0FBQ0E7QUFDQztBQUNBO0FBRlk7QUFJYjtBQUNDO0FBQ0E7QUFGYTs7QUE3Q0E7QUFvRFo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNOO0FBQ0E7QUFDQTtBQUNNO0FBQ0E7QUFDQTtBQUNBOztBQUVOO0FBQ007QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUo7QUFDQztBQUNBO0FBQ0E7QUFDQTs7QUFFRTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNOO0FBQ0E7QUFDQTtBQUNNO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDTjs7QUFFTTtBQUNBO0FBQ0E7QUFDTjtBQUNBO0FBQ007QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFLQTtBQUNBO0FBQ1U7QUFDQTtBQUNIO0FBQ0Q7QUFDTjtBQUNHOztBQUVKO0FBQ087O0FBRUE7QUFDSDtBQXBKSTs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ047QUFDTTtBQUNJO0FBQ0E7QUFGTztBQXRCSDs7QUE0Qlo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDTTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUVIOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEO0FBQ0Y7QUFDQTs7QUFFTTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ047QUFDQTtBQUNBO0FBQ0c7O0FBRUo7QUFDTztBQUNBO0FBQ047QUFDQTtBQUNBO0FBQ0c7O0FBR0Q7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQU5SO0FBUUg7QUFDRDtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBTlI7QUFRSDtBQUVEO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ1Q7QUFDUztBQUNBO0FBQ0E7QUFDVDtBQUNTO0FBQ1Q7QUFDQTtBQUNTO0FBQ1Q7QUFDUztBQUNUO0FBQ0E7QUFDUzs7O0FBckJKO0FBeUJIO0FBRUE7QUFDRztBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBTlI7QUFRSDs7O0FBRUQ7QUFDQztBQUNHO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNBO0FBQ0c7QUFNSDtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNNO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUlIOztBQTNMSTs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFaUTs7QUFlWjtBQUNBOztBQUlBO0FBQ0E7QUFDRjtBQUVBO0FBQ007QUFDQTtBQUNBO0FBQ0E7QUFFSDs7QUFFSjtBQUNPO0FBQ047QUFDTTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDTjtBQUNBO0FBQ007QUFDQTtBQUNIO0FBbERJIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG4gXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8g6L+Z5Liq5bGe5oCn5byV55So5LqG5pif5pif6aKE5Yi26LWE5rqQXHJcbiAgICAgICAgc3RhclByZWZhYjoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIOaYn+aYn+S6p+eUn+WQjua2iOWkseaXtumXtOeahOmaj+acuuiMg+WbtFxyXG4gICAgICAgIG1heFN0YXJEdXJhdGlvbjogMCxcclxuICAgICAgICBtaW5TdGFyRHVyYXRpb246IDAsXHJcbiAgICAgICAgLy8g5Zyw6Z2i6IqC54K577yM55So5LqO56Gu5a6a5pif5pif55Sf5oiQ55qE6auY5bqmXHJcbiAgICAgICAgZ3JvdW5kOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIHBsYXllciDoioLngrnvvIznlKjkuo7ojrflj5bkuLvop5LlvLnot7PnmoTpq5jluqbvvIzlkozmjqfliLbkuLvop5LooYzliqjlvIDlhbNcclxuICAgICAgICBwbGF5ZXI6IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy/muLjmiI/nmoTlvpfliIZcclxuICAgICAgICBzY29yZToge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJTY29yZSAocGxheWVyKVwiLFxyXG4gICAgICAgICAgICB0b29sdGlwOiBcIlRoZSBzY29yZSBvZiBwbGF5ZXJcIlxyXG4gICAgICAgIH0sXHJcblx0XHQvL+a4uOaIj+W+l+WIhueahOaYvuekulxyXG5cdFx0c2NvcmVEaXNwbGF5OiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXHJcbiAgICAgICAgfSxcclxuXHRcdC8vIOW+l+WIhumfs+aViOi1hOa6kFxyXG4gICAgICAgIHNjb3JlQXVkaW86IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcclxuICAgICAgICB9LFxyXG5cdFx0Ly8g5Ymp5L2Z5pe26Ze05pi+56S6XHJcblx0XHR0aW1lRGlzcGxheToge1xyXG5cdFx0XHRkZWZhdWx0OiBudWxsLFxyXG5cdFx0XHR0eXBlOiBjYy5MYWJlbFxyXG5cdFx0fSxcclxuXHRcdC8vIOe7meW3puWPs+aMiemSruS8oOmAkueOqeWutueahOW8leeUqFxyXG5cdFx0bGVmdEJ1dHRvbjogIHtcclxuXHRcdFx0ZGVmYXVsdDogbnVsbCxcclxuXHRcdFx0dHlwZTogY2MuTm9kZVxyXG5cdFx0fSxcclxuXHRcdHJpZ2h0QnV0dG9uOiAge1xyXG5cdFx0XHRkZWZhdWx0OiBudWxsLFxyXG5cdFx0XHR0eXBlOiBjYy5Ob2RlXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdFx0XHJcbiAgICB9LFxyXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyDojrflj5blnLDlubPpnaLnmoQgeSDovbTlnZDmoIdcclxuICAgICAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLmdyb3VuZC55ICsgdGhpcy5ncm91bmQuaGVpZ2h0LzI7XHJcbiAgICAgICAgLy8g55Sf5oiQ5LiA5Liq5paw55qE5pif5pifXHJcbiAgICAgICAgdGhpcy5zcGF3bk5ld1N0YXIoKTtcclxuICAgICAgICAvLyDnlJ/miJDkuIDkuKrmlrDnmoTmmJ/mmJ9cclxuICAgICAgICB0aGlzLnNwYXduTmV3U3RhcigpO1xyXG5cdFx0Ly8g55So5LqO5LqM5q616Lez55qE5rWL6K+VXHJcblx0XHQvLyB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoJ3BsYXllcicpLmdhbWU9dGhpcztcclxuXHRcdC8vIOeUqOS6juW3puWPs+inpuaOp+aMiemSruS8oOmAkuS/oeaBr+e7mXBsYXllciBcclxuICAgICAgICB0aGlzLmxlZnRCdXR0b24ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25sZWZ0VG91Y2hTdGFydCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5sZWZ0QnV0dG9uLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vbmxlZnRUb3VjaEVuZCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5yaWdodEJ1dHRvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vbnJpZ2h0VG91Y2hTdGFydCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5yaWdodEJ1dHRvbi5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25yaWdodFRvdWNoRW5kLCB0aGlzKTtcclxuXHRcdFxyXG5cdFx0Ly8g5Yid5aeL5YyW5pif5pif5raI5aSx5pe26Ze055qE6K6h5pe25ZmoXHJcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvbmxlZnRUb3VjaEVuZDpmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoJ3BsYXllcicpLm9uS2V5b3V0KGNjLktFWS5sZWZ0KTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9ubGVmdFRvdWNoU3RhcnQ6ZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KCdwbGF5ZXInKS5vbktleWluKGNjLktFWS5sZWZ0KTtcclxuICAgIH0sXHJcblxyXG4gICAgb25yaWdodFRvdWNoRW5kOmZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucGxheWVyLmdldENvbXBvbmVudCgncGxheWVyJykub25LZXlvdXQoY2MuS0VZLnJpZ2h0KTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9ucmlnaHRUb3VjaFN0YXJ0OmZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucGxheWVyLmdldENvbXBvbmVudCgncGxheWVyJykub25LZXlpbihjYy5LRVkucmlnaHQpO1xyXG4gICAgfSxcclxuXHJcblx0Z2FpblNjb3JlOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuc2NvcmUgKz0gMTtcclxuXHRcdHRoaXMuc2NvcmVEaXNwbGF5LnN0cmluZyA9ICdTY29yZTonICsgdGhpcy5zY29yZTtcclxuXHRcdGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5zY29yZUF1ZGlvLCBmYWxzZSk7XHJcblx0fSxcclxuXHRcclxuICAgIHNwYXduTmV3U3RhcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g5L2/55So57uZ5a6a55qE5qih5p2/5Zyo5Zy65pmv5Lit55Sf5oiQ5LiA5Liq5paw6IqC54K5XHJcbiAgICAgICAgdmFyIG5ld1N0YXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnN0YXJQcmVmYWIpO1xyXG4gICAgICAgIC8vIOS4uuaYn+aYn+iuvue9ruS4gOS4qumaj+acuuS9jee9rlxyXG4gICAgICAgIG5ld1N0YXIuc2V0UG9zaXRpb24odGhpcy5nZXROZXdTdGFyUG9zaXRpb24oKSk7XHJcbiAgICAgICAgLy8g5bCG5paw5aKe55qE6IqC54K55re75Yqg5YiwIENhbnZhcyDoioLngrnkuIvpnaJcclxuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XHJcblx0XHQvLyDnu5nmmJ/mmJ/mj5DkvptnYW1l5Zy65pmv55qE5byV55So77yM5L2/5b6X5pif5pif5Y+v5Lul6I635Y+W546p5a6255qE5L2N572u77yM5Yik5pat6Ieq5bex5piv5ZCm6KKr5o2V5o2J5Yiw5LqGXHJcblx0XHRuZXdTdGFyLmdldENvbXBvbmVudCgnc3RhcicpLmdhbWUgPSB0aGlzO1xyXG5cdFx0Ly8g6YeN572u5pif5pif5raI5aSx55qE6K6h5pe25Zmo77yM5qC55o2u5raI5aSx5pe26Ze06IyD5Zu06ZqP5py65Y+W5LiA5Liq5YC8XHJcbiAgICAgICAgdGhpcy5zdGFyRHVyYXRpb24gPSB0aGlzLm1pblN0YXJEdXJhdGlvbiArIE1hdGgucmFuZG9tKCkgKiAodGhpcy5tYXhTdGFyRHVyYXRpb24gLSB0aGlzLm1pblN0YXJEdXJhdGlvbik7XHJcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldE5ld1N0YXJQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByYW5kWCA9IDA7XHJcbiAgICAgICAgLy8g5qC55o2u5Zyw5bmz6Z2i5L2N572u5ZKM5Li76KeS6Lez6LeD6auY5bqm77yM6ZqP5py65b6X5Yiw5LiA5Liq5pif5pif55qEIHkg5Z2Q5qCHIFxyXG5cdFx0dmFyIHJhbmRZID0gdGhpcy5ncm91bmRZICsgTWF0aC5yYW5kb20oKSAqIHRoaXMucGxheWVyLmdldENvbXBvbmVudCgncGxheWVyJykuanVtcEhlaWdodDtcclxuICAgICAgICBcclxuICAgICAgICAvLyDmoLnmja7lsY/luZXlrr3luqbvvIzpmo/mnLrlvpfliLDkuIDkuKrmmJ/mmJ8geCDlnZDmoIdcclxuICAgICAgICB2YXIgbWF4WCA9IHRoaXMubm9kZS53aWR0aC8yO1xyXG4gICAgICAgIHJhbmRYID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMiAqIG1heFg7XHJcblx0XHRjYy5sb2coJ3JhbmRZIGlzJytyYW5kWSk7XHJcblx0XHRjYy5sb2coJ3RoaXMuZ3JvdW5kWSBpcyAnKyB0aGlzLmdyb3VuZFkpO1xyXG4gICAgICAgIC8vIOi/lOWbnuaYn+aYn+WdkOagh1xyXG4gICAgICAgIHJldHVybiBjYy52MihyYW5kWCwgcmFuZFkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuXHRcdC8vIOWmguaenOS4u+inkueahOS9jee9ruWIsOS6huWxj+W5lei+ueeVjO+8jOWwseS7juWxj+W5leWPpuS4gOi+ueWHuuadpVxyXG5cdFx0dmFyIG1heFggPSB0aGlzLm5vZGUud2lkdGgvMjtcclxuXHRcdHZhciBtaW5YID0gMC1tYXhYO1xyXG5cdFx0aWYodGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KCdwbGF5ZXInKS5ub2RlLnggPiBtYXhYKVxyXG5cdFx0XHR0aGlzLnBsYXllci5nZXRDb21wb25lbnQoJ3BsYXllcicpLm5vZGUueCA9IG1pblg7XHJcblx0XHRlbHNlIGlmKHRoaXMucGxheWVyLmdldENvbXBvbmVudCgncGxheWVyJykubm9kZS54IDwgbWluWClcclxuXHRcdFx0dGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KCdwbGF5ZXInKS5ub2RlLnggPSBtYXhYO1xyXG5cdFx0XHJcblx0XHQvLyDlpoLmnpzkuLvop5LkuIDlrprml7bpl7TmsqHmnInmjYnliLDmmJ/mmJ/vvIzmuLjmiI/nu5PmnZ/kuoZcclxuXHRcdGlmICh0aGlzLnRpbWVyID4gdGhpcy5zdGFyRHVyYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlcigpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGltZXIgKz0gZHQ7XHJcblx0XHR0aGlzLnRpbWVEaXNwbGF5LnN0cmluZyA9ICdUaW1lTGVmdDonICsgKHBhcnNlSW50KHRoaXMuc3RhckR1cmF0aW9uIC0gdGhpcy50aW1lcikpO1xyXG4gICAgfSxcclxuXHRcclxuXHRnYW1lT3ZlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucGxheWVyLnN0b3BBbGxBY3Rpb25zKCk7IC8v5YGc5q2iIHBsYXllciDoioLngrnnmoTot7Pot4PliqjkvZxcclxuXHRcdFxyXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnZ2FtZScpOy8v566h55CG5ri45oiP6YC76L6R5rWB56iL55qE5Y2V5L6L5a+56LGh77yM6L+Z6YeM5piv5ri45oiP6YeN5paw5byA5aeLXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuXHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgICAgICAvLyDkuLvop5Lot7Pot4Ppq5jluqZcclxuICAgICAgICBqdW1wSGVpZ2h0OiAwLFxyXG4gICAgICAgIC8vIOS4u+inkui3s+i3g+aMgee7reaXtumXtFxyXG4gICAgICAgIGp1bXBEdXJhdGlvbjogMCxcclxuICAgICAgICAvLyDmnIDlpKfnp7vliqjpgJ/luqZcclxuICAgICAgICBtYXhNb3ZlU3BlZWQ6IDAsXHJcbiAgICAgICAgLy8g5Yqg6YCf5bqmXHJcbiAgICAgICAgYWNjZWw6IDAsXHJcbiAgICAgICAgLy8g5pGp5pOm5YqbIFxyXG4gICAgICAgIGRpc2FjY2VsOjAsXHJcblx0XHQvLyDot7Pot4Ppn7PmlYjotYTmupBcclxuICAgICAgICBqdW1wQXVkaW86IHtcclxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbih0aGlzLnNldEp1bXBBY3Rpb24oKSk7XHJcbiAgICAgICAgLy8g5Yqg6YCf5bqm5pa55ZCR5byA5YWzXHJcbiAgICAgICAgdGhpcy5hY2NMZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hY2NSaWdodCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5maXJzdEp1bXAgPSBmYWxzZTtcclxuXHRcdHRoaXMuc2Vjb25kSnVtcCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5maXJzdEp1bXBGaW5pc2ggPSBmYWxzZTtcclxuXHRcdHRoaXMuc2Vjb25kSnVtcEZpbmlzaCA9IGZhbHNlO1xyXG4gICAgICAgIC8vIOS4u+inkuW9k+WJjeawtOW5s+aWueWQkemAn+W6plxyXG4gICAgICAgIHRoaXMueFNwZWVkID0gMDtcclxuICAgIFxyXG5cclxuICAgICAgICAvLyDliJ3lp4vljJbplK7nm5jovpPlhaXnm5HlkKxcclxuICAgICAgICBjYy5zeXN0ZW1FdmVudC5vbihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sIHRoaXMub25LZXlEb3duLCB0aGlzKTtcclxuICAgICAgICBjYy5zeXN0ZW1FdmVudC5vbihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLCB0aGlzLm9uS2V5VXAsIHRoaXMpOyAgICAgXHJcbiAgICAgICBcclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uRGVzdHJveSgpIHtcclxuICAgICAgICAvLyDlj5bmtojplK7nm5jovpPlhaXnm5HlkKxcclxuICAgICAgICBjYy5zeXN0ZW1FdmVudC5vZmYoY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCB0aGlzLm9uS2V5RG93biwgdGhpcyk7XHJcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub2ZmKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzZXRKdW1wQWN0aW9uOiBmdW5jdGlvbiAoKSB7XHJcblx0XHQvL2NjLmxvZygnanVtcCB0bycrdGhpcy5qdW1wSGVpZ2h0KTtcclxuXHRcdC8vY2MubG9nKCdwbGF5ZXIgeSBpcycrdGhpcy5ub2RlLnkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIOi3s+i3g+S4iuWNh1xyXG4gICAgICAgIHZhciBqdW1wVXAgPSBjYy5tb3ZlQnkodGhpcy5qdW1wRHVyYXRpb24sIGNjLnYyKDAsIHRoaXMuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSk7XHJcbiAgICAgICAgLy8g5LiL6JC9XHJcbiAgICAgICAgdmFyIGp1bXBEb3duID0gY2MubW92ZUJ5KHRoaXMuanVtcER1cmF0aW9uLCBjYy52MigwLCAtdGhpcy5qdW1wSGVpZ2h0KSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpO1xyXG4gICAgICAgIC8vIOiQveS4i+adpeS5i+WQjuaSreaUvuiQveWcsOeahOWjsOmfs++8jOeEtuWQjuWPlua2iOS6jOautei3s+eahOeKtuaAgVxyXG5cdFx0dmFyIGNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5wbGF5SnVtcERvd25DYWxsYmFjaywgdGhpcyk7XHRcdFxyXG5cdFx0Ly8g5LiN5pat6YeN5aSNXHJcblx0XHRyZXR1cm4gY2MucmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShqdW1wVXAsIGp1bXBEb3duLCBjYWxsYmFjaykpO1xyXG4gICAgfSxcclxuXHRcclxuXHRwbGF5SnVtcERvd25DYWxsYmFjazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIOiwg+eUqOWjsOmfs+W8leaTjuaSreaUvuWjsOmfs1xyXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5qdW1wQXVkaW8sIGZhbHNlKTtcclxuXHRcdC8vIOWPlua2iOS6jOautei3syAgXHJcblx0XHQvL3RoaXMuZmlyc3RKdW1wID0gZmFsc2U7XHJcblx0XHQvL3RoaXMuc2Vjb25kSnVtcCA9IGZhbHNlO1xyXG4gICAgfSxcclxuICAgIFxyXG5cdCBcclxuICAgIG9uS2V5aW4oa2V5Q29kZSkge1xyXG4gICAgICAgIHN3aXRjaChrZXlDb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmxlZnQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY0xlZnQgPSB0cnVlOyBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLktFWS5yaWdodDpcclxuICAgICAgICAgICAgICAgIHRoaXMuYWNjUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHQgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9LFx0IFxyXG4gICAgb25LZXlvdXQoa2V5Q29kZSkge1xyXG4gICAgICAgIHN3aXRjaChrZXlDb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmxlZnQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY0xlZnQgPSBmYWxzZTsgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5LRVkucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcdCAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcclxuICAgIG9uS2V5RG93bihldmVudCkge1xyXG4gICAgICAgIC8vIHNldCBhIGZsYWcgd2hlbiBrZXkgcHJlc3NlZFxyXG4gICAgICAgIHN3aXRjaChldmVudC5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmxlZnQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY0xlZnQgPSB0cnVlOyBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLktFWS5yaWdodDpcclxuICAgICAgICAgICAgICAgIHRoaXMuYWNjUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vY2FzZSBjYy5LRVkuc3BhY2U6XHJcblx0XHRcdC8vLy/kuIDmrrXot7PlkozkuozmrrXot7PnmoTotbfmiYvlupTor6XlnKjmjInplK7ml7blgJnop6blj5HvvIznu5PmnZ/liJnlupTor6XmmK/okL3kuIvlnLDpnaLml7blgJnnu5PmnZ9cclxuICAgICAgICAgICAgLy8gICAgaWYodGhpcy5maXJzdEp1bXAgJiYgdGhpcy5zZWNvbmRKdW1wKVxyXG4gICAgICAgICAgICAvLyAgICAgICAgO1xyXG4gICAgICAgICAgICAvLyAgICBlbHNlIGlmKHRoaXMuZmlyc3RKdW1wKVxyXG5cdFx0XHQvL1x0e1xyXG4gICAgICAgICAgICAvLyAgICAgICAgdGhpcy5zZWNvbmRKdW1wID0gdHJ1ZTtcclxuXHRcdFx0Ly9cdFx0dGhpcy5zZWNvbmRKdW1wRmluaXNoID0gZmFsc2U7XHJcblx0XHRcdC8vXHR9XHJcbiAgICAgICAgICAgIC8vICAgIGVsc2VcclxuXHRcdFx0Ly9cdHtcclxuICAgICAgICAgICAgLy8gICAgICAgIHRoaXMuZmlyc3RKdW1wID0gdHJ1ZTtcclxuXHRcdFx0Ly9cdFx0dGhpcy5maXJzdEp1bXBGaW5pc2ggPSBmYWxzZTtcclxuXHRcdFx0Ly9cdH1cclxuICAgICAgICAgICAgLy8gICAgYnJlYWs7XHJcblx0XHRcdFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAgb25LZXlVcChldmVudCkge1xyXG4gICAgICAgIC8vIHNldCBhIGZsYWcgd2hlbiBrZXkgcHJlc3NlZFxyXG4gICAgICAgIHN3aXRjaChldmVudC5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmxlZnQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY0xlZnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLktFWS5yaWdodDpcclxuICAgICAgICAgICAgICAgIHRoaXMuYWNjUmlnaHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICAvLyDmoLnmja7lvZPliY3liqDpgJ/luqbmlrnlkJHmr4/luKfmm7TmlrDpgJ/luqZcclxuICAgICAgICBpZiAodGhpcy5hY2NMZWZ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMueFNwZWVkIC09IHRoaXMuYWNjZWwgKiBkdDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYWNjUmlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgKz0gdGhpcy5hY2NlbCAqIGR0O1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgIHsvL+S4jeaTjeS9nOW6lOivpemAkOa4kOWHj+mAn1xyXG4gICAgICAgICAgICBpZih0aGlzLnhTcGVlZCA+IDAgJiYgdGhpcy54U3BlZWQtdGhpcy5kaXNhY2NlbCA+IDAgKVxyXG4gICAgICAgICAgICAgICAgdGhpcy54U3BlZWQgLT0gdGhpcy5kaXNhY2NlbDtcclxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLnhTcGVlZCA8IDAgJiYgdGhpcy54U3BlZWQrdGhpcy5kaXNhY2NlbCA8IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhTcGVlZCArPSB0aGlzLmRpc2FjY2VsO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnhTcGVlZCA9IDA7XHJcbiAgICAgICAgfVxyXG5cdFx0Ly9pZih0aGlzLnNlY29uZEp1bXApXHJcblx0XHQvL3tcclxuXHRcdC8vXHRpZih0aGlzLnNlY29uZEp1bXBGaW5pc2g9PWZhbHNlKVxyXG5cdFx0Ly9cdHtcclxuXHRcdC8vXHRcdHRoaXMueSArPSB0aGlzLmp1bXBIZWlnaHQvNDsvL2ZpeG1lXHJcblx0XHQvL1x0XHR0aGlzLmdhbWUuZ2FpblNjb3JlKCk7Ly9maXhtZVxyXG5cdFx0Ly9cdFx0dGhpcy5zZWNvbmRKdW1wRmluaXNoPXRydWU7XHJcblx0XHQvL1x0fSBcclxuXHRcdC8vfVxyXG5cdFx0Ly9lbHNlIGlmKHRoaXMuZmlyc3RKdW1wKVxyXG5cdFx0Ly97XHJcblx0XHQvL1x0aWYodGhpcy5maXJzdEp1bXBGaW5pc2g9PWZhbHNlKVxyXG5cdFx0Ly9cdHtcclxuXHRcdC8vXHRcdHRoaXMueSArPSB0aGlzLmp1bXBIZWlnaHQvMjsvL2ZpeG1lXHJcblx0XHQvL1x0XHR0aGlzLmdhbWUuZ2FpblNjb3JlKCk7Ly9maXhtZVxyXG5cdFx0Ly9cdFx0dGhpcy5maXJzdEp1bXBGaW5pc2g9dHJ1ZTtcclxuXHRcdC8vXHR9IFxyXG5cdFx0Ly99XHJcbiAgICAgICAgLy8g6ZmQ5Yi25Li76KeS55qE6YCf5bqm5LiN6IO96LaF6L+H5pyA5aSn5YC8XHJcbiAgICAgICAgaWYgKCBNYXRoLmFicyh0aGlzLnhTcGVlZCkgPiB0aGlzLm1heE1vdmVTcGVlZCApIHtcclxuICAgICAgICAgICAgLy8gaWYgc3BlZWQgcmVhY2ggbGltaXQsIHVzZSBtYXggc3BlZWQgd2l0aCBjdXJyZW50IGRpcmVjdGlvblxyXG4gICAgICAgICAgICB0aGlzLnhTcGVlZCA9IHRoaXMubWF4TW92ZVNwZWVkICogdGhpcy54U3BlZWQgLyBNYXRoLmFicyh0aGlzLnhTcGVlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmoLnmja7lvZPliY3pgJ/luqbmm7TmlrDkuLvop5LnmoTkvY3nva5cclxuICAgICAgICB0aGlzLm5vZGUueCArPSB0aGlzLnhTcGVlZCAqIGR0O1xyXG4gICAgICAgIFxyXG5cdFx0XHJcblx0XHRcclxuICAgIH0sXHJcbiAgICBcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8gZm9vOiB7XHJcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxyXG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxyXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcclxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICAvLyAuLi5cclxuICAgICAgICAvLyDmmJ/mmJ/lkozkuLvop5LkuYvpl7TnmoTot53nprvlsI/kuo7ov5nkuKrmlbDlgLzml7bvvIzlsLHkvJrlrozmiJDmlLbpm4ZcclxuICAgICAgICBwaWNrUmFkaXVzOiAwLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblx0XHRpZih0aGlzLmdldFBsYXllckRpc3RhbmNlKCkgPCB0aGlzLnBpY2tSYWRpdXMpXHJcblx0XHRcdHRoaXMub25QaWNrZWQoKTtcclxuXHRcdC8vIC4uLlxyXG4gICAgICAgIC8vIOagueaNriBHYW1lIOiEmuacrOS4reeahOiuoeaXtuWZqOabtOaWsOaYn+aYn+eahOmAj+aYjuW6plxyXG4gICAgICAgIHZhciBvcGFjaXR5UmF0aW8gPSAxIC0gdGhpcy5nYW1lLnRpbWVyL3RoaXMuZ2FtZS5zdGFyRHVyYXRpb247XHJcbiAgICAgICAgdmFyIG1pbk9wYWNpdHkgPSA1MDtcclxuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IG1pbk9wYWNpdHkgKyBNYXRoLmZsb29yKG9wYWNpdHlSYXRpbyAqICgyNTUgLSBtaW5PcGFjaXR5KSk7XHJcblxyXG4gICAgfSwgXHJcblx0XHJcblx0Z2V0UGxheWVyRGlzdGFuY2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyDmoLnmja4gcGxheWVyIOiKgueCueS9jee9ruWIpOaWrei3neemuyAgICAgICAgXHJcblx0XHR2YXIgcGxheWVyUG9zID0gdGhpcy5nYW1lLnBsYXllci5nZXRQb3NpdGlvbigpO1xyXG4gICAgICAgIC8vIOagueaNruS4pOeCueS9jee9ruiuoeeul+S4pOeCueS5i+mXtOi3neemu1xyXG4gICAgICAgIHZhciBkaXN0ID0gdGhpcy5ub2RlLnBvc2l0aW9uLnN1YihwbGF5ZXJQb3MpLm1hZygpO1xyXG4gICAgICAgIHJldHVybiBkaXN0O1xyXG4gICAgfSxcclxuXHJcbiAgICBvblBpY2tlZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g5b2T5pif5pif6KKr5pS26ZuG5pe277yM6LCD55SoIEdhbWUg6ISa5pys5Lit55qE5o6l5Y+j77yM55Sf5oiQ5LiA5Liq5paw55qE5pif5pifXHJcbiAgICAgICAgdGhpcy5nYW1lLnNwYXduTmV3U3RhcigpO1xyXG5cdFx0Ly8g546p5a625b6X5YiGXHJcblx0XHR0aGlzLmdhbWUuZ2FpblNjb3JlKCk7XHJcbiAgICAgICAgLy8g54S25ZCO6ZSA5q+B5b2T5YmN5pif5pif6IqC54K5XHJcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcclxuICAgIH0sXHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9