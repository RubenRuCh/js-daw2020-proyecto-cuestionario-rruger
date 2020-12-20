// Import Main.js
import { currentUser, Question, Temporizador } from "../main.js";

function Questionary() {
  this.duration = 0;
  this.remainingTime = 0;
  this.punctuation = 0;
  this.maxPunctuation = 0;
  this.questions = new Array(); // Array of Question objects
  this.numQuestionsToSave = 0; // Number of Question objects to be saved

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

  /**
   * Return true if all questions have been saved correctly, and false if there is any question that is still processing
   */
  this.areAllQuestionsSaved = () => {
    return this.numQuestionsToSave == 0;
  };
}

// Export class Question
export { Questionary };
