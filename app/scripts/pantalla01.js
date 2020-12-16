function printLoginScreen() {
  var oldSection = document.querySelector("#initialMessage");
  var mainContainer = oldSection.parentNode;

  var section = document.createElement("section");
  section.setAttribute("id", "login");

  var form = document.createElement("form");

  var label = document.createElement("label");
  label.setAttribute("for", "usuario");

  var input = document.createElement("input");
  input.setAttribute("type", "email");
  input.setAttribute("name", "usuario");
  input.setAttribute("id", "usuario");

  form.appendChild(label);
  form.appendChild(input);

  section.appendChild(form);

  console.log(section.innerHTML);

  mainContainer.removeChild(oldSection);
  mainContainer.appendChild = section;
}

document.addEventListener("load", (event) => {
  // Call setTimer with 5 seconds and actions to manage resolv and reject situations
  let promise = Temporizador.setTimer(5000, printLoginScreen(), () => {
    // If something went wrong in setTimer, create an Error
    Error("Error with setTimer");
  });
  // If everything its correct, execute printLoginScreen function
  promise.then(
    (response) => {
      response();
    },
    // If the timer goes wrong, we print an error message instead of login screen
    (error) => {
      document.querySelector("#initialMessage").parentNode.textContent = error;
    }
  );
});

document.addEventListener("keyup", (event) => {
  if (event.ctrlKey && event.key == "F10") {
    printLoginScreen();
  }
});
