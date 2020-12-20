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
        if (currentUser.questionary.areAllQuestionsSaved()) {
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
        if (currentUser.questionary.areAllQuestionsSaved()) {
          currentUser.enableBackBtn();
        }
      });
  };

  /**
   * Print this question's title in a HTML list format
   *
   * @param {String} idList
   */
  this.printTitle = (idSectionList) => {
    const list = document.querySelector(`section#${idSectionList} ul`);
    const listElement = document.createElement("li");
    listElement.textContent = this.title;

    // Config drag and drop of Question's title
    listElement.setAttribute("draggable", "true");
    listElement.dataset.title = this.title;
    listElement.dataset.origin = this.isSelected ? "selected" : "available";

    // When Question start being dragged, opacity = 50% and transfer it's title to check later
    listElement.addEventListener("dragstart", (event) => {
      listElement.style.opacity = 0.1;

      event.dataTransfer.setData("text", event.target.dataset.title);
    });

    // When another Question is dragged over this, desplace this to let space
    listElement.addEventListener("dragover", (event) => {
      listElement.style.paddingTop = "2rem";
    });

    // When another Question left being hover this, restore this Question's position
    listElement.addEventListener("dragleave", (event) => {
      listElement.style.paddingTop = "0rem";
    });

    // When we release Question, set it's opacity to it's original state
    listElement.addEventListener("dragend", (event) => {
      listElement.style.opacity = 1;
    });

    /* When we drop a Question inside another, reorder it */
    listElement.addEventListener("drop", async (event) => {
      listElement.style.paddingTop = "0rem";

      // Wait 10ms to allow enough time to update Question list with list drop event
      await Temporizador.setTimer(10);

      // event.target represent the Question that was already on this list
      let indexOldQuestion = currentUser.questionary.searchQuestionByTitle(
        event.target.dataset.title
      );

      const oldQuestion = currentUser.questionary.questions[indexOldQuestion];

      // In case we drop a Question inside selectedQuestions list
      if (oldQuestion.isSelected) {
        // New Question will be the last one of selectedQuestions
        const newQuestion = currentUser.questionary
          .getQuestionsSelected()
          .pop();

        console.log(oldQuestion);
        console.log(newQuestion);
        // TODO ordenar
      }
      // In case we drop a Question inside availableQuestions list
      else {
        // New Question will be the last one of availableQuestions
        const newQuestion = currentUser.questionary
          .getQuestionsAvailable()
          .pop();

        console.log(oldQuestion);
        console.log(newQuestion);
        // TODO ordenar
      }
    });

    list.appendChild(listElement);
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

  /**
   * Load questions from cookies
   *
   * If mustWait == true, wait 5 seconds before load the questions
   *
   * @param {boolean} mustWait
   * @param {String} idTable
   */
  this.loadQuestions = async (mustWait = false, idTable = "questions") => {
    if (mustWait) {
      await Temporizador.setTimer(5000);
    }

    this.printQuestions(
      JSON.parse(Cookies.get(currentUser.email)).questionary.questions,
      idTable
    );
  };

  /**
   * Print questions in a HTML table format
   *
   * @param {Array} questions
   * @param {String} idTable
   */
  this.printQuestions = (questions, idTable) => {
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
  };
}

// Export class Question
export { Question };
