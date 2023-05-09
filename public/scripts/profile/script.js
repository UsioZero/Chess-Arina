window.addEventListener('DOMContentLoaded', function () {
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
        1/2,
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
        winrate1.innerHTML = roundedWinrate+"%";
    }
    for (let i = 1; i <= 3; i++) {
        const row = document.getElementById(`data-${i}`);
        const cells = row.getElementsByTagName("td");
      
        cells[0].innerHTML = lastGames[i-1][0];
        cells[1].innerHTML = lastGames[i-1][1];
        cells[2].getElementsByTagName("img")[0].src = lastGames[i-1][2];
        cells[4].innerHTML = lastGames[i-1][3];
        cells[5].innerHTML = lastGames[i-1][4];
        cells[6].innerHTML = 1 - lastGames[i-1][3];
        cells[8].getElementsByTagName("img")[0].src = lastGames[i-1][5];
      }
      
      if (dataArray[6] == true) {
        let premiumAdImg = document.querySelector('.premium-ad-img');
        if (premiumAdImg) {
            premiumAdImg.src = 'img/Premium_no_ad.png';
        }
    }
});