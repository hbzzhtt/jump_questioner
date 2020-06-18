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
		leftButton:  {
			default: null,
			type: cc.Node
		},
		rightButton:  {
			default: null,
			type: cc.Node
		}
		
			
    },
    // use this for initialization
    onLoad: function () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;
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
    
    onleftTouchEnd:function() {
        this.player.getComponent('player').onKeyout(cc.KEY.left);
    },
    
    onleftTouchStart:function() {
        this.player.getComponent('player').onKeyin(cc.KEY.left);
    },

    onrightTouchEnd:function() {
        this.player.getComponent('player').onKeyout(cc.KEY.right);
    },
    
    onrightTouchStart:function() {
        this.player.getComponent('player').onKeyin(cc.KEY.right);
    },

	gainScore: function() {
		this.score += 1;
		this.scoreDisplay.string = 'Score:' + this.score;
		cc.audioEngine.playEffect(this.scoreAudio, false);
	},
	
    spawnNewStar: function() {
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

    getNewStarPosition: function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标 
		var randY = this.groundY + Math.random() * this.player.getComponent('player').jumpHeight;
        
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width/2;
        randX = (Math.random() - 0.5) * 2 * maxX;
		cc.log('randY is'+randY);
		cc.log('this.groundY is '+ this.groundY);
        // 返回星星坐标
        return cc.v2(randX, randY);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
		// 如果主角的位置到了屏幕边界，就从屏幕另一边出来
		var maxX = this.node.width/2;
		var minX = 0-maxX;
		if(this.player.getComponent('player').node.x > maxX)
			this.player.getComponent('player').node.x = minX;
		else if(this.player.getComponent('player').node.x < minX)
			this.player.getComponent('player').node.x = maxX;
		
		// 如果主角一定时间没有捉到星星，游戏结束了
		if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
		this.timeDisplay.string = 'TimeLeft:' + (parseInt(this.starDuration - this.timer));
    },
	
	gameOver: function () {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
		
        cc.director.loadScene('game');//管理游戏逻辑流程的单例对象，这里是游戏重新开始
    }
});


