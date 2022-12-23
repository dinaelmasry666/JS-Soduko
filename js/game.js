document.body.onload = BodyLoad;

var EMPTY = '#e3e3e3', NORMAL = '#207bff', ERROR = '#fc4e4e',
    H_EMPTY = '#d0c4e8', H_AREA = '#7d4efc', H_CELL = '#00e8f2', H_OCC = '#7a49a5';

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

function SetCellOnClick() {
    for (var btn of document.getElementsByClassName('num_block')) {
        btn.onclick = CellClick;
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
    SetCellOnClick();
    BuildBoard('e');
    SetSudoku();
}

function HighlightBox(r, c) {
    r = Math.floor(r / 3) * 3;
    c = Math.floor(c / 3) * 3;

    for (let i = r; i < r + 3; i++) {
        for (let j = c; j < c + 3; j++) {
            var cell = document.getElementById(`c${i}${j}`);
            if (cell.style.backgroundColor !== ERROR) {
                if (board_unsolved[i][j] === 0)
                    cell.style.backgroundColor = H_EMPTY;
                else
                    cell.style.backgroundColor = H_AREA;
            }
        }
    }
}

function HighlightRowCol(r, c) {
    for (let i = 0; i < 9; i++) {
        var cell_r = document.getElementById(`c${r}${i}`),
            cell_c = document.getElementById(`c${i}${c}`);

        if (cell.style.backgroundColor !== ERROR) {
            if (board_unsolved[r][i] === 0)
                cell_r.style.backgroundColor = H_EMPTY;
            else
                cell_r.style.backgroundColor = H_AREA;
        }

        if (cell.style.backgroundColor !== ERROR) {
            if (board_unsolved[i][c] === 0)
                cell_c.style.backgroundColor = H_EMPTY;
            else
                cell_c.style.backgroundColor = H_AREA;
        }
    }
}

function HighlightNumber(n) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var cell = document.getElementById(`c${i}${j}`);

            if (cell.style.backgroundColor !== ERROR && board_unsolved[i][j] === n)
                cell.style.backgroundColor = H_OCC;
        }
    }
}

function ResetHighlight() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var cell = document.getElementById(`c${i}${j}`);

            if (cell.style.backgroundColor !== ERROR) {
                if (board_unsolved[i][j] === 0)
                    cell.style.backgroundColor = EMPTY;
                else
                    cell.style.backgroundColor = NORMAL;
            }
        }
    }
}

function Highlight(r, c) {
    var n = board_unsolved[r][c];
    ResetHighlight();
    HighlightBox(r, c);
    HighlightRowCol(r, c);
    if (n !== 0) HighlightNumber(n);

    document.getElementById(`c${r}${c}`).style.backgroundColor = H_CELL;
}

//error functions should be called after undo, hint, write.
//highlight should not change any cell with error background

function HighlightSolutionError(r, c) {
    if (board_unsolved[r][c] !== board_solved[r][c])
        document.getElementById(`c${r}${c}`).style.backgroundColor = ERROR;
}

function HighlightRuleError() {

}

function CellClick(evt) {
    var r = parseInt(evt.target.id[1]), c = parseInt(evt.target.id[2]);
    //Raouf write

    //Kareem if erase is on

    //call to highlight if needed
    Highlight(r, c);
    //to check if input is wrong solution wise, and highlight call
    //HighlightSolutionError(r,c);
    //to check if the input caused a game rule violation call
    //HighlightRuleError(); //NOT YET WORKING
}