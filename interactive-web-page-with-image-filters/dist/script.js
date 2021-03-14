var fgImage = null;
var bgImage = null;
var grayimg=null;
var redimg=null;
var imgBlur=null ;

var fgCanvas=document.getElementById("fgcan");  ;
var bgCanvas = document.getElementById("bgcan");;
///////////////////////////////
function upload()
{
  doClear(fgCanvas);
  var filein= document.getElementById("fin");
  fgImage= new SimpleImage(filein);
  fgImage.drawTo(fgCanvas); 
  
  grayimg=new SimpleImage(filein);
  redimg=new SimpleImage(filein);
  imgBlur=new SimpleImage(filein);
}
////////////////////////////////
function makegray(){
  if (grayimg!=null) { 
  for(var pixel of grayimg.values()){

    var avg=(pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
    pixel.setRed(avg);

    pixel.setGreen(avg);

    pixel.setBlue(avg); 
}
  grayimg.drawTo(fgCanvas);
}
  else{
    alert('The image did not load');
  }
}

///////////////////////////////
function makered(){
  if (redimg!=null) { 
  for(var pixel of redimg.values()){
    var avg=(pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
    if(avg<128)
    {pixel.setRed(2*avg);

    pixel.setGreen(0);

    pixel.setBlue(0); }
    else{
      pixel.setRed(255);

    pixel.setGreen(2*avg-255);

    pixel.setBlue(2*avg-255);
      
    }
}
  redimg.drawTo(fgCanvas);
}
  else{
    alert('The image did not load');
  }
}
///////////////////////
function makeBlur() {
 for(var pixel of imgBlur.values()){
    var rndm = Math.random();
    var x = pixel.getX();
    var y = pixel.getY();
  if(rndm < 0.5){
     imgBlur.setPixel(x,y,pixel);
     }
  else{
     getnewPixel(x,y);
    }
  }
  imgBlur.drawTo(fgCanvas);
}

function getnewPixel(x,y){
  var h = imgBlur.getHeight();
  var w = imgBlur.getWidth();
  var rndmX = Math.floor(Math.random()*10);
  var rndmY = Math.floor(Math.random()*10);
  if(rndmX > w-1){
    rndmX = w-1;
  }
  else if(rndmX < 0){
    rndmX = 0;
  }
  if(rndmY > h-1){
    rndmY = h-1
  }
  else if(rndmY < 0){
    rndmY = 0;
  }
  var newPixel =      imgBlur.getPixel(rndmX,rndmY);
 imgBlur.setPixel(x,y,newPixel);
  return;
}
//////////////////////////////
function reset(){
    if (fgImage!=null) { 
    upload();
}
  else{
    alert('The image did not load');
  }
}

///////////////////////////////
function loadBackgroundImage() {
  var file = document.getElementById("bgfile");
  bgImage = new SimpleImage(file);
  bgImage.drawTo(bgCanvas);
}

function createComposite() {
  // this function creates a new image with the dimensions of the foreground image and returns the composite green screen image
  var output = new SimpleImage(fgImage.getWidth(),fgImage.getHeight());
  var greenThreshold = 240;
  for (var pixel of fgImage.values()) {
    var x = pixel.getX();
    var y = pixel.getY();
    if (pixel.getGreen() > pixel.getRed()+pixel.getBlue()) {
      //pixel is green, use background
      var bgPixel = bgImage.getPixel(x,y);
      output.setPixel(x,y,bgPixel);
    }
    else {
      //pixel is not green, use foreground
      output.setPixel(x,y,pixel);
    }
  }
  return output;
}

function doGreenScreen() {
  //check that images are loaded
  if (fgImage == null  || ! fgImage.complete()) {
    alert("Foreground image not loaded");
  }
  if (bgImage == null || ! bgImage.complete()) {
    alert("Background image not loaded");
  }
  // clear canvases
  clearCanvas();
  // call createComposite, which does green screen algorithm and returns a composite image
  var finalImage = createComposite();
  finalImage.drawTo(fgCanvas);
}

function clearCanvas() {
  doClear(fgCanvas);
  doClear(bgCanvas);
}

function doClear(canvas) {
  var context = canvas.getContext("2d");
  context.clearRect(0,0,canvas.width,canvas.height);
}