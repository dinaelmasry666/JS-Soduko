document.body.onload = BodyLoad;

var EMPTY = 'rgb(227, 227, 227)', NORMAL = 'rgb(32, 123, 255)', ERROR = 'rgb(252, 78, 78)',
    H_EMPTY = 'rgb(208, 196, 232)', H_AREA = 'rgb(125, 78, 252)', H_CELL = 'rgb(0, 232, 242)', H_OCC = 'rgb(123, 73, 166)';

var board_solved, board_unsolved;
var erasable = []  // this array contains all the places that can be deleted.
var inserted = []; // array to contain all cells user already filled, will use in hint
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
    BuildBoard('h');
    SetSudoku();
    SetErasableCells();
    toggleSelectedNumbers();
    toggleNotes();
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

        if (board_unsolved[r][i] === 0)
            cell_r.style.backgroundColor = H_EMPTY;
        else
            cell_r.style.backgroundColor = H_AREA;

        if (board_unsolved[i][c] === 0)
            cell_c.style.backgroundColor = H_EMPTY;
        else
            cell_c.style.backgroundColor = H_AREA;
    }
}

function HighlightNumber(n) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var cell = document.getElementById(`c${i}${j}`);

            if (board_unsolved[i][j] === n)
                cell.style.backgroundColor = H_OCC;
        }
    }
}

function ResetHighlight() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            var cell = document.getElementById(`c${i}${j}`);

            if (board_unsolved[i][j] === 0)
                cell.style.backgroundColor = EMPTY;
            else
                cell.style.backgroundColor = NORMAL;
        }
    }
}

function Highlight(r, c, highlightMistake, highlightDuplicate) {
    var n = board_unsolved[r][c];
    ResetHighlight();
    if (highlightDuplicate) HighlightRuleError();
    if (highlightMistake) HighlightSolutionError(r, c);
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

    // ROWS & COLS
    var all_occ_r = [], all_occ_c = [];
    for (let i = 0; i < 9; i++) {
        var occ1 = {}, occ2 = {};
        for (let j = 0; j < 9; j++) {
            let tmp = board_unsolved[i][j];

            if (tmp !== 0)
                occ1[tmp] = occ1[tmp] === undefined ? 1 : occ1[tmp] + 1;

            tmp = board_unsolved[j][i];
            if (tmp !== 0)
                occ2[tmp] = occ2[tmp] === undefined ? 1 : occ2[tmp] + 1;
        }
        all_occ_r.push(occ1);
        all_occ_c.push(occ2);
    }
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let tmp = board_unsolved[i][j];
            if (tmp !== 0 && all_occ_r[i][tmp] > 1) {
                document.getElementById(`c${i}${j}`).style.backgroundColor = ERROR;
            }

            tmp = board_unsolved[j][i];
            if (tmp !== 0 && all_occ_c[i][tmp] > 1) {
                document.getElementById(`c${j}${i}`).style.backgroundColor = ERROR;
            }
        }
    }

    // BOX
    var r = 0, c = 0;
    var all_occ = []
    for (let i = 0; i < 9; i++) {
        var occ = {};
        for (let j = r; j < r + 3; j++) {
            for (let k = c; k < c + 3; k++) {
                let tmp = board_unsolved[j][k];
                if (tmp !== 0)
                    occ[tmp] = occ[tmp] === undefined ? 1 : occ[tmp] + 1;
            }
        }
        c += 3;
        if (c === 9) {
            c = 0;
            r += 3;
        }
        all_occ.push(occ);
    }

    r = 0; c = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = r; j < r + 3; j++) {
            for (let k = c; k < c + 3; k++) {
                let tmp = board_unsolved[j][k];
                if (tmp !== 0 && all_occ[i][tmp] > 1) {
                    document.getElementById(`c${j}${k}`).style.backgroundColor = ERROR;
                }
            }
        }
        c += 3;
        if (c === 9) {
            c = 0;
            r += 3;
        }
    }
}

function CellClick(evt) {
    var r = parseInt(evt.target.id[1]), c = parseInt(evt.target.id[2]);


    //Raouf write
    if (!eraseMode) {
        //region temporary input method
        var x = parseInt(prompt());
        if (x.toString() === 'NaN') return;
        board_unsolved[r][c] = x;
        // loop on inserted and remove the value from it
        for (let i = 0; i < inserted.length; i++) {
            if (inserted[i][0] == r && inserted[i][1] == c) {
                inserted.splice(i, 1);
                break;
            }
        }
        document.getElementById(`c${r}${c}`).innerText = x;
        //endregion
    }


    //Kareem if erase is on
    else
        Erase(r, c);
    //call to highlight if needed, last 2 params highlight mistake, highlight duplicate true->on, false -> off
    Highlight(r, c, false, true);
}


