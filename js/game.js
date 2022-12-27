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
    toggleSelectedNumbers();
    toggleNotes();
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

    //call to highlight if needed
    Highlight(r, c);
    //to check if input is wrong solution wise, and highlight call
    //HighlightSolutionError(r,c);
    //to check if the input caused a game rule violation call
    //HighlightRuleError(); //NOT YET WORKING
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