window.addEventListener('DOMContentLoaded', async function () {
  var dataArray = [
    "img/avatars/Avatar3.png",
    "img/bgs/bg1.png",
    "Іво Бобул",
    "ibobyl",
    "Ukraine",
    "Chernivtsi Oblast",
    true,
    "ivo.bobul@gmail.com",
    "",
    25,
    51
  ];
  var lastGames = [
    ["22.03",
      "11:30",
      "img/avatars/Avatar2.png",
      1 / 2,
      "15|10",
      "img/avatars/Avatar1.png"],
    ["22.03",
      "11:10",
      "img/avatars/Avatar3.png",
      1,
      "10|5",
      "img/avatars/Avatar2.png"],
    ["22.03",
      "11:00",
      "img/avatars/Avatar4.png",
      1,
      "3|2",
      "img/avatars/Avatar2.png"]
  ]
  const backgroundImg = document.querySelector('.background-image');
  backgroundImg.src = dataArray[1];

  const roundImg = document.querySelector('.round-image');
  roundImg.src = dataArray[0];

  const topTitle = document.querySelector('.top-two-title');
  topTitle.innerHTML = dataArray[2];

  const usernameLink = document.querySelector('.icon-text-row-1');
  usernameLink.innerHTML = "@" + dataArray[3];

  const locationLink = document.querySelector('.icon-text-row-2');
  locationLink.innerHTML = dataArray[5] + ", " + dataArray[4];

  const emailLink = document.querySelector('.icon-text-row-3');
  emailLink.innerHTML = dataArray[7];

  const connectLink = document.querySelector('.icon-text-row-4');
  if (dataArray[8] !== "") {
    connectLink.innerHTML = dataArray[8];
  } else {
    connectLink.innerHTML = "Not Connected";
  }

  const totalWins = document.querySelector('#total-wins');
  totalWins.innerHTML = dataArray[9];

  const totalGames = document.querySelector('#total-games');
  totalGames.innerHTML = dataArray[10];
  const winrate1 = document.querySelector('#winrate');
  totalGames.innerHTML = dataArray[10];

  if (dataArray[10] !== 0) {
    const winrate = dataArray[9] / dataArray[10] * 100;
    console.log(winrate);
    let roundedWinrate = parseFloat(winrate.toFixed(0));
    console.log(roundedWinrate);
    winrate1.innerHTML = roundedWinrate + "%";
  }
  for (let i = 1; i <= 3; i++) {
    const row = document.getElementById(`data-${i}`);
    const cells = row.getElementsByTagName("td");

    cells[0].innerHTML = lastGames[i - 1][0];
    cells[1].innerHTML = lastGames[i - 1][1];
    cells[2].getElementsByTagName("img")[0].src = lastGames[i - 1][2];
    cells[4].innerHTML = lastGames[i - 1][3];
    cells[5].innerHTML = lastGames[i - 1][4];
    cells[6].innerHTML = 1 - lastGames[i - 1][3];
    cells[8].getElementsByTagName("img")[0].src = lastGames[i - 1][5];
  }

  if (dataArray[6] == true) {
    let premiumAdImg = document.querySelector('.premium-ad-img');
    if (premiumAdImg) {
      premiumAdImg.src = 'img/Premium_no_ad.png';
    }
  }

  const responce = await fetch('/api/user');
  const resData = await responce.json();
  const menuImg = document.querySelector("#btn1-container div img");
  menuImg.src = `img/profiles/${resData._id}/avatar.png`;



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
    if (startGameData[0] == "hu") {
      let link = `/game/link?id=${resData._id}`;
      window.location.href = `/game/?link=${link}`;
    }
    else {
      window.location.href = `/game/?type=${startGameData[0]}&side=${startGameData[1]}&timer=${startGameData[2]}`;
    }
  });

});