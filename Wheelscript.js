var myCanvas = document.getElementById("myCanvas");
var canVasPin = document.getElementById("pin");
var canvasResult = document.getElementById("resultCanvas");
canvasResult.width = 300,
canvasResult.height = 80,
canVasPin.width = 480;
canVasPin.height = 50;
myCanvas.width = 480;
myCanvas.height = 480;
var ctxPin = canVasPin.getContext("2d");
var ctxResult = canvasResult.getContext("2d");
var ctx = myCanvas.getContext("2d");
let lastdegree = 0;
let spinButton = document.getElementById("spin_button");
const isDisable = false;

let myData = [
  "Prize 1",
  "Prize 2",
  "Prize 3",
  "Prize 4",
  "Prize 5",
  "Prize 6",
  "Prize 7",
  "Prize 8",
  "Prize 9",
  "Prize 10",
  "Prize 11",
  "Prize 12"
];

let myDataAngle = [];

for (let i = 0; i < myData.length; i++) {
  myDataAngle.push({
    name: `${myData[i]}`,
    startAngle: (i * 360) / myData.length,
    endAngle: ((i + 1) * 360) / myData.length
  });
}

const RotateFunc = () => {    
  const RotateNow = Math.round(Math.random() * 12) + 1; 
  const random = Math.round(Math.random() * 16) + 1;   
  if (lastdegree === 0) {     
    return 360 * random + 360 / RotateNow + 15;    
  }  
  return lastdegree + 360 * random + 360 / RotateNow; //never reverse 
};

getRotMat = angle =>
  math.matrix([
    [Math.cos(angle), Math.sin(angle) * -1],
    [Math.sin(angle), Math.cos(angle)]
  ]);

drawPin = () => {
  ctxPin.save();
  ctxPin.beginPath();
  ctxPin.moveTo(220, 0);
  ctxPin.lineTo(270, 0);
  ctxPin.lineTo(245, 50);
  ctxPin.fillStyle = "#8FE001";
  ctxPin.fill();
  ctxPin.restore();
};

drawResult = (result) => {
  ctxResult.save();
  ctxResult.beginPath();
  ctxResult.fillStyle = "#ffffff";
  ctxResult.fillRect(0, 0, 300, 80);
  ctxResult.fillStyle = "#FF0000";
  ctxResult.font = "40px Georgia";
  ctxResult.textAlign = "center";
  ctxResult.textBaseline = "middle";
  setTimeout(function() {      
    ctxResult.fillText(result, canvasResult.width/2, 40);
    ding(); 
    spinButton.classList.remove("off-spinner");
    spinButton.classList.add("spin-button");
    document.getElementById("spin_button").disabled = isDisable;
  }, 4000);
     
}

drawOneArc = (
  ctx,
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  color,
  i
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerX, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();
  ctx.font = "18px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";   
  ctx.save();
  ctx.fillStyle = "#000000";
  const angle = startAngle + ((Math.PI - (endAngle - startAngle)) / 2) * -1;
  const rotAngle = startAngle + (endAngle - startAngle) / 2;
  let x = 240 + 0.85 * 240 * Math.cos(rotAngle);
  let y = 240 + 0.85 * 240 * Math.sin(rotAngle);

  arr = math.multiply([x, y], getRotMat(angle))._data;
  if (i) {
    ctx.rotate(angle);
    ctx.fillText(i, arr[0], arr[1]);
  }
  ctx.restore();
};

class circleChart {
  constructor(options) {
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
  }

  draw() {
    let total_val = 0;
    let color_index = 0;
    for (let i in this.options.data) {
      let val = this.options.data[i];
      total_val += val;
    }
    let start_angle = 0;
    for (let i in this.options.data) {
      let val = this.options.data[i];
      let slice_angle = (2 * Math.PI) / this.options.data.length;
      drawOneArc(
        this.ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        Math.min(this.canvas.width / 2, this.canvas.height / 2),
        start_angle,
        start_angle + slice_angle,
        this.colors[color_index % this.colors.length],
        this.options.data[i]
      );
      start_angle += slice_angle;
      color_index++;
    }
    if (this.options.chartHole) {
      drawOneArc(
        this.ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        this.options.chartHole *
          Math.min(this.canvas.width / 2, this.canvas.height / 2),
        0,
        2 * Math.PI,        
        "#ffffff"        
      );
    }
  }
}

var MyCircleChart = new circleChart({
  canvas: myCanvas,
  data: myData,
  colors: ["#fde23e", "#f16e23", "#57d9ff", "#937e88", "#FFA500"],
  chartHole: 0.7
});
setTimeout(() => {
  MyCircleChart.draw();
  drawPin();
  //drawResult();
}, 1000);

const startSpin = () => {  
  let canVas = document.getElementById("myCanvas");
  let audio = document.getElementById("audioId");
  playAudio(audio);
  spinButton.classList.remove("spin-button");
  spinButton.classList.add("off-spinner");
  document.getElementById("spin_button").disabled = !isDisable; //disable button while spinning
  let currentDegree = RotateFunc();

  canVas.style.transform = `rotate(${currentDegree}deg)`;

  lastdegree = currentDegree;

  const currentValue = getCurrentValue(currentDegree);
 
};

const getCurrentValue = (degree) => {
  const value = degree % 360;

  let currentDegree;

  if (value > 270) {
    currentDegree = 360 + 270 - value;
  } else {
    currentDegree = 270 - value;
  }

  const result = myDataAngle.find(
    c => c.startAngle <= currentDegree && c.endAngle > currentDegree
  ); 

  drawResult(result.name);  
  return result.name;
  
};

playAudio = (audio) =>{
  audio.play();
  audio.currentTime = 0;
}

ding = () => {
  let dingBell = document.getElementById("dingId");
  dingBell.play();
  dingBell.currentTime = 0
}

let btns = document.getElementsByClassName("segmentButtons");
console.log(btns);
for(var i = 0; i < btns.length; i++ ){
  btns[i].addEventListener("click", function(){
    let current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className = this.className + " active";
  })
}

const noSegment = (val) => {  
  myData = [];
  for (let i = 0;  i < val; i++) {    
    myData.push('Prize ' + (i + 1));
  }

  myDataAngle = [];

  for (let i = 0; i < myData.length; i++) {
    myDataAngle.push({
      name: `${myData[i]}`,
      startAngle: (i * 360) / myData.length,
      endAngle: ((i + 1) * 360) / myData.length
    });
  }

  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

  var MyCircleChart1 = new circleChart({
    canvas: myCanvas,
    data: myData,
    colors: ["#fde23e", "#f16e23", "#57d9ff", "#937e88", "#FFA500", "#A9A9A9"],
    chartHole: 0.7
  });

  MyCircleChart1.draw();

}

