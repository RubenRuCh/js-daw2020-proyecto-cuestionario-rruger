// Import Main.js
import { currentUser, Question, Temporizador } from "../main.js";

function Questionary() {
  this.duration = 60; // At leats 1 minute (60 seconds)
  this.remainingTime = 0;
  this.punctuation = -1;
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
   * Save in cookies changes on selectedQuestions order
   *
   */
  this.saveOrderOfSelectedQuestion = () => {
    const listQuestionSelected = document.querySelector(
      "section#questionsSelected ul"
    );

    // Get Questions in selectedQuestions list
    const questionsInList = new Array();

    for (let question of listQuestionSelected.children) {
      questionsInList.push(question.dataset.title);
    }

    /* We have all selected questions in their actual order,
    now we have to save that order in our cookies list*/
    var newOrder = 0;

    for (let questionTitle of questionsInList) {
      let currentIndex = this.searchQuestionByTitle(questionTitle);
      let question = this.questions[currentIndex];
      question.order = newOrder++;

      // Update Question
      this.questions[currentIndex] = question;
    }

    // Save questions's new order in cookie
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
   * Reset this questionary
   *
   * Return questions at their original state (isCorrect = false)
   */
  this.resetQuestionary = () => {
    for (const question of this.questions) {
      question.isCorrect = false;
    }
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
    // Get selected questions sorted by their order (determined by user actions)
    const selectedQuestions = this.getQuestionsSelected().sort((a, b) => {
      // If there's order
      if (a.order >= 0 && b.order >= 0) {
        return parseInt(a.order) - parseInt(b.order);
      }
      // If not, order alphabetically
      else {
        return a.title.toString().localeCompare(b.title, "es");
      }
    });

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
   * Return the time used in complete the questionary in mm:ss
   */
  this.getTimeUsed = () => {
    const secondsUsed = parseInt(this.duration) - parseInt(this.remainingTime);

    var minutes = Math.floor(parseInt(secondsUsed) / 60);
    var seconds = parseInt(secondsUsed) - minutes * 60;

    if (seconds.toString().length == 1) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  };

  /**
   * Return the duration of the questionary in minutes
   */
  this.getDuration = () => {
    return Math.floor(this.duration / 60);
  };

  /**
   * Return the remaining time of the questionary in mm:ss
   */
  this.getCountdown = () => {
    var minutes = Math.floor(parseInt(this.remainingTime) / 60);
    var seconds = parseInt(this.remainingTime) - minutes * 60;

    if (seconds.toString().length == 1) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  };

  /**
   * Decrease 1 second to remainingTime and update changes in cookies
   */
  this.countdown = () => {
    if (parseInt(this.remainingTime) > 0) {
      this.remainingTime--;
      currentUser.saveUser();
    } else {
      return -1;
    }
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
