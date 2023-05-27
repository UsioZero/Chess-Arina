document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.style.color = 'black';
        });
    });

    document.querySelector('.register-btn').addEventListener('click', async () => {
        const email = document.querySelector('#email').value;
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        function isValidUsername(user) {
            return user.length >= 8 && user.length <= 16;
        }

        if (password === confirmPassword
            && isValidEmail(email)
            && isValidUsername(username)) {
            console.log(email, " ", username, " ", password, " ", confirmPassword);

            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'user': username, 'pwd': password, 'email': email })
            });

            const data = await response.json();

            if (response.ok) {
                //localStorage.setItem('accessToken', data.accessToken);
                //window.location.href = '/regpage/login';
                console.log(data);
                window.location.href = "/login";
            } else {
                alert(data.message ?? "Error. Try again later");
            }
        }
        else {
            console.log("false");
        }
    });




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