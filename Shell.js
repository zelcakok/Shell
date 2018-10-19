const IO = require("./IO");

class Shell {
  constructor(){
    this.io = new IO();
    this.operations = new Object();
  }

  addOperation(key, func){
    this.operations[key] = func;
  }

  addOperations(operations){
    Object.keys(operations).map((key)=>{
      this.operations[key] = operations[key];
    })
  }

  prompt(){
    this.io.ask("CMD", "BLK>").then((res)=>{
      if(Array.isArray(res)){
        console.log("Is array: ", res);
      } else {
        console.log("String: ", res);
      }
    });
  }
}
module.exports = Shell;
