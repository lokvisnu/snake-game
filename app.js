let speed = 1;
let GAME_DIMENSION = 40;
var timer; 
var timeLeft = 60;
//*****CONSTANTS
const PRIMARY_BG = '#000000',SECONDARY_BG ='#000000',DISTANCE_THRESHOLD = 50;
//*****
let r = document.documentElement
let direction = {x:0,y:0}
let lastPaintTime = 0;
let snakeArray = [{x:5,y:15},{x:4,y:15},{x:3,y:15}] 
let snakeElements = []
let foodArray = []
let foodOrderArray =[]
let score = 0;
let currentActiveFood = 0;
const background = document.querySelector('#board')
const foodOrder = document.querySelector('#food-order')
const Score  = document.querySelector('#score')

r.style.setProperty('--primary-bg', PRIMARY_BG);
r.style.setProperty('--secondary-bg', SECONDARY_BG);
let WIDTH = background.offsetWidth;
let CELL_WIDTH = WIDTH / GAME_DIMENSION; // Width and Height of one Cell in px
function main(currentTime)
{
  window.requestAnimationFrame(main)
  if((currentTime -lastPaintTime)/100 < 1/speed)
  return;
  lastPaintTime  = currentTime;
  gameEngine();
}

//Initialize
function Initialize()
{
  timeLeft = 60;
  score = 0;
  document.querySelector("#timer").innerHTML = timeLeft;
  background.innerHTML=''
  foodOrder.innerHTML = ''
  snakeArray.forEach((ele,index)=>{
    let snakeElement = createSnakeElement(ele.x,ele.y)
    background.appendChild(snakeElement)
    if(index===0)
      snakeElement.classList.add("head");
    snakeElements.push(snakeElement);
  })

  createNewFoodSequence();
}

//Timer
function updateTimer() {
  if(!(direction.x===0&&direction.y===0)){
    timeLeft = timeLeft - 1;
    if(timeLeft >= 0)
      document.querySelector('#timer').innerHTML = (timeLeft);
    else
      gameOver();
  }
    
}
function startTimer() {
  console.log("Start Timer")
  timeLeft = 60;
  timer = setInterval(updateTimer, 1000);
  updateTimer();
}
//Timer


function gameOver() {
  clearInterval(timer);
  timer=null;
  timeLeft = 60;
  direction ={x:0,y:0}
  snakeArray=[{x:5,y:15},{x:4,y:15},{x:3,y:15}] 
  snakeElements = []
  foodArray = []
  foodOrderArray = []
  currentActiveFood = 0;
  alert("Game Over");
  Initialize();

}

function createSnakeElement(x,y){
  let snakeElement = document.createElement('div');
  snakeElement.classList.add('snake');
  snakeElement.style.top=`${y*CELL_WIDTH}px`;
  snakeElement.style.left=`${x*CELL_WIDTH}px`;
  snakeElement.style.width = `${CELL_WIDTH}px`
  snakeElement.style.height = `${CELL_WIDTH}px`
  return snakeElement;
}


function isCollide(){
  if(snakeElements[0].offsetTop>=WIDTH||snakeElements[0].offsetLeft>=WIDTH||snakeElements[0].offsetTop<0||snakeElements[0].offsetLeft<0)
    return true;
}
//Increase Snake Length
function IncreaseSnakeLEngth(foodIndex){
  let snakeElement = createSnakeElement(x=foodArray[foodIndex].offsetLeft,y=foodArray[foodIndex].offsetTop);
  background.appendChild(snakeElement)
  snakeElements.push(snakeElement)
  snakeArray.push({...foodArray[foodIndex]});
}

//New Food Sequence
function createNewFoodSequence(){
  for(var i=0;i<5;i++){
    let {foodElement,foodOrderElement}= createNewFoodElement(); 
    if(i===0)
    {
      foodElement.classList.add("active");
      foodOrderElement.classList.add("active");
    }
     
    foodArray.push(foodElement);
    foodOrderArray.push(foodOrderElement)
    background.appendChild(foodElement);
    foodOrder.appendChild(foodOrderElement);
  }
}

//Check For Similar Color

