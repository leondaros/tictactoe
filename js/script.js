var board = [0,1,2,3,4,5,6,7,8]; 
var round = 0;
var iter = 0;
var computer = "x"
var humanP = "o"
var currentPlayer = humanP;


const cells = document.querySelectorAll('.cell');
const replay = document.getElementById('replay');
startGame();

function startGame() {
    reset();
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].addEventListener("click",turnClick,false);
    }
    replay.addEventListener("click",startGame,false);
}

function turnClick(cell) {
    turn(cell.target.id,currentPlayer)
    console.log(board)
    if(!checkTie()) turn(bestSpot(), currentPlayer)
}

function turn(position,player){
    if(player==currentPlayer && board[position]==position){
        board[position] = player;
        cells[position].innerHTML = player
        checkWinner(board, player);
        round++;
        nextPlayer();
    }
}

function checkWinner(board,player){
    if ((board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)) {
        gameOver();
    }
}

function nextPlayer(){
    if(currentPlayer == humanP){
        console.log("computer turn");
        currentPlayer = computer;
    }else{
        console.log("human turn");
        currentPlayer = humanP;
    }
}

function minmax(board,player){
    iter++;

    var availableCells = emptyCells();

    if(checkWinner(board,computer)){
        return 1;   
    }
    if(checkWinner(board,humanP)){
        return -1;
    }
    if(!checkWinner(board,computer)&&!checkWinner(board,humanP)){
        return 0;
    }

    moves = possibleMoves(board,availableCells,player);

}

function possibleMoves(newBoard,availableCells,player){
    var moves = []
    for (let index = 0; index < availableCells.length; index++){
        var move = {
            index: null,
            score: null
        };

        move.index = newBoard[availableCells[index]];
        newBoard[availableCells[index]] = player;

        if(player == computer){
            var score = minmax(newBoard,humanP)
            move.score = score;
        }else{
            var score = minmax(newBoard,computer)
            move.score = score;
        }

        newBoard[availableCells[index]] = move.index;
        moves.push(move);
    }
    return moves;
}

function getBestMove(moves){
    var bestMove;
    searchBestMove(moves,computer);
    searchBestMove(moves,humanP);
}

function searchBestMove(moves,player){
    var bestScore = (player == computer) ? -10000 : 10000;
    for (var i = 0; i < moves.length; i++) {
        var condition = (player == computer) ? (moves[i].score > bestScore) : (moves[i].score < bestScore)
        if (condition) {
            bestScore = moves[i].score;
            bestMove = i;
        }
    }
    return bestMove;
}

function emptyCells(){
    return board.filter(cell => cell != humanP && cell != computer);
}

function bestSpot() {
    return emptyCells()[0];
}

function reset(){
    board = [0,1,2,3,4,5,6,7,8]; 
    round = 0;
    currentPlayer = humanP;
}

function checkTie() {
    if (emptyCells().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie game!")
        return true;
    } 
    return false;
}

function declareWinner(who) {
    console.log(who);
}

function gameOver(tie) {
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(currentPlayer == humanP ? "You win!" : "You lose.")
}