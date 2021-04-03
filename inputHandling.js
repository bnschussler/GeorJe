document.getElementById('timeStepText').readOnly = true;

var inputs=[
document.getElementById("p1"),
document.getElementById("v1"),
document.getElementById("p2"),
document.getElementById("v2"),
document.getElementById("p3"),
document.getElementById("v3"),
document.getElementById("pt1"),
document.getElementById("pt2"),
document.getElementById("pt3"),
document.getElementById("w1"),
document.getElementById("w2"),
document.getElementById("w3")
];

var vInputs=[
document.getElementById("wall"),
document.getElementById("wall1"),
document.getElementById("sin"),
document.getElementById("parabola"),
document.getElementById("a1"),
document.getElementById("a2"),
document.getElementById("a3"),
document.getElementById("a4"),
document.getElementById("h1"),
document.getElementById("h2"),
document.getElementById("h3"),
document.getElementById("h4")
];

var tInputs=[
document.getElementById("timeStepRange")
]

function setToDefault(data){
	run=false;
	for(var i=0;i<(inputs.concat(vInputs)).length;i++){
		inputs.concat(vInputs)[i].value=data[i];
		inputs.concat(vInputs)[i].checked=data[i];
	}
	document.getElementById("timeStepRange").value=data[24];
  	document.getElementById("measure").value=data[25];	
	setT();
	setV();
	setPsi();
}

function reset(){
	run=false;
	setPsi();
	setV();
	setT();
}

function initializeWaveFunction(data){ //'particles' holds potition and momentum information
  particles=data[0];
  //console.log(particles);
  useP=data[1];
  //alert(useV);
  psi=[];//zero out psi and V
  //alert(psi[0]);
  for(n=0;n<len;n++){               //initialize wavefunction and normalize
    
    temp=[0,0];
    for(i=0;i<particles.length;i++){
      //alert([n,i,Math.sin(n/len*2*PI*particles[i][1])*Math.exp(-Math.pow(n-particles[i][0],2)/width)]);
      if(useP[i]){
        temp[0]+=Math.sin(n/len*2*PI*particles[i][1])*Math.exp(-Math.pow((n-particles[i][0])/width/data[2][i],2))/Math.sqrt(data[2][i]);
        temp[1]+=-Math.cos(n/len*2*PI*particles[i][1])*Math.exp(-Math.pow((n-particles[i][0])/width/data[2][i],2))/Math.sqrt(data[2][i]);
      }
    }
    psi=psi.concat([temp]);
    //alert(psi.length);

    //alert(psi);
  }
  //alert(psi);
  //alert(V);
  //alert(mag);
  norm(psi,12);
  //alert(psi.length);
  A=fft(psi,true);
  //alert(A);
}

function setPsi(){
	run=false;
	initializeWaveFunction([[[inputs[0].value/800*len,inputs[1].value*1],
								[inputs[2].value/800*len,inputs[3].value*1],
								[inputs[4].value/800*len,inputs[5].value*1]],
							[inputs[6].checked,inputs[7].checked,inputs[8].checked],
							[Math.exp(inputs[9].value/10-6),Math.exp(inputs[10].value/10-6),Math.exp(inputs[11].value/10-6)]]);
	//alert("done!");
}

function setV(){
	useV=[Number(vInputs[0].checked),Number(vInputs[1].checked),Number(vInputs[2].checked),Number(vInputs[3].checked)];
  	vPos=[Number(vInputs[4].value/800*len),Number(vInputs[5].value/800*len),Number(vInputs[6].value/800*len),Number(vInputs[7].value/800*len)];
  	vheights=[Number(vInputs[8].value),Number(vInputs[9].value),Number(vInputs[10].value),Number(vInputs[11].value)];
 	//alert(useV);
 	V=[];
	for(n=0;n<len;n++){
		temp=0;
    	for(i=0;i<useV.length;i++){         
    	  if(useV[i]){ 
    	    //console.log((Math.abs(mod(n-vPos[1],len)-len/2)<10)?vheights[1]:0);
    	    temp+=[Math.exp(-Math.pow(mod(n-vPos[0],len)/len-.5,2)*len)*vheights[0],
    	           (Math.abs(mod(n-vPos[1],len)-len/2)<10)?vheights[1]:0,
    	           Math.sin(mod(n-vPos[2],len)/len*2*PI)*vheights[2],
    	           Math.pow((mod(n-vPos[3],len)/len-.5)*2,2)*vheights[3]][i];
    	  }
    	}
    	//console.log(temp);
    	V=V.concat(temp);
	}
}

inputs.forEach(function(element) {
    element.addEventListener("input", function() {
    	setPsi();
    });
});

vInputs.forEach(function(element) {
    element.addEventListener("input", function() {
    	setV();
    });
});

function setT(){
	t=document.getElementById("timeStepRange").value/200000;
	document.getElementById("timeStepText").value=Math.round(t*1000000)/100+"x"
}

tInputs.forEach(function(element) {
    element.addEventListener("input", function() {
    	setT();
    });
});

var canvas=document.getElementById("myCanvas");
document.addEventListener("mousemove", updatePosition, false);
function updatePosition(e) {
  var rect = canvas.getBoundingClientRect();
  if(e.clientX-rect.left>0 && e.clientX-rect.left<canvas.width &&
  	 e.clientY-rect.top>0 && e.clientY-rect.top<canvas.height){
  	mouseX=e.clientX-rect.left;
  	mouseY=e.clientY-rect.top;
  }
  else{
  	mouseX=-1;
  	mouseY=-1;
  }
  //console.log(mouseX,mouseY);
}
