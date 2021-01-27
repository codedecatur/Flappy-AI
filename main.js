var c = document.createElement("canvas");

document.body.appendChild(c);

c.width = window.innerWidth;
c.height = window.innerHeight;

var s = c.height;

var tofu = new Image();
tofu.src = "Tofu.png";

var bestBirdOfLastGen;

//canvas context
var ctx = c.getContext("2d");

var gravity = 0.0005;

var birds = [];
var pipes = [];

var genNum = 0;
var highestCurrentScore = 0;

var distToNextPipe = 0;
var closestHeight = 0;

function bird(neuron){
    birds.push(this);
    if(!neuron){
        this.brain = new Net();
    } else {
        this.brain = neuron;
    }

    this.height = 0.5;
    this.velocity = 0;

    this.update = function(){
        this.score++;
        this.velocity += gravity;

        this.height += this.velocity;

        //flap
        if(this.brain.guess([this.height, closestHeight, distToNextPipe, 0.005 * (1+(highestCurrentScore / 5000)), this.velocity])){
            this.velocity = -0.01;
        }

        if(this.height < 0 || this.height > 1){
            this.alive = false;
        }

        for(i of pipes){
            if((0.25 > i.x && 0.25 < i.x + i.width) && Math.abs(i.height - this.height) > i.gapHeight){
                this.alive = false;
            }
        }
    }

    this.draw = function(){
        if(this.alive) ctx.drawImage(tofu, s / 4 - s/30, this.height * s - s/30, s / 15, s / 15);
    }
    this.score = 0;
    this.alive = true;
}

for(var i = 0; i < 1000; i++){
    new bird();
}

function closestPipe(){
    var closest = Infinity;
    var closestPipe;
    for(var i of pipes){
        if(i.x > 0.25 - 0.1 && i.x < closest){
            closest = i.x;
            closestPipe = i;
        }
    }

    return closestPipe;
}

function pipe(){
    pipes.push(this);
    this.x = c.width / c.height;
    this.width = 0.1;
    this.height = Math.random() * 0.85 + 0.075;
    this.gapHeight = 0.075; 
    this.update = function(){
        this.x -= 0.005 * (1+(highestCurrentScore / 5000));
        //when a pipe goes off the left, give living birds a point and kill the pipe
        if(this.x < -this.width){
            pipes.splice(pipes.indexOf(this), 1);
        }
    }
    this.draw = function(){
        ctx.fillStyle = "black";
        ctx.fillRect(this.x * s, 0, this.width * s, s * (this.height - this.gapHeight));
        ctx.fillRect(this.x * s, s * (this.height + this.gapHeight), this.width * s, c.height);
    }
}

var pipeTime = 0;

function birdsAlive(){
    var sum = 0;
    for(let i of birds){
        sum += i.alive;
    }

    return sum;
}

function update(){

    highestCurrentScore++;

    //next generation, when all birds die
    if(birdsAlive() == 0){
        //find the best bird
        var highestScore = 0;
        for(let i of birds){
            if(i.score >= highestScore) { 
                bestBirdOfLastGen = i;
                highestScore = i.score;
            }
        }
        
        highestCurrentScore = 0;
        genNum++;
        birds.sort((a, b) => {b.score - a.score});
        var parents = [];
        for(var i = 0; i < 10; i++){
            parents.push(birds[i]);
        }

        birds = [];

        for(var i = 0; i < 1000; i++){
            var p1 = parents[Math.floor(Math.random() * parents.length)];
            var p2 = parents[Math.floor(Math.random() * parents.length)];
            new bird(breed(p1.brain, p2.brain));
        }
        pipes = [];
        pipeTime = 0;
    }
    pipeTime -= 1/60;
    if(pipeTime <= 0){
        new pipe();
        pipeTime = Math.random() + 3;
    }
    ctx.clearRect(0, 0, c.width, s);
    var cp = closestPipe();
    if(cp){
        distToNextPipe = closestPipe().x - 0.25;
        closestHeight = cp.height;
    }
    updateBirds();
    drawBirds();
    updatePipes();
    drawPipes();
    drawStats();
}

function drawStats(){
    var fontSize = s/40;

    ctx.fillStyle = "black";
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillText("Generation: " + genNum ,0.05 * s, 0.05 * s);
    ctx.fillText("Distance: " + highestCurrentScore ,0.05 * s, 0.05 * s + fontSize + 0.05 * s);
    if(bestBirdOfLastGen){
        ctx.fillText("Best Name: " + bestBirdOfLastGen.brain.name ,0.05 * s, 0.05 * s + 2*(fontSize + 0.05 * s));
    }
}

function updateBirds(){
    for(let i of birds){
        i.update();
    }
}
function drawBirds(){
    for(let i of birds){
        i.draw();
    }
}

function updatePipes(){
    for(let i of pipes){
        i.update();
    }
}

function drawPipes(){
    for(let i of pipes){
        i.draw();
    }
}

function drawNet(){

}

setInterval(update, 1000/60);