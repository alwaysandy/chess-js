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

function createPieceData(piece, colour, directions) {
    return {
        piece:piece,
        colour:colour,
        directions:directions,
    }
}

function createPieceImageElements(piece) {
    let whitePiece = document.createElement('img');
    let blackPiece = document.createElement('img');
    blackPiece.setAttribute("src", `./chessvgs/${piece}-black.svg`);
    whitePiece.setAttribute("src", `./chessvgs/${piece}-white.svg`);
    
    blackPiece.classList.add('piece');
    whitePiece.classList.add('piece');
    return {black: blackPiece, white: whitePiece};
}

function createAndPlace(piece, offset) {
    for (let i = 0; i < 2; i++) {
        const pieces = createPieceImageElements(piece);
        if (i == 0) {
            board[0][offset].appendChild(pieces[1]);
            board[7][offset].appendChild(pieces[0]);
        } else {
            board[0][7 - offset].appendChild(pieces[1]);
            board[7][7 - offset].appendChild(pieces[0]);
        }
    }
}

function placePieces() {
    let pieces = []
    let pieceNodes;
    for (let x = 0; x < 8; x++) { 
        if (x == 0 || x == 7) {
            nodes = createPieceImageElements("rook");
            nodes.black.dataset.x = x;
            nodes.black.dataset.y = 0;
            nodes.white.dataset.x = x;
            nodes.white.dataset.y = 7;
            board[0][x].appendChild(nodes.black);
            board[7][x].appendChild(nodes.white);
        }

        if (x == 1 || x == 6) {
            nodes = createPieceImageElements("knight");
            nodes.black.dataset.x = x;
            nodes.black.dataset.y = 0;
            nodes.white.dataset.x = x;
            nodes.white.dataset.y = 7;
            board[0][x].appendChild(nodes.black);
            board[7][x].appendChild(nodes.white);
        }

        if (x == 2 || x == 5) {
            nodes = createPieceImageElements("bishop");
            nodes.black.dataset.x = x;
            nodes.black.dataset.y = 0;
            nodes.white.dataset.x = x;
            nodes.white.dataset.y = 7;
            board[0][x].appendChild(nodes.black);
            board[7][x].appendChild(nodes.white);
        }

        if (x == 3) {
            nodes = createPieceImageElements("queen");
            nodes.black.dataset.x = x;
            nodes.black.dataset.y = 0;
            nodes.white.dataset.x = x;
            nodes.white.dataset.y = 7;
            board[0][x].appendChild(nodes.black);
            board[7][x].appendChild(nodes.white);
        }

        if (x == 4) {
            nodes = createPieceImageElements("king");
            nodes.black.dataset.x = x;
            nodes.black.dataset.y = 0;
            nodes.white.dataset.x = x;
            nodes.white.dataset.y = 7;
            board[0][x].appendChild(nodes.black);
            board[7][x].appendChild(nodes.white);
        }

        nodes = createPieceImageElements("pawn");
        nodes.black.dataset.x = x;
        nodes.black.dataset.y = 1;
        nodes.white.dataset.x = x;
        nodes.white.dataset.y = 6;
        board[1][x].appendChild(nodes.black);
        board[6][x].appendChild(nodes.white);
    }


    for (let y = 0; y < board.length; y++) {
        pieces.push([]);
        for (let x = 0; x < board[y].length; x++) {
           pieces[y].push(0); 
        }
    }
}

let board = createBoard();
placePieces();
