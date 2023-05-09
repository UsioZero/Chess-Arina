

document.addEventListener('DOMContentLoaded', function() {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    const side = "w";
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
      for (var j=0;j<=1;j++){
      let t = counters[0+6*j];
      for (var i=0; i< t; i++)
      {
        const tdId = `defeated-figures-container-${i+1}-${1-j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
      }
      t = counters[1+6*j];
      if (t==1)
      {
        const tdId = `defeated-figures-container-${10}-${1-j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
      }
      if (t==2)
      {
        for (var i=10;i <= 15;i+=5)
        {
        const tdId = `defeated-figures-container-${i}-${1-j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
        }
      }
      t = counters[2+6*j];
      if (t==1)
      {
        const tdId = `defeated-figures-container-${11}-${1-j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
      }
      if (t==2)
      {
        for (var i=11;i <= 14;i+=3)
        {
        const tdId = `defeated-figures-container-${i}-${1-j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
        }
      }
      t = counters[3+6*j];
      if (t==1)
      {
        const tdId = `defeated-figures-container-${9}-${1-j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
      }
      if (t==2)
      {
        for (var i=9;i <= 16;i+=7)
        {
        const tdId = `defeated-figures-container-${i}-${1-j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
        }
      }
      t = counters[4+6*j];
      if (t==1)
      {
        const tdId = `defeated-figures-container-${12}-${1-j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
      }
      t = counters[5+6*j];
      if (t==1)
      {
        const tdId = `defeated-figures-container-${13}-${1-j}`;
        const td = document.getElementById(tdId);
        const img = td.querySelector('img');
        img.style.opacity = '0';
      }
      }
      
    }
    addDefeatedPieces(countPieces(fen));
    
    
    // Remove slashes and replace digits with spaces
    const fenSpaces = fen.replace(/\//g, "").replace(/\d/g, (d) => " ".repeat(parseInt(d, 10)));
    let fenRows2 = [];
    let fenRows = [];
    let fenSpaces2 = "";
    if (side == "w")
    {
    
        for (let i = 0; i < 64; i += 8) {
        fenRows.push(fenSpaces.substr(i, 8));
    }
    for (let i = 0; i < 8; i ++) {
        fenRows2[i] = fenRows[7-i]
    }
    fenSpaces2 = fenRows2.join('');
    }
    else
    {
        fenSpaces2 = fenSpaces;
    }
    
    
        for (let i = 0; i < 64; i++) {
            // Get the cell and image elements
            const cell = document.getElementById(`cell${i}`);
            const img = cell.querySelector("img");
          
            // Set the image source based on the FEN string
            if (fenSpaces2[i] !== " ") {
              const pieceType = fenSpaces2[i].toUpperCase();
              const isWhite = fenSpaces2[i] === fenSpaces2[i].toUpperCase();
              const src = `img/pieces/pak1/${pieceType}${isWhite ? "" : "2"}.png`;
              img.setAttribute("src", src);
            } else {
              const src = `img/pieces/pak1/N${(i%8 + Math.floor(i / 8))% 2 === 1 ? "even" : "odd"}.png`;
              img.setAttribute("src", src);
            }
          }
          
          const legalMoves = [
            [8,16,0],[9,17,0],[10,18,0],[11,19,0],[12,20,0],[13,21,0],[14,22,0],[15,23,0],
            [8,24,1],[9,25,1],[10,26,1],[11,27,1],[12,28,1],[13,29,1],[14,30,1],[15,31,1],
            [1,16,0],[1,18,0],[6,21,0],[6,23,0],
          ];
          
          let previousCell = null;
          let previousLegalMoves = null;
          
          const boardTable = document.querySelector('.board-table');
          
          for (let i = 0; i < 64; i++) {
            const cell = document.getElementById(`cell${i}`);
          
            if (legalMoves.some(move => move[0] === i)) {
              cell.addEventListener('click', function() {
                const legalMovesForCell = legalMoves.filter(move => move[0] === i);
          
                if (previousCell !== null && previousLegalMoves !== null) {
                  removeBordersFromLegalMoves(previousLegalMoves);
                }
          
                showLegalMoves(legalMovesForCell);
                previousCell = this;
                previousLegalMoves = legalMovesForCell;
              });
            }
            else {
              cell.addEventListener('click', function() {
                if (previousCell !== null && previousLegalMoves !== null) {
                  removeBordersFromLegalMoves(previousLegalMoves);
                  previousCell = null;
                  previousLegalMoves = null;
                }
              });
            }
          }
          function getPieceInfo(type) {
            const side = type.endsWith('2') ? 1 : 0;
            let pieceType;
            switch(type[19].toUpperCase()) {
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
            return {side, pieceType};
          }
          function getAtteckedPieceInfo(filename) {
            if (filename=="Neven.png"||filename=="Nodd.png")
            {
              const aside = 255;
              const apieceType = 255;
              return {apieceType, aside};
            }
            filename = filename.substring(0, 2);
            const aside = filename.endsWith('2') ? 1 : 0;
            let apieceType;
            switch(filename[0].toUpperCase()) {
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
            return {apieceType, aside};
          }
          function getImageSrc(i) {
            const cell = document.getElementById(`cell${i}`);
            const img = cell.querySelector('img');
            return img.src;
          }
          function getMove(start, end, pieceType) {
            const fileNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            const startCol = start % 8;
            const startRow = Math.floor(start / 8);
            const endCol = end % 8;
            const endRow = Math.floor(end / 8);
            const pieceCodes = ['', 'N', 'B', 'R', 'Q', 'K'];
            const pieceCode = pieceCodes[pieceType];
            const startSquare = fileNames[startCol] + (1+startRow);
            const endSquare = fileNames[endCol] + (1+endRow);
            return pieceCode + " "+startSquare + " " +endSquare+ "\n";
          }

          let Moves = [];
          function showLegalMoves(legalMoves) {
            legalMoves.forEach(move => {
              const endCell = document.getElementById(`cell${move[1]}`);
              const endCellId = parseInt(endCell.id.substring(4));
              const startCell = document.getElementById(`cell${move[0]}`);
              const startCellId = parseInt(startCell.id.substring(4));
              const filename = getImageSrc(endCellId).substring(getImageSrc(endCellId).lastIndexOf('/') + 1);
              const {side, pieceType} = getPieceInfo(startCell.firstChild.getAttribute('src'));
              const {apieceType, aside} = getAtteckedPieceInfo(filename);
              endCell.style.border = '2px solid red';
              endCell.addEventListener('click', function() {
                console.log(`${startCellId}, ${endCellId}, ${side}, ${pieceType}, ${aside}, ${apieceType}, ${move[2]}`);
                Moves.push(getMove(startCellId,endCellId,pieceType));
                let formattedString = "";

                for(let i = 0; i < Moves.length; i+=2) {
                  if (Moves.length%2==1){Moves.push("");}
                  formattedString += `${i/2+1} ${Moves[i]}  ${Moves[i+1]}<br>`;
                }
                if (Moves[Moves.length-1]==""){Moves.pop();}
                const moveTextElement = document.querySelector(".move-text");
                  moveTextElement.innerHTML= formattedString;
              });
              
            });
          }
          function removeBordersFromLegalMoves(legalMoves) {
            legalMoves.forEach(move => {
              const endCell = document.getElementById(`cell${move[1]}`);
              endCell.style.border = '';
              endCell.removeEventListener('click', function() {
                console.log(`Moved piece from ${startCell.id} to ${endCell.id}`);
              });
            });
          }

          
          
});

