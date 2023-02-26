// Factory Function
function gameSetup(gOpponent, aiLevel, p1Name, p2Name, p1Symbol) {
    p1Name = p1Name.toLowerCase();
    p2Name = p2Name.toLowerCase();
    const p2Symbol = p1Symbol === 'x' ? 'o' : 'x';
    const gBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const gRound = 0;
    const p1Score = 0;
    const p2Score = 0;
    const pTurn = 0;
    const currentPlayer = 'o';
    const gameOver = false;

    return {
        gOpponent, 
        aiLevel, 
        p1Name, 
        p1Symbol, 
        p2Name, 
        p2Symbol, 
        gBoard, 
        gRound, 
        p1Score, 
        p2Score,
        pTurn,
        currentPlayer, 
        gameOver
    }
}