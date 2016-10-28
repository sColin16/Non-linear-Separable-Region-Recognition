
var e = 2.71828;

function sigmoid(x){
    return 1/(1+Math.pow(e, -x));
}

function sigmoidPrime(x){
    return (sigmoid(x) * (1 - sigmoid(x)));
}

function getRandom(min, max){
    return Math.random() * (max - min) + min;
}

function inputNeuron(config){
    this.value = config.inputValue||-1;
}

function hiddenNeuron(config){
    this.sum = config.sum||-1;
    this.output;
}

function outputNeuron(config){
    this.sum = config.sum||-1;
    this.output;

}

function Mind(config){
    this.inputNumber = config.inputNumber||2;
    this.outputNumber = config.outputNumber||1;
    this.hiddenLayerNumber = config.hiddenLayerNumber||4;
    this.input = config.input||[[0, 0], [0, 1], [1, 0], [1, 1]];
    this.outputTarget = config.outputTargets||[[0], [1], [1], [0]];
    this.learningRate = config.learningRate||1;

    this.trainingTime;
    
    this.name = config.name;
        
    this.inputLayer = [];
    for(var i = 0; i<this.inputNumber; i++){
        this.inputLayer.push(new inputNeuron({}));
    }
    
    this.outputLayer = [];
    for(i =0; i<this.outputNumber; i++){
        this.outputLayer.push(new outputNeuron({}));
    }
    
    this.hiddenLayer = [];
    for(i = 0; i<this.hiddenLayerNumber; i++){
        this.hiddenLayer.push(new hiddenNeuron({}));
    }
    
    this.inputWeights = [];
    for(i = 0; i<this.inputNumber; i++){
        this.inputWeights.push([]);
        for(var j = 0; j<this.hiddenLayerNumber; j++){
            this.inputWeights[i].push(getRandom(-1, 1));
        }
    }
    
    this.outputWeights = [];
    
    for(i = 0; i<this.hiddenLayerNumber; i++){
        this.outputWeights.push([]);
        for(j = 0; j<this.outputNumber; j++){
            this.outputWeights[i].push(getRandom(-1, 1));
        }
    }
}//Neural Network Class, with one hidden layer.

Mind.prototype.forward = function(inputSet){
    var output = [];
    
    //copy inputs into the right inputs
    for(var i = 0; i<this.inputNumber; i++){
        this.inputLayer[i].value = this.input[inputSet][i];
    }
    
    //loop through each hidden neuron, and compute it's result
    for(i = 0; i<this.hiddenLayerNumber; i++){
        var sum=0;
        //loop through each input
        for(var j = 0; j<this.inputNumber; j++){
            sum += this.inputLayer[j].value*this.inputWeights[j][i];
        }
        this.hiddenLayer[i].sum = sum;
        this.hiddenLayer[i].output = sigmoid(sum);
        //console.log(sum);
        //console.log(this.hiddenLayer[i].output);
    }
    
    //loop through each output neuron, and computer it's result
    for(i=0; i<this.outputNumber; i++){
        var sum = 0;
        //loop through each hidden layer result
        for(j = 0; j<this.hiddenLayerNumber; j++){
            sum+= this.hiddenLayer[j].output*this.outputWeights[j][i];
        }
        this.outputLayer[i].sum = sum;
        this.outputLayer[i].output = sigmoid(sum);
        output.push(sigmoid(sum));
        //console.log(sum);
        //console.log(this.outputLayer[i].output);
        
    }
    
    return output;
};//studies on set of input vales, passes them through to output Neurons, and returns output array

