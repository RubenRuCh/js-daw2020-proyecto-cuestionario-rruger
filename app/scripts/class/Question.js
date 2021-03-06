// Import Main.js
import { currentUser, Temporizador } from "../main.js";

function Question() {
  this.title;
  this.answer;
  this.value;
  this.order = 999; // Determine order in selectedQuestion
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
   * @param {String} idSectionList HTML id of list where we want to print the newQuestion
   * @param {Boolean|Array} reorderItems false if there's nothing to reorder. Array with parent of oldQuestion and oldQuestion to be reorder
   */
  this.printTitle = (idSectionList, reorderItems = false) => {
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
      let newQuestionTitle = event.dataTransfer.getData("text");

      // Wait 10ms to allow enough time to update Question list with list drop event
      await Temporizador.setTimer(10);

      // event.target represent the Question that was already on this list
      let indexOldQuestion = currentUser.questionary.searchQuestionByTitle(
        event.target.dataset.title
      );

      // Get old question
      const oldQuestionInCookie =
        currentUser.questionary.questions[indexOldQuestion];

      const oldQuestionInDocument = document.querySelector(
        `li[data-title='${oldQuestionInCookie.title}']`
      );

      // Get new question (the one that has been dropped)
      let indexNewQuestion = currentUser.questionary.searchQuestionByTitle(
        newQuestionTitle
      );

      const newQuestionInCookie =
        currentUser.questionary.questions[indexNewQuestion];

      const newQuestionInDocument = document.createElement("li");
      newQuestionInDocument.textContent = newQuestionInCookie.title;

      // Update HTML view with the new order
      const parent = oldQuestionInDocument.parentNode;

      const arrayWithToolsToOrder = [];
      arrayWithToolsToOrder["parent"] = parent;
      arrayWithToolsToOrder["oldQuestionInDocument"] = oldQuestionInDocument;

      this.title = newQuestionInCookie.title;
      this.isSelected = newQuestionInCookie.isSelected;

      // Call printTitle to give newQuestionInDocument same properties that before
      this.printTitle(idSectionList, arrayWithToolsToOrder);
    });

    // If its just move one Question from one list to another, just append it in the end
    if (!reorderItems) {
      list.appendChild(listElement);
    }
    // If they are the same question, we don't insert nor delete nothing
    else if (
      this.title == reorderItems["oldQuestionInDocument"].dataset.title
    ) {
      return true;
    }
    // If we drop a Question on top on other Question, we gonna reorder them
    else {
      // Get previus position of Question dropped
      const newQuestionInLastPosition = document.querySelector(
        `li[data-title='${this.title}']`
      );
      // Remove it
      newQuestionInLastPosition.parentNode.removeChild(
        newQuestionInLastPosition
      );

      // Insert Question dropped on top on the Question that received the drop
      reorderItems["parent"].insertBefore(
        listElement,
        reorderItems["oldQuestionInDocument"]
      );

      // Save new order in cookies
      currentUser.questionary.saveOrderOfSelectedQuestion();
    }
  };

  /**
   *  Save this Question in User cookie
   *
   */
  this.saveQuestion = () => {
    currentUser.questionary.questions.push(this);
    currentUser.saveUser();
  };

  /**
   *  Update this Question in User cookie
   */
  this.updateQuestion = () => {
    // Get index of this Question
    const indexQuestionToUpdate = currentUser.questionary.searchQuestionByTitle(
      this.title
    );

    // Update this Question
    currentUser.questionary.questions[indexQuestionToUpdate] = this;

    // Make the changes permanent by updating cookies asynchronously
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
