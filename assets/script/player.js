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
        disaccel:0,
		// 跳跃音效资源
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function () {
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
    
    onDestroy() {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    
    setJumpAction: function () {
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
	
	playJumpDownCallback: function () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
		// 取消二段跳  
		//this.firstJump = false;
		//this.secondJump = false;
    },
    
	 
    onKeyin(keyCode) {
        switch(keyCode) {
            case cc.KEY.left:
                this.accLeft = true; 
                break;
            case cc.KEY.right:
                this.accRight = true;
                break;	            
        }
    },	 
    onKeyout(keyCode) {
        switch(keyCode) {
            case cc.KEY.left:
                this.accLeft = false; 
                break;
            case cc.KEY.right:
                this.accRight = false;
                break;	            
        }
    },
    
    onKeyDown(event) {
        // set a flag when key pressed
        switch(event.keyCode) {
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
    
     onKeyUp(event) {
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.KEY.left:
                this.accLeft = false;
                break;
            case cc.KEY.right:
                this.accRight = false;
                break;
        }
    },
    
    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        } else
        {//不操作应该逐渐减速
            if(this.xSpeed > 0 && this.xSpeed-this.disaccel > 0 )
                this.xSpeed -= this.disaccel;
            else if(this.xSpeed < 0 && this.xSpeed+this.disaccel < 0)
                this.xSpeed += this.disaccel;
            else
                this.xSpeed = 0;
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
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;
        
		
		
    },
    
});
