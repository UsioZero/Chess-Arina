window.addEventListener("load", async function () {


  // how to send files, but now after all it will just send file by console log 
  // in server side(if it will works with bg and avatar, then uncomment 
  // 15-17 lines in /middleware/fileSaver.js)

  // Html code:
  // <form id="uploadForm1">
  //   <input type="file" id="myFiles" accept="image/*" />
  // </form>

  // js code:
  // jsonData = { "uId": "<userId>", "isAvata": true }// isAvatar = true when Avatar img, flase - bg img
  // const myFile = document.getElementById('myFiles').files[0];
  // const formData = new FormData();
  // formData.append('file', myFile);
  // formData.append('jsonData', JSON.stringify(jsonData));


  // Set the base value to 1
  var base = 3;

  // Loop through the objects with ids "theme-{i}" and "theme-{i}-button", where i is from 1 to 4
  for (var i = 1; i <= 4; i++) {
    // Get the td element with id "theme-{i}"
    var themeTd = document.getElementById(`theme-${i}`);
    // Get the td element with id "theme-{i}-button"
    var themeButtonTd = document.getElementById(`theme-${i}-button`);

    // If i is equal to the base value, set the active class for the td and its img
    if (i === base) {
      // themeTd.classList.add("active-theme");
      themeTd.getElementsByTagName("img")[0].classList.add("active-theme");
      themeButtonTd.getElementsByTagName("div")[0].classList.add("active-checkbox");
    }
  }

  const themes = document.querySelectorAll('[id^="theme-"]');
  //const themeButtons = document.querySelectorAll('[id^="theme-"][id$="-button"]');
  console.log(themes);
  themes.forEach((button) => {
    const index = parseInt(button.id.split("-")[1]);
    button.addEventListener("click", () => {
      var themeTd = document.getElementById(`theme-${base}`);
      var themeButtonTd = document.getElementById(`theme-${base}-button`);
      themeTd.getElementsByTagName("img")[0].classList.remove("active-theme");
      themeButtonTd.getElementsByTagName("div")[0].classList.remove("active-checkbox");
      base = index;
      themeButtonTd = document.getElementById(`theme-${base}-button`);
      themeTd = document.getElementById(`theme-${base}`);
      themeTd.getElementsByTagName("img")[0].classList.add("active-theme");
      themeButtonTd.getElementsByTagName("div")[0].classList.add("active-checkbox");
      console.log(base);
    });
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

    console.log(startGameData);
    const link = document.querySelector(".start-game-button a");
    link.href = "http://localhost:3000/game";
    link.click();
  });

});