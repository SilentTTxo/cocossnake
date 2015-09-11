var time = 20;
var dellong = 10000;
var fx = 0;
var HEAD_TAG = 0;
var FOOD1_TAG = 1;
var FOOD2_TAG = 100;
var SCORE_TAG = 1000;
var HEAD_EG_TAG =3000;
var COLOR_TYPE = 3;
var isOver = false;
var scoreNum = 0;
var Body = [];
var BodyNum = 1;
var zxPoint = [];
var pPoint = 0;
var BODYMOVE_TAG = 5000;
var PlayLayer = cc.Layer.extend({
    bgSprite:null,
    ctor:function () {
        this._super();
        this.initGame();

        var size = cc.winSize;

        // add bg
        this.bgSprite = new cc.Sprite(res.PlayB_png);
        this.bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            //scale: 0.5,
            //rotation: 180
        });
        this.addChild(this.bgSprite, 0);
        this.addFood();
        this.addHead();
        var Head = this.getChildByTag(0);
        this.schedule(this.update);
        this.schedule(this.bodyMove,0.08,BODYMOVE_TAG);
        cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyPressed:  function(keyCode, event){
            var label = event.getCurrentTarget();
            function Move(x,y){
                Head.stopAllActions();
                var MoveAction =  cc.MoveBy.create(time,x,y);
                Head.runAction(new cc.RepeatForever(MoveAction));
            };
            //通过判断keyCode来确定用户按下了哪个键
            //cc.log("Key " + keyCode.toString() + " was pressed!");
            if((keyCode-fx)!=2&&(keyCode-fx)!=-2&&keyCode!=fx&&!isOver){
                if(fx==0){
                    fx=39;
                }
                switch(keyCode){
                    case 38:Move(0,dellong);break;//up
                    case 37:Move(-1*dellong,0);break;//left
                    case 39:Move(dellong,0);break;//right
                    case 40:Move(0,-1*dellong);break;//down
                };
                if(keyCode-fx==3)  Head.runAction(cc.rotateBy(0.1,(keyCode-fx-4)*90));
                else if(keyCode-fx==-3)  Head.runAction(cc.rotateBy(0.1,(keyCode-fx+4)*90));
                else Head.runAction(cc.rotateBy(0.1,(keyCode-fx)*90));
                
                fx = keyCode;
            }
        }
    }, this); 
        return true;
    },
    addFood:function () {
        var Food1 = new cc.Sprite(this.chooseColor());
        var Food2 = new cc.Sprite(this.chooseColor());
        var size = cc.winSize;

        //cc.log("height="+Food.height+"width="+Food.width);
        var x = size.width*cc.random0To1();
        if (x < Food1.width/2) x = Food1.width/2;
        if (x > size.width-Food1.width/2) x = size.width-Food1.width/2;
        var y = size.height*cc.random0To1();
        if (y < Food1.height/2+size.height/6) y = Food1.height/2+size.height/6;
        if (y > -Food1.height/2+size.height) y = -Food1.height/2+size.height;
        Food1.attr({
            x: x,
            y: y
        });
        FOOD1_TAG++;
        Food1.setOpacity(0);
        this.addChild(Food1,5,FOOD1_TAG);
        Food1.runAction(cc.FadeIn.create(0.2));
        do{
            var x = size.width*cc.random0To1();
            if (x < Food2.width/2) x = Food2.width/2;
            if (x > size.width-Food2.width/2) x = size.width-Food2.width/2;
            var y = size.height*cc.random0To1();
            if (y < Food2.height/2+size.height/6) y = Food2.height/2+size.height/6;
            if (y > -Food2.height/2+size.height) y = -Food2.height/2+size.height;
            Food2.attr({
                x: x,
                y: y
            });
        }while(cc.rectIntersectsRect(Food1.getBoundingBox(),Food2.getBoundingBox()));
        FOOD2_TAG++;
        Food2.setOpacity(0);
        this.addChild(Food2,5,FOOD2_TAG);
        Food2.runAction(cc.FadeIn.create(0.2));
    },
    addHead:function () {
        var Head = new cc.Sprite(res.Head_png);
        var size = cc.winSize;

        var x = Head.width/2;
        var y = size.height-Head.height/2;
        Head.attr({
            x: x,
            y: y
        });

        this.addChild(Head,5,HEAD_TAG);
        Body[0] = Head;
    },
    update:function(){
        var size = cc.winSize;
        var Head = this.getChildByTag(HEAD_TAG);
        var Food1 = this.getChildByTag(FOOD1_TAG);
        var Food2 = this.getChildByTag(FOOD2_TAG);
        var hBox = Head.getBoundingBox();
        var fBox1 = Food1.getBoundingBox();
        var fBox2 = Food2.getBoundingBox();
        if(cc.rectIntersectsRect(hBox,fBox1)||cc.rectIntersectsRect(hBox,fBox2)){
            var color = "";
            if(cc.rectIntersectsRect(hBox,fBox1)) color = Food1.displayFrame()._texture.url;
            if(cc.rectIntersectsRect(hBox,fBox2)) color = Food2.displayFrame()._texture.url;
            this.addBody(color);
            this.addScore(10);
            this.addFood();
            Food1.runAction(cc.FadeOut.create(0.2));
            Food2.runAction(cc.FadeOut.create(0.2));
            setTimeout(this.removeChild(Food1,true),0.2);
            setTimeout(this.removeChild(Food2,true),0.2);  
            //this.removeChild(Food,true);
        }
        var x = Head.x;
        var y = Head.y;
        var key = 0;
        if (x < Head.width/2 || x > size.width-Head.width/2 || y < Head.height/2+size.height/6 || y > -Head.height/2+size.height) this.gameover();
    },
    chooseColor:function(){
        var x = Math.floor(COLOR_TYPE*Math.random());
        var a = new Array();
        a=[res.Yellow_png,res.Blue_png,res.Red_png];
        return a[x];
    },
    addScore:function(delta){
        var Scoreee = this.getChildByTag(SCORE_TAG);
        scoreNum+=delta;
        Scoreee.setString(scoreNum);
        dellong += 200;
        if(dellong>=25000) dellong=25000;

        cc.log(dellong/time);
    },
    initGame:function(){
        time = 20;
        speed = time*500;
        fx = 0;
        HEAD_TAG = 0;
        FOOD1_TAG = 1;
        FOOD2_TAG = 100;
        COLOR_TYPE = 3;
        isOver = false;
        scoreNum = 0;
        var size = cc.winSize;

        //ScoreLable
        var scoreText = new cc.LabelTTF("0", "Arial", 60);
        scoreText.attr({
            x:size.width * 7 / 20 ,
            y:size.height * 0.13
        });
        this.addChild(scoreText, 5,SCORE_TAG);

        //SkillSprite
        /*var scoreText = new cc.LabelTTF("0", "Arial", 60);
        scoreText.attr({
            x:size.width * 7 / 20 ,
            y:size.height * 0.13
        });
        this.addChild(scoreText, 5,SCORE_TAG);*/
    },
    gameover:function(){
        isOver = true;
        var Head = this.getChildByTag(HEAD_TAG);
        Head.stopAllActions();
        var gameOver = new cc.LayerColor(cc.color(225,225,225,100));
        var size = cc.winSize;
        var titleLabel = new cc.LabelTTF("Game Over", "Arial", 60);
        titleLabel.attr({
            x:size.width / 2 ,
            y:size.height / 2
        });
        gameOver.addChild(titleLabel, 5);
        var TryAgainItem = new cc.MenuItemFont(
                "Try Again",
                function () {
                    cc.log("Menu is clicked!");
                    var transition= cc.TransitionFade.create(1, new PlayScene(),cc.color(255,255,255,255));
                    cc.director.runScene(transition);
                }, this);
        TryAgainItem.attr({
            x: size.width/2,
            y: size.height / 2 - 60,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(TryAgainItem);
        menu.x = 0;
        menu.y = 0;
        gameOver.addChild(menu, 1);
        this.getParent().addChild(gameOver);

        this.unschedule(this.update);
        return;
    },
    bodyMove:function(){
        //BodyMove
        for(bodyi = 1;bodyi < BodyNum;bodyi ++){
            Body[bodyi].stopAllActions();
            var juli = Math.sqrt(Math.pow(Body[bodyi].x-Body[bodyi-1].x,2)+Math.pow(Body[bodyi].y-Body[bodyi-1].y,2));
            var move = new cc.MoveTo.create(0.7*juli*time/dellong,Body[bodyi-1].x,Body[bodyi-1].y);
            //cc.log("snake Speed:"+dellong/time+"|bodyjuli:"+juli*time/dellong);
            Body[bodyi].runAction(move);
        }
    },
    addBody:function(color){
        //AddSnakeBody
        Body[BodyNum] = new cc.Sprite.create(color);
        function setPosition(dx,dy,THIS){
            Body[BodyNum].attr({
                x: Body[BodyNum-1].x+dx,
                y: Body[BodyNum-1].y+dy
            });
            THIS.addChild(Body[BodyNum],5,HEAD_EG_TAG+BodyNum);
            BodyNum++;
        }
        switch(fx){
            case 38:setPosition(0,0,this);break;//up
            case 37:setPosition(0,0,this);break;//left
            case 39:setPosition(0,0,this);break;//right
            case 40:setPosition(0,0,this);break;//down
        };
    }
});

var PlayScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new PlayLayer();
        this.addChild(layer);
    }
});