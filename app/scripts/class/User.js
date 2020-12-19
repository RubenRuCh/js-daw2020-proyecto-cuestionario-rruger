// Import Main.js
import { Questionary } from "../main.js";

function User() {
  this.email;
  this.newLogin = Date.now();
  this.lastLogin = false;
  this.questionary = new Questionary(); // Object Questionary

  /**
   * Return String with info of lastLogin
   *
   */
  this.getLastLoginInfo = () => {
    const dateToFormat = new Date(this.lastLogin);
    const year = dateToFormat.getFullYear();
    const day = dateToFormat.getDate();

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const month = months[dateToFormat.getMonth()];

    const hour = dateToFormat.getHours();
    const minutes = dateToFormat.getMinutes();
    const seconds = dateToFormat.getSeconds();

    return `La última vez que entraste fue el ${day}-${month}-${year} a las ${hour}:${minutes}:${seconds}`;
  };

  /**
   * Return an instance of User with data passed by userJson
   *
   * @param {JSON} userJSON
   */
  this.getFromJSON = (userJSON) => {
    return Object.assign(new User(), JSON.parse(userJSON));
  };

  /**
   * Return an instance of Questionary with data saved in User.questionary
   *
   */
  this.getQuestionary = () => {
    return Object.assign(new Questionary(), this.questionary);
  };

  /**
   * Save Question in Questionary's array of questions
   *
   * @param {Question} Question
   */
  this.createQuestion = (Question) => {
    this.questionary.questions.push(Question);
    this.saveUser();
  };

  /**
   * Return an instance of User with data contained in currentUser cookie
   *
   * If there's no currentUser, redirect to index.html to log
   *
   */
  this.getCurrentUser = () => {
    const currentUserJSON = Cookies.get("currentUser");

    if (currentUserJSON != undefined) {
      return this.getFromJSON(currentUserJSON);
    } else {
      window.location.replace("./index.html");
    }
  };

  /**
   * Update User info in cookie
   *
   */
  this.saveUser = () => {
    Cookies.set(this.email, JSON.stringify(this), { expires: 10 });
    Cookies.set("currentUser", JSON.stringify(this), { expires: 1 });
  };
}

// Export class User
export { User };
