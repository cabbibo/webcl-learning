
function Recluse(){


  this.cl         = this.checkForCL();
  this.ctx        = this.cl.createContext();

  this.platforms  = this.cl.getPlatforms();
  this.devices    = this.platforms[0].getDevices( this.cl.DEVICE_TYPE_GPU );
 
  this.queue      = this.ctx.createCommandQueue();

}

Recluse.prototype.checkForCL = function(){

  if (window.webcl == undefined) {
      this.onError(
        "Unfortunately your system does not support webcl. " +
        "Make sure that you have both the OpenCL driver " +
        "and the webcl browser extension installed."
      );
  }else{
    return window.webcl
  }

}


Recluse.prototype.loadProgram = function( id ){

  var programElement = document.getElementById(id);
  var programSource = programElement.text;
  if (programElement.src != "") {
      var mHttpReq = new XMLHttpRequest();
      mHttpReq.open("GET", programElement.src, false);
      mHttpReq.send(null);
      programSource = mHttpReq.responseText;
  } 
  return programSource;


}

Recluse.prototype.buildProgram = function( program , device ){

  try{
  
      program.build( [device] , "" );

  }catch(e){
    
    this.onError( e );

  }


}


// Gets kernel, creates a program, and using a device builds it
Recluse.prototype.createProgram = function( id , device ){

  var programSrc = this.loadProgram( id );
  var program   = this.ctx.createProgram( programSrc );
  

  // Makes sure that we have a device if its not passed through
  if( !device )
    device = this.devices[0]; 


  this.buildProgram( program , device );

  return program;


}


Recluse.prototype.createKernal  = function( program , kernalID , args ){

  var kernel = program.createKernel( kernalID );

  if( !args ){
    this.onError( 'No Args Passed to this kernel' );
  }else{

    this.setArgs( kernel , args );

  }


}

Recluse.prototype.setArgs = function( kernel , args ){
  for( var i = 0; i < args.length; i++ ){
    kernal.setArg( i , args[i] );
  }
}



Recluse.prototype.createCommandQueue = function( device ){
}

Recluse.prototype.createReadBuffer = function( size ){
  var buffer = this.ctx.createBuffer( cl.MEM_READ_ONLY , size );
  return buffer;
}

Recluse.prototype.createWriteBuffer = function( size ){
  var buffer = this.ctx.createBuffer( cl.MEM_WRITE_ONLY , size );
  return buffer;
}



Recluse.prototype.onError = function( e ){
  alert( e );
}



