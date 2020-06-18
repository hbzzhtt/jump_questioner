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
    },
 
    // use this for initialization
    onLoad: function () {
        //想达到按住节点，节点才能移动的效果，将监听函数注册到 this.node 上
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

    },
    
    onTouchEnd:function() {
        this.player.getComponent('player').onKeyUp(cc.KEY.right);
    },
    
    onTouchStart:function() {
        this.player.getComponent('player').onKeyDown(cc.KEY.right);
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
