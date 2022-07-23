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
    }

    if (piece == "pawn") {
        pieceData.enpassant = false;
        pieceData.firstMove = true;
    }

    if (directions) {
        pieceData.directions = directions;
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

function placePieces() {
    let pieces = []
    let whitePieces = [];
    let blackPieces = [];
    
    for (let y = 0; y < board.length; y++) {
        pieces.push([]);
        for (let x = 0; x < board[y].length; x++) {
           pieces[y].push(0); 
        }
    }
    
    let nodes;
    for (let x = 0; x < 8; x++) { 
        if (x == 4) {
            nodes = createPieceNodes("king", x);
            board[0][x].appendChild(nodes.black);
            board[7][x].appendChild(nodes.white);
            whitePieces.push(nodes.white);
            blackPieces.push(nodes.black);
            pieces[0][x] = createPieceData("king", "black", []); 
            pieces[7][x] = createPieceData("king", "white", []); 
        }

        if (x == 0 || x == 7) {
            nodes = createPieceNodes("rook", x);
            board[0][x].appendChild(nodes.black);
            board[7][x].appendChild(nodes.white);
            whitePieces.push(nodes.white);
            blackPieces.push(nodes.black);
            pieces[0][x] = createPieceData("rook", "black", ["n", "s", "e", "w"]);
            pieces[7][x] = createPieceData("rook", "white", ["n", "s", "e", "w"]);
        }

        if (x == 1 || x == 6) {
            nodes = createPieceNodes("knight", x);
            board[0][x].appendChild(nodes.black);
            board[7][x].appendChild(nodes.white);
            whitePieces.push(nodes.white);
            blackPieces.push(nodes.black);
            pieces[0][x] = createPieceData("knight", "black", []); 
            pieces[7][x] = createPieceData("knight", "white", []); 
        }

        if (x == 2 || x == 5) {
            nodes = createPieceNodes("bishop", x);
            board[0][x].appendChild(nodes.black);
            board[7][x].appendChild(nodes.white);
            whitePieces.push(nodes.white);
            blackPieces.push(nodes.black);
            pieces[0][x] = createPieceData("bishop", "black", ["nw", "ne", "sw", "se"]); 
            pieces[7][x] = createPieceData("bishop", "white", ["nw", "ne", "sw", "se"]);
        }

        if (x == 3) {
            nodes = createPieceNodes("queen", x);
            board[0][x].appendChild(nodes.black);
            board[7][x].appendChild(nodes.white);
            whitePieces.push(nodes.white);
            blackPieces.push(nodes.black);
            pieces[0][x] = createPieceData("queen", "black", ["n", "s", "e", "w", "nw", "ne", "sw", "se"]); 
            pieces[7][x] = createPieceData("queen", "white", ["n", "s", "e", "w", "nw", "ne", "sw", "se"]);
        }

        nodes = createPieceNodes("pawn", x);
        board[1][x].appendChild(nodes.black);
        board[6][x].appendChild(nodes.white);
        whitePieces.push(nodes.white);
        blackPieces.push(nodes.black);
        pieces[0][x] = createPieceData("pawn", "black", []); 
        pieces[7][x] = createPieceData("pawn", "white", []); 
    }

    return [pieces, whitePieces, blackPieces]
}

let board = createBoard();
let pieceArray = placePieces();
let pieces = pieceArray[0];
let whitePieces = pieceArray[1];
let blackPieces = pieceArray[2];
