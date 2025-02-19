/*
By Okazz
*/
let colors = ['#c1292e', '#f1d302', '#1A53C0', '#083d77', '#da4167', '#FBAF00', '#00AF54'];
let ctx;
let motions = [];
let motionClasses = [];
let isAnimating = false;
let lastTriggerTime = 0;
let currentMotionIndex = 0; // 追踪当前使用的动画类型
let isInitialized = false;

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight/3);
	canvas.parent('sketch-holder');
	canvas.style('position', 'fixed');
	canvas.style('top', '0');
	canvas.style('left', '0');
	canvas.style('z-index', '1');
	
	rectMode(CENTER);
	ctx = drawingContext;
	
	motionClasses = [Motion01, Motion02, Motion03, Motion04, Motion05, Motion06, Motion07, Motion08, Motion09, Motion10, Motion11, Motion12, Motion13, Motion14, Motion15, Motion16];
	
	initializeMotions();
	
	// 直接添加鼠标事件监听
	document.addEventListener('mousemove', triggerAnimation);
}

// 修改触发函数，增加节流控制
let lastMoveTime = 0;
function triggerAnimation(event) {
	const currentTime = Date.now();
	if (isAnimating || currentTime - lastMoveTime < 100) { // 增加到 100ms
		return;
	}
	
	lastMoveTime = currentTime;
	isAnimating = true;
	
	currentMotionIndex = (currentMotionIndex + 1) % motionClasses.length;
	updateMotions();
	
	for (let m of motions) {
		m.t = -m.rest;
	}
}

function updateMotions() {
	let gridSize = width * 0.8;
	let cellCount = 6;
	let cellSize = gridSize / cellCount;
	let oldMotions = motions.slice(); // 保存旧的动画
	let newMotions = [];
	let number = 1;
	
	// 创建新的动画
	for (let i = 0; i < cellCount; i++) {
		for (let j = 0; j < cellCount; j++) {
			let index = i * cellCount + j;
			let oldMotion = motions[index];
			
			let MotionClass = motionClasses[(currentMotionIndex + number) % motionClasses.length];
			let newMotion = new MotionClass(
				oldMotion.x,
				oldMotion.y,
				oldMotion.w,
				oldMotion.clr1.toString(),
				oldMotion.clr2.toString()
			);
			
			newMotion.progress = oldMotion.progress;
			newMotion.transitionProgress = 0; // 新动画开始时完全透明
			newMotions.push(newMotion);
			number++;
		}
	}
	
	motions = newMotions;
	
	// 创建过渡动画
	let transitionDuration = 1200; // 增加到 1.2 秒
	let startTime = Date.now();
	
	function animate() {
		let currentTime = Date.now();
		let progress = (currentTime - startTime) / transitionDuration;
		
		if (progress < 1) {
			// 更新所有动画的过渡进度
			motions.forEach((motion, index) => {
				motion.transitionProgress = easeInOutCubic(progress);
			});
			requestAnimationFrame(animate);
		} else {
			// 过渡完成
			motions.forEach(motion => {
				motion.transitionProgress = 1;
			});
		}
	}
	
	animate();
}

function initializeMotions() {
	motions = [];
	let gridSize = width * 0.8;
	let cellCount = 6;
	let cellSize = gridSize / cellCount;
	let number = 1;
	
	for (let i = 0; i < cellCount; i++) {
		for (let j = 0; j < cellCount; j++) {
			let x = cellSize * j + (cellSize / 2) + (width - gridSize) / 2;
			let y = cellSize * i + (cellSize / 2) + (height - gridSize) / 2;
			let MotionClass = motionClasses[number % motionClasses.length];
			let clr1 = random(colors);
			let clr2 = random(colors);
			while (clr1 == clr2) {
				clr2 = random(colors);
			}
			motions.push(new MotionClass(x, y, cellSize * 0.75, clr1, clr2));
			number++;
		}
	}
}

function draw() {
	background(240);
	
	// 启用混合模式以支持透明度
	blendMode(BLEND);
	
	for (let m of motions) {
		m.run();
	}
}

