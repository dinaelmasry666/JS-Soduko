document.body.onload = BodyLoad;

var EMPTY = '#e3e3e3', NORMAL = '#207bff', ERROR = '#fc4e4e',
    H_EMPTY = '#d0c4e8', H_ROW_COL = '#7d4efc', H_CELL = '#00e8f2', H_OCC = '#7a49a5';

var board_solved, board_unsolved;

function SetIds() {
    var i = 0, j = 0;
    for (let row of document.getElementsByTagName('tr')) {
        for (let col of row.getElementsByTagName('td')) {
            for (let cell of col.getElementsByTagName('button')) {
                if (cell.nodeType === Node.ELEMENT_NODE) {
                    cell.id = `c${i}${j}`;
                    j++;
                }
            }
        }
        i++;
        j = 0;
    }
}

function SetSudoku() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board_unsolved[i][j] === 0) {
                document.getElementById(`c${i}${j}`).style.backgroundColor = EMPTY;
            }
            else
                document.getElementById(`c${i}${j}`).innerText = board_unsolved[i][j];
        }
    }
}

function BuildBoard(diff) {
    var game = Play(diff);
    board_solved = game[0];
    board_unsolved = game[1];

}

function BodyLoad() {
    SetIds();
    BuildBoard('e');
    SetSudoku();
}