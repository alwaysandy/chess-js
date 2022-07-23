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
    pieceData = {
        piece:piece,
        colour:colour,
    };

    if (piece == "pawn") {
        pieceData.enpassant = false;
        pieceData.firstMove = true;
    }

    if (piece == "bishop") {
        pieceData.directions = ["nw", "ne", "sw", "se"]; 
    } else if (piece == "rook") {
        pieceData.directions = ["n", "s", "e", "w"];
    } else if (piece == "queen") {
        pieceData.directions = ["n", "s", "e", "w", "nw", "ne", "sw", "se"]; 
    }

    return pieceData;
}

function createPieceNodes(piece, x) {
    let whitePiece = document.createElement('img');
    let blackPiece = document.createElement('img');
    blackPiece.setAttribute("src", `./chessvgs/${piece}-black.svg`);
    whitePiece.setAttribute("src", `./chessvgs/${piece}-white.svg`);
    
    blackPiece.classList.add('piece');
    whitePiece.classList.add('piece');

    if (piece === "pawn") {
        blackPiece.dataset.x = x;
        whitePiece.dataset.x = x;
        blackPiece.dataset.y = 1;
        whitePiece.dataset.y = 6;
    } else {
        blackPiece.dataset.x = x;
        whitePiece.dataset.x = x;
        blackPiece.dataset.y = 0;
        whitePiece.dataset.y = 7;
    }

    return {black: blackPiece, white: whitePiece};
}

function placePieces(piece, x, whitePieces, blackPieces, pieces) {
    // This starts by creating a black and white image element for the
    // requested piece. It appends those elements to the board, and saves
    // the metadata to the pieces array.
    //
    // The whitePieces and blackPieces arrays hold references to the nodes
    // themselves. These will be useful when I need to do something with every
    // single piece on the board.
    let nodes = createPieceNodes(piece, x);
    if (piece == "pawn") {
        board[1][x].appendChild(nodes.black);
        board[6][x].appendChild(nodes.white);
        pieces[1][x] = createPieceData(piece, "black");
        pieces[6][x] = createPieceData(piece, "white");
    } else {
        board[0][x].appendChild(nodes.black);
        board[7][x].appendChild(nodes.white);
        pieces[0][x] = createPieceData(piece, "black");
        pieces[7][x] = createPieceData(piece, "white");
    }

    if (piece == "king") {
        whitePieces.unshift(nodes.white);
        blackPieces.unshift(nodes.black);
    } else {
        whitePieces.push(nodes.white);
        blackPieces.push(nodes.black);
    }
}

function initializePieces(whitePieces, blackPieces) {
    let pieces = [];
    
    for (let y = 0; y < board.length; y++) {
        pieces.push([]);
        for (let x = 0; x < board[y].length; x++) {
           pieces[y].push(0); 
        }
    }
    
    for (let x = 0; x < 8; x++) { 
        if (x == 0 || x == 7) {
            placePieces("rook", x, whitePieces, blackPieces, pieces);
        }

        if (x == 1 || x == 6) {
            placePieces("knight", x, whitePieces, blackPieces, pieces);
        }

        if (x == 2 || x == 5) {
            placePieces("bishop", x, whitePieces, blackPieces, pieces);
        }

        if (x == 3) {
            placePieces("queen", x, whitePieces, blackPieces, pieces);
        }

        if (x == 4) {
            placePieces("king", x, whitePieces, blackPieces, pieces);
        }

        placePieces("pawn", x, whitePieces, blackPieces, pieces);
    }

    return pieces; 
}

let board = createBoard();
let whitePieces = [];
let blackPieces = [];
let pieces = initializePieces(whitePieces, blackPieces);
