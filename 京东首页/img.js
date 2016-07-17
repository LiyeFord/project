window.$=HTMLElement.prototype.$=function(selector){
    //���$��ȫ�ֵ��ã�����document���ң�
    //�����ڵ�ǰԪ������
    var elems=(this==window?document:this)
        .querySelectorAll(selector);
    if(elems==null){//���û�ҵ�
        return null;
    }else if(elems.length==1){//���ֻ�ҵ�һ��
        return elems[0]; //ֻ����һ��
    }else{//����ҵ����
        return elems; //����Ԫ�ض���ļ���
    }
}
/*���������ݵ�����*/
var imgs=[
    {"i":0,"img":"images/index/banner_01.jpg"},
    {"i":1,"img":"images/index/banner_02.jpg"},
    {"i":2,"img":"images/index/banner_03.jpg"},
    {"i":3,"img":"images/index/banner_04.jpg"},
    {"i":4,"img":"images/index/banner_05.jpg"},
];

var adv={//����
    LIWIDTH:670,//ÿ�����li�Ŀ��
    DURATION:500,//ÿ�ι�������ʱ��
    INTERVAL:20,//��������ÿһ����ʱ����
    WAIT:3000,//�Զ��ֲ���ʱ����
    timer:null,//��¼��ǰ�����ֲ��Ķ��������,ÿ�������¶�������Ҫ��ͣ�ɶ���
    canAuto:true,//�Ƿ��Զ��ֲ�
    ulImgs:null,//Ҫ�ֲ���ͼƬul
    ulIdxs:null,//�����ŵ�ul
    init:function(){
        var self=this;
        self.ulImgs=$("#imgs");
        //����ulImgs�Ŀ�ΪLIWIDTH*imgs��ͼƬ�ĸ���
        self.ulImgs.style.width=self.LIWIDTH*imgs.length+"px";
        self.ulIdxs=$("#indexs");
        //��i+1����idxs�ĵ�ǰλ�ã�֮��i����1
        for(var i=0,idxs=[];i<imgs.length;idxs[i]=i++ +1);//[1,2,3,4,5]
        //��'<li class="hover">'+idxs.join('</li><li>')+'</li>',���뵽self��ulIdxs��������
        self.ulIdxs.innerHTML='<li class="hover">'+idxs.join("</li><li>")+'</li>';

        //ˢ�½���
        self.updateView();

        //Ϊindex��ť��onmouseover�¼�
        self.ulIdxs.onmouseover=function(){
            var e=window.event||arguments[0];
            var target=e.target||e.srcElement;
            //���target����LI����target����-1����imgs�е�һ��i-1(��ǰͼƬ���±�)
            if(target.nodeName=="LI"&&target.innerHTML-1!=imgs[0].i){
                $("#indexs>.hover").className="";
                $("#indexs>li")[imgs[0].i].className="hover";
                self.move(target.innerHTML-1-imgs[0].i);//��λ��-ԭλ��==>n-->move
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
        //���ԭ����index��hover��
        $("#indexs>.hover").className="";
        //��self��ulIdxs������li�к�imgs��0λ�ö����i���Զ�Ӧλ�õ�li,����Ϊhover
        self.ulIdxs.$("li")[imgs[0].i].className="hover";//Ϊѡ�е�index����hover��
    },
    startAutoMove:function(){
        var self=this;
        self.timer=setTimeout(function(){
            if(self.canAuto){//��ѡ�񲻵���move
                self.move(1);
            }else{//
                self.startAutoMove();
            }
        },self.WAIT);
    },
    move:function(n){//��ul�ƶ�n��λ��
        var self=this;
        //��ֹͣ���ڲ��ŵĶ���
        clearTimeout(self.timer);
        self.timer=null;
        if(n<0){//���ƣ�1--->5��
            //�ӵ���-n��ʼɾ��-n��Ԫ�أ�����dels��
            var dels=imgs.splice(imgs.length-(-n),-n);
            //��ʣ��imgsƴ�ӵ�dels��β���ٱ����imgs��
            imgs=dels.concat(imgs);
            self.updateView();
            //�޸�self��ulImgs��leftΪLIWIDTH*n
            self.ulImgs.style.left=self.LIWIDTH*n+"px";
            console.log(self.ulImgs.style.left);
        }
        self.moveStep(n);
    },
    moveStep:function(n){//�����ƶ�һ��
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
            if(n>0){//���ƣ�5--->1��
                var dels=imgs.splice(0,n);
                imgs=imgs.concat(dels);
                self.updateView();
            }
            self.ulImgs.style.left="0px";
            //ֻҪ�ֶ��ֲ�ֹͣ���������Զ��ֲ�
            self.startAutoMove();
        }
    }
}
window.onload=function(){
    adv.init();
    console.log();
}
