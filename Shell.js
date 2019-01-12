const { spawn } = require('child_process');
const IO = require("./IO");

class Shell {
  constructor(label = "", loadOpt = true){
    this.io = new IO();
    this.operations = new Object();
    this.label = label;
    if(loadOpt) this.loadStandardOpt();
  }

  static desc(msg){
    return Shell.desc(msg;
  }

  addOperation(key, func){
    this.operations[key] = func;
  }

  addOperations(operations){
    Object.keys(operations).map((key)=>{
      this.operations[key] = operations[key];
    })
  }

  setLabel(label){
    this.label = label;
  }

  loadStandardOpt(){
    var operations = {
      clear: {
        Desc: Shell.desc("Clear the console."),
        func: ()=>console.clear(),
      },
      help: {
        Desc: Shell.desc("List all commands."),
        func: ()=>{
          console.log("Command".padEnd(9) + "Argument(s)".padEnd(20) + "Description\n");
          Object.keys(this.operations).map((cmd)=>{
            console.log(cmd.padEnd(9) + this.operations[cmd].Desc);
          })
        }
      },
      exit: {
        Desc: Shell.desc("Exit Blockchain system."),
        func: ()=>process.exit(0)
      }
    }
    this.addOperations(operations);
  }

  react(cmd){
    return new Promise((resolve, reject)=>{
      try {
        if(Array.isArray(cmd)) resolve(this.operations[cmd[0]].func(...cmd));
        else resolve(this.operations[cmd].func());
      } catch(err) {
        console.log("Command not found");
        resolve();
      }
    });
  }

  prompt(){
    this.io.reset();
    this.io.ask("CMD", this.label + ">").then((res)=>{
      try {
        var cmd = res["CMD"].includes(" ") ? res["CMD"].split(" ") : res["CMD"];
        this.react(cmd).then(()=>this.prompt());
      } catch(err) {
        this.prompt();
      }
    }).catch((err)=>console.log(err))
  }

  setLabel(label){
    this.label = label;
  }
}
module.exports = Shell;
