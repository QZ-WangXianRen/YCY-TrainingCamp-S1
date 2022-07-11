class BrakeBanner{
	constructor(selector){
		this.app = new PIXI.Application({
			width:window.innerWidth,
			height:window.innerHeight,
			backgroundColor:0xffffff,
			resizeTo:window
		})
		this.stage = this.app.stage;
		document.querySelector(selector).appendChild(this.app.view);
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

		let maluliney = new PIXI.Container(); 
		// maluliney.rotation = 35*Math.PI/180;
		maluliney.pivot.x = window.innerWidth/2;
		maluliney.pivot.y = window.innerHeight/2;
		
		maluliney.x = window.innerWidth/2;
		maluliney.y = window.innerHeight/2;
		this.stage.addChild(maluliney);
		maluliney.rotation = 35*Math.PI/180;
		

		let malu = new PIXI.Sprite(this.loader.resources['malu.png'].texture);
		malu.pivot.x = malu.pivot.y = 0.5;
		maluliney.addChild(malu);


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



		let actionbtn = this.createAction();
		actionbtn.x = actionbtn.y = 500;

		actionbtn.interactive = true;
		actionbtn.buttonMode = true;

		actionbtn.on("mousedown",()=>{
			gsap.to(bikeLever,{duration:.6,rotation:Math.PI/180*-30});
			pause();
		})
		actionbtn.on("mouseup",()=>{
			gsap.to(bikeLever,{duration:.6,rotation:0});
			start();
		})

		
		
		let resize =  () => {
			bikeContainer.x = window.innerWidth - bikeContainer.width;
			bikeContainer.y = window.innerHeight - bikeContainer.height;
			malu.x = window.innerWidth - bikeContainer.width-600;
			malu.y = window.innerHeight - bikeContainer.height-600;
		}

		window.addEventListener('resize',resize);
		resize();

		let particle = new PIXI.Container(); 
		this.stage.addChild(particle);
		
		particle.pivot.x = window.innerWidth/2;
		particle.pivot.y = window.innerHeight/2;
		
		particle.x = window.innerWidth/2;
		particle.y = window.innerHeight/2;
		particle.rotation = 35*Math.PI/180;
		let particlelist = [];
		for (let i = 0; i < 10; i++) {
			let gr = new PIXI.Graphics();
			gr.beginFill(this.setColor4());
			gr.drawCircle(0,0,6);
			gr.endFill();
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

		let speed = 0;
		let status = true;
		function loop(){
			if(status){
				speed+=.2;
			}else{
				speed-=.4;
			}
			speed = Math.min(speed,20);
			speed = Math.max(speed,0);
			for (let i = 0; i < particlelist.length; i++) {
				const pitem = particlelist[i];
				pitem.gr.y+=speed;
				pitem.sy = pitem.gr.y;
				if(speed>=20){
					pitem.gr.scale.y=40;
					pitem.gr.scale.x=0.03;
				}
				if(pitem.gr.y>window.innerHeight)pitem.gr.y=0;
			}
			maluliney.y+=(Math.cos(35*Math.PI/180))*speed;
			maluliney.x-=(Math.sin(35*Math.PI/180))*speed;
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
		let actionbtn = new PIXI.Container();
		this.stage.addChild(actionbtn);
		let btni = new PIXI.Sprite(this.loader.resources['btn.png'].texture);
		let btnc = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture);
		let btnc2 = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture);
		actionbtn.addChild(btni);
		actionbtn.addChild(btnc);
		actionbtn.addChild(btnc2);
		btni.pivot.x = btni.pivot.y = btni.width/2;
		btnc.pivot.x = btnc.pivot.y = btnc.width/2;
		btnc2.pivot.x = btnc2.pivot.y = btnc2.width/2;
		btnc.scale.x = btnc.scale.y = 0.8;
		gsap.to(btnc.scale,{duration:1,x:1.3,y:1.3,repeat:-1});
		gsap.to(btnc,{duration:1,alpha:0,repeat:-1});
		return actionbtn;
	}
}