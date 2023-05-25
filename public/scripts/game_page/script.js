document.addEventListener('DOMContentLoaded', async function () {
  const responce = await fetch('/api/user');
  const resData = await responce.json();
  console.log(resData._doc);
  let en_passant = 255;
  let castlings = [1, 1, 1, 1];
  let move_ctr = 1;
  let isAI = true;
  let isWhite = false;
  let isWhiteMove = true;
  let timerBase = 10;
  let timerInv = 5;
  var showModal = false;

  function openModal(result) {
    if (showModal) {
      var modal = document.getElementById("myModal1");
      modal.style.display = "block";
      endgame.innerHTML = result;
    }
  }

  const timers = document.querySelectorAll(".timer-text a");
  let blackSeconds = timerBase * 60 + timerInv;
  let whiteSeconds = timerBase * 60 + timerInv;
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  function refreshTimers(whiteSeconds, blackSeconds) {
    timers[0].innerHTML = formatTime(blackSeconds);
    timers[1].innerHTML = formatTime(whiteSeconds);
  }
  const endgame = document.querySelector(".modal1-content h4");
  setInterval(() => {
    // Виконується код або функція кожну секунду
    if (isWhiteMove) {
      whiteSeconds--;
      if (whiteSeconds == 0) { showModal = true; openModal("Black wins"); }

    } else {
      blackSeconds--;
      if (blackSeconds == 0) { showModal = true; openModal("White wins."); }
    }
    refreshTimers(whiteSeconds, blackSeconds);
  }, 1000);


  const avatars = document.querySelectorAll(".avatar-icon img");
  const nicks = document.querySelectorAll(".avatar-nickname");
  const names = document.querySelectorAll(".avatar-name");



  function countPieces(fen) {
    const pieces = ['P', 'N', 'B', 'R', 'Q', 'K', 'p', 'n', 'b', 'r', 'q', 'k'];
    const counts = new Array(12).fill(0);
    const rows = fen.split(' ')[0].split('/');

    for (let i = 0; i < rows.length; i++) {
      let col = 0;
      for (let j = 0; j < rows[i].length; j++) {
        const c = rows[i].charAt(j);
        if (!isNaN(c)) {
          col += parseInt(c);
        } else {
          const index = pieces.indexOf(c);
          if (index !== -1) {
            const counter = (index < 6) ? index : index - 6;
            const side = (index < 6) ? 0 : 1;
            counts[counter + side * 6]++;
            col++;
          }
        }
      }
    }
    return counts;
  }
  function addDefeatedPieces(counters) {
    for (var j = 0; j <= 1; j++) {
      let t = counters[0 + 6 * j];
      for (var i = 0; i < t; i++) {
        const tdId = `defeated-figures-container-${i + 1}-${1 - j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
      }
      t = counters[1 + 6 * j];
      if (t == 1) {
        const tdId = `defeated-figures-container-${10}-${1 - j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
      }
      if (t == 2) {
        for (var i = 10; i <= 15; i += 5) {
          const tdId = `defeated-figures-container-${i}-${1 - j}`;
          const td = document.getElementById(tdId);
          const img = td.querySelector('img');
          img.style.opacity = '0';
        }
      }
      t = counters[2 + 6 * j];
      if (t == 1) {
        const tdId = `defeated-figures-container-${11}-${1 - j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
      }
      if (t == 2) {
        for (var i = 11; i <= 14; i += 3) {
          const tdId = `defeated-figures-container-${i}-${1 - j}`;
          const td = document.getElementById(tdId);
          const img = td.querySelector('img');
          img.style.opacity = '0';
        }
      }
      t = counters[3 + 6 * j];
      if (t == 1) {
        const tdId = `defeated-figures-container-${9}-${1 - j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
      }
      if (t == 2) {
        for (var i = 9; i <= 16; i += 7) {
          const tdId = `defeated-figures-container-${i}-${1 - j}`;
          const td = document.getElementById(tdId);
          const img = td.querySelector('img');
          img.style.opacity = '0';
        }
      }
      t = counters[4 + 6 * j];
      if (t == 1) {
        const tdId = `defeated-figures-container-${12}-${1 - j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
      }
      t = counters[5 + 6 * j];
      if (t == 1) {
        const tdId = `defeated-figures-container-${13}-${1 - j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
      }
    }

  }

  function getPieceInfo(type) {
    type = type.slice(0, -4);

    const side = type.endsWith('2') ? 1 : 0;
    let pieceType;
    switch (type[16].toUpperCase()) {
      case 'P':
        pieceType = 0;
        break;
      case 'N':
        pieceType = 1;
        break;
      case 'B':
        pieceType = 2;
        break;
      case 'R':
        pieceType = 3;
        break;
      case 'Q':
        pieceType = 4;
        break;
      case 'K':
        pieceType = 5;
        break;
      default:
        pieceType = 255;
        break;
    }
    return { side, pieceType };
  }



  function getAtteckedPieceInfo(filename) {
    filename = filename.split('/')[filename.split('/').length - 1];
    if (filename == "Neven.png" || filename == "Nodd.png") {
      const aside = 255;
      const apieceType = 255;
      return { apieceType, aside };
    }
    filename = filename.substring(0, 2);
    const aside = filename.endsWith('2') ? 1 : 0;
    let apieceType;
    switch (filename[0].toUpperCase()) {
      case 'P':
        apieceType = 0;
        break;
      case 'N':
        apieceType = 1;
        break;
      case 'B':
        apieceType = 2;
        break;
      case 'R':
        apieceType = 3;
        break;
      case 'Q':
        apieceType = 4;
        break;
      case 'K':
        apieceType = 5;
        break;
      default:
        apieceType = 255;
        break;
    }
    return { apieceType, aside };
  }
  let whiteDraw = false;
  let blackDraw = false;
  let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  let legalMoves = [
    [8, 16, 0], [9, 17, 0], [10, 18, 0], [11, 19, 0], [12, 20, 0], [13, 21, 0], [14, 22, 0], [15, 23, 0],
    [8, 24, 1], [9, 25, 1], [10, 26, 1], [11, 27, 1], [12, 28, 1], [13, 29, 1], [14, 30, 1], [15, 31, 1],
    [1, 16, 0], [1, 18, 0], [6, 21, 0], [6, 23, 0]
  ];

  if (isAI) {
    if (isWhite) {
      nicks[0].innerHTML = "@rana_deus";
      names[0].innerHTML = "God of frogs";
      avatars[0].src = "img/avatars/bot.png";
      nicks[1].innerHTML = `@${resData._doc.username}`;
      if (resData._doc.options.real_name!=null){
        names[1].innerHTML = `@${resData._doc.options.real_name}`;
      }
     
      avatars[1].src = "img/avatars/bot.png";
      refreshBoard(fen, 'w', legalMoves);
      addEventToCells(true);
    }
    else {
      nicks[1].innerHTML = "@rana_deus";
      names[1].innerHTML = "God of frogs";
      avatars[1].src = "img/avatars/bot.png";
      fen = "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR";
      move_ctr = 1.5;
      isWhiteMove = !isWhiteMove;
      legalMoves = [[48, 40, 0], [49, 41, 0], [50, 42, 0], [51, 43, 0], [52, 44, 0], [53, 45, 0], [54, 46, 0], [55, 47, 0], [48, 32, 1], [49, 33, 1], [50, 34, 1], [51, 35, 1], [52, 36, 1], [53, 37, 1], [54, 38, 1], [55, 39, 1], [57, 40, 0], [57, 42, 0], [62, 45, 0], [62, 47, 0]]
      refreshBoard(fen, 'w', legalMoves);
      addEventToCells(true);
    }
  }
  else {
    refreshBoard(fen, 'w', legalMoves);
    addEventToCellsHuman(true);
  }
  const gub = document.getElementById("give-up-button");
  //console.log(gub);
  gub.addEventListener('click', () => {
    {
      console.log('c');
      if (!isWhite) {
        showModal = true;
        openModal("White wins.");
      }
      else {
        showModal = true;
        openModal("Black wins.");
      }
    }
  });


  const offerDraw = document.getElementById("draw-button");
  //console.log(offerDraw);
  offerDraw.addEventListener('click', () => {
    console.log(1);
    if ((isWhite && blackDraw) || (!isWhite && whiteDraw)) {
      showModal = true;
      openModal("Draw by offering.");
      console.log(2);
    }
    if (!whiteDraw && !blackDraw) {
      alert("You`ve been offered draw. Press offer draw to accept it.");
      if (isWhite) { whiteDraw = true; } else { blackDraw = true; }
    }


  });


  function refreshBoard(fen, side, legalMoves) {
    whiteDraw = false;
    blackDraw = false;
    addDefeatedPieces(countPieces(fen));
    const fenSpaces = fen.replace(/\//g, "").replace(/\d/g, (d) => " ".repeat(parseInt(d, 10)));
    let fenRows2 = [];
    let fenRows = [];
    let fenSpaces2 = "";
    if (side == "w") {

      for (let i = 0; i < 64; i += 8) {
        fenRows.push(fenSpaces.substr(i, 8));
      }
      for (let i = 0; i < 8; i++) {
        fenRows2[i] = fenRows[7 - i]
      }
      fenSpaces2 = fenRows2.join('');
    }
    else {
      fenSpaces2 = fenSpaces;
    }


    for (let i = 0; i < 64; i++) {
      // Get the cell and image elements
      const cell = document.getElementById(`cell${i}`);
      const img = cell.querySelector("img");
      cell.onclick = null;
      // Set the image source based on the FEN string
      if (fenSpaces2[i] !== " ") {
        const pieceType = fenSpaces2[i].toUpperCase();
        const isWhite = fenSpaces2[i] === fenSpaces2[i].toUpperCase();
        const src = `img/pieces/pak1/${pieceType}${isWhite ? "" : "2"}.png`;
        img.setAttribute("src", src);
      } else {
        const src = `img/pieces/pak1/N${(i % 8 + Math.floor(i / 8)) % 2 === 1 ? "even" : "odd"}.png`;
        img.setAttribute("src", src);
      }
    }
  }

  function addEventToCells(isFirst) {
    var cells = document.querySelectorAll('.cell'); // Отримання всіх клітин

    var clickSequence = []; // Послідовність кліків користувача

    // Додавання обробників подій на кожну клітину
    cells.forEach(function (cell) {
      async function clickHandler() {
        var cellId = parseInt(this.id.replace('cell', '')); // Отримання індексу клітини

        if (clickSequence.length === 0) {
          clickSequence.push(cellId);
          legalMoves.forEach(move => {
            if (clickSequence[0] == move[0]) {
              var startCell = document.getElementById('cell' + clickSequence[0]);
              startCell.style.border = '2px solid red';
              var possibleMoves = legalMoves.filter(function (move) {
                return move[0] === clickSequence[0];
              });
              possibleMoves.forEach(function (move) {
                var endCell = document.getElementById('cell' + move[1]);
                endCell.style.border = '2px solid red';
              });
            }
          })

          //this.style.border = '2px solid red'; // Виділення початкової клітини червоним бордером
        } else if (clickSequence.length === 1) {
          var start = clickSequence[0];
          var end = cellId;

          // Перевірка, чи відповідає послідовність кліків умовам з legalMoves
          var isValidMove = false;
          var validMove = null;
          for (var i = 0; i < legalMoves.length; i++) {
            if (legalMoves[i][0] === start && legalMoves[i][1] === end) {
              isValidMove = true;
              validMove = legalMoves[i];
              break;
            }
          }

          if (isValidMove) {
            clickSequence.push(cellId);

            // Прибирання бордера з усіх клітин
            cells.forEach(function (cell) {
              cell.style.border = '';
            });
            const { side, pieceType } = getPieceInfo(document.getElementById(`cell${start}`).firstChild.getAttribute('src'));
            const { apieceType, aside } = getAtteckedPieceInfo(document.getElementById(`cell${end}`).firstChild.getAttribute('src'));

            let base = `${fen} ${en_passant} ${castlings[0]} ${castlings[1]} ${castlings[2]} ${castlings[3]} ${move_ctr} ${validMove[0]} ${validMove[1]} ${side} ${pieceType} ${apieceType} ${aside} ${validMove[2]}`;

            document.getElementById('cell' + validMove[1]).firstChild.src = document.getElementById('cell' + validMove[0]).firstChild.src;
            document.getElementById('cell' + validMove[0]).firstChild.src = `img/pieces/pak1/N${(validMove[0] % 8 + Math.floor(validMove[0] / 8)) % 2 === 1 ? "even" : "odd"}.png`;
            if (validMove[2] == 3) {
              document.getElementById('cell3').firstChild.src = document.getElementById('cell0').firstChild.src;
              document.getElementById('cell0').firstChild.src = `img/pieces/pak1/Nodd.png`;
            }
            if (validMove[2] == 4) {
              document.getElementById('cell5').firstChild.src = document.getElementById('cell7').firstChild.src;
              document.getElementById('cell7').firstChild.src = `img/pieces/pak1/Neven.png`;
            }
            if (validMove[2] == 5) {
              document.getElementById('cell59').firstChild.src = document.getElementById('cell56').firstChild.src;
              document.getElementById('cell56').firstChild.src = `img/pieces/pak1/Neven.png`;
            }
            if (validMove[2] == 6) {
              document.getElementById('cell61').firstChild.src = document.getElementById('cell63').firstChild.src;
              document.getElementById('cell63').firstChild.src = `img/pieces/pak1/Nodd.png`;
            }
            const comPath = '../web/engine';
            const com = 'a';
            isWhiteMove = !isWhiteMove;
            const responceCOM = await fetch('/runComm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ path: comPath, com: com, args: base })
            });
            const resData = await responceCOM.json();

            const dataArr = resData.result.split("\n").map(el => el.replace("\r", ""));
            fen = dataArr[0];
            en_passant = dataArr[1];
            for (let i = 0; i < 4; i++) {
              castlings[i] = dataArr[i + 2];
            }
            move_ctr = dataArr[6];
            legalMoves = [];
            for (let i = 7; i < dataArr.length - 1; i++) {
              var values = dataArr[i].match(/\d+/g);
              var newArray = [parseInt(values[0]), parseInt(values[1]), parseInt(values[2])];
              legalMoves.push(newArray);
            }
            //let isCheck = dataArr[dataArr.length-1]

            clickSequence = [];
            cells.forEach(function (cell) {
              cell.removeEventListener('click', clickHandler);
            });
            console.log(dataArr);
            //console.log (isCheck);
            isWhiteMove = !isWhiteMove;
            refreshBoard(fen, 'w', legalMoves);
            addEventToCells(false);
            if (dataArr.length == 8) {
              if (dataArr[7] == 1) {
                if (!isWhite) {
                  showModal = true;
                  openModal("White wins.");
                }
                else {
                  showModal = true;
                  openModal("Black wins.");
                }

              }
              else {
                showModal = true;
                openModal("Draw by stalemate.");
              }
            }

          } else {
            clickSequence = [];

            cells.forEach(function (cell) {
              cell.style.border = '';
            });
          }
        }
      }
      if (isFirst) {
        cell.onclick = clickHandler;
      }
      else {
        cell.onclick = null;
        cell.onclick = clickHandler;
      }

    });
  }
  function addEventToCellsHuman(isFirst) {
    var cells = document.querySelectorAll('.cell'); // Отримання всіх клітин

    var clickSequence = []; // Послідовність кліків користувача

    // Додавання обробників подій на кожну клітину
    cells.forEach(function (cell) {
      async function clickHandler() {
        var cellId = parseInt(this.id.replace('cell', '')); // Отримання індексу клітини

        if (clickSequence.length === 0) {
          clickSequence.push(cellId);
          legalMoves.forEach(move => {
            if (clickSequence[0] == move[0]) {
              var startCell = document.getElementById('cell' + clickSequence[0]);
              startCell.style.border = '2px solid red';
              var possibleMoves = legalMoves.filter(function (move) {
                return move[0] === clickSequence[0];
              });
              possibleMoves.forEach(function (move) {
                var endCell = document.getElementById('cell' + move[1]);
                endCell.style.border = '2px solid red';
              });
            }
          })

          //this.style.border = '2px solid red'; // Виділення початкової клітини червоним бордером
        } else if (clickSequence.length === 1) {
          var start = clickSequence[0];
          var end = cellId;

          // Перевірка, чи відповідає послідовність кліків умовам з legalMoves
          var isValidMove = false;
          var validMove = null;
          for (var i = 0; i < legalMoves.length; i++) {
            if (legalMoves[i][0] === start && legalMoves[i][1] === end) {
              isValidMove = true;
              validMove = legalMoves[i];
              break;
            }
          }

          if (isValidMove) {
            clickSequence.push(cellId);

            // Прибирання бордера з усіх клітин
            cells.forEach(function (cell) {
              cell.style.border = '';
            });
            const { side, pieceType } = getPieceInfo(document.getElementById(`cell${start}`).firstChild.getAttribute('src'));
            const { apieceType, aside } = getAtteckedPieceInfo(document.getElementById(`cell${end}`).firstChild.getAttribute('src'));

            let base = `${fen} ${en_passant} ${castlings[0]} ${castlings[1]} ${castlings[2]} ${castlings[3]} ${move_ctr} ${validMove[0]} ${validMove[1]} ${side} ${pieceType} ${apieceType} ${aside} ${validMove[2]}`;

            document.getElementById('cell' + validMove[1]).firstChild.src = document.getElementById('cell' + validMove[0]).firstChild.src;
            document.getElementById('cell' + validMove[0]).firstChild.src = `img/pieces/pak1/N${(validMove[0] % 8 + Math.floor(validMove[0] / 8)) % 2 === 1 ? "even" : "odd"}.png`;
            if (validMove[2] == 3) {
              document.getElementById('cell3').firstChild.src = document.getElementById('cell0').firstChild.src;
              document.getElementById('cell0').firstChild.src = `img/pieces/pak1/Nodd.png`;
            }
            if (validMove[2] == 4) {
              document.getElementById('cell5').firstChild.src = document.getElementById('cell7').firstChild.src;
              document.getElementById('cell7').firstChild.src = `img/pieces/pak1/Neven.png`;
            }
            if (validMove[2] == 5) {
              document.getElementById('cell59').firstChild.src = document.getElementById('cell56').firstChild.src;
              document.getElementById('cell56').firstChild.src = `img/pieces/pak1/Neven.png`;
            }
            if (validMove[2] == 6) {
              document.getElementById('cell61').firstChild.src = document.getElementById('cell63').firstChild.src;
              document.getElementById('cell63').firstChild.src = `img/pieces/pak1/Nodd.png`;
            }
            const comPath = '../web/engine';
            const com = 'm';
            isWhiteMove = !isWhiteMove;
            const responceCOM = await fetch('/runComm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ path: comPath, com: com, args: base })
            });
            const resData = await responceCOM.json();

            const dataArr = resData.result.split("\n").map(el => el.replace("\r", ""));
            fen = dataArr[0];
            en_passant = dataArr[1];
            for (let i = 0; i < 4; i++) {
              castlings[i] = dataArr[i + 2];
            }
            move_ctr = dataArr[6];
            legalMoves = [];
            for (let i = 7; i < dataArr.length - 1; i++) {
              var values = dataArr[i].match(/\d+/g);
              var newArray = [parseInt(values[0]), parseInt(values[1]), parseInt(values[2])];
              legalMoves.push(newArray);
            }
            //let isCheck = dataArr[dataArr.length-1]

            clickSequence = [];
            cells.forEach(function (cell) {
              cell.removeEventListener('click', clickHandler);
            });
            console.log(dataArr);
            if (dataArr.length == 8) {
              if (dataArr[7] == 1) {
                if (move_ctr % 1 === 0) {
                  showModal = true;
                  openModal("Black wins.");
                }
                else {
                  showModal = true;
                  openModal("White wins.");
                }

              }
              else {
                showModal = true;
                openModal("Draw by stalemate.");
              }
            }
            //console.log (isCheck);
            isWhiteMove = !isWhiteMove;
            refreshBoard(fen, 'w', legalMoves);
            addEventToCellsHuman(false);
            addDefeatedPieces();


          } else {
            clickSequence = [];

            cells.forEach(function (cell) {
              cell.style.border = '';
            });
          }
        }
      }
      if (isFirst) {
        cell.onclick = clickHandler;
      }
      else {
        cell.onclick = null;
        cell.onclick = clickHandler;
      }

    });
  }

});

