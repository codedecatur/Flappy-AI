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

    this.name = names[Math.floor(Math.random() * names.length)];

    this.guess = function(inputs){
        //add more weights depending on number of inputs
        while(this.weights.length <= inputs.length){
            this.weights.push(Math.random() * 2 - 1);
        }

        inputs.push(1); //+c is the same as c * 1

        var sum = 0;

        //x1*w1 + x2*w2 + x3*w3 + c
        for(let  i = 0; i < inputs.length; i++){
            sum += this.weights[i] * inputs[i];
        }
        return sum > 0;
    }
}


var mutationRate = 0.05;

/*
---\-----\--------
===\=====\========


---=====--------


---------
=========

-==--=-=~~-==---

*/
function breed(n1, n2){
    var neuron = new Neuron();

    for(let i = 0; i < n1.weights.length; i++){
        if(Math.random() < 0.5){
            neuron.weights[i] = n1.weights[i];
        } else {
            neuron.weights[i] = n2.weights[i];
        }

        if(Math.random() < mutationRate){
            neuron.weights[i] = Math.random() * 2 - 1;
        }
    }
}