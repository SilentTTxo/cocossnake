var time = 20;
var dellong = 7500;
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
var isSkillOpen = false;
var ScoreDel = 10;
var Game ;
var Touch_1,Touch_2,pos1;
SkillTable = [
            {
                color:"RRR",
                pngurl:"res/RedB.png",
                skillname:"SpeedUP",
                SkillDo:function(){
                    cc.log(dellong);
                    dellong*=2;
                    cc.log(dellong);
                    //var Head = Game.getChildByTag(HEAD_TAG);
                    cc.audioEngine.playEffect(res.fireSkill_wav);
                    var Fire = cc.ParticleSystem.create(res.s_fire);
                    Fire.x = 0;
                    Fire.y = 0;
                    Fire.duration = 3;
                    Body[1].addChild(Fire,5); 
                    setTimeout(function(){
                        dellong/=2;
                        isSkillOpen = false;
                        setTimeout(function(){
                            Body[1].removeChild(Fire,true);
                        },2000);
                    },3000);
                }
            },
            {
                color:"BBB",
                pngurl:"res/BlueB.png",
                skillname:"ScoreUP",
                SkillDo:function(){
                    ScoreDel*=2;  
                    setTimeout(function(){
                        ScoreDel/=2;;
                        isSkillOpen = false;
                    },3000);
                }
            },
            ];