function SetErasableCells() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board_unsolved[i][j] === 0) {
                erasable.push([i, j]);
            }
        }
    }
    inserted.push.apply(inserted, erasable); // copy elements from erasable to inserted
}


function Erase(r, c) {
    for (var i = 0; erasable.length; i++) {
        if (erasable[i][0] == r && erasable[i][1] == c) {
            board_unsolved[r][c] == 0;
            inserted.push([r, c]);
            break;
        }

    }
    document.getElementById(`c${r}${c}`).innerText = "";   //to draw the board again
}

// if the user clicked the eraser it will be true if clicked again it will be false
$("#eraser").click(() => {
    eraseMode = !eraseMode;
})

$("#idea").click(() => {
    Hint();
})

function Hint() {
    // generate random number
    var rnd = Math.random();
    var index = Math.floor(inserted.length * rnd);

    // access erasable array to get that random (r,c)
    var row, col;
    [row, col] = inserted[index];   // destructuring syntax
    // access board_solved to find value at that (r,c)
    var value = board_solved[row][col];
    // set that value in board_unsolved
    board_unsolved[row][col] = value;
    // set element on the board
    document.getElementById(`c${row}${col}`).innerText = value;
    //delete this value form the erasable array to not be deleted by erase
    erasable.splice(index, 1);
    // static counter to allow 3 hints only.
    Highlight(row, col, false, true);
}


function toggleSelectedNumbers() {

    var header = document.getElementById("findSelectedNumberDiv");
    var btns = header.getElementsByTagName("button");
    for (var i = 0; i < btns.length; i++) {

        /*   1- Add Event listener to each number key.  */
        btns[i].addEventListener("click", function () {

            /*   2- this registers a list of all the elements that has "numSelected" class name */
            var current = document.getElementsByClassName("numSelected");

            /* 3- we check first if we the same key is pressed , if true -- we remove the selection
             if false --> we   */

            console.log(this.classList.contains("numSelected")); // testing

            if (this.classList.contains("numSelected")) {
                current[0].className = current[0].className.replace("numSelected", "");
                console.log("same Btn were selected")
            }
            else {
                if (current.length > 0) {
                    current[0].className = current[0].className.replace("numSelected", "");
                    this.className += " numSelected";
                }
                else {
                    this.className += " numSelected";
                }
            }
        });
    }

}

function toggleNotes() {

    document.getElementsByClassName("notesStyle")[0].addEventListener("click", function () {
        var current = document.getElementsByClassName("notesSelected");

        if (this.classList.contains("notesSelected")) {
            current[0].className = current[0].className.replace("notesSelected", "");
            console.log("notesBtnOff")
        }
        else {

            /* note: it's really important to keep space at the begaining of the qoutes here 
                          
            */

            this.className += " notesSelected";

        }

    });
}


function toggleSelectedNumbers() {

    var header = document.getElementById("findSelectedNumberDiv");
    var btns = header.getElementsByTagName("button");
    for (var i = 0; i < btns.length; i++) {

        /*   1- Add Event listener to each number key.  */
        btns[i].addEventListener("click", function () {

            /*   2- this registers a list of all the elements that has "numSelected" class name */
            var current = document.getElementsByClassName("numSelected");

            /* 3- we check first if we the same key is pressed , if true -- we remove the selection
             if false --> we   */

            console.log(this.classList.contains("numSelected")); // testing

            if (this.classList.contains("numSelected")) {
                current[0].className = current[0].className.replace("numSelected", "");
                console.log("same Btn were selected")
            }
            else {
                if (current.length > 0) {
                    current[0].className = current[0].className.replace("numSelected", "");
                    this.className += " numSelected";
                }
                else {
                    this.className += " numSelected";
                }
            }
        });
    }

}

function toggleNotes() {

    document.getElementsByClassName("notesStyle")[0].addEventListener("click", function () {
        var current = document.getElementsByClassName("notesSelected");

        if (this.classList.contains("notesSelected")) {
            current[0].className = current[0].className.replace("notesSelected", "");
            console.log("notesBtnOff")
        }
        else {

            /* note: it's really important to keep space at the begaining of the qoutes here 
                          
            */

            this.className += " notesSelected";

        }

    });
}