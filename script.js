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
        firstMove:true,
    };

    if (piece == "bishop") {
        pieceData.directions = ["nw", "ne", "sw", "se"]; 
    } else if (piece == "rook") {
        pieceData.directions = ["n", "s", "e", "w"];
    } else if (piece == "queen" || piece == "king") {
        pieceData.directions = ["n", "s", "e", "w", "nw", "ne", "sw", "se"]; 
    } else if (piece == "pawn") {
        if (colour == "white") {
            pieceData.directions = ["n", "ne", "nw"];
        } else {
            pieceData.directions = ["s", "se", "sw"];
        }
        pieceData.enpassant = false;
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

function checkForCheck() {
    let x, y;
    if (turn == "white") {
        x = parseInt(whitePieces[0].dataset.x);
        y = parseInt(whitePieces[0].dataset.y);
    } else {
        x = parseInt(blackPieces[0].dataset.x);
        y = parseInt(blackPieces[0].dataset.y);
    }
    // This is going to fucking suck
    let directionChange = {
        n: [0, -1],
        e: [1, 0],
        s: [0, 1],
        w: [-1, 0],
        ne: [1, -1],
        se: [1, 1],
        sw: [-1, 1],
        nw: [-1, -1],
    };

    let knightDirections = [
        [1, 2],
        [2, 1],
        [-1, 2],
        [-2, 1],
        [1, -2],
        [2, -1],
        [-1, -2],
        [-2, -1]
    ];
    
    for (let direction in directionChange) {
        let cx = x;
        let cy = y;
        let dc = directionChange[direction]; 
        switch(direction) {
            case "n":
            case "e":
            case "s":
            case "w":
                while (true) {
                    cx += dc[0];
                    cy += dc[1];
                    if (cx < 0 || cy < 0 || cx > 7 || cy > 7) {
                        break;
                    }
                    
                    if (pieces[cy][cx]) {
                        if (pieces[cy][cx].colour !== turn) {
                            if (pieces[cy][cx].piece == "queen" || 
                                pieces[cy][cx].piece == "rook") {
                                return true;
                            }
                        }

                        break;
                    }
                }
                break;
            default:
                while (true) {
                    cx += dc[0];
                    cy += dc[1];
                    if (cx < 0 || cy < 0 || cx > 7 || cy > 7) {
                        break;
                    }

                    if (pieces[cy][cx]) {
                        if (pieces[cy][cx].colour !== turn) {
                            if (pieces[cy][cx].piece == "queen" || 
                                pieces[cy][cx].piece == "bishop") {
                                return true;
                            } else if (pieces[cy][cx].piece == "pawn") {
                                if (pieces[cy][cx].colour == "white") {
                                    if (y + 1 == cy) {
                                        return true;
                                    }
                                } else {
                                    if (y - 1 == cy) {
                                        return true;
                                    }
                                }
                            } 
                        } 
                         
                        break;
                    }
                }
        }
    }

    for (let dc of knightDirections) {
        let cx = x + dc[0];
        let cy = y + dc[1];

        if (cx < 0 || cy < 0 || cx > 7 || cy > 7) {
            continue
        }

        if (pieces[cy][cx] && 
            pieces[cy][cx].colour !== turn && 
            pieces[cy][cx].piece === "knight") {
            return true;
        }
    }

    return false;
}

function slope(x1, y1, x2, y2) {
    return (Math.abs((y2 - y1) / (x2 - x1)));
}

function checkForPin(x, y) {
    // First see if it's in view of the king

    let kingx, kingy;
    if (turn === "white") {
        kingx = parseInt(whitePieces[0].dataset.x);
        kingy = parseInt(whitePieces[0].dataset.y);
    } else {
        kingx = parseInt(blackPieces[0].dataset.x);
        kingy = parseInt(blackPieces[0].dataset.y);
    }

    if (y === kingy && x === kingx) {
        return false;
    }

    if (x === kingx) {
        let cy = y;
        while (true) {
            cy = cy < kingy ? (cy + 1) : (cy - 1);
            if (cy === kingy) {
                break;
            }
            if (pieces[cy][x]) {
                return false;
            }
        }
        
        cy = y;
        while (true) {
            cy = cy < kingy ? (cy - 1) : (cy + 1);
            if (cy > 7 || cy < 0) {
                return false;
            }
            if (pieces[cy][x]) {
                if (pieces[cy][x].colour !== turn &&
                (pieces[cy][x].piece === "rook" || 
                pieces[cy][x].piece === "queen")) {
                    return "n";
                }
                return false;
            }
        }
    } else if (y == kingy) {
        let cx = x;
        while (true) {
            cx = cx < kingx ? (cx + 1) : (cx - 1);
            if (cx === kingx) {
                break;
            }
            if (pieces[y][cx]) {
                return false;
            }
        }
        
        cx = x;
        while (true) {
            cx = cx < kingx ? (cx - 1) : (cx + 1);
            if (cx > 7 || cx < 0) {
                return false;
            }
            if (pieces[y][cx]) {
                if (pieces[y][cx].colour !== turn &&
                (pieces[y][cx].piece === "rook" || 
                pieces[y][cx].piece === "queen")) {
                    return "e";
                }
                return false;
            }
        }
    } else if (slope(x, y, kingx, kingy) == 1) {
        let cx = x;
        let cy = y;
        while (true) {
            cx = cx < kingx ? (cx + 1) : (cx - 1);
            cy = cy < kingy ? (cy + 1) : (cy - 1);
            if (cx === kingx) {
                break;
            }
            if (pieces[cy][cx]) {
                return false;
            }
        }

        cx = x;
        cy = y;
        while (true) {
            cx = cx < kingx ? (cx - 1) : (cx + 1);
            cy = cy < kingy ? (cy - 1) : (cy + 1);
            if (cy > 7 || cx > 7 || cy < 0 || cx < 0) {
                return false;
            }
            if (pieces[cy][cx]) {
                if (pieces[cy][cx].colour !== turn &&
                (pieces[cy][cx].piece === "bishop" || 
                pieces[cy][cx].piece === "queen")) {
                    if (x > kingx) {
                        if (y < kingy) {
                            return("ne")
                        } else {
                            return("se");
                        }
                    } else {
                        if (y < kingy) {
                            return "nw";
                        } else {
                            return "sw";
                        }
                    }
                }
                return false;
            }
        }

    }
}

function checkMoveLegality(x, y, cx, cy) {
    // The way the king coordinates are accessed when checking if a move will
    // put it in check is by checking the first index of the black/whitePieces
    // arrays. The issue is those arrays point to the nodes on the board. By
    // switching the dataset here, it fixes a bug where the king thinks it can
    // take a piece when that piece is defended, which is illegal.
    let king = pieces[y][x].piece == "king";
    if (king) {
        board[y][x].firstChild.dataset.x = cx;
        board[y][x].firstChild.dataset.y = cy;
    }
    oldPiece = pieces[cy][cx]; 

    pieces[cy][cx] = pieces[y][x];
    pieces[y][x] = 0;
    let c = checkForCheck();
    pieces[y][x] = pieces[cy][cx];
    pieces[cy][cx] = oldPiece;
    if (king) {
        board[y][x].firstChild.dataset.x = x;
        board[y][x].firstChild.dataset.y = y;
    }
    return c;
}

function checkMate() {
    let piecesToCheck;
    if (turn == "white") {
        piecesToCheck = whitePieces; 
    } else {
        piecesToCheck = blackPieces;
    }

    for (let p of piecesToCheck) {
        let x = parseInt(p.dataset.x);
        if (x == -1) {
            continue;
        }
        let y = parseInt(p.dataset.y);
        findMoves(x, y);
        if (validMoves.length > 0) {
            validMoves = []
            return false;
        }
    }

    return true;
}

function findMoves(x, y) {
    let p = pieces[y][x];
    let directionChange = {
        n: [0, -1],
        e: [1, 0],
        s: [0, 1],
        w: [-1, 0],
        ne: [1, -1],
        se: [1, 1],
        sw: [-1, 1],
        nw: [-1, -1],
    };

    let pinDirection = checkForPin(x, y);

    if (p.piece === "rook" || p.piece === "bishop" || p.piece === "queen") {
        let directions;
        if (pinDirection === "n") {
            if (p.piece === "bishop") {
                return;
            } else {
                directions = ["n", "s"];
            }
        } else if (pinDirection === "e") {
            if (p.piece === "bishop") {
                return;
            } else {
                directions = ["e", "w"];
            }
        } else if (pinDirection === "nw" || pinDirection === "se") {
            if (p.piece === "rook") {
                return;
            } else {
                directions = ["nw", "se"];
            }
        } else if (pinDirection === "ne" || pinDirection === "sw") {
            if (p.piece === "rook") {
                return;
            } else {
                directions = ["ne", "sw"]; 
            }
        } else {
            directions = p.directions;
        }

        for (let d of directions) {
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
                        if (check) {
                            if (checkMoveLegality(x, y, cx, cy)) {
                                continue;
                            }
                        }
                        validMoves.push([cx, cy]);
                    }

                    break;
                } else {
                    if (check) {
                        if (checkMoveLegality(x, y, cx, cy)) {
                            continue;
                        }
                    }
                    validMoves.push([cx, cy])
                }
            }
        }
    } else if (p.piece == "knight") {
        if (pinDirection) {
            return;
        }
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
                    if (check) {
                        if (checkMoveLegality(x, y, cx, cy)) {
                            continue;
                        }
                    }
                    validMoves.push([cx, cy]);
                }
            } else {
                if (check) {
                    if (checkMoveLegality(x, y, cx, cy)) {
                        continue;
                    }
                }
                validMoves.push([cx, cy]);
            }
        }
    } else if (p.piece == "king") {
        for (let d of p.directions) {
            let dc = directionChange[d]
            let cx = x + dc[0];
            let cy = y + dc[1];
            if (cx < 0 || cy < 0 || cx > 7 || cy > 7) {
                continue;
            }

            if (pieces[cy][cx]) {
                if (pieces[cy][cx].colour !== p.colour) {
                    if (check) {
                        if (checkMoveLegality(x, y, cx, cy)) {
                            continue;
                        }
                    }
                    validMoves.push([cx, cy]);
                }
            } else {
                if (check) {
                    if (checkMoveLegality(x, y, cx, cy)) {
                        continue;
                    }
                }
                validMoves.push([cx, cy]);
            }
        }

        // Add castling moves
        if (p.firstMove) {
            // King side castle
            if (!pieces[y][x + 1] && !pieces[y][x + 2]) {
                if (pieces[y][x + 3].piece == "rook" && 
                pieces[y][x + 3].firstMove) {
                    if (!checkMoveLegality(x, y, x + 1, y) && 
                    !checkMoveLegality(x, y, x + 2, y)) {
                        validMoves.push([x + 2, y]);
                    }
                } 
            }

            // Queen side castle
            if (!pieces[y][x - 1] && !pieces[y][x - 2] && !pieces[y][x - 3]) {
                if (pieces[y][x - 4].piece == "rook" &&
                pieces[y][x - 4].firstMove) {
                    if (!checkMoveLegality(x, y, x - 1, y) &&
                    !checkMoveLegality(x, y, x - 2, y)) {
                        validMoves.push([x - 2, y]);
                    }
                }
            }
        }
    } else if (p.piece == "pawn") {
        let directions;
        if (pinDirection) {
            if (pinDirection == "n") {
                if (p.colour == "white") {
                    directions = ["n"];
                } else {
                    directions = ["s"];
                }
            } else if (pinDirection == "ne" || pinDirection == "sw") {
                if (p.colour == "white") {
                    directions = ["ne"];
                } else {
                    directions = ["sw"];
                }
            } else if (pinDirection == "nw" || pinDirection == "se") {
                if (p.colour == "white") {
                    directions = ["nw"];
                } else {
                    directions = ["se"];
                }
            } else {
                return;
            }
        } else {
            directions = p.directions;
        }

        for (let d of directions) {
            let dc = directionChange[d];
            let cx = x + dc[0];
            let cy = y + dc[1];

            if (cx > 7 || cy > 7 || cx < 0 || cy < 0) {
                continue;
            }

            if (cx !== x) {
                if (pieces[cy][cx]) {
                    if (pieces[cy][cx].colour !== p.colour) {
                        if (check) {
                            if (checkMoveLegality(x, y, cx, cy)) {
                                continue;
                            }
                        }
                        validMoves.push([cx, cy]);
                    } 
                } else if (pieces[y][cx]) {
                    if (pieces[y][cx].piece == "pawn" && 
                    pieces[y][cx].colour !== p.colour && 
                    pieces[y][cx].enpassant) {
                        if (check) {
                            if (checkMoveLegality(x, y, cx, cy)) {
                                continue;
                            }
                        }
                        validMoves.push([cx, cy]);
                    }
                }
            } else {
                if (!pieces[cy][cx]) {
                    if (check) {
                        if (checkMoveLegality(x, y, cx, cy)) {
                            continue;
                        }
                    }
                    validMoves.push([cx, cy]);
                    if (p.firstMove && !pieces[cy + dc[1]][cx]) {
                        if (check) {
                            if (checkMoveLegality(x, y, cx, (cy + dc[1]))) {
                                continue;
                            }
                        }
                        validMoves.push([cx, (cy + dc[1])]);
                    }
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

function unhighlight() {
    if (selectedPiece[0] !== -1) {
        board[selectedPiece[1]][selectedPiece[0]].classList.remove('selected');
    }

    for (let m of validMoves) {
        board[m[1]][m[0]].classList.remove('highlighted');
    }

    validMoves = [];
    selectedPiece = [-1, -1];
}

function changePawn(x, y) {
    let piece;
    while (true) {
        piece = prompt("What piece would you like instead? (rook, knight, bishop, queen)")
        piece = piece.toLowerCase().trim();
        if (piece === "queen" ||
        piece === "knight" ||
        piece === "bishop" ||
        piece === "rook") {
            break;
        }
    }

    pieces[y][x].piece = piece;
    if (turn == "white") {
        board[y][x].firstChild.setAttribute("src", `./chessvgs/${piece}-white.svg`);
    } else {
        board[y][x].firstChild.setAttribute("src", `./chessvgs/${piece}-black.svg`);
    }

    if (piece === "queen") {
        pieces[y][x].directions = ["n", "e", "w", "s", "ne", "nw", "sw", "se"];
    } else if (piece === "rook") {
        pieces[y][x].directions = ["n", "e", "w", "s"];
    } else if (piece === "bishop") {
        pieces[y][x].directions = ["ne", "nw", "se", "sw"];
    } else {
        pieces[y][x].directions = [];
    }
}

function movePiece(x, y) {
    oldx = selectedPiece[0];
    oldy = selectedPiece[1];
    if (pieces[y][x]) {
        // If there's a piece at the x and y coordinate, it means it was
        // taken, and can now be removed.

        // Set the x and y values to -1 so that if I check their position in
        // the white and black pieces arrays, it will be easy to tell they've
        // been taken without removing them from those arrays.
        board[y][x].firstChild.dataset.x = -1;
        board[y][x].firstChild.dataset.y = -1;
        board[y][x].removeChild(board[y][x].firstChild);
    } else if (pieces[oldy][oldx].piece == "pawn") {
        // Qu'est que c'est? En passant??
        // If the pawn moves to the left or right, it means a piece is taken
        // Since the pawn moves to where the old piece was, if there's no piece
        // currently occupying that space, it means the pawn must have been
        // taken en passant.
        if (x !== oldx) {
            board[oldy][x].firstChild.dataset.x = -1;
            board[oldy][x].firstChild.dataset.y = -1;
            board[oldy][x].removeChild(board[oldy][x].firstChild);
            pieces[oldy][x] = 0;
        }
    } else if (pieces[oldy][oldx].piece == "rook") {
        pieces[oldy][oldx].firstMove = false;
    } else if (pieces[oldy][oldx].piece == "king") {
        pieces[oldy][oldx].firstMove = false;
        // Check if king castled, if so, move the knight node to the correct
        // position, and update firstMove attribute accordingly.
        if (Math.abs(oldx - x) === 2) {
            if (oldx < x) {
                board[y][5].appendChild(board[y][7].firstChild);
                pieces[y][5] = pieces[y][7];
                pieces[y][7] = 0;
                pieces[y][5].firstMove = false;
            } else {
                board[y][3].appendChild(board[y][0].firstChild);
                pieces[y][3] = pieces[y][0];
                pieces[y][0] = 0;
                pieces[y][3].firstMove = false;
            }
        }
    }

    board[y][x].appendChild(board[oldy][oldx].firstChild);
    board[y][x].firstChild.dataset.x = x;
    board[y][x].firstChild.dataset.y = y;

    pieces[y][x] = pieces[oldy][oldx];
    pieces[oldy][oldx] = 0;
    
    // Whats this? en passant?
    // Set the en passant flag (meaning the piece can be taken en passant) if
    // the pawn moves forward by 2 spaces.

    // Also set the firstMove flag to false since the pawn moved, therefore
    // not allowing the pawn to move forward 2 spaces again.. a bit more
    // elegant than checking the y coordinate
    
    // Also check here to see if the pawn made it to the end and should be
    // switched to a piece of choice.
    if (pieces[y][x].piece == "pawn") {
        pieces[y][x].firstMove = false;
        if (Math.abs(oldy - y) == 2) {
            pieces[y][x].enpassant = true;
        }

        if (pieces[y][x].colour == "white" && y == 0 || 
        pieces[y][x].colour == "black" && y == 7) {
            changePawn(x, y);
        }
    }
    

    // EN PASSANT BABY
    // Also keep track of the last made move.. this is literally just put in
    // place so that if the pawn moves again the system won't think it can
    // be taken en passant. (This is seperate from the firstMove flag since
    // en passant happens after the firstMove flag is set to false).
    turn = turn == "white" ? "black" : "white";
    if (lastMove[0] !== -1 && pieces[lastMove[1]][lastMove[0]].piece == "pawn") {
        pieces[lastMove[1]][lastMove[0]].enpassant = false;
    }
    lastMove = [x, y];

    unhighlight();
    check = checkForCheck();
    if (checkMate()) {
        if (check) {
            turn = turn == "white" ? "Black" : "White";
            alert(`Checkmate! ${turn} wins!`);
            turn = turn == "White" ? "black" : "white";
        } else {
            alert("Tie game! Stalemate!");
        }
    }
}

function selectPiece(x, y) {
    unhighlight();
    board[y][x].classList.add('selected');
    selectedPiece[0] = x;
    selectedPiece[1] = y;
    findMoves(x, y);
    highlightMoves();
}

function handleClick(t) {
    let x = parseInt(t.target.dataset.x)
    let y = parseInt(t.target.dataset.y);
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
let check = false;
initializePieces(pieces, whitePieces, blackPieces);
addEventListeners();