var PlayLayer = cc.Layer.extend({
    bgSprite:null,
    ctor:function () {
        this._super();
        this.initGame();
        Game = this;

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
        this.addHead();
        this.addFood();
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
            if(keyCode==32){
                cc.log("Skill!");
                for(bodyi = 1;bodyi < BodyNum ; bodyi++){
                    for(i = 0;i < SkillTable.length;i++){
                        if(Body[bodyi].displayFrame()._texture.url == SkillTable[i].pngurl){
                            isSkillOpen = true;
                            Point = cc.p(Body[bodyi].x,Body[bodyi].y);
                            Game.removeChild(Body[bodyi],true);
                            Body[bodyi] = new cc.Sprite(res.NoSkill_png);
                            Body[bodyi].attr({
                                x:Point.x,
                                y:Point.y
                            });
                            Game.addChild(Body[bodyi],5);
                            SkillTable[i].SkillDo();
                            switch(fx){
                                case 38:Move(0,dellong);break;//up
                                case 37:Move(-1*dellong,0);break;//left
                                case 39:Move(dellong,0);break;//right
                                case 40:Move(0,-1*dellong);break;//down
                            }
                            return;
                        }
                    }
                }
                return ;
            }
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
        cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function (touch, event) {
            Touch_1 = touch;
            pos1 = cc.p(Touch_1.getLocation());
            return true;
        },
        onTouchEnded: function (touch, event) {
            Touch_2 = touch;
            pos2 = cc.p(Touch_2.getLocation());
            delx = pos2.x - pos1.x;
            dely = pos2.y - pos1.y;
            function Move(x,y){
                Head.stopAllActions();
                var MoveAction =  cc.MoveBy.create(time,x,y);
                Head.runAction(new cc.RepeatForever(MoveAction));
            };
            //单击事件
            if(delx == 0 && dely == 0) {
                cc.log("Single click!");
                for(bodyi = 1;bodyi < BodyNum ; bodyi++){
                    for(i = 0;i < SkillTable.length;i++){
                        if(Body[bodyi].displayFrame()._texture.url == SkillTable[i].pngurl){
                            isSkillOpen = true;
                            Game.removeChild(Body[bodyi],true);
                            Body[bodyi] = new cc.Sprite(res.NoSkill_png);
                            Game.addChild(Body[bodyi],5);
                            SkillTable[i].SkillDo();
                            switch(fx){
                                case 38:Move(0,dellong);break;//up
                                case 37:Move(-1*dellong,0);break;//left
                                case 39:Move(dellong,0);break;//right
                                case 40:Move(0,-1*dellong);break;//down
                            }
                            return;
                        }
                    }
                }
                return ;
            }
            keyCode = 0;

            if(Math.abs(delx)>Math.abs(dely)){
                if(delx<0) keyCode = 37;
                else keyCode = 39;
            }
            else{
                if(dely<0) keyCode = 40;
                else keyCode = 38;
            }
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
        function RandomXY(){
            var x = size.width*cc.random0To1();
            if (x < Food1.width/2) x = Food1.width/2;
            if (x > size.width-Food1.width/2) x = size.width-Food1.width/2;
            var y = size.height*cc.random0To1();
            if (y < Food1.height/2+size.height/6) y = Food1.height/2+size.height/6;
            if (y > -Food1.height/2+size.height) y = -Food1.height/2+size.height;
            return cc.p(x,y)
        }
        var xy = RandomXY();
        Food1.attr({
            x: xy.x,
            y: xy.y
        });
        for(bodyi = 0;bodyi < BodyNum; bodyi++){
            if(cc.rectIntersectsRect(Food1.getBoundingBox(),Body[bodyi].getBoundingBox())){
                bodyi = 0;
                var xy = RandomXY();
                Food1.attr({
                    x: xy.x,
                    y: xy.y
                });
            }
        }
        FOOD1_TAG++;
        Food1.setOpacity(0);
        this.addChild(Food1,5,FOOD1_TAG);
        Food1.runAction(cc.FadeIn.create(0.2));
        var xy = RandomXY();
        Food2.attr({
            x: xy.x,
            y: xy.y
        });
        for(bodyi = 0;bodyi < BodyNum; bodyi++){
            if(bodyi == 0){
                if(cc.rectIntersectsRect(Food2.getBoundingBox(),Food1.getBoundingBox())){
                    bodyi = -1;
                    var xy = RandomXY();
                    Food2.attr({
                        x: xy.x,
                        y: xy.y
                    });
                    continue;
                }
            }
            if(cc.rectIntersectsRect(Food2.getBoundingBox(),Body[bodyi].getBoundingBox())){
                bodyi = 0;
                var xy = RandomXY();
                Food2.attr({
                    x: xy.x,
                    y: xy.y
                });
            }
        }
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
    isEat:function(){
        var size = cc.winSize;
        var Head = this.getChildByTag(HEAD_TAG);
        var Food1 = this.getChildByTag(FOOD1_TAG);
        var Food2 = this.getChildByTag(FOOD2_TAG);
        var hBox = Head.getBoundingBox();
        var fBox1 = Food1.getBoundingBox();
        var fBox2 = Food2.getBoundingBox();
        if(cc.rectIntersectsRect(hBox,fBox1)||cc.rectIntersectsRect(hBox,fBox2)){
            cc.audioEngine.playEffect(res.eat_wav);
            var color = "";
            if(cc.rectIntersectsRect(hBox,fBox1)) color = Food1.displayFrame()._texture.url;
            if(cc.rectIntersectsRect(hBox,fBox2)) color = Food2.displayFrame()._texture.url;
            this.addBody(color);
            this.addScore(ScoreDel);
            this.addFood();
            Food1.runAction(cc.FadeOut.create(0.2));
            Food2.runAction(cc.FadeOut.create(0.2));
            setTimeout(this.removeChild(Food1,true),0.2);
            setTimeout(this.removeChild(Food2,true),0.2);  
            //this.removeChild(Food,true);

            this.isSkillOk();
        }
    },
    isGameover:function(){
        var size = cc.winSize;
        var Head = this.getChildByTag(HEAD_TAG);
        var x = Head.x;
        var y = Head.y;
        var key = 0;
        if (x < Head.width/2 || x > size.width-Head.width/2 || y < Head.height/2+size.height/6 || y > -Head.height/2+size.height) this.gameover();
        for(bodyi = 6;bodyi < BodyNum; bodyi++){
            if(cc.rectIntersectsRect(Head.getBoundingBox(),Body[bodyi].getBoundingBox())){
                this.gameover();
            }
        }
    },
    isSkillOk:function(){
        function GetColor(x){
            color = x.displayFrame()._texture.url;
            switch(color){
                case "res/Red.png":return 'R';
                case "res/Blue.png":return 'B';
                case "res/Yellow.png":return 'Y';
            }
            return 'S';
        }
        function SetSkill(i,skillcolor,THIS){

            var Skill =  null;
            for(y =0;y<SkillTable.length;y++){
                if(SkillTable[y].color==skillcolor) Skill=SkillTable[y];
            }
            if(Skill == null) return false;
            var temp = cc.p(Body[i].x,Body[i].y);
            for(cont = 0; cont < 2; cont++){
                for(bodyi = i - 2 ;bodyi < BodyNum-1; bodyi++){
                    THIS.removeChild(Body[bodyi],true);
                    Body[bodyi] = Body[bodyi+1];
                }
            }
            THIS.removeChild(Body[i-2],true);
            Body[i-2] = new cc.Sprite(Skill.pngurl);
            Body[i-2].attr({
                x:temp.x,
                y:temp.y
            });
            THIS.addChild(Body[i-2],5);
            BodyNum-=2;
            cc.audioEngine.playEffect(res.skillOk_wav);
        }
        SkillColor = "";
        si = 0;
        for(bodyi = 1;bodyi < BodyNum; bodyi++){
            if(bodyi >= BodyNum - 2 && si == 0) return ;
            if(GetColor(Body[bodyi])!='S'){
                SkillColor+=GetColor(Body[bodyi]);
                si++;
                if(si == 3) {
                    //choose skill
                    //cc.log(SkillColor);
                    if(!SetSkill(bodyi,SkillColor,this)){
                        si = 0;
                        bodyi -= 2;
                        SkillColor = "";
                    }
                }
            }
            else {
                si = 0;
                SkillColor = "";
            }
        }
    },
    update:function(){
        this.isEat();
        this.isGameover();
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
        if(dellong>=25000 && !isSkillOpen) dellong=25000;

        cc.log(dellong+"/"+time+"="+dellong/time);
    },
    initGame:function(){
        time = 20;
        dellong = 7500;
        fx = 0;
        HEAD_TAG = 0;
        FOOD1_TAG = 1;
        FOOD2_TAG = 100;
        SCORE_TAG = 1000;
        HEAD_EG_TAG =3000;
        COLOR_TYPE = 3;
        isOver = false;
        scoreNum = 0;
        Body = [];
        BodyNum = 1;
        zxPoint = [];
        pPoint = 0;
        BODYMOVE_TAG = 5000;
        isSkillOpen = false;
        size = cc.winSize;

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
        var titleLabel = new cc.LabelTTF("Game Over", "Arial", 150);
        titleLabel.attr({
            x:size.width / 2 ,
            y:size.height / 2 + 100
        });
        gameOver.addChild(titleLabel, 5);
        for(bodyi = 0;bodyi < BodyNum; bodyi++){
            Body[bodyi].stopAllActions();
        }
        this.unscheduleAllCallbacks();
        var TryAgainItem = new cc.MenuItemFont(
                "Try Again",
                function () {
                    cc.log("Menu is clicked!");
                    var transition= cc.TransitionFade.create(1, new PlayScene(),cc.color(255,255,255,255));
                    cc.director.runScene(transition);
                }, this);
        TryAgainItem.fontSize = 100;
        TryAgainItem.attr({
            x: size.width/2,
            y: size.height / 2 - 100,
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
            var move = new cc.MoveTo.create(0.8*juli*time/dellong,Body[bodyi-1].x,Body[bodyi-1].y);
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