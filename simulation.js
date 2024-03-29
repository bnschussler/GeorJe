const PI=3.14159;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle="#606060";

var width=document.getElementById("myCanvas").width;
var height=document.getElementById("myCanvas").height;

//approximates Schrodinger equation using foruier transforms (based off https://jakevdp.github.io/blog/2012/09/05/quantum-python/ and https://anarchy.website/2017/09/24/schrodinger.html)
//fast forier transform: https://discourse.processing.org/t/fft-of-1d-array-of-1024-measurements/7901/10

var run=false;

var len=1024;       //how fine the divisions of position are
var t=.0001;         //frametime (length of one frame)
var xmaxbound=10;   //upper bound for position space
var xminbound=0;    //lower bound for position space
var m=1;    //mass of particle

var dx=(xmaxbound-xminbound)/len;
var dp=2*PI/dx;
var psi=new Array(len);  //position waveform over line [0,1]; second index is for 0:real,1:imag
var A=new Array(len);  //momentum waveform over line [0,1]; second index is for 0:real,1:imag
var A1=new Array(len); //to save momentum space (FFT overwrites input arrays)
var V=new Array(len);     //potential field over line [0,1]
var psi=new Array(len).fill(new Array(2).fill(0));
var Vmax=14000;    //for normalization on graph
var Adiv=20;  //see above
var hbar=1;   //reduced Planck's constant
var n,n1,k,a,b,i,j,temp,temp1;        //temp variables for calculation
var mouseX,mouseY;
var find="neutral";

var particles,useV,vheights;

function rot(x,t){  //rotate complex variable (multiply by e^it)
  return [x[0]*Math.cos(t)-x[1]*Math.sin(t),+x[1]*Math.cos(t)+x[0]*Math.sin(t)];
}

function mod(a,b){
  return ((a%b)+b)%b;
}

function mag(vecF){
  //alert(vecF);
  var out=0
  for(var i=0;i<vecF.length;i++){
    out+=Math.sqrt(Math.pow(vecF[i][0],2)+Math.pow(vecF[i][1],2));
  }
  return out;
}

function norm(vecF,magOut){
  var magIn=mag(vecF);
  //alert([magIn,magOut]);
  for(var i=0;i<vecF.length;i++){
    vecF[i]=[vecF[i][0]/magIn*magOut,vecF[i][1]/magIn*magOut];
  } 
}


canvas.addEventListener("click",function(){
  measure(mouseY<height/2?"psi":"A",mouseY<height/2?psi:A,Math.floor(mouseX/canvas.width*len),Number(document.getElementById("measure").value));
},false);

function measure(fName,vecF,ind,dist){
  var prob=0
  //alert(dist);
  for(i=Math.max(0,ind-dist);(i<=ind+dist && i<vecF.length);i++){
    //alert(i);
    //alert([ind,dist]);
    //alert(Number(ind)+Number(dist));
    tempI=fName=="A"?mod(i-len/2,len):i;
    prob+=Math.sqrt(Math.pow(vecF[tempI][0],2)+Math.pow(vecF[tempI][1],2));
  }
  //var rand=Math.random()
  var found=find=="neutral"?Math.random()<(prob/mag(vecF)):find;
  console.log(found?"particle found!":"particle not found!");
  document.getElementById("particleFound").innerText=found?"particle found!":"particle not found!";
  //alert(document.getElementById("particleFound").innerText);
  //console.log([ind,dist]);
  //temp=0;
  for(i=0;i<len;i++){
    //console.log([i,Math.abs(ind-i)<dist,Math.abs(ind-i)<dist?!found:found]);
    //alert(i);
    //alert(ind);
    //alert(ind-i);
    //alert(Math.abs(ind-i)<dist?!found:found);
    tempI=fName=="A"?mod(i-len/2,len):i;
    if(Math.abs(ind-tempI)<dist?!found:found){
      vecF[i]=[0,0];
    }
  }
  if(fName=="psi"){
    norm(psi,12);
    A=fft(psi,true);
  }
  if(fName=="A"){
    psi=fft(A,false);
    norm(psi,12);
    A=fft(psi,true);
  }
}

