const { spawn } = require('child_process');
const IO = require("./IO");
const Auth = require("./Auth");

class Shell {
  constructor(label = "Blockchain [Login required]", loadOpt = true){
    this.io = new IO();
    this.operations = new Object();
    this.auth = Auth.getInstance();
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
    return new Promise((resolve, reject)=>{
      this.io.asks(questions).then((res)=>{
        this.auth.emailAuth(res.email, res.password).then((cred)=>{
          this.io.pushMsg("Login successful");
          this.setLabel("Blockchain [" + cred.user.email.split("@")[0]+"]");
          setTimeout(()=>{
            resolve();
          }, 1500);
        }).catch((err)=>{
          this.io.pushMsg("Login failure");
          setTimeout(()=>{
            resolve();
          }, 1500);
        })
      })
    });
  }

  async upgrade(){
    this.io.pushMsg("Checking with Git Lab, please wait...");
    return new Promise((resolve, reject)=>{
      const gitpull = spawn('git', ['pull', '-f']);
      gitpull.stdout.on('data', (data) => {
        this.io.pushMsg(data.toString());
      });
      gitpull.on('close', (code) => {
        this.io.pushMsg("Blockchain client upgrade ended with code " + code);
        setTimeout(()=>{
          resolve();
        }, 1500);
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

  setLabel(label){
    this.label = label;
  }
}
module.exports = Shell;