Mind.prototype.newBack = function(){
    //variables to store the difference in the weights
    var deltaInputWeights = [];
    var deltaOutputWeights = [];
    
    //fill the weight arrays with the correct array data structure
    for(var i = 0; i<this.inputNumber; i++){
        deltaInputWeights.push([]);
        for(var j = 0; j<this.hiddenLayerNumber; j++){
            deltaInputWeights[i].push(0);
        }
    }
    
    for(i = 0; i<this.hiddenLayerNumber; i++){
        deltaOutputWeights.push([]);
        for(var j = 0; j< this.outputNumber; j++){
            deltaOutputWeights[i].push(0);
        }
    }
    

    //loop through every input/output pair given to the network
    for(var i = 0; i<this.input.length; i++){
        
        this.forward(i);
        //first, loop through the output weights. These are easier.
        
        for(var j = 0; j<this.hiddenLayerNumber; j++){
            
            for(var k = 0; k<this.outputNumber; k++){
                //then calculate the difference that must be made to the weight
                dif = -(this.learningRate)*(this.outputTarget[i][k] - this.outputLayer[k].output)*(sigmoidPrime(this.outputLayer[k].sum))*(this.hiddenLayer[j].output);
                
                //then, add this difference to the weights
                deltaOutputWeights[j][k] += dif;
            }
            
        }
        
        
        //calculate constants used in the difference for all input weights
        var errorSum = 0;
        var activationSum = 0;
        
        for(var j = 0; j< this.outputNumber; j++){
            errorSum += (this.outputTarget[i][j] - this.outputLayer[j].output);
            activationSum += sigmoidPrime(this.outputLayer[j].sum);
        }
        
        //next, loop through the input weights. These are more complicated.
        
        for(var j = 0; j<this.inputNumber; j++){
        
            var dif;
        
            for(var k = 0; k<this.hiddenLayerNumber; k++){
                //sum the otutput weights associated with the given hidden layer neuron
                
                var weightSum = 0;
                
                for(var l = 0; l<this.outputNumber; l++){
                    weightSum += this.outputWeights[k][l];
                }
                
                //calculate difference for the weight
                
                dif = (this.learningRate) * (-errorSum) * (activationSum) * (weightSum) * (sigmoidPrime(this.hiddenLayer[k].sum)) * this.inputLayer[j].value;
                
                //add the difference to the weights
                deltaInputWeights[j][k] += dif;
            }
        }
        
    }
    
    //after all the differences have been calculated from all the input/output pairs, change the actual weights
    
    for(var i = 0; i<this.inputNumber; i++){
        for(var j = 0; j<this.hiddenLayerNumber; j++){
            this.inputWeights[i][j] -= deltaInputWeights[i][j];
        }
    }
    
    for(i = 0; i<this.hiddenLayerNumber; i++){
        for(var j = 0; j< this.outputNumber; j++){
            this.outputWeights[i][j] -= deltaOutputWeights[i][j];
        }
    }
}

Mind.prototype.newTrain = function(minimumError, maxIterations){
    var start = millis();
    if(maxIterations === undefined){
        maxIterations = 50000;
    }
    var a = -1;
    while(true){
        a++;
        this.newBack();
        if(a > maxIterations){
            console.log(a);
            this.trainingTime = millis() - start;
            return false;
        } else if(this.sumError()<minimumError){
            this.trainingTime = millis()-start;
            console.log(a, "iterations");
            console.log(a/this.trainingTime, "Iterations per millisecond")
            return true;
        }
    }
};//trains the network

Mind.prototype.mutate = function(){
    var a = getRandom(0, 2);
    if(a<1){
        for(var i = 0; i<this.inputNumber; i++){
            for(var j = 0; j<this.hiddenLayerNumber; j++){
                this.inputWeights[i][j] = getRandom(-1, 1);
            }
        }
    } else{
        for(var i = 0; i<this.hiddenLayerNumber; i++){
            for(var j = 0; j<this.outputNumber; j++){
                this.outputWeights[i][j] = getRandom(-1, 1);
            }
        }
    }
};//mutates a random weight in the network, to aid in getting out of local minimum

