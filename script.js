function createBoard() {
    let board = [];
    const boardDiv = document.querySelector('div.board');
    console.log(boardDiv);
    for (let y = 0; y < 8; y++) {
        board.push([]);
        const line = document.createElement('div');
        line.classList.add('line');
        for (let x = 0; x < 8; x++) {
            let tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.x = x;
            tile.dataset.y = y;

            if (y % 2 == 0) {
                if (x % 2 == 0) {
                    tile.classList.add('white-tile');
                } else {
                    tile.classList.add('black-tile');
                }
            } else {
                if (x % 2 == 0) {
                    tile.classList.add('black-tile');
                } else {
                    tile.classList.add('white-tile');
                }
            }
            line.appendChild(tile);
            board[y].push(tile)
        }
        boardDiv.appendChild(line);
    }

    return board;
}

function placePieces() {
    const bqueen = document.createElement('img');
    bqueen.setAttribute("src", "./chessvgs/queen-black.svg")
    bqueen.classList.add('piece');
    board[0][0].appendChild(bqueen);
}

let board = createBoard();
placePieces();
