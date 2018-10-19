const { spawn } = require('child_process');
const IO = require("./IO");

class Shell {
  constructor(label = "BLK", loadOpt = true){
    this.io = new IO();
    this.operations = new Object();
    this.label = label;
    if(loadOpt) this.loadStandardOpt();
  }

  addOperation(key, func){
    this.operations[key] = func;
  }

  addOperations(operations){
    Object.keys(operations).map((key)=>{
      this.operations[key] = operations[key];
    })
  }

  loadStandardOpt(){
    var operations = {
      echo: {
        Desc: "echo [arg] | echo message.",
        func: (...msg)=>{
          msg = msg.slice(1);
          console.log(msg.join(" "));
        }
      },
      clear: {
        Desc: "clear | Clear the console.",
        func: ()=>console.clear(),
      },
      help: {
        Desc: "help | List all commands",
        func: ()=>{
          console.log("Command\t\tDescription\n");
          Object.keys(operations).map((cmd)=>{
            console.log(cmd + "\t\t" + operations[cmd].Desc);
          })
        }
      },
      exit: {
        Desc: "exit | Exit Blockchain",
        func: ()=>process.exit(0)
      },
      login: {
        Desc: "login | Login to Blockchain system.",
        func: async ()=>await this.login()
      },
      upgrade: {
        Desc: "upgrade | Upgrade Blockchain client.",
        func: async ()=>await this.upgrade()
      }
    }
    this.addOperations(operations);
  }

  async login(){
    var questions = {
      email: {
        question: "Email"
      },
      password: {
        question: "Password",
        isMasked: true
      }
    }
    await this.io.asks(questions).then((res)=>{
      console.log("CALL FIREBASE HERE:", res);
    })
  }

  async upgrade(){
    return new Promise((resolve, reject)=>{
      const gitpull = spawn('git', ['pull', '-f']);
      gitpull.stdout.on('data', (data) => {
        this.io.pushMsg(data);
      });
      gitpull.on('close', (code) => {
        this.io.pushMsg("Blockchain client upgrade ended with code " + code);
      });
    });
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
}
module.exports = Shell;
