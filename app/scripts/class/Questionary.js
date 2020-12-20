// Import Main.js
import { currentUser, Question, Temporizador } from "../main.js";

function Questionary() {
  this.duration = 60; // At leats 1 minute (60 seconds)
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
   * Create a new Question in User's Questionary's array of questions
   *
   * printQuestion will print it into HTML table and then save it in User's cookie
   *
   * @param {Question} Question
   */
  this.createQuestion = (Question) => {
    Question.printQuestion();
  };

  /**
   * Move Question from one list to another, depends on his isSelected attribute
   *
   * @param {String} questionTitle
   */
  this.moveQuestion = (questionTitle) => {
    const indexQuestionToMove = this.searchQuestionByTitle(questionTitle);

    // Create a copy of this.questions
    const newQuestions = [...this.questions];

    // Reverse isSelected value
    newQuestions[indexQuestionToMove] = {
      ...newQuestions[indexQuestionToMove],
      isSelected: !newQuestions[indexQuestionToMove].isSelected,
    };

    // Update this.questions
    this.questions = newQuestions;

    // Make the changes permanent by updating cookies asynchronously
    currentUser.saveUser();
  };

  /**
   * Return index of Question object found in this.questions given it's title
   *
   * @param {String} questionTitle
   */
  this.searchQuestionByTitle = (questionTitle) => {
    return this.questions.findIndex(
      (question) => question.title == questionTitle
    );
  };

  /**
   * Return all questions that are selected to be part of the questionary
   */
  this.getQuestionsSelected = () => {
    return this.questions.filter((question) => question.isSelected);
  };

  /**
   * Print all questions that are selected to be part of the questionary
   */
  this.printQuestionsSelected = async () => {
    // Get selected questions sorted by their order (determined by user actions) //TODO MANTENER ORDEN
    const selectedQuestions = this.getQuestionsSelected().sort((a, b) =>
      a.title.toString().localeCompare(b.title, "es")
    );

    // Display 'Cargando...' to indicate we are loading questions
    let temporalList = document.querySelector("#questionsSelected ul");
    temporalList.textContent = "Cargando...";

    // Wait 5 seconds before print questions
    await Temporizador.setTimer(5000);

    // Delete 'Cargando...'
    temporalList.textContent = "";

    for (let selectedQuestion of selectedQuestions) {
      selectedQuestion = Object.assign(new Question(), selectedQuestion);
      selectedQuestion.printTitle("questionsSelected");
    }
  };

  /**
   * Returns all the questions that haven't yet been selected to be part of the questionary
   */
  this.getQuestionsAvailable = () => {
    return this.questions.filter((question) => !question.isSelected);
  };

  /**
   * Print all questions that haven't yet been selected to be part of the questionary
   */
  this.printQuestionsAvailable = async () => {
    // Get available questions sorted alphabetically by their title
    const availableQuestions = this.getQuestionsAvailable().sort((a, b) =>
      a.title.toString().localeCompare(b.title, "es")
    );
    // Display 'Cargando...' to indicate we are loading questions
    let temporalList = document.querySelector("#questionsAvailable ul");
    temporalList.textContent = "Cargando...";

    // Wait 5 seconds before print questions
    await Temporizador.setTimer(5000);

    // Delete 'Cargando...'
    temporalList.textContent = "";

    for (let availableQuestion of availableQuestions) {
      availableQuestion = Object.assign(new Question(), availableQuestion);
      availableQuestion.printTitle("questionsAvailable");
    }
  };

  /**
   * Return true if all questions have been saved correctly, and false if there is any question that is still processing
   */
  this.areAllQuestionsSaved = () => {
    return this.numQuestionsToSave == 0;
  };

  /**
   * Return the duration of the questionary in minutes
   */
  this.getDuration = () => {
    return Math.floor(this.duration / 60);
  };

  /**
   * Save the duration of the questionary in seconds
   *
   * @param {Number} minutes Duration in minutes
   */
  this.setDuration = (minutes) => {
    this.duration = parseInt(minutes) * 60;

    // Update user info
    currentUser.saveUser();
  };
}

// Export class Question
export { Questionary };
