function User(email) {
  this.email = email;
  this.newLogin = Date.now();
  this.oldLogin;
  this.Questionary;

  this.hola = function () {
    console.log("Hey");
    return true;
  };

  this.getFromJSON = function (userJSON) {
    return Object.assign(new User(), JSON.parse(userJSON));
  };
}

// Export class User
export { User };