Mind.prototype.predict = function(input){
    var output = [];
    
    //copy inputs into the right inputs
    for(var i = 0; i<this.inputNumber; i++){
        this.inputLayer[i].value = input[i];
    }
    
    //loop through each hidden neuron, and compute it's result
    for(i = 0; i<this.hiddenLayerNumber; i++){
        var sum=0;
        //loop through each input
        for(var j = 0; j<this.inputNumber; j++){
            sum += this.inputLayer[j].value*this.inputWeights[j][i];
        }
        this.hiddenLayer[i].sum = sum;
        this.hiddenLayer[i].output = sigmoid(sum);
        //console.log(sum);
        //console.log(this.hiddenLayer[i].output);
    }
    
    //loop through each output neuron, and computer it's result
    for(i=0; i<this.outputNumber; i++){
        var sum = 0;
        //loop through each hidden layer result
        for(j = 0; j<this.hiddenLayerNumber; j++){
            sum+= this.hiddenLayer[j].output*this.outputWeights[j][i];
        }
        this.outputLayer[i].sum = sum;
        this.outputLayer[i].output = sigmoid(sum);
        output.push(sigmoid(sum));
        //console.log(sum);
        //console.log(this.outputLayer[i].output);
        
    }
    return output;
}

Mind.prototype.draw = function(){
    for(var i = 0; i<this.inputNumber; i++){
        for(var j = 0; j<this.hiddenLayerNumber; j++){
            if(this.inputWeights[i][j] < 0){
                stroke(255, 0, 0);
            } else{
                stroke(0, 255, 0);
            }
            strokeWeight(3);
            line(50, 50+65*i, 115, 50+65*j);
        }
        fill(255);
        stroke(0);
        strokeWeight(1);
        ellipse(50, 50+65*i, 30, 30);
        fill(0);
        textAlign(CENTER, CENTER);
        noStroke();
        text(this.inputLayer[i].value, 50, 50+65*i);
        
    }
    for(i = 0; i<this.hiddenLayerNumber; i++){
        for(j = 0; j<this.outputNumber; j++){
            if(this.outputWeights[i][j] < 0){
                stroke(255, 255*this.outputWeights[i][j], 255*this.outputWeights[i][j]);
            } else{
                stroke(255*-this.outputWeights[i][j],255, 255*-this.outputWeights[i][j]);
            }
            strokeWeight(3);
            line(115, 50+65*i, 180, 50+65*j);
        }
        fill(255);
        stroke(0);
        strokeWeight(1);
        ellipse(115, 50+65*i, 30, 30);
        fill(0);
        textAlign(CENTER, CENTER);
        noStroke();
        text(Math.round((this.hiddenLayer[i].output)*100)/100, 115, 50+65*i);
    }
    
    for(var i = 0; i<this.outputNumber; i++){
        fill(255);
        stroke(0);
        strokeWeight(1);
        ellipse(180, 50+65*i, 30, 30);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(Math.round((this.outputLayer[i].output)*100)/100, 180, 50+65*i);
    }

    fill(0);
    text(this.sumError(), 300, 200);
    text(this.sumError() <0.1?"Success":"Failure", 300, 225);

};//draws the neural network! TODO Fix colors

Mind.prototype.sumError = function(){
    var sum = 0;
    //loop through each set of target outputs
    for(var i = 0; i<this.outputTarget.length; i++){
        //loop through each output in the set
        this.forward(i);
        for(var j = 0; j< this.outputNumber; j++){
            var a = (this.outputTarget[i][j] - this.outputLayer[j].output);
            sum += (1/2)*a*a;
        }
    }
    return sum;
}//returns the sum of the cost function (1/2)(target- value)^2

Mind.prototype.trainingTime = function(){
    return this.trainingTime();
};//returns the time taken to train the neural network, in milliseconds

Mind.prototype.archive = function(){
    localStorage.setObj("NN" + this.name + "I", this.inputWeights);
    localStorage.setObj("NN" + this.name + "O", this.outputWeights);
}//archives a neural net in Local Storage

Mind.prototype.recoverMind = function(name){
    var a = localStorage.getObj("NN" + name + "I");
    var b = localStorage.getObj("NN" + name + "O");
    
    if(this.hiddenLayerNumber === b.length){
        this.inputWeights = a;
        this.outputWeights = b;
    } else{
        alert("Failed to recover mind. Please make sure mind had proper number of hidden layer neurons");
    }
    
}//recovers a neural net stored in Local Storage, and stores it to itself

Mind.destroyMind = function(name){
    localStorage.removeItem("NN" + name + "I");
    localStorage.removeItem("NN"+ name + "O");
}//destroys a neural net with a given name, removing it from local Storage

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}//local Storage function to store neural nets

Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}//more local storage functions