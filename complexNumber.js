/*
basic complex number arithmetic from 
http://rosettacode.org/wiki/Fast_Fourier_transform#Scala
(modified by Benjamin Schussler)
*/
class Complex{
  constructor(re, im) 
  {
    this.re = re;
    this.im = im || 0.0;
  }
  add(other, dst)
  {
    dst.re = this.re + other.re;
    dst.im = this.im + other.im;
    return dst;
  }
  sub(other, dst)
  {
    dst.re = this.re - other.re;
    dst.im = this.im - other.im;
    return dst;
  }
  mul(other, dst)
  {
    //cache re in case dst === this
    var r = this.re * other.re - this.im * other.im;
    dst.im = this.re * other.im + this.im * other.re;
    dst.re = r;
    return dst;
  }
  cexp(dst)
  {
    var er = Math.exp(this.re);
    dst.re = er * Math.cos(this.im);
    dst.im = er * Math.sin(this.im);
    return dst;
  }
  log()
  {
    /*
    although 'It's just a matter of separating out the real and imaginary parts of jw.' is not a helpful quote
    the actual formula I found here and the rest was just fiddling / testing and comparing with correct results.
    http://cboard.cprogramming.com/c-programming/89116-how-implement-complex-exponential-functions-c.html#post637921
    */
    if( !this.re )
      console.log(this.im.toString()+'j');
    else if( this.im < 0 )
      console.log(this.re.toString()+this.im.toString()+'j');
    else
      console.log(this.re.toString()+'+'+this.im.toString()+'j');
  }
}

/*
complex fast fourier transform and inverse from
http://rosettacode.org/wiki/Fast_Fourier_transform#C.2B.2B
*/
function cfft(amplitudes)
{
  //alert(amplitudes.length);
  var N = amplitudes.length;
  if( N <= 1 )
    return amplitudes;
  var hN = N / 2;
  var even = [];
  var odd = [];
  //even.length = hN;
  //odd.length = hN;
  for(var i = 0; i < hN; ++i)
  {
    even = even.concat([amplitudes[i*2]]);
    odd = odd.concat([amplitudes[i*2+1]]);
    //alert(even);
  }
  //alert(even);
  even = cfft(even);
  odd = cfft(odd);
  var a = -2*Math.PI;
  for(var k = 0; k < hN; ++k)
  {
    if(!(even[k] instanceof Complex))
      even[k] = new Complex(even[k], 0);
    if(!(odd[k] instanceof Complex))
      odd[k] = new Complex(odd[k], 0);
    var p = k/N;
    var t = new Complex(0, a * p);
    t.cexp(t).mul(odd[k], t);
    amplitudes[k] = even[k].add(t, odd[k]);
    amplitudes[k + hN] = even[k].sub(t, even[k]);
  }
  return amplitudes;
}
function icfft(amplitudes)
{
  var N = amplitudes.length;
  var iN = 1 / N;
 
  //conjugate if imaginary part is not 0
  for(var i = 0 ; i < N; ++i)
    if(amplitudes[i] instanceof Complex)
      amplitudes[i].im = -amplitudes[i].im;
 
  //apply fourier transform
  amplitudes = cfft(amplitudes)
 
  for(var i = 0 ; i < N; ++i)
  {
    //conjugate again
    amplitudes[i].im = -amplitudes[i].im;
    //scale
    amplitudes[i].re *= iN;
    amplitudes[i].im *= iN;
  }
  return amplitudes;
}

function fft(data,direct){          //wrapper function for dfft and idfft (mine, not rosettacode's)
  var cData=new Array(data.length);
  //alert(data.length);
  for(var i=0;i<data.length;i++){
    //alert("temp");
    //alert(new Complex(data[i][0],data[i][1]).re);
    cData[i]=new Complex(data[i][0],data[i][1]);
    //alert(cData[i].re);
  }
  //alert(cData[0].im);
  var outcData=direct?cfft(cData):icfft(cData);

  var out=new Array(data.length);
  for(var i=0;i<data.length;i++){
    out[i]=[outcData[i].re,outcData[i].im];
  }
  return out;
}