function easeInOutCubic(x) {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

class Motion {
	constructor(x, y, w, clr1, clr2) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.rest = 20;
		this.t = -this.rest;
		this.t1 = 40;
		this.t2 = this.t1 + this.rest;
		this.t3 = this.t2 + 40;
		this.progress = 0;
		this.clr1 = color(clr1);
		this.clr2 = color(clr2);
		this.completed = false;
		this.fadeProgress = 1;
		this.transitionProgress = 1; // 新增：图形切换的过渡进度
	}

	show() {
		// 子类会重写这个方法
	}

	move() {
		if (!isAnimating) return;
		
		if (0 < this.t && this.t < this.t1) {
			this.progress = easeInOutCubic(norm(this.t, 0, this.t1 - 1));
		} else if (this.t2 < this.t && this.t < this.t3) {
			this.progress = easeInOutCubic(1 - norm(this.t, this.t2, this.t3 - 1));
		} else if ((this.t3 + this.rest) < this.t) {
			this.completed = true;
			let allCompleted = motions.every(m => m.completed);
			if (allCompleted) {
				isAnimating = false;
				for (let m of motions) {
					m.completed = false;
				}
			}
			return;
		}
		this.t++;
	}

	run() {
		if (!this.completed) {
			push();
			// 使用 transitionProgress 控制图形切换的透明度
			tint(255, this.transitionProgress * 255);
			this.show();
			this.move();
			pop();
		} else {
			push();
			tint(255, this.transitionProgress * 255);
			this.show();
			pop();
		}
	}
}

class Motion01 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		let h = this.w * this.progress;
		push();
		translate(this.x, this.y);
		noStroke();
		fill(this.clr1);
		rect(0, this.w / 2 - h / 2, this.w, h);

		scale(1 - (this.progress * 2), 1);
		fill(this.clr1);
		if (this.progress > 0.5) {
			fill(this.clr2);
		}
		circle(0, 0, this.w * 0.8);
		fill(this.clr2);
		if (this.progress > 0.5) {
			fill(this.clr1);
		}
		circle(0, 0, this.w * 0.3);
		pop();
	}
}

class Motion02 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		fill(this.clr1);
		noStroke();
		circle(0, 0, lerp(1, 0.45, this.progress) * this.w);
		let r = this.w * lerp(0, 0.5, this.progress);
		fill(this.clr1);
		for (let i = 0; i < 4; i++) {
			let a = ((TAU / 4) * i);
			square(r * 0.75 * cos(a), r * 0.75 * sin(a), this.w * lerp(0, 0.15, this.progress), this.progress * this.w / 4);
		}
		fill(this.clr2);
		rotate(PI / 4);
		for (let i = 0; i < 4; i++) {
			let a = ((TAU / 4) * i);
			square(r * cos(a), r * sin(a), this.w * lerp(0.4, 0.3, this.progress), this.progress * this.w / 4);
		}
		pop();
	}
}

class Motion03 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		let c = 3;
		let w = this.w / c;
		noStroke();
		fill(this.clr1);
		rect(0, 0, this.w * 0.75 * (this.progress));
		for (let i = 0; i < c; i++) {
			for (let j = 0; j < c; j++) {
				let x = i * w + (w / 2) - this.w / 2;
				let y = j * w + (w / 2) - this.w / 2;
				fill(this.clr1);
				circle(x, y, w * 0.75 * (1 - this.progress));
				push();
				fill(this.clr2);
				translate(x, y);
				rotate(TAU * (this.progress));
				rect(0, 0, w * 0.75 * this.progress);
				pop();
			}
		}
		pop();
	}
}

class Motion04 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		noStroke();
		translate(this.x, this.y);
		let clr = lerpColor(this.clr1, this.clr2, this.progress);
		fill(clr);
		rect(-(this.w / 4) + (this.w / 2 * this.progress), -(this.w / 4), this.w / 2);
		rect((this.w / 4) - (this.w / 2 * this.progress), (this.w / 4), this.w / 2);
		fill(this.clr2);
		circle(this.w / 4, -this.w / 4, this.w * 0.3);
		circle(-this.w / 4, this.w / 4, this.w * 0.3);
		fill(this.clr1);
		circle(-this.w / 4, -this.w / 4, this.w * 0.2);
		circle(this.w / 4, this.w / 4, this.w * 0.2);
		pop();
	}
}

