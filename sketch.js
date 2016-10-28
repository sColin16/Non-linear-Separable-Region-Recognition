
var recognizer = new Mind({
    learningRate:0.1,
    hiddenLayerNumber:5,
    name:"Region",
});
var regionOutline = [];

var classA = [];
var classB = [];

var phase = "Boundary";

var mpress = 0;

function createBoundary (){
    if(mouseIsPressed && mouseY<400){
        regionOutline.push(createVector(mouseX, mouseY));
    }
}

function drawBoundary() {
    for(var i = 0; i<regionOutline.length-1; i++){
        stroke(0);
        strokeWeight(3);
        line(regionOutline[i].x, regionOutline[i].y, regionOutline[i+1].x, regionOutline[i+1].y);
    }
}

function dropPoints(){
    if(mpress === 1 && keyIsDown(CONTROL)){
        classA.push(createVector(mouseX, mouseY));
    } else if(mpress === 1 && keyIsDown(SHIFT)){
        classB.push(createVector(mouseX, mouseY));
    }
}

function drawPoints(){
    for(var i = 0; i<classA.length; i++){
        fill(255, 0, 0);
        noStroke();
        ellipse(classA[i].x, classA[i].y, 10, 10);
    }
    for(i = 0; i<classB.length; i++){
        fill(0, 0, 255);
        noStroke();
        ellipse(classB[i].x, classB[i].y, 10, 10);
    }
    
}

function normalizeArray(vectorArray){
    var output = [];
    for(var i = 0; i<vectorArray.length; i++){
        output[i] = createVector(vectorArray[i].x/400, vectorArray[i].y/400);
    }
    return output;
}

function vectorToInput(vectorArray){
    var output = [];
    for(var i = 0; i<vectorArray.length; i++){
        
        output.push([vectorArray[i].x, vectorArray[i].y]);
    }
    return output;
}

function classListToArray(classArray, value){
    var output = [];
    for(var i = 0; i<classArray.length; i++){
        output.push([value]);
    }
    return output;
}

function setup(){
    createCanvas(400, 450);
    textAlign(CENTER, CENTER);
}

var iterations = 0;

function draw(){
    
    if(mouseIsPressed){
        mpress++;
    } else{
        mpress = 0;
    }
    
    if(phase === "Boundary"){
        background(100, 255, 100);
        createBoundary();
        drawBoundary();
        
        fill(200);
        noStroke();
        rect(0, 400, 400, 50);
        fill(0);
        noStroke();
        textSize(20);
        text("Draw Area Boundary", 100, 425);
        
        fill(100);
        rect(250, 410, 100, 30);
        fill(0);
        text("Continue", 300, 425);
        var a = (mouseX>250 && mouseX<350 && mouseY>410 && mouseY<440 && mpress === 1);
        if(a){
            phase = "Points";
        }
        
    } else if(phase === "Points"){
        background(100, 255, 100);
        drawBoundary();
        dropPoints();
        drawPoints();
        
        fill(200);
        noStroke();
        rect(0, 400, 400, 50);
        fill(0);
        noStroke();
        textSize(10);
        text("Drop Training Points\nCtrl+Click => Class A\n Shift+Click => Class B", 75, 425);
        
        fill(100);
        rect(250, 410, 100, 30);
        fill(0);
        textSize(15);
        text("Train Network", 300, 425);
        var a = (mouseX>250 && mouseX<350 && mouseY>410 && mouseY<440 && mpress === 1);
        if(a){
            phase = "PrepTrain";
        }
        
    } else if(phase === "PrepTrain"){
        classA = normalizeArray(classA);
        classB = normalizeArray(classB);
        
        recognizer.input = vectorToInput(classA).concat(vectorToInput(classB));
        recognizer.outputTarget = classListToArray(classA, 0).concat(classListToArray(classB, 1));
        
        phase = "Train";
        //initiate inputs and target outputs
    } else if(phase === "Train"){
        for(var i = 0; i<250; i++){
            recognizer.newBack();
        }

        var a = recognizer.sumError();
        //console.log(a);
        if(a < 0.1 || mpress === 1){
            phase = "Result";
        }
        background(100, 255, 100);
        noStroke();
        var a;
        for(var i = 0; i< 40; i++){
            for(var j = 0; j<40; j++){
                a = recognizer.predict([(((i*10)+5)/400), (((j*10)+5)/400)]);
                if(round(a)=== 1){
                    fill(0, 0, 255);
                } else if(round(a) === 0){
                    fill(255, 0, 0);
                }
                ellipse(((i*10)+5), ((j*10)+5), 10, 10);
            }
        }
        drawBoundary();
        fill(200);
        noStroke();
        rect(0, 400, 400, 50);
        fill(0);
        noStroke();
        textSize(20);
        text("Training. Click To Stop", 100, 425);
    }else if(phase === "Result"){
        background(100, 255, 100);
        noStroke();
        var a;
        for(var i = 0; i< 400; i++){
            for(var j = 0; j<400; j++){
                a = recognizer.predict([(i/400), (j/400)]);
                if(round(a)=== 1){
                    fill(0, 0, 255);
                } else if(round(a) === 0){
                    fill(255, 0, 0);
                }
                rect(i, j, 1, 1);
            }
        }
        drawBoundary();
        fill(200);
        noStroke();
        rect(0, 400, 400, 50);
        fill(0);
        noStroke();
        textSize(20);
        text("Training Stopped. Here's the Result!", 200, 425);
        phase = "Done";
        //display results of training here!
    } else if(phase === "Done"){
        
    }
    
}