window.addEventListener('DOMContentLoaded', async function () {

  const responce = await fetch('/api/user');
  const resData = await responce.json();
  const menuImg = document.querySelector("#btn1-container div img");
  menuImg.src = `img/profiles/${resData._id}/avatar.png`;

  var dataArray = [`img/profiles/${resData._id}/avatar.png`, `img/profiles/${resData._id}/bg.png`];


  const avatarImgs = document.querySelectorAll('.avatar-td img');


  avatarImgs.forEach(img => {
    img.src = dataArray[0];
  });
  const sb = this.document.querySelector('.save-button');
  sb.addEventListener('click', ()=>{
    location.reload();
  });

  var bgTestImage = document.querySelector('.bg-test-image');


  bgTestImage.style.backgroundImage = `url(${dataArray[1]})`;

  const buttonUploadAvatar = document.getElementById("button-upload-avatar");

  buttonUploadAvatar.addEventListener("click", async () => {
    jsonData = { "uId": `${resData._id}`, "isAvatar": true }
    const myFiles = document.getElementById('myFiles').files[0];

    const formData = new FormData();

    formData.append('file', myFiles);
    formData.append('jsonData', JSON.stringify(jsonData));
    const fileUpResponce = await fetch('/fileUpload', {
      method: 'POST',
      body: formData
    });
    const fileUpData = await fileUpResponce.json();
    console.log(fileUpData);
  });


  const buttonUploadBg = document.getElementById("button-upload-bg");
  
  buttonUploadBg.addEventListener("click", async () => {
    jsonData = { "uId": `${resData._id}`, "isAvatar": false }
    const myFiles = document.getElementById('myFiles2').files[0];

    const formData = new FormData();

    formData.append('file', myFiles);
    formData.append('jsonData', JSON.stringify(jsonData));
    const fileUpResponce = await fetch('/fileUpload', {
      method: 'POST',
      body: formData
    });
    const fileUpData = await fileUpResponce.json();
    console.log(fileUpData);
  });


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
      }).then(res=>res.json()).then(data=>{
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
