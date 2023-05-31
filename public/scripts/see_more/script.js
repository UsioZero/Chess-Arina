document.addEventListener('DOMContentLoaded', async function () {
    const responce = await fetch('/api/user');
    const resData = await responce.json();

    const menuImg = document.querySelector("#btn1-container div img");
    menuImg.src = `img/profiles/${resData._id}/avatar.png`;
    var dataArray = [
        {
            avatar: `img/profiles/${resData._id}/avatar.png`,
            name: `${resData.options.real_name}`,
            username: `${resData.username}`,
            location: `${resData.options.location.city}, ${resData.options.location.state}, ${resData.options.location.country}`,
            email: `${resData.email}`,
            twitter: "Not connected"
        },
    ];


    var table = document.querySelector('.top-table');


    var rows = table.querySelectorAll('tr');

    for (var i = 0; i < dataArray.length; i++) {
        var row = rows[i];
        var data = dataArray[i];


        var avatarImg = row.querySelector('.avatar-img');
        avatarImg.src = data.avatar;


        var nameTd = row.querySelector('td:nth-child(2)');
        var usernameTd = row.querySelector('td:nth-child(3)');
        var locationTd = row.querySelector('td:nth-child(4)');
        var emailTd = row.querySelector('td:nth-child(5)');
        var twitterTd = row.querySelector('td:nth-child(6)');

        nameTd.innerHTML = data.name;
        usernameTd.innerHTML = `@${data.username}`;
        locationTd.innerHTML = data.location;
        emailTd.innerHTML = data.email;
        twitterTd.innerHTML = data.twitter;
    }
    const resp = await fetch('/api/game');
    const gameData = await resp.json();
    let lg = [];
    let ctr = 3;
    for (let i = gameData.length - 1; i > 0; i--) {
        if (ctr == 0) { break; }
        if (gameData[i].win) {
            lg.push(gameData[i]);
            ctr--;
        }
    }
    let dataArrayForStat = [];
    let stat = [];


    let ctr2 = 0;
    for (let i = 0; i < gameData.length; i++) {
        if (gameData[i].win) {
            ctr2++;
            stat.push(gameData[i]);
        }

    }
    console.log(stat);

    for (let i = 0; i < ctr2; i++) {
        const responce1 = await fetch(`/api/user/${stat[i].user1}`);
        const resData1 = await responce1.json();
        const responce2 = await fetch(`/api/user/${stat[i].user2}`);
        const resData2 = await responce2.json();
        let res;
        if (stat[i].win == 'w') {
            res = 1;

        }
        else {
            if (stat[i].win == 'b') {
                res = 0;
            }
            else {
                res = 0.5;
            }

        }
        dataArrayForStat.push({
            user1a: `img/profiles/${stat[i].user1}/avatar.png`,
            user2a: `img/profiles/${stat[i].user2}/avatar.png`,
            user1n: `${resData1.username}`,
            user2n: `${resData2.username}`,
            user1r: `${resData1.rena}`,
            user2r: `${resData2.rena}`,
            result: res
        });
    }
    let currentPage = 0;
    var table = document.querySelector('.stat-table');
    var rows = table.querySelectorAll('tbody tr');
    function refreshTable(num) {
        if (dataArrayForStat.length>11){
            if (dataArrayForStat.length - num * 11 >= 11) {
                for (var i = num * 11; i < num * 11 + 11; i++) {
                    var row = rows[i];
                    var data = dataArrayForStat[i];
                    var avatarImg = row.querySelectorAll('.avatar-stat');
                    avatarImg[0].src = data.user1a;
                    avatarImg[1].src = data.user2a;
    
                    row.querySelector('td:nth-child(2)').innerHTML = `@${data.user1n}`;
                    row.querySelector('td:nth-child(3)').innerHTML = `${data.user1r}`;
                    row.querySelector('td:nth-child(5)').innerHTML = `${data.result}`;
                    row.querySelector('td:nth-child(7)').innerHTML = `${1 - data.result}`;
                    row.querySelector('td:nth-child(10)').innerHTML = `@${data.user1n}`;
                    row.querySelector('td:nth-child(9)').innerHTML = `${data.user1r}`;
    
                }
            }
            else
            {
                for (var i = num-1 * 11 + dataArrayForStat.length%11; i < num * 11 + dataArrayForStat.length%11; i++) {
                    var row = rows[i];
                    var data = dataArrayForStat[i];
                    var avatarImg = row.querySelectorAll('.avatar-stat');
                    avatarImg[0].src = data.user1a;
                    avatarImg[1].src = data.user2a;
    
                    row.querySelector('td:nth-child(2)').innerHTML = `@${data.user1n}`;
                    row.querySelector('td:nth-child(3)').innerHTML = `${data.user1r}`;
                    row.querySelector('td:nth-child(5)').innerHTML = `${data.result}`;
                    row.querySelector('td:nth-child(7)').innerHTML = `${1 - data.result}`;
                    row.querySelector('td:nth-child(10)').innerHTML = `@${data.user1n}`;
                    row.querySelector('td:nth-child(9)').innerHTML = `${data.user1r}`;
                }
                    
            }
        }
        else
        {
            for (var i = 0; i < dataArrayForStat.length; i++) {
                var row = rows[i];
                var data = dataArrayForStat[i];
                var avatarImg = row.querySelectorAll('.avatar-stat');
                avatarImg[0].src = data.user1a;
                avatarImg[1].src = data.user2a;

                row.querySelector('td:nth-child(2)').innerHTML = `@${data.user1n}`;
                row.querySelector('td:nth-child(3)').innerHTML = `${data.user1r}`;
                row.querySelector('td:nth-child(5)').innerHTML = `${data.result}`;
                row.querySelector('td:nth-child(6)').innerHTML = `10|5`;
                row.querySelector('td:nth-child(7)').innerHTML = `${1 - data.result}`;
                row.querySelector('td:nth-child(10)').innerHTML = `@${data.user2n}`;
                row.querySelector('td:nth-child(9)').innerHTML = `${data.user2r}`;
            }
        }
       
    }
    refreshTable(currentPage);
    const btn6 = document.querySelector("#btn6");
    const btn7 = document.querySelector("#btn7");
    btn6.addEventListener('click', ()=>{
        console.log("p");
        if (currentPage>0){
            currentPage--;
            refreshTable(currentPage);
        }
    });
    btn7.addEventListener('click', ()=>{
        console.log("n");
        if (dataArrayForStat.length - currentPage*11 > 11){
            currentPage++;
            refreshTable(currentPage);
        }

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

