document.addEventListener("DOMContentLoaded", function() {
    let oldPassword = "123";
    let isVisible = true;
  
    const oldPasswordInput = document.getElementById("old-password");
    const newPasswordInput = document.getElementById("new-password");
    const confirmationInput = document.getElementById("confirm-password");
    const anyoneCheckbox = document.getElementById("anyone-checkbox");
    const nooneCheckbox = document.getElementById("noone-checkbox");
    const saveButton = document.querySelector(".save-button-sequrity");
  
    // Set the initial state of the checkboxes
    if (isVisible) {
      anyoneCheckbox.checked = true;
    } else {
      nooneCheckbox.checked = true;
    }
  
    // Add event listeners to the checkboxes
    anyoneCheckbox.addEventListener("change", () => {
      nooneCheckbox.checked = !anyoneCheckbox.checked;
      isVisible = anyoneCheckbox.checked;
      console.log(isVisible);
    });
  
    nooneCheckbox.addEventListener("change", () => {
      anyoneCheckbox.checked = !nooneCheckbox.checked;
      isVisible = !nooneCheckbox.checked;
      console.log(isVisible);
    });
  
    // Add event listener to the save button
    saveButton.addEventListener("click", () => {
      let oldPasswordValue = oldPasswordInput.value;
      let newPasswordValue = newPasswordInput.value;
      let confirmationValue = confirmationInput.value;
  
      if (oldPasswordValue === oldPassword && newPasswordValue === confirmationValue) {
        oldPassword = newPasswordValue;
        oldPasswordInput.value = "";
        newPasswordInput.value = "";
        confirmationInput.value = "";
        console.log(oldPassword);
      } else {
        alert("Wrong passwords");
      }
    });
  });
  