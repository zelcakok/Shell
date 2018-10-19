const Enquirer = require("enquirer");

class IO {
  constructor(){
    this.enquirer = new Enquirer();
    this.enquirer.register('password', require('prompt-password'));
  }

  set(key, question, isMarked = false){
    return this.enquirer.set({
      type: isMarked? 'password' : 'input',
      message: question,
      name: key
    })
  }

  test(){
    this.enquirer.ask();
  }

  ask(key, question, isMarked = false){
    return this.enquirer.ask({
      type: isMarked? 'password' : 'input',
      message: question,
      name: key
    })
  }

  asks(questions, index = 0, responses = null){
    return new Promise((resolve, reject)=>{
      var resList = responses? responses : new Object();
      var key = Object.keys(questions)[index];
      if(!questions.hasOwnProperty(key)) return resolve(responses);
      this.enquirer.ask({
        type: questions[key].isMarked? 'password' : 'input',
        message: questions[key].question,
        name: key
      }).then((res)=>{
        resList[key] = res[key];
        resolve(this.asks(questions, ++index, resList))
      })
    });
  }

  print(msg){
    console.log(msg);
  }
}
module.exports = IO;
