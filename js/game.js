(function () {
    var EMPTY = '#e3e3e3', NORMAL = '#207bff', ERROR = '#fc4e4e',
        H_EMPTY = '#d0c4e8', H_AREA = '#7d4efc', H_CELL = '#00e8f2', H_OCC = '#7a49a5',
        //write
        CellWritten = '#ff6e31',
        numberIsDone = '#579bb1',
        wrongNumber = '#ff597B';

    var EMPTY = 'rgb(227, 227, 227)', NORMAL = 'rgb(32, 123, 255)', ERROR = 'rgb(252, 78, 78)',
        H_EMPTY = 'rgb(208, 196, 232)', H_AREA = 'rgb(125, 78, 252)', H_CELL = 'rgb(0, 232, 242)', H_OCC = 'rgb(123, 73, 166)';

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

            function BuildBoard(diff) {
                var game = Play(diff);
                board_solved = game[0];
                board_unsolved = game[1];

            }

            function BodyLoad() {
                SetIds();
                SetCellOnClick();
                BuildBoard('h');
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

                        function Highlight(r, c, highlightMistake, highlightDuplicate) {
                            var n = board_unsolved[r][c];
                            ResetHighlight();
                            if (highlightDuplicate) HighlightRuleError();
                            if (highlightMistake) HighlightSolutionError(r, c);
                            HighlightBox(r, c);
                            HighlightRowCol(r, c);
                            if (n !== 0) HighlightNumber(n);

                            HighlightRowCol(r, c);

                            /* 4- if there is already a number in that cell, then we highlight all the other identical numbers  */
                            if (n !== 0) HighlightNumber(n);

                            /* 5- at last we highligh the cell itself. */
                            document.getElementById(`c${r}${c}`).style.backgroundColor = H_CELL;
                        }

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

                        //region temporary input method
                        var x = parseInt(prompt());
                        if (x.toString() === 'NaN') return;
                        board_unsolved[r][c] = x;
                        document.getElementById(`c${r}${c}`).innerText = x;
                        //endregion

                        //Kareem if erase is on

                        //call to highlight if needed, last 2 params highlight mistake, highlight duplicate true->on, false -> off
                        Highlight(r, c, false, true);
                    }
