let snowflakes = [];

/**
 * 초기화 작업 수행
 */
function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
}

/**
 * 반복 애니메이션 작업
 */
function draw() {
    let t = frameCount / 60;
    blendMode(BLEND);
    background('black');

    // 달 그리기
    blendMode(ADD);
    colorMode(HSB, 360, 100, 100, 1); // 색조, 채도, 밝기, 
    for (let i = 200; i > 50; i--){
		fill(0,0,10,0.05);
		ellipse(width*0.7, height*0.3, i, i);	
	}
	fill(255, 0.5);
	ellipse(width*0.7, height*0.3,80,80);

    // 눈 그리기
    fill(255);
    for (let i = 0; i < random(3); i++) {
        snowflakes.push(new snowflake());
    }

    for (let flake of snowflakes) {
        flake.update(t);
        flake.display();
    }
} 

function snowflake() {
    // 좌표값 초기화
    this.posX = 0;
    this.posY = random(-50, 0);
    this.initialangle = random(0, 2*PI);
    this.size = random(2, 5);

    // 방사형 눈송이의 반지름
    this.radius = sqrt(random(pow(width / 2, 2)));

    this.update = function(time) {
        // x위치  
        let w = 0.3; // 각속도
        let angle = w * time + this.initialangle;
        this.posX = width / 2 + this.radius * sin(angle);
        
        // 크기가 다른 눈송이가 미묘하게 다른 y 속도로 떨어짐.
        this.posY += pow(this.size, 0.5);
        // 화면 하단을 지나친 눈송이 삭제
        if (this.posY > height) {
            let index = snowflakes.indexOf(this);
            snowflakes.splice(index, 1);
        }
    }

    this.display = function() {
        ellipse(this.posX, this.posY, this.size);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

