// Import Main.js
import { currentUser, Question, Temporizador } from "../main.js";

function Questionary() {
  this.duration = 0;
  this.remainingTime = 0;
  this.punctuation = 0;
  this.maxPunctuation = 0;
  this.questions = new Array(); // Array of Question objects

  /**
   * Return an instance of Questionary with data passed by questionaryJSON
   *
   * @param {JSON} questionaryJSON
   */
  this.getFromJSON = (questionaryJSON) => {
    return Object.assign(new Questionary(), JSON.parse(questionaryJSON));
  };

  /**
   * Return all questions that are selected to be part of the questionary
   */
  this.getQuestionsSelected = () => {
    return this.questions.filter((question) => question.isSelected);
  };

  /**
   * Returns all the questions that haven't yet been selected to be part of the questionary
   */
  this.getQuestionsAvailable = () => {
    return this.questions.filter((question) => !question.isSelected);
  };
}

// Export class Question
export { Questionary };