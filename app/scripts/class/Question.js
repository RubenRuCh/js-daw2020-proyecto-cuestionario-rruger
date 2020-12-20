// Import Main.js
import { currentUser, Temporizador } from "../main.js";

function Question() {
  this.title;
  this.answer;
  this.value;
  this.isCorrect = false; // Determine if the question has been answered correctly
  this.isLoaded = false; // Determine if the question was loaded correctly in the list
  this.isSelected = false; // Determine if the question has been chosen to be part of the questionary

  /**
   * Print this question in a HTML table format
   *
   * @param {Question} question
   * @param {String} idTable
   */
  this.printQuestion = (idTable = "questions") => {
    // Disable backBtn and increment numQuestionToSave
    currentUser.disableBackBtn();
    currentUser.questionary.numQuestionsToSave++;

    const table = document.querySelector(`#${idTable} tbody`);

    // Create a new row and insert it into the table
    let rowQuestion = document.createElement("tr");
    let colTitle = document.createElement("td");
    let colAnswer = document.createElement("td");
    let colValue = document.createElement("td");
    let colIsLoaded = document.createElement("td");

    colTitle.textContent = this.title;
    colAnswer.textContent = this.answer;
    colValue.textContent = this.value;
    // Question.isLoaded it's false by default so there's no need to indicate that value
    colIsLoaded.textContent = "Guardando...";

    rowQuestion.appendChild(colTitle);
    rowQuestion.appendChild(colAnswer);
    rowQuestion.appendChild(colValue);
    rowQuestion.appendChild(colIsLoaded);

    table.appendChild(rowQuestion);

    // Wait 5 seconds before save it
    let wait = Temporizador.setTimer(5000);
    wait
      .then((resolv) => {
        // Mark this Question as correctly loaded and save it
        this.isLoaded = true;
        colIsLoaded.textContent = "OK";
        this.saveQuestion();

        // Decrement numQuestionToSave and check if it's more to load
        currentUser.questionary.numQuestionsToSave--;

        // If this was the last one, enable backBtn
        if (currentUser.getQuestionary().areAllQuestionsSaved()) {
          currentUser.enableBackBtn();
        }
      })
      // TODO Check this with Jest tests
      .catch((reject) => {
        // Mark this Question with an Error and don't save it
        colIsLoaded.textContent = "ERROR";

        // Decrement numQuestionToSave and check if it's more to load
        currentUser.questionary.numQuestionsToSave--;

        // If this was the last one, enable backBtn
        if (currentUser.getQuestionary().areAllQuestionsSaved()) {
          currentUser.enableBackBtn();
        }
      });
  };

  /**
   *  Save this Question in User cookie
   *
   * @param {Question} Question
   */
  this.saveQuestion = () => {
    currentUser.questionary.questions.push(this);
    currentUser.saveUser();
  };

  /**
   * Return an instance of Question with data passed by questionJSON
   *
   * @param {JSON} questionJSON
   */
  this.getFromJSON = (questionJSON) => {
    return Object.assign(new Question(), JSON.parse(questionJSON));
  };
}

/**
 * Load questions from cookies
 *
 * If mustWait == true, wait 5 seconds before load the questions
 *
 * @param {boolean} mustWait
 * @param {String} idTable
 */
async function loadQuestions(mustWait = false, idTable = "questions") {
  if (mustWait) {
    await Temporizador.setTimer(5000);
  }

  printQuestions(
    JSON.parse(Cookies.get(currentUser.email)).questionary.questions,
    idTable
  );
}

/**
 * Print questions in a HTML table format
 *
 * @param {Array} questions
 * @param {String} idTable
 */
function printQuestions(questions, idTable) {
  let loadingMessage = document.querySelector("#cargando");
  loadingMessage.parentNode.removeChild(loadingMessage);

  const table = document.querySelector(`#${idTable} tbody`);
  // For every question, create a new row and insert it into the table
  for (const question of questions) {
    let rowQuestion = document.createElement("tr");
    let colTitle = document.createElement("td");
    let colAnswer = document.createElement("td");
    let colValue = document.createElement("td");
    let colIsLoaded = document.createElement("td");

    colTitle.textContent = question.title;
    colAnswer.textContent = question.answer;
    colValue.textContent = question.value;
    colIsLoaded.textContent = question.isLoaded ? "OK" : "Guardando...";

    rowQuestion.appendChild(colTitle);
    rowQuestion.appendChild(colAnswer);
    rowQuestion.appendChild(colValue);
    rowQuestion.appendChild(colIsLoaded);

    table.appendChild(rowQuestion);
  }
}

// Export class Question
export { Question, loadQuestions };
