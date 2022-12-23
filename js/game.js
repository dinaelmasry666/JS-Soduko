document.body.onload = BodyLoad;

var EMPTY = '#e3e3e3', NORMAL = '#207bff', ERROR = '#fc4e4e',
    H_EMPTY = '#d0c4e8', H_AREA = '#7d4efc', H_CELL = '#00e8f2', H_OCC = '#7a49a5';

var board_solved, board_unsolved;
var erasable = []  // this array contains all the places that can be deleted.
var eraseMode = false;

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
    board_solved = game[0];          // the game solved
    board_unsolved = game[1];     // any number of 0 means can be inserted 
}

function BodyLoad() {
    SetIds();
    SetCellOnClick();
    BuildBoard('e');
    SetSudoku();
    SetErasableCells();
}

function HighlightBox(r, c) {
    r = Math.floor(r / 3) * 3;
    c = Math.floor(c / 3) * 3;

    for (let i = r; i < r + 3; i++) {
        for (let j = c; j < c + 3; j++) {
            if (board_unsolved[i][j] === 0)
                document.getElementById(`c${i}${j}`).style.backgroundColor = H_EMPTY;
            else
                document.getElementById(`c${i}${j}`).style.backgroundColor = H_AREA;
        }
    }
}

function HighlightRowCol(r, c) {
    for (let i = 0; i < 9; i++) {
        if (board_unsolved[r][i] === 0)
            document.getElementById(`c${r}${i}`).style.backgroundColor = H_EMPTY;
        else
            document.getElementById(`c${r}${i}`).style.backgroundColor = H_AREA;

        if (board_unsolved[i][c] === 0)
            document.getElementById(`c${i}${c}`).style.backgroundColor = H_EMPTY;
        else
            document.getElementById(`c${i}${c}`).style.backgroundColor = H_AREA;
    }
}

function HighlightNumber(n) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board_unsolved[i][j] === n)
                document.getElementById(`c${i}${j}`).style.backgroundColor = H_OCC;
        }
    }
}

function ResetHighlight() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board_unsolved[i][j] === 0)
                document.getElementById(`c${i}${j}`).style.backgroundColor = EMPTY;
            else
                document.getElementById(`c${i}${j}`).style.backgroundColor = NORMAL;
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
    if (eraseMode)
        Erase(r, c);
    //call to highlight if needed
    Highlight(r, c);
    //to check if input is wrong solution wise, and highlight call
    //HighlightSolutionError(r,c);
    //to check if the input caused a game rule violation call
    //HighlightRuleError(); //NOT YET WORKING
}


function SetErasableCells() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board_unsolved[i][j] === 0) {
                erasable.push([i, j]);
            }
        }
    }
}


function Erase(r, c) {
    for (var i = 0; erasable.length; i++) {
        if (erasable[i][0] == r && erasable[i][1] == c) {
            board_unsolved[r][c] == 0;
        }

    }
    SetSudoku();   //to draw the board again
}

// if the user clicked the eraser it will be true if clicked again it will be false
$("#eraser").click(() => {                            
    eraseMode = eraseMode ? false : true;
})

function Hint(){
    // generate random number
    var rnd = Math.random();
    var index = Math.floor(erasable.length * rnd);
    
    // access erasable array to get that random (r,c)
    var row, col;
    [row, col] = erasable[index];   // destructuring syntax
    // access board_solved to find value at that (r,c)
    var value= board_solved[row][col];
    // set that value in board_unsolved
    board_unsolved[row][col]=value;
    // call SetSedoku() func to regenerate the board
    SetSudoku();
    //delete this value form the erasable array to not be deleted by erase
    erasable.splice(index,1);
    // static counter to allow 3 hints only.
}