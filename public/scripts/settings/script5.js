document.addEventListener("DOMContentLoaded", async function () {
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



  const responce = await fetch('/api/user');
  const resData = await responce.json();
  const menuImg = document.querySelector("#btn1-container div img");
  menuImg.src = `img/profiles/${resData._id}/Avatar.png`;



  //start game modal
  // Get the modal
  var modal = document.getElementById("modal");

  // Get the button that opens the modal
  var btn = document.getElementById("open-modal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  let startGameData = [];

  const sideImgs = document.querySelectorAll(".side-img");
  sideImgs.forEach(sideImg => { sideImg.addEventListener('click', () => { sideImgs.forEach(sideImg2 => sideImg2.classList.remove("active-option")); sideImg.classList.add("active-option") }) });
  const startGameButton = document.querySelector(".start-game-button");


  const typeImgs = document.querySelectorAll(".type-img");
  const divs = document.querySelectorAll(".choose-slider-div");
  divs.forEach(div => {
    div.style.height = "0";
    div.style.border = "0px";
    div.style.fontSize = "0px";
  });
  divs[0].style.height = "40px";
  divs[0].style.border = "2px solid #8A4726";
  divs[0].style.fontSize = "30px";
  typeImgs.forEach((typeImg, i) => {
    typeImg.addEventListener('click', () => {
      typeImgs.forEach(typeImg2 => typeImg2.classList.remove("active-option"));
      typeImg.classList.add("active-option");

      divs.forEach(div => {
        div.style.height = "0";
        div.style.border = "0px";
        div.style.fontSize = "0px";
        startGameButton.innerHTML = "Start Game"
      });
      divs[i].style.height = "40px";
      divs[i].style.border = "2px solid #8A4726";
      divs[i].style.fontSize = "30px";
      if (i == 1) { startGameButton.innerHTML = "Get Link" }

    });
  });
  function checkFormat(str) {
    const regex = /^\d+\|\d+$/;
    return regex.test(str);
  }

  const uniqueTimer = document.querySelector(".custom-timer-button");
  const inp = document.querySelector(".hidden-input");
  uniqueTimer.addEventListener('click', () => {
    if (checkFormat(inp.value)) { uniqueTimer.innerHTML = inp.value; } else { uniqueTimer.innerHTML = "Wrong format"; }
  });
  const timers = document.querySelectorAll(".default-timer-button");
  timers.forEach(timer => { timer.addEventListener('click', () => { timers.forEach(timer2 => timer2.classList.remove("active-option")); timer.classList.add("active-option") }) });



  startGameButton.addEventListener('click', () => {
    const activeButtons = document.querySelectorAll(".active-option");
    activeButtons.forEach((button, index) => {

      if (index == 0) {
        const src = button.getAttribute("src");
        let fileName = src.substring(src.lastIndexOf("/") + 1);
        if (fileName == "computericon.png") {
          fileName = "AI";
        }
        else {
          if (fileName == "human.png") {
            fileName = "hu";
          }
          else {
            fileName = "hs";
          }

        }
        startGameData.push(fileName);
      }
      if (index == 1) {
        const src = button.getAttribute("src");
        let fileName = src.substring(src.lastIndexOf("/") + 1);
        if (fileName == "K.png") {
          fileName = "w";
        }
        else {
          if (fileName == "K2.png") {
            fileName = "b";
          }
          else {
            fileName = "r";
          }
        }
        startGameData.push(fileName);
      }
    });
    const thirdButton = activeButtons[2];
    let thirdButtonInnerHTML;
    if (thirdButton.innerHTML != "Wrong format") {
      thirdButtonInnerHTML = thirdButton.innerHTML;
    } else {
      thirdButtonInnerHTML = "15|10";
    }
    startGameData.push(thirdButtonInnerHTML);

    console.log(startGameData);
    if (startGameData[0]=="hu"){
      let link = `/game/link?id=${resData._id}`;
      window.location.href = `/game/?link=${link}&timer=${startGameData[2]}`;
    }
    else
    {
      window.location.href = `/game/?type=${startGameData[0]}&side=${startGameData[1]}&timer=${startGameData[2]}`;
    }
    
  });
});
