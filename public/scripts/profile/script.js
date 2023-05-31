window.addEventListener('DOMContentLoaded', async function () {
  const responce = await fetch('/api/user');
  const resData = await responce.json();

  const resp = await fetch('/api/game');
  const gameData = await resp.json();

  let counter = 0;
  let ctr2 = 0;
  for (let i = 0; i < gameData.length; i++) {
    if (gameData[i].win) {ctr2++;}
    if ((gameData[i].user1 == resData._id && gameData[i].win == "w") || (gameData[i].user2 == resData._id && gameData[i].win == "b")) { counter++; }
  }
  console.log(resData);
  console.log(gameData);
  const menuImg = document.querySelector("#btn1-container div img");
  menuImg.src = `img/profiles/${resData._id}/avatar.png`;
  if (resData.roles.Premium == 1984 ?? false) {
    const advimg = document.querySelector("#adv-img");
    advimg.src = "img/frog_premium.png";
    const advbut = document.querySelector("#remove-ads-button");
    advbut.style.display = "none";
  }

  var dataArray = [
    `img/profiles/${resData._id}/avatar.png`,
    `img/profiles/${resData._id}/bg.png`,
    `${resData.options.real_name}`,
    `${resData.username}`,
    `${resData.options.location.country}`,
    `${resData.options.location.city}, ${resData.options.location.state}`,
    resData.roles.Premium == 1984 ?? false,
    `${resData.email}`,
    "",
    counter,
    ctr2
  ];

  let lg = [];
  let ctr = 3;
  for (let i = gameData.length - 1; i > 0; i--) {
    if (ctr == 0) { break; }
    if (gameData[i].win) {
      lg.push(gameData[i]);
      ctr--;
    }
  }


  




  const backgroundImg = document.querySelector('.background-image');
  backgroundImg.src = dataArray[1];

  const roundImg = document.querySelector('.round-image');
  roundImg.src = dataArray[0];

  const topTitle = document.querySelector('.top-two-title');
  topTitle.innerHTML = dataArray[2];
  if (topTitle.innerHTML == "undefined") { topTitle.innerHTML = "Hidden name"; }


  const usernameLink = document.querySelector('.icon-text-row-1');
  usernameLink.innerHTML = "@" + dataArray[3];

  const locationLink = document.querySelector('.icon-text-row-2');
  locationLink.innerHTML = dataArray[5] + ", " + dataArray[4];
  if (locationLink.innerHTML == "undefined, undefined, undefined") { locationLink.innerHTML = "Do not display"; }

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
  var lastGames = [];
  if (lg.length < 3) {
    lastGames = [
      [`img/frog.png`,
      1 / 2,
        "Play at least 3 games!",
      `img/frog_2.png`],
      [`img/frog.png`,
      1 / 2,
        "Play at least 3 games!",
      `img/frog_2.png`],
      [`img/frog.png`,
      1 / 2,
        "Play at least 3 games!",
      `img/frog_2.png`]
    ];
  }
  else {
    lastGames = [
      [`img/profiles/${lg[0].user1}/avatar.png`,
      1 / 2,
        "10|5",
      `img/profiles/${lg[0].user2}/avatar.png`],
      [`img/profiles/${lg[1].user1}/avatar.png`,
        1,
        "10|5",
      `img/profiles/${lg[1].user2}/avatar.png`],
      [`img/profiles/${lg[2].user1}/avatar.png`,
        1,
        "10|5",
      `img/profiles/${lg[2].user2}/avatar.png`]
    ];
  }



  for (let i = 0; i < lg.length; i++) {
    if (lg[i].win == "w") {
      lastGames[i][1] = 1;
    } else {
      if (lg[i].win == "b") {
        lastGames[i][1] = 0;
      }
      else {
        lastGames[i][1] = 0.5;
      }
    }
  }


  for (let i = 1; i <= 3; i++) {
    const row = document.getElementById(`data-${i}`);
    const cells = row.getElementsByTagName("td");
    cells[0].getElementsByTagName("img")[0].src = lastGames[i - 1][0];
    cells[2].innerHTML = lastGames[i - 1][1];
    cells[3].innerHTML = lastGames[i - 1][2];
    cells[4].innerHTML = 1 - lastGames[i - 1][1];
    cells[6].getElementsByTagName("img")[0].src = lastGames[i - 1][3];
  }

  if (dataArray[6] == true) {
    let premiumAdImg = document.querySelector('.premium-ad-img');
    if (premiumAdImg) {
      premiumAdImg.src = 'img/Premium_no_ad.png';
    }
  }





  var modal = document.getElementById("modal");

  var btn = document.getElementById("open-modal");

  var span = document.getElementsByClassName("close")[0];

  btn.onclick = function () {
    modal.style.display = "block";
  }

  span.onclick = function () {
    modal.style.display = "none";
  }

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