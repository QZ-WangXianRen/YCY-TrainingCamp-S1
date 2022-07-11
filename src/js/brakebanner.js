class BrakeBanner{
		constructor(selector){
		// 创建
		this.app = new PIXI.Application({
			width:window.innerWidth,
			height:window.innerHeight,
			backgroundColor:0xffffff,
			resizeTo:window
		})
		this.stage = this.app.stage;
		// 渲染
		document.querySelector(selector).appendChild(this.app.view);
		// 加载资源
		this.loader = new PIXI.Loader();
		this.loader.add("btn.png","images/btn.png");
		this.loader.add("btn_circle.png","images/btn_circle.png");
		this.loader.add("brake_bike.png","images/brake_bike.png");
		this.loader.add("brake_handlerbar.png","images/brake_handlerbar.png");
		this.loader.add("brake_lever.png","images/brake_lever.png");
		this.loader.add("malu.png","images/malu.png");
		this.loader.add("malu_line.png","images/malu_line.png");
		this.loader.load();
		this.loader.onComplete.add(()=>{
			this.show();
		});
	}
	show(){
		//马路
		let maluliney = new PIXI.Container(); 
		maluliney.pivot.x = window.innerWidth/2;
		maluliney.pivot.y = window.innerHeight/2;
		//位置
		maluliney.x = window.innerWidth/2;
		maluliney.y = window.innerHeight/2;
		this.stage.addChild(maluliney);
		//旋转
		maluliney.rotation = 35*Math.PI/180;
		//引入马路
		let malu = new PIXI.Sprite(this.loader.resources['malu.png'].texture);
		//缩放
		malu.pivot.x = malu.pivot.y = 0.5;
		maluliney.addChild(malu);
		//车
		let bikeContainer = new PIXI.Container();
		this.stage.addChild(bikeContainer);
		bikeContainer.scale.x = bikeContainer.scale.y = 0.3;
		let bikeImage = new PIXI.Sprite(this.loader.resources['brake_bike.png'].texture);
		bikeContainer.addChild(bikeImage);
		let bikeLever = new PIXI.Sprite(this.loader.resources['brake_lever.png'].texture);
		bikeContainer.addChild(bikeLever);
		bikeLever.pivot.x = 455;
		bikeLever.pivot.y = 455;
		bikeLever.x = 722;
		bikeLever.y = 900;
		let bikeHand = new PIXI.Sprite(this.loader.resources['brake_handlerbar.png'].texture);
		bikeContainer.addChild(bikeHand);


		//调用创建按钮
		let actionbtn = this.createAction();
		// 调整坐上边距
		actionbtn.x = actionbtn.y = 500;
		actionbtn.interactive = true;
		actionbtn.buttonMode = true;
		// 按下效果
		actionbtn.on("mousedown",()=>{
			//按下执行刹车把的动画
			gsap.to(bikeLever,{duration:.6,rotation:Math.PI/180*-30});
			pause();
		})
		// 松开效果
		actionbtn.on("mouseup",()=>{
			//松开执行刹车把松开动画
			gsap.to(bikeLever,{duration:.6,rotation:0});
			start();
		})


		// 变换浏览器大小重置位置
		let resize =  () => {
			bikeContainer.x = window.innerWidth - bikeContainer.width;
			bikeContainer.y = window.innerHeight - bikeContainer.height;
			malu.x = window.innerWidth - bikeContainer.width-600;
			malu.y = window.innerHeight - bikeContainer.height-600;
		}

		window.addEventListener('resize',resize);
		resize();
		//新建点的容器
		let particle = new PIXI.Container(); 
		this.stage.addChild(particle);
		//调整中心点
		particle.pivot.x = window.innerWidth/2;
		particle.pivot.y = window.innerHeight/2;
		//调整位置
		particle.x = window.innerWidth/2;
		particle.y = window.innerHeight/2;
		//调整角度（旋转）
		particle.rotation = 35*Math.PI/180;
		//新建一个数组存储点位
		let particlelist = [];
		// 循环创建点
		for (let i = 0; i < 10; i++) {
			let gr = new PIXI.Graphics();
			// 取色
			gr.beginFill(this.setColor4());
			gr.drawCircle(0,0,6);
			gr.endFill();
			// 位置随机取
			let pitem = {
				sx:Math.random()*window.innerWidth,
				sy:Math.random()*window.innerHeight,
				gr:gr
			}
			gr.x = pitem.sx;
			gr.y = pitem.sy;
			particle.addChild(gr);
			particlelist.push(pitem);
		}
		//设置运动速度
		let speed = 0;
		//判断是开始还是暂停
		let status = true;
		// 运动
		function loop(){
			//如果是开始，则加速慢点
			if(status){
				speed+=.2;
			}else{
				//如果是结束，则停止的动画快点
				speed-=.4;
			}
			//设置加速最大值
			speed = Math.min(speed,20);
			//设置减速最小值
			speed = Math.max(speed,0);
			//循环改变点的位置
			for (let i = 0; i < particlelist.length; i++) {
				const pitem = particlelist[i];
				pitem.gr.y+=speed;
				pitem.sy = pitem.gr.y;
				//当速度大于20时，以固定速度移动并拉伸点，看起来像一条线
				if(speed>=20){
					pitem.gr.scale.y=40;
					pitem.gr.scale.x=0.03;
				}
				//超出屏幕重置位置
				if(pitem.gr.y>window.innerHeight)pitem.gr.y=0;
			}
			//计算改变Y
			maluliney.y+=(Math.cos(35*Math.PI/180))*speed;
			//计算改变X
			maluliney.x-=(Math.sin(35*Math.PI/180))*speed;
			//超出重置
			if(maluliney.y>400)maluliney.y=-100,maluliney.x=620;
		}
		function start(){
			speed = 0;
			status = true;
			gsap.ticker.remove(loop);
			gsap.to(bikeContainer,{duration:.6,x:window.innerWidth - bikeContainer.width,y:window.innerHeight - bikeContainer.height});
			gsap.ticker.add(loop);
		}
		function pause(){
			status = false;
			for (let i = 0; i < particlelist.length; i++) {
				const pitem = particlelist[i];
				pitem.gr.scale.y=1;
				pitem.gr.scale.x=1;
				gsap.to(pitem.gr,{duration:.6,x:pitem.sx,y:pitem.sy,case:'elastic.out'});
			}
			gsap.to(bikeContainer,{duration:.6,x:window.innerWidth - bikeContainer.width-50,y:window.innerHeight - bikeContainer.height +50});
		}
		start();
		
	}
	setColor4(){
		var str='0123456789abcdef';
		var colorStr='';
		for(var i=1;i<=6;i++){
			colorStr+=str[parseInt(Math.random()*str.length)];
		}
		return '0x'+colorStr;
	}
	createAction(){
		//创建一个容器，存放按钮
		let actionbtn = new PIXI.Container();
		this.stage.addChild(actionbtn);
		//创建按钮
		let btni = new PIXI.Sprite(this.loader.resources['btn.png'].texture);
		//按钮边上的圆
		let btnc = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture);
		let btnc2 = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture);
		//添加到画布渲染
		actionbtn.addChild(btni);
		actionbtn.addChild(btnc);
		actionbtn.addChild(btnc2);
		//调整位置
		btni.pivot.x = btni.pivot.y = btni.width/2;
		btnc.pivot.x = btnc.pivot.y = btnc.width/2;
		btnc2.pivot.x = btnc2.pivot.y = btnc2.width/2;
		//调整大小缩放
		btnc.scale.x = btnc.scale.y = 0.8;
		//动画效果
		gsap.to(btnc.scale,{duration:1,x:1.3,y:1.3,repeat:-1});
		gsap.to(btnc,{duration:1,alpha:0,repeat:-1});
		return actionbtn;
	}
}