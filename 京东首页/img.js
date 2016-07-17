window.$=HTMLElement.prototype.$=function(selector){
    //如果$被全局调用，就在document中找，
    //否则，在当前元素下找
    var elems=(this==window?document:this)
        .querySelectorAll(selector);
    if(elems==null){//如果没找到
        return null;
    }else if(elems.length==1){//如果只找到一个
        return elems[0]; //只返回一个
    }else{//如果找到多个
        return elems; //返回元素对象的集合
    }
}
/*保存广告数据的数组*/
var imgs=[
    {"i":0,"img":"images/index/banner_01.jpg"},
    {"i":1,"img":"images/index/banner_02.jpg"},
    {"i":2,"img":"images/index/banner_03.jpg"},
    {"i":3,"img":"images/index/banner_04.jpg"},
    {"i":4,"img":"images/index/banner_05.jpg"},
];

var adv={//对象
    LIWIDTH:670,//每个广告li的宽度
    DURATION:500,//每次滚动的总时长
    INTERVAL:20,//滚动动画每一步的时间间隔
    WAIT:3000,//自动轮播的时间间隔
    timer:null,//记录当前正在轮播的动画的序号,每次启动新动画，都要先停旧动画
    canAuto:true,//是否自动轮播
    ulImgs:null,//要轮播的图片ul
    ulIdxs:null,//广告序号的ul
    init:function(){
        var self=this;
        self.ulImgs=$("#imgs");
        //设置ulImgs的宽为LIWIDTH*imgs中图片的个数
        self.ulImgs.style.width=self.LIWIDTH*imgs.length+"px";
        self.ulIdxs=$("#indexs");
        //将i+1放入idxs的当前位置，之后i递增1
        for(var i=0,idxs=[];i<imgs.length;idxs[i]=i++ +1);//[1,2,3,4,5]
        //将'<li class="hover">'+idxs.join('</li><li>')+'</li>',放入到self的ulIdxs的内容中
        self.ulIdxs.innerHTML='<li class="hover">'+idxs.join("</li><li>")+'</li>';

        //刷新界面
        self.updateView();

        //为index按钮绑定onmouseover事件
        self.ulIdxs.onmouseover=function(){
            var e=window.event||arguments[0];
            var target=e.target||e.srcElement;
            //如果target不是LI，且target内容-1不是imgs中第一个i-1(当前图片的下标)
            if(target.nodeName=="LI"&&target.innerHTML-1!=imgs[0].i){
                $("#indexs>.hover").className="";
                $("#indexs>li")[imgs[0].i].className="hover";
                self.move(target.innerHTML-1-imgs[0].i);//新位置-原位置==>n-->move
            }
        }
        $("#slider").onmouseover=function(){
            self.canAuto=false;
        }
        $("#slider").onmouseout=function(){
            self.canAuto=true;
        }
        self.startAutoMove();
    },
    updateView:function(){
        var self=this;
        for(var i=0,lis=[];i<imgs.length;i++){
            lis[i]='<li><img src="'+imgs[i].img+'"/></li>';
        }
        self.ulImgs.innerHTML=lis.join("");
        //清除原来的index的hover类
        $("#indexs>.hover").className="";
        //将self的ulIdxs下所有li中和imgs中0位置对象的i属性对应位置的li,设置为hover
        self.ulIdxs.$("li")[imgs[0].i].className="hover";//为选中的index增加hover类
    },
    startAutoMove:function(){
        var self=this;
        self.timer=setTimeout(function(){
            if(self.canAuto){//可选择不调用move
                self.move(1);
            }else{//
                self.startAutoMove();
            }
        },self.WAIT);
    },
    move:function(n){//将ul移动n个位置
        var self=this;
        //先停止正在播放的动画
        clearTimeout(self.timer);
        self.timer=null;
        if(n<0){//右移（1--->5）
            //从倒数-n开始删除-n个元素，存在dels中
            var dels=imgs.splice(imgs.length-(-n),-n);
            //将剩余imgs拼接到dels结尾，再保存回imgs中
            imgs=dels.concat(imgs);
            self.updateView();
            //修改self的ulImgs的left为LIWIDTH*n
            self.ulImgs.style.left=self.LIWIDTH*n+"px";
            console.log(self.ulImgs.style.left);
        }
        self.moveStep(n);
    },
    moveStep:function(n){//反复移动一步
        var self=this;
        var step=self.LIWIDTH*n/(self.DURATION/self.INTERVAL);
        if(getComputedStyle){
            style=getComputedStyle(self.ulImgs);
        }else{
            style=self.ulImgs.currentStyle;
        }
        var left=parseFloat(style.left)-step;
        self.ulImgs.style.left=left+"px";
        if((n<0&&left<0)||(n>0&&left>self.LIWIDTH*-n)){
            self.timer=setTimeout(function(){self.moveStep(n)},self.INTERVAL);
        }else{
            if(n>0){//右移（5--->1）
                var dels=imgs.splice(0,n);
                imgs=imgs.concat(dels);
                self.updateView();
            }
            self.ulImgs.style.left="0px";
            //只要手动轮播停止，就启动自动轮播
            self.startAutoMove();
        }
    }
}
window.onload=function(){
    adv.init();
    console.log();
}
