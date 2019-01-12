const Shell = require("./Shell");

var shell = new Shell();
var opt = {
  test: {
    Desc: Shell.desc("Testing"),
    func: ()=>console.log("A")
  }
}
shell.setLabel("Autoencoder")
shell.addOperation("test", opt["test"])
shell.prompt();