class Motion05 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		fill(this.clr1);
		noStroke();
		triangle(this.w / 2, -this.w / 2, this.w / 2 - (this.w * this.progress), this.w / 2 - (this.w * this.progress), -this.w / 2, this.w / 2);
		scale(1, (this.progress * 2) - 1);
		fill(this.clr2);
		beginShape();
		vertex(0, -this.w * 0.3);
		vertex(this.w * 0.3, 0);
		vertex(0, this.w * 0.3);
		vertex(-this.w * 0.3, 0);
		endShape();
		pop();
	}
}

class Motion06 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		fill(this.clr2);
		circle(0, 0, this.w * (1 - this.progress));
		fill(this.clr2);
		for (let i = 0; i < 5; i++) {
			let a = map(i, 0, 5, 0, TAU) + PI / 10;
			let r = this.w * 0.4 * this.progress;
			circle(r * cos(a), r * sin(a), this.w * 0.1);
		}

		fill(this.clr1);
		beginShape();
		for (let i = 0; i < 10; i++) {
			let a = map(i, 0, 10, 0, TAU) + (PI / 10) + (1 - this.progress) * TAU;
			let r = lerp(0.25, 0.5, this.progress) * this.w;
			if (i % 2 == 0) r *= 0.5;
			vertex(r * cos(a), r * sin(a));
		}
		endShape(CLOSE);
		pop();
	}
}

class Motion07 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		fill(this.clr1);
		arc(-this.w / 2 * (1 - this.progress), 0, this.w, this.w, -PI / 2, PI / 2);
		arc(this.w / 2 * (1 - this.progress), 0, this.w, this.w, PI / 2, PI * 1.5);
		fill(this.clr2);
		circle(0, 0, this.w * 0.2 * this.progress);
		pop();
	}
}

class Motion08 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		fill(this.clr1);
		let a = lerp(0.1, 0.5, this.progress) * PI;
		arc(0, 0, this.w, this.w, (PI / 2) - a, (PI / 2) + a);
		let clr = lerpColor(this.clr1, this.clr2, this.progress);
		fill(clr);
		circle(0, lerp(-this.w * 0.3, this.w * 0.3, this.progress), this.w * 0.3);
		pop();
	}
}

class Motion09 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		fill(this.clr1);
		rect(0, (this.w / 4) - (this.progress * this.w / 2), this.w, this.w / 2);
		fill(this.clr2);
		rect((this.w / 4) - (this.progress * this.w / 2), 0, this.w / 2, this.w);
		fill(this.clr1);
		square(this.w / 4, this.w / 4, this.w * lerp(0.25, 0.5, this.progress), this.w / 2 * (1 - this.progress));
		pop();
	}
}

class Motion10 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		push();
		rotate(PI * (1 - this.progress));
		fill(this.clr1);
		square(0, 0, this.w / 3);
		pop();
		fill(this.clr2);
		square((this.w / 3), (this.w / 3) - (this.w / 3 * 2 * this.progress), (this.w / 3));
		square(-(this.w / 3), -(this.w / 3) + (this.w / 3 * 2 * this.progress), (this.w / 3));
		pop();
	}
}

class Motion11 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		fill(this.clr1);
		beginShape();
		vertex(0, -this.w / 2 + (this.w / 2 * this.progress));
		vertex(this.w / 2, -this.w / 4 + (this.w / 2 * this.progress));
		vertex(0, + (this.w / 2 * this.progress));
		vertex(-this.w / 2, -this.w / 4 + (this.w / 2 * this.progress));
		endShape();

		fill(this.clr2);
		beginShape();
		vertex(this.w / 2, -this.w / 4 + (this.w / 2 * this.progress));
		vertex(0, 0 + (this.w / 2 * this.progress));
		vertex(-this.w / 2, -this.w / 4 + (this.w / 2 * this.progress));
		vertex(-this.w / 2, -this.w / 4 + this.w / 2);
		vertex(0, this.w / 2);
		vertex(this.w / 2, -this.w / 4 + this.w / 2);
		endShape();
		pop();
	}
}

class Motion12 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		fill(this.clr1);
		circle(-(this.w / 4 * this.progress), (this.w / 4 * this.progress), this.w * 0.2 * this.progress);
		fill(this.clr2);
		circle((this.w / 4 * this.progress), -(this.w / 4 * this.progress), this.w * 0.2 * this.progress);
		fill(this.clr1);

		arc(this.w / 4 * this.progress, 0, this.w / 2, this.w / 2, 0, PI);
		fill(this.clr2);
		arc(-this.w / 4 * this.progress, 0, this.w / 2, this.w / 2, PI, TAU);

		pop();
	}
}

