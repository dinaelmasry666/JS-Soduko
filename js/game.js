let EMPTY = '#e3e3e3';
let board_solved, board_unsolved;

function SetIds() {
    let i = 0, j = 0;
    for (let table_row_elem of document.getElementsByTagName('tr')) {
        for (let table_col_elem of table_row_elem.getElementsByTagName('td')) {
            for (let part of table_col_elem.getElementsByTagName('button')) {
                if (part.nodeType === Node.ELEMENT_NODE) {
                    part.id = `c${i}${j}`;
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
    let game = Play(diff);
    board_solved = game[0];
    board_unsolved = game[1][0];
}

SetIds();
BuildBoard('e');
SetSudoku();