function IsDuplicateFoodElement(color,X,Y)
{
  let flag = 0;
  if(X<=3||Y<=3||X>=37||Y>=37||color===PRIMARY_BG||color===SECONDARY_BG)
    flag = 1;
  else
  {
    foodArray.forEach((e)=>{
      //console.log("Start")
      // Position Check
      let x = Math.floor(e.offsetLeft/CELL_WIDTH);
      let y = Math.floor(e.offsetTop/CELL_WIDTH);
      let posCheck = (Math.abs(x - X)<=2||Math.abs(y - Y)<=2);
      let colorCheck = (color === PRIMARY_BG || color === SECONDARY_BG)
      console.log("x: "+x,"y: "+y,"X: "+X,"Y:"+Y,"E: "+color,"PBG: "+PRIMARY_BG,"SBG: "+SECONDARY_BG,"pos: "+posCheck,"color: "+colorCheck)
      if(colorCheck)
        flag = 1;
      if(posCheck)
        flag = 1;
    })
  }
    if(flag)
      return true;
    else
      return false;
}
function createNewFoodElement(){
  //console.log("New Food Element Start")
  let foodColor,foodX,foodY;
  //console.log("Is Dup ",IsDuplicateFoodElement(foodColor,foodX,foodY))
  do
  {
     foodColor =  "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
     foodX = Math.floor(Math.random()*GAME_DIMENSION);
     foodY = Math.floor(Math.random()*GAME_DIMENSION);
  }while(IsDuplicateFoodElement(foodColor,foodX,foodY))
  
  let Element = document.createElement('div');
  Element.style.top = `${foodY*CELL_WIDTH}px`;
  Element.style.left = `${foodX*CELL_WIDTH}px`;
  Element.style.backgroundColor = foodColor;
  Element.style.width = `${CELL_WIDTH}px`
  Element.style.height = `${CELL_WIDTH}px`
  Element.classList.add('food');

  let orderElement  = document.createElement('div');
  orderElement.style.backgroundColor = foodColor;
  orderElement.classList.add('food');
  return{foodElement:Element,foodOrderElement:orderElement}
}
function FoodCheck(){
  if(foodArray[currentActiveFood].offsetLeft===snakeElements[0].offsetLeft&&foodArray[currentActiveFood].offsetTop===snakeElements[0].offsetTop)
  {
    //IncreaseSnakeLEngth(currentActiveFood)
    foodArray[currentActiveFood].classList.remove('active')
    foodArray[currentActiveFood].classList.add('inactive')
    foodOrderArray[currentActiveFood].classList.remove('active')
    currentActiveFood++;
    if(currentActiveFood>=5){
      currentActiveFood = 0;
      foodArray = [];
      foodOrderArray = [];
      foodOrder.innerHTML = ''
      createNewFoodSequence()
      score+=3;
      timeLeft+=8;
    }
    else
    {
      foodArray[currentActiveFood].classList.add('active')
      foodOrderArray[currentActiveFood].classList.add('active')
      score+=2;
    }
      
  }
  else{
    foodArray.forEach((e,i)=>{
      if(e.offsetLeft===snakeElements[0].offsetLeft&&e.offsetTop===snakeElements[0].offsetTop&&i!==currentActiveFood)
      {
        e.classList.add("blink")
        setTimeout(()=>e.classList.remove('blink'),500);
        score-=1;
      }
    })
  }

}
function gameEngine()
{
  Score.innerHTML = score;
  if(isCollide()){
    gameOver();
}
  FoodCheck();

  for(let i=snakeArray.length-2;i>= 0;i--){
    snakeArray[i+1] = {...snakeArray[i]}
  }
  for(let i=snakeArray.length-1;i>= 0;i--){
    snakeElements[i].style.top = `${snakeArray[i].y*CELL_WIDTH}px`
    snakeElements[i].style.left = `${snakeArray[i].x*CELL_WIDTH}px`
  }
  snakeArray[0].x+=direction.x;
  snakeArray[0].y+=direction.y;

  snakeElements[0].style.top = `${snakeArray[0].y*CELL_WIDTH}px`
  snakeElements[0].style.left = `${snakeArray[0].x*CELL_WIDTH}px`
  
}
Initialize();
window.requestAnimationFrame(main);
function handleDirectionChange(code){
  if(direction.x===0&&direction.y===0)
  startTimer()
direction ={x:0,y:1}
switch(code){
  case 0:
    direction ={x:0,y:-1}
    break;
  case 1:
    direction ={x:0,y:1}
    break;
    case 2:
      direction ={x:-1,y:0}
      break;
    case 3:
      direction ={x:1,y:0}
      break;
}
}
window.addEventListener('keydown',(e)=>{
  if(direction.x===0&&direction.y===0)
    startTimer()
  direction ={x:0,y:1}
  switch(e.key){
    case "ArrowUp":
      handleDirectionChange(0)
      break;
    case "ArrowDown":
      handleDirectionChange(1)
      break;
      case "ArrowLeft":
        handleDirectionChange(2)
        break;
      case "ArrowRight":
        handleDirectionChange(3)
        break;
  }
})
document.addEventListener('swipeleft', function(e) {
  // ...
  handleDirectionChange(2)
});
document.addEventListener('swiperight', function(e) {
  handleDirectionChange(3)
  // ...
});
document.addEventListener('swipeup', function(e) {
  // ...
  handleDirectionChange(0)
});
document.addEventListener('swipedown', function(e) {
  handleDirectionChange(1)
  // ...
});