function updateWaveFunction(){
                                              //implementation of wave equation
    for(n=0;n<len;n++){         //half step in position space + begin calculation of A from psi
      psi[n]=rot(psi[n],-(t*V[n]/hbar/2));
    }
    A=fft(psi,true);
    //alert(psi);
    //alert(A);
    //a=m*xminbound*dp/len;
    //for(n=0;n<len;n++){
    //  A[n]=rot(A[n],a);                      //this is the current momuntum space, A1 will be used now so that A will save the momentum for display
    //}
    for(n=0;n<len;n++){                      //half step in momentum space + begin calculation of psi from A
      A1[n]=rot(A[n],-(t*hbar*(Math.pow((mod(n+len/2,len)-len/2),2)/(2*m))));
    }
    psi=fft(A1,false);
    for(n=0;n<len;n++){
      psi[n]=rot(psi[n],-(t*V[n]/hbar/2));
    }
    
    norm(psi,12);
    //stop();
}


function updateCanvas(){
  //console.log(mag(A));
  ctx.fillRect(0,0,width,height);

  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0,(height)/4);
  ctx.strokeStyle = "#FF00FF";
  for(n=0;n<len;n++){   //scalar potential field
    ctx.lineTo(width*n/len,(-V[n]*1/Vmax*height+height)/4);
  }
  ctx.stroke();

  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(0,(height)/4);
  ctx.strokeStyle = "#0000FF";
  for(n=0;n<len;n++){   //position space -- imaginary axis
    //alert(psi[n]);
    ctx.lineTo(width*n/len,(-psi[n][1]*height+height)/4);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0,(height)/4);
  ctx.strokeStyle = "#FF0000";
  for(n=0;n<len;n++){   //position space -- real axis
    ctx.lineTo(width*n/len,(-psi[n][0]*height+height)/4);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0,(height)/4);
  ctx.strokeStyle = "#00FF00";
  for(n=0;n<len;n++){   //position space -- probability
    ctx.lineTo(width*n/len,-((Math.pow(psi[n][0],2)+Math.pow(psi[n][1],2))*height*10-height)/4);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0,(3*height)/4);
  ctx.strokeStyle = "#0000FF";
  for(n=0;n<len;n++){   //momentum space -- imaginary axis
    k=mod(n-len/2,len);
    ctx.lineTo(width*n/len,(-A[k][1]/Adiv*height+3*height)/4);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0,(3*height)/4);
  ctx.strokeStyle = "#FF0000";
  for(n=0;n<len;n++){   //momentum space -- real axis
    k=mod(n-len/2,len);
    ctx.lineTo(width*n/len,(-A[k][0]/Adiv*height+3*height)/4);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0,height*0.75);
  ctx.strokeStyle = "#00FF00";
  for(n=0;n<len;n++){   //momentum space -- probability
    k=mod(n-len/2,len);
    ctx.lineTo(width*n/len,-(Math.pow(A[k][0]/Adiv,2)+Math.pow(A[k][1]/Adiv,2))*1000+height*0.75);
  }
  ctx.stroke();

  if(mouseX>=0 && mouseY>=0){
    temp=Number(document.getElementById("measure").value);
    //console.log([temp]);
    ctx.strokeStyle = "#FFFF00";
    ctx.beginPath();
    ctx.rect(mouseX-temp/len*width,height/8+mouseY-mod(mouseY,height/2),temp*2/len*width,height/4);
    ctx.stroke();
  }
}

window.addEventListener('keydown',this.keyPressed,false);
window.addEventListener('keyup',this.keyReleased,false);
function keyPressed(e) {
  //alert(e.key);
  switch(e.key){
    case 'a':
      find=true;
      break;
    case 'z':
      find=false;
      break;
  }
  //alert(find);
}
function keyReleased(e){
  switch(e.key){
    case 'a':
    case 'z':
      find="neutral";
      break;
  }
}

//alert(fft([[0,0]],true));
setToDefault([100,163,100,-163,200,80,true,false,false,30,30,30,true,false,false,false,0,0,0,0,14000,14000,14000,14000,20,20]);
setInterval(function(){
  updateCanvas(); 
  if(run){
    updateWaveFunction();
    //alert(A);
  }
}, 30);  //actually run the code
//updateCanvas();