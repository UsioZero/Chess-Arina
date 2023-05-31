document.addEventListener("DOMContentLoaded", async function () {
  let oldPassword = "123";
  
  const tmp = await fetch("/api/user");
  const dataTmp = await tmp.json();
  const optData = dataTmp.options;
  let isVisible = optData.is_profile_visible;
  const oldPasswordInput = document.getElementById("old-password");
  const newPasswordInput = document.getElementById("new-password");
  const confirmationInput = document.getElementById("confirm-password");
  const anyoneCheckbox = document.getElementById("anyone-checkbox");
  const nooneCheckbox = document.getElementById("noone-checkbox");
  const saveButton = document.querySelector(".save-button-sequrity");


  if (isVisible) {
    anyoneCheckbox.checked = true;
    nooneCheckbox.checked = false;
  } else {
    nooneCheckbox.checked = true;
    anyoneCheckbox.checked = false;
  }


  anyoneCheckbox.addEventListener("change", async () => {
    nooneCheckbox.checked = !anyoneCheckbox.checked;
    isVisible = anyoneCheckbox.checked;
    optData.is_profile_visible = isVisible;
    const gameRes = await fetch("/api/user", {

      method: "PUT", body: JSON.stringify({
        "options": optData      
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });

  nooneCheckbox.addEventListener("change", async () => {
    anyoneCheckbox.checked = !nooneCheckbox.checked;
    isVisible = !nooneCheckbox.checked;
    optData.is_profile_visible = isVisible;
    const gameRes = await fetch("/api/user", {
    method: "PUT", body: JSON.stringify({
      "options": optData      
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  });


  saveButton.addEventListener("click", async () => {

   

    let oldPasswordValue = oldPasswordInput.value;
    let newPasswordValue = newPasswordInput.value;
    let confirmationValue = confirmationInput.value;
    console.log(dataTmp);
    if (newPasswordValue === confirmationValue) {
      dataTmp.password = newPasswordValue;
      oldPasswordInput.value = "";
      newPasswordInput.value = "";
      confirmationInput.value = "";
      const gameRes = await fetch("/api/user", {

        method: "PUT", body: JSON.stringify({
          "password": dataTmp.password     
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      alert("Wrong passwords");
    }
  });



  const responce = await fetch('/api/user');
  const resData = await responce.json();
  const menuImg = document.querySelector("#btn1-container div img");
  menuImg.src = `img/profiles/${resData._id}/avatar.png`;





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
