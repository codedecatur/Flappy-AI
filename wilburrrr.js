//names
var names = ["Tweety", 
"Flappy", 
"Humphrey", 
"Birdname", 
"Nikolas", 
"Gigantosaurus", 
"Big Bird", 
"Klappi", 
"Klippi", 
"Tofu",
"Bread"
];

//neuron
function Neuron(){
    //weights to multiply by inputs
    this.weights = [];

    this.guess = function(inputs){
        //add more weights depending on number of inputs
        while(this.weights.length <= inputs.length){
            this.weights.push(Math.random() * 2 - 1);
        }

        var sum = 0;

        //flap? = x1*w1 + x2*w2 + x3*w3 + 1*w4
        for(let  i = 0; i < inputs.length; i++){
            sum += this.weights[i] * inputs[i];
        }

        //+wn
        sum += this.weights[this.weights.length - 1];


        return sigmoid(sum);
    }
}

//class for whole neural network
function Net(){

    this.name = names[Math.floor(Math.random() * names.length)];

    this.layers = [
        [new Neuron(), new Neuron(), new Neuron()], //hidden layer
        [new Neuron()] //output neuron
    ];

    this.guess = function(input){
        var curInput = input;
        for(let layer of this.layers){
            var tempInput = []; 
            //each neuron does guess
            for(let neuron of layer){
                tempInput.push(neuron.guess(curInput));
            }
            curInput = tempInput;
        }

        return curInput[0] > 0;
    }
}

/*
---\-----\--------
===\=====\========


---=====--------


---------
=========

-=---==--===-==~~===----=-=

*/


var mutationRate = 0.05;

//takes in 2 neural nets, randomly assigns their weights to a child
function breed(p1, p2){
    var net = new Net();

    for(let i = 0; i < p1.layers.length; i++){
        for(let j = 0; j < p1.layers[i].length; j++){
            net.layers[i][j] = new Neuron();
            for(let k = 0 ; k < p1.layers[i][j].weights.length; k++){
                if(Math.random() < 0.5){
                    net.layers[i][j].weights[k] = p1.layers[i][j].weights[k];
                } else {
                    net.layers[i][j].weights[k] = p2.layers[i][j].weights[k];
                }

                if(Math.random() < mutationRate){
                    net.layers[i][j].weights[k] = Math.random() * 2 - 1; //random number between -1 and 1
                }
                
            }
        }
    }

    return net;
}

function sigmoid(x){
    return 2/(1+(Math.E**(x))) - 1;
}