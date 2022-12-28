(function(){
    var EMPTY = '#e3e3e3', NORMAL = '#207bff', ERROR = '#fc4e4e',
        H_EMPTY = '#d0c4e8', H_AREA = '#7d4efc', H_CELL = '#00e8f2', H_OCC = '#7a49a5',
        //write
        CellWritten = '#ff6e31',
        numberIsDone = '#579bb1',
        wrongNumber = '#ff597B';


    var board_solved, board_unsolved,
        insertable = [], empty = [], undoArr = [],
        numberSelected = null,
        numberUsageArr = [0, 0, 0, 0, 0, 0, 0, 0, 0],
        mistakeCount = 0, notes = false;

    BodyLoad();

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
                } else
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
        eventListenerCall();

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let tmp = board_unsolved[i][j];

                if (tmp === 0) {
                    insertable.push(`${i}${j}`);
                    empty.push(`${i}${j}`);
                } else numberUsageArr[tmp - 1]++;
            }
        }
    }

    function HighlightBox(r, c) {

        /* this part resets the r,c to the starting cell of each box */
        r = Math.floor(r / 3) * 3;
        c = Math.floor(c / 3) * 3;

        for (let i = r; i < r + 3; i++) {
            for (let j = c; j < c + 3; j++) {
                if (board_unsolved[i][j] === 0)
                    /* if the cell is empty, then we highlight it in light purple
                        if the cell has a number, then we highligh it in dark blue */
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
        /* note: the highlighter is called by the cellClick event */
        var n = board_unsolved[r][c];
        /* 1- First we run throw the whole table and remove all the highlighting  */
        ResetHighlight();
        /* 2- we highlight the box that holds the cell we clicked */
        HighlightBox(r, c);
        /* 3- we highlight the row and column of that cell */

        HighlightRowCol(r, c);

        /* 4- if there is already a number in that cell, then we highlight all the other identical numbers  */
        if (n !== 0) HighlightNumber(n);

        /* 5- at last we highligh the cell itself. */
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

        //if(eraseon)
        if(numberSelected){
            if(notes) cellWrite(r, c, true);
            else cellWrite(r, c, false);
        }


        Highlight(r, c);
    }

    function cellWrite(r, c, isNote) {
        if (insertable.indexOf(`${r}${c}`) === -1) return;

        var selectedCell = document.getElementById(`c${r}${c}`);

        if (isNote) {
            selectedCell.innerText = numberSelected;
        }

        else {
            //mistakeCounter();
            if(board_unsolved[r][c]!==0) {
                numberUsageTracker('remove', board_unsolved[r][c]);
            }

            undoArr.push(`${numberSelected}${board_unsolved[r][c]}${r}${c}`);

            selectedCell.innerText = numberSelected;
            board_unsolved[r][c] = numberSelected;

            //remove from empty
            var idx = empty.indexOf(`${r}${c}`);
            if (idx !== -1)
                empty.splice(idx, 1);

            numberUsageTracker('add', numberSelected);
        }

    }

    function eventListenerCall() {
        document.getElementById("undo").addEventListener("click", undoNumber);
        document.getElementById("notes").addEventListener("click", takingNotes);
    }

    function takingNotes() {
        // called by the eventListener
    }

    function cellScrap() {
        // to remove the deleted cell from board_inserted
    }

    function undoNumber() {

        if (undoArr.length !== 0) {

            var history = undoArr.pop();

            var _new = parseInt(history[0]);
            var _old = parseInt(history[1]);
            var r = parseInt(history[2]);
            var c = parseInt(history[3]);

            var selectedCell = document.getElementById(`c${r}${c}`);

            numberUsageTracker('remove', _new);
            numberUsageTracker('add', _old);

            selectedCell.innerText = _old === 0? '':_old;
            board_unsolved[r][c] = _old;

            Highlight(r,c);
        }
    }

    function mistakeCounter() {
        if (mistakeCount === 2) {
            // alert("You lose");
            document.getElementById("mistakes").innerText = `mistakes: 3/3`;
        } else {
            document.getElementById("mistakes").innerText = `mistakes: ${++mistakeCount}/3`;

        }

    }

    function numberUsageTracker(operation, targetNumber) {
        if(targetNumber <= 0) return;

        if (operation === 'add') numberUsageArr[targetNumber - 1]++;
        else if(operation === 'remove') numberUsageArr[targetNumber - 1]--;
        else return;

        var tmp = document.getElementById(`n${targetNumber}`);

        if (numberUsageArr[targetNumber - 1] === 9) {
            tmp.disabled = true;
            tmp.className = 'numControlDisabled'
            numberSelected = null;
        } else {
            if(tmp.disabled === null || tmp.disabled === true){
                tmp.disabled = false;
                tmp.className = 'numControlEnabled';
            }
        }

    }

    function targetAbutton(i) {
        var header = document.getElementById("findSelectedNumberDiv");
        var btns = header.getElementsByTagName("button");
        return btns[i];

    }

    function toggleSelectedNumbers() {
        //adds an eventListener to all the numbered buttons
        var header = document.getElementById("findSelectedNumberDiv");
        var btns = header.getElementsByTagName("button");
        for (var i = 0; i < btns.length; i++) {

            /*   1- Add Event listener to each number key.  */
            btns[i].addEventListener("click", numberClicked);
        }

    }

    function numberClicked(evt) {
        var _newSelected = parseInt(evt.target.id[1]);

        if(numberSelected === _newSelected){
            document.getElementById(`n${numberSelected}`).className = 'numControlEnabled';
            numberSelected = null;
        }

        else{
            if(numberSelected !== null)
                document.getElementById(`n${numberSelected}`).className = 'numControlEnabled';
            document.getElementById(`n${_newSelected}`).className = 'numSelected';

            numberSelected = _newSelected;
        }

    }

    function toggleNotes() {

        document.getElementsByClassName("notesStyle")[0].addEventListener("click", function () {
            var current = document.getElementsByClassName("notesSelected");

            if (this.classList.contains("notesSelected")) {
                current[0].className = current[0].className.replace("notesSelected", "");
                notes = false;
            } else {
                notes=true;
                this.classList.add("notesSelected");
            }

        });
    }
}())