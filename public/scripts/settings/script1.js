document.addEventListener("DOMContentLoaded", async function () {
  let isValidCountry = true;

  const responce = await fetch('/api/user');
  const resData = await responce.json();

  let dataArray = [`${resData.options.real_name}`, resData.username, resData.options.location.country, resData.options.location.state, resData.options.location.city, resData.roles.Premium == 1984 ?? false];
  let inputName = document.getElementById("input-name");
  inputName.value = dataArray[0];
  let inputNick = document.getElementById("input-nick");
  inputNick.value = "@" + dataArray[1];
  let inputCountry = document.getElementById("input-country");
  inputCountry.value = dataArray[2];
  let inputState = document.getElementById("input-state");
  inputState.value = dataArray[3];
  let inputCity = document.getElementById("input-city");
  if (dataArray[4] != "") {
    inputCity.value = dataArray[4];
  }
  else {
    inputCity.value = "(Do not display)"
  }
  let inputPremium = document.getElementById("input-premium");
  if (dataArray[5]) {
    inputPremium.value = "You have Premium";
  }
  else {
    inputPremium.value = "(Not owned)";
  }
  // Get a list of all country names using the REST Countries API
  fetch("https://restcountries.com/v2/all")
    .then(response => response.json())
    .then(data => {
      let countryNames = data.map(country => country.name);

      // Add an event listener to the input element with ID "input-country"
      let inputCountry = document.getElementById("input-country");
      inputCountry.addEventListener("input", function () {
        let inputValue = inputCountry.value.trim();

        // Check if the input value is a valid country name
        if (countryNames.includes(inputValue)) {
          inputCountry.style.color = "black";
          isValidCountry = true;
          if (inputValue == "Russian Federation") { inputCountry.value = "Москаль, вийшов нахуй"; isValidCountry = false; }
        } else {
          inputCountry.style.color = "red";
          isValidCountry = false;
        }
      });
    })
    .catch(error => console.error(error));


  let saveButton = document.querySelector(".save-button");

  // Add a click event listener to the "Save" button
  saveButton.addEventListener("click", function () {
    // Get the values of the input fields and save them to the dataArray array
    dataArray[0] = inputName.value;
    if (isValidCountry) {
      dataArray[2] = inputCountry.value;
    }
    else {
      alert("Wrong country, your changes discarded");
    }
    dataArray[3] = inputState.value;
    if (inputCity.value != "(Do not display)") {
      dataArray[4] = inputCity.value;
    }
    else {
      dataArray[4] = "";
    }
    // Log the updated dataArray array to the console
    console.log(dataArray);
  });


  const menuImg = document.querySelector("#btn1-container div img");
  menuImg.src = `img/profiles/${resData._id}/avatar.png`;



  //start game modal
  // Get the modal

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



  startGameButton.addEventListener('click', async () => {
    const activeButtons = document.querySelectorAll(".active-option");
    activeButtons.forEach((button, index) => {

      if (index == 0) {
        const src = button.getAttribute("src");
        let fileName = src.substring(src.lastIndexOf("/") + 1);
        if (fileName == "computericon.png") {
          fileName = "AI"
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

    //console.log(startGameData);
    if (startGameData[0] == "hu") {

      fetch("/api/game", {
        method: "POST", body: JSON.stringify({
          "user1": resData._id,
          "moveData": {
            "playerId": resData._id,
            "dataArray": ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", 255, 1, 1, 1, 1, 1],
            "legalMovesForPlayer": [
              [8, 16, 0], [9, 17, 0], [10, 18, 0], [11, 19, 0], [12, 20, 0], [13, 21, 0], [14, 22, 0], [15, 23, 0],
              [8, 24, 1], [9, 25, 1], [10, 26, 1], [11, 27, 1], [12, 28, 1], [13, 29, 1], [14, 30, 1], [15, 31, 1],
              [1, 16, 0], [1, 18, 0], [6, 21, 0], [6, 23, 0]
            ]
          }
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(data => {
        let link = `/game/link?id=${data._id}`;
        //console.log(gameData);

        window.location.href = `/game/?link=${link}`;
      })



    }
    else {
      window.location.href = `/game/?type=${startGameData[0]}&side=${startGameData[1]}&timer=${startGameData[2]}`;
    }
  });
  if (resData.roles.Premium == 1984 ?? false) {
    const advimg = document.querySelector("#adv-img");
    advimg.src = "img/frog_premium.png";
    const advbut = document.querySelector("#remove-ads-button");
    advbut.style.display = "none"
  }
});