class Motion13 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		let c = 3;
		let w = this.w / c;
		noStroke();
		fill(this.clr1);
		for (let i = 0; i < c; i++) {
			for (let j = 0; j < c; j++) {
				let x = i * w + (w / 2) - this.w / 2;
				let y = j * w + (w / 2) - this.w / 2;

				push();
				translate(x, y);
				rotate(PI * 0.75 * (this.progress));
				fill(this.clr1);
				square(0, 0, w * 0.5 * this.progress);
				fill(this.clr2);
				let ww = lerp(w, w * 0.5, this.progress) / 2;
				triangle(-ww, ww, ww, ww, ww, -ww);
				pop();
			}
		}
		pop();
	}
}

class Motion14 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		fill(this.clr1);
		circle(0, 0, this.w * this.progress);
		fill(this.clr2);
		this.drawleaf(-this.w / 4, -this.w / 4, this.w / 2, (PI / 2) + (PI * 1.5 * this.progress * -1));
		this.drawleaf(this.w / 4, -this.w / 4, this.w / 2, (PI * 1.5 * this.progress * -1));
		this.drawleaf(this.w / 4, this.w / 4, this.w / 2, (PI / 2) + (PI * 1.5 * this.progress * -1));
		this.drawleaf(-this.w / 4, this.w / 4, this.w / 2, (PI * 1.5 * this.progress * -1));
		pop();
	}

	drawleaf(x, y, w, a) {
		push();
		translate(x, y);
		rotate(a);
		beginShape();
		for (let a = 0; a < PI / 2; a += TAU / 180) {
			vertex(-(w / 2) + w * cos(a), -(w / 2) + w * sin(a));
		}
		for (let a = PI; a < PI * 1.5; a += TAU / 180) {
			vertex((w / 2) + w * cos(a), (w / 2) + w * sin(a));
		}
		endShape();
		pop();
	}
}

class Motion15 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		for (let i = 0; i < 2; i++) {
			fill(this.clr1);
			triangle(-this.w / 2, -this.w / 4, -this.w / 4, -this.w / 2, -this.w / 4, lerp(0, this.w / 4, this.progress));
			fill(this.clr2);
			triangle(0, -this.w / 4, -this.w / 4, -this.w / 2, -this.w / 4, lerp(0, this.w / 4, this.progress));
			circle(-this.w / 4, this.w / 4, this.w * 0.1 * (1 - this.progress));
			rotate(PI);
		}

		pop();
	}
}

class Motion16 extends Motion {
	constructor(x, y, w, clr1, clr2) {
		super(x, y, w, clr1, clr2);
	}

	show() {
		push();
		translate(this.x, this.y);
		fill(this.clr1);
		noStroke();
		square((this.w / 4), (this.w / 4) - (this.w / 2 * this.progress), this.w / 2);
		square(-(this.w / 4), -(this.w / 4) + (this.w / 2 * this.progress), this.w / 2);
		fill(this.clr2);
		square(0, 0, this.w / 2);
		fill(this.clr1);
		square((this.w / 8) - (this.w / 4 * this.progress), -(this.w / 8), this.w / 4);
		square(-(this.w / 8) + (this.w / 4 * this.progress), (this.w / 8), this.w / 4);
		noStroke();
		pop();
	}
}

// 响应窗口大小变化
function windowResized() {
	resizeCanvas(windowWidth, windowHeight/3);
	// 重新计算网格大小和位置
	let gridSize = width * 0.8;
	let cellCount = 6;
	let cellSize = gridSize / cellCount;
	// 重新初始化 motions 数组
	motions = [];
	let number = 1;
	for (let i = 0; i < cellCount; i++) {
		for (let j = 0; j < cellCount; j++) {
			let x = cellSize * j + (cellSize / 2) + (width - gridSize) / 2;
			let y = cellSize * i + (cellSize / 2) + (height - gridSize) / 2;
			let MotionClass = motionClasses[number % motionClasses.length];
			let clr1 = random(colors);
			let clr2 = random(colors);
			while (clr1 == clr2) {
				clr2 = random(colors);
			}
			motions.push(new MotionClass(x, y, cellSize * 0.75, clr1, clr2));
			number++;
		}
	}
}