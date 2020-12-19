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
    colIsLoaded.textContent = question.isLoaded;

    rowQuestion.appendChild(colTitle);
    rowQuestion.appendChild(colAnswer);
    rowQuestion.appendChild(colValue);
    rowQuestion.appendChild(colIsLoaded);

    table.appendChild(rowQuestion);
  }
}

// Export class Question
export { Question, loadQuestions };
