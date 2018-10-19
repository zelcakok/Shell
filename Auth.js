const firebase = require('firebase');

var instance = null;
class Auth {
  constructor(){
    var config = {
      apiKey: "AIzaSyCffQlrQXqYcwOQZWLPsnsaeGHk6q8W6kw",
      authDomain: "blockchain-1077f.firebaseapp.com",
      projectId: "blockchain-1077f",
    };
    firebase.initializeApp(config);
    this.fbAuth = firebase.auth();
  }

  static getInstance(){
    if(instance === null) instance = new Auth();
    return instance;
  }

  emailAuth(email, password){
    return this.fbAuth.signInWithEmailAndPassword(email, password);    
  }
}

module.exports = Auth;
