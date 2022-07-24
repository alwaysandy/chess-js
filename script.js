function createBoard() {
    let board = [];
    const boardDiv = document.querySelector('div.board');
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

function createPieceData(piece, colour) {
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
    } else if (piece == "queen" || piece == "king") {
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

function initializePieces(pieces, whitePieces, blackPieces) {    
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
}

function findMoves(x, y) {
    validMoves = [];
    let p = pieces[y][x];
    let directionChange = {
        n: [0, 1],
        e: [1, 0],
        s: [0, -1],
        w: [-1, 0],
        ne: [1, 1],
        se: [1, -1],
        sw: [-1, -1],
        nw: [-1, 1],
    };

    if (p.piece == "rook" || p.piece == "bishop" || p.piece == "queen") {
        for (let d of p.directions) {
            let cx = x;
            let cy = y;
            let dc = directionChange[d];
            while (true) {
                cx += dc[0];
                cy += dc[1];
                if (cx < 0 || cx > 7 || cy < 0 || cy > 7) {
                    break;
                }

                if (pieces[cy][cx]) {
                    if (pieces[cy][cx].colour !== p.colour) {
                        validMoves.push([cx, cy]);
                    }

                    break;
                } else {
                    validMoves.push([cx, cy])
                }
            }
        }
    } else if (p.piece == "knight") {
        let directions = [
            [1, 2],
            [2, 1],
            [-1, 2],
            [-2, 1],
            [1, -2],
            [2, -1],
            [-1, -2],
            [-2, -1]
        ];

        for (let d of directions) {
            let cx = x + d[0];
            let cy = y + d[1];
            if (cx < 0 || cy < 0 || cx > 7 || cy > 7) {
                continue;
            }

            if (pieces[cy][cx]) {
                if (pieces[cy][cx].colour !== p.colour) {
                    validMoves.push([cx, cy]);
                }
            } else {
                validMoves.push([cx, cy]);
            }
        }
    } else if (p.piece == "king") {
        for (let d of p.directions) {
            let cx = x + directionChange[d][0];
            let cy = y + directionChange[d][1];
            if (cx < 0 || cy < 0 || cx > 7 || cy > 7) {
                continue;
            }

            if (pieces[cy][cx]) {
                if (pieces[cy][cx].colour !== p.colour) {
                    validMoves.push([cx, cy]);
                }
            } else {
                validMoves.push([cx, cy]);
            }
        } 
    } else if (p.piece == "pawn") {
        let cy;
        if (p.colour == "white") {
            cy = y - 1;
        } else {
            cy = y + 1;
        }

        if (cy <= 7 && cy >= 0) {
            if (x + 1 <= 7 && pieces[cy][x + 1]) {
                if (pieces[cy][x + 1].colour !== p.colour) {
                    validMoves.push([x + 1, cy]);
                }
            }

            if (x - 1 >= 0  && pieces[cy][x - 1]) {
                if (pieces[cy][x - 1].colour !== p.colour) {
                    validMoves.push([x - 1, cy]);
                }
            }
            if (!pieces[cy][x]) {
                validMoves.push([x, cy]);
                if (p.colour == "white") {
                    cy -= 1;
                } else {
                    cy += 1;
                }

                if (p.firstMove && cy <= 7 && cy >= 0) {
                    if (!pieces[cy][x]) {
                        validMoves.push([x, cy]);
                    }
                }
            }
        
        }

        //En Passant
        let cx = x - 1;
        if (cx >= 0) {
            if (pieces[y][cx] && 
                pieces[y][cx].piece == "pawn" && 
                pieces[y][cx].colour !== p.colour && 
                pieces[y][cx].enpassant) {
                if (p.colour == "white") {
                    if (!pieces[y - 1][cx]) {
                        validMoves.push([cx, y - 1]);
                    }
                } else {
                    if (!pieces[y + 1][cx]) {
                        validMoves.push([cx, y + 1]);
                    }
                }
            }
        }

        cx = x + 1;
        if (cx <= 7) {
            if (pieces[y][cx] && 
            pieces[y][cx].piece == "pawn" && 
            pieces[y][cx].colour !== p.colour && 
            pieces[y][cx].enpassant) {
                if (p.colour == "white") {
                    validMoves.push([cx, y - 1]);
                } else {
                    validMoves.push([cx, y + 1]);
                }
            }
        }

    }
}

function highlightMoves() {
    for (let m of validMoves) {
        board[m[1]][m[0]].classList.add('highlighted');
    }
}

function selectPiece(x, y) {
    board[y][x].classList.add('selected');
    selectedPiece[0] = x;
    selectedPiece[1] = y;
    findMoves(x, y);
    highlightMoves();
}

function movePiece(x, y) {
    oldx = selectedPiece[0];
    oldy = selectedPiece[1];
    if (pieces[y][x]) {
        board[y][x].firstChild.dataset.x = -1;
        board[y][x].firstChild.dataset.y = -1;
        board[y][x].removeChild(board[y][x].firstChild);
    } else if (pieces[oldy][oldx].piece == "pawn") {
        //EN PASSANT BABY!
        if (x !== oldx) {
            board[oldy][x].firstChild.dataset.x = -1;
            board[oldy][x].firstChild.dataset.y = -1;
            board[oldy][x].removeChild(board[oldy][x].firstChild);
            pieces[oldy][x] = 0;
        }
    }

    board[y][x].appendChild(board[oldy][oldx].firstChild);
    board[y][x].firstChild.dataset.x = x;
    board[y][x].firstChild.dataset.y = y;

    pieces[y][x] = pieces[oldy][oldx];
    pieces[oldy][oldx] = 0;
    
    // Whats this? en passant?
    if (pieces[y][x].piece == "pawn") {
        pieces[y][x].firstMove = false;
        if (Math.abs(oldy - y) == 2) {
            pieces[y][x].enpassant = true;
        }
    }

    selectedPiece = [-1, -1];
    validMoves = [];

    // EN PASSANT BABY
    turn = turn == "white" ? "black" : "white";
    if (lastMove[0] !== -1 && pieces[lastMove[1]][lastMove[0]].piece == "pawn") {
        pieces[lastMove[1]][lastMove[0]].enpassant = false;
    }
    lastMove = [x, y];
}

function unhighlight() {
    if (selectedPiece[0] !== -1) {
        board[selectedPiece[1]][selectedPiece[0]].classList.remove('selected');
    }

    for (let m of validMoves) {
        board[m[1]][m[0]].classList.remove('highlighted');
    }
}

function handleClick(t) {
    let x = parseInt(t.target.dataset.x)
    let y = parseInt(t.target.dataset.y);
    unhighlight();
    if (validMoves.find(m => m[0] == x && m[1] == y)) {
        movePiece(x, y);
    } else {
        if (pieces[y][x].colour == turn) {
            selectPiece(x, y);
        }
    }
}

function addEventListeners() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile) => {
        tile.addEventListener('click', handleClick);
    }); 
}

let board = createBoard();
let whitePieces = [];
let blackPieces = [];
let pieces = [];
let selectedPiece = [-1, -1];
let validMoves = [];
let lastMove = [-1, -1];
let turn = "white";
initializePieces(pieces, whitePieces, blackPieces);

//pieces[3][3] = createPieceData("pawn", "black");
//pieces[3][5] = createPieceData("pawn", "black");
//pieces[2][4] = createPieceData("pawn", "black");
//pieces[4][4] = createPieceData("pawn", "white");
//selectPiece(4, 4);
addEventListeners();
