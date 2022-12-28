
/* developer notes: 

1- sudoku uses an alogrithm called (backTracking) 

*/ 

// this is related to
function Copy2DArray(src, dest) {
    for (let i = 0; i < 9; i++) {
        // 1- it adds an array of 1D in each array element
        dest.push([]);
        for (let j = 0; j < 9; j++) {
            // 2- we fill each array with the results coming from the source elements 
            dest[i].push(src[i][j]);
        }
    }
}


/* 1- Get random number   */
function GetRandom(min, max) {
    if (max === undefined)

    /* if max = undefined , this means we entered only one input GetRandom(0) 
        this will set the min to (0) -- 
        if it's 0  ====> max = 8 
        if it's (any number)  ====> max = 9 
         */
        max = min === 0 ? 8 : 9;

        /* this formula of multiplying math.random() by those values 
            return numbers in range ---- (including the max and min values.)
            
            https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript

            0 to 8  --- we are generating numbers for the array index
            1 to 9  --- we are generating numbers for the suduko numbers
            
            */
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/* 2- we check the sudoku numbers of the board that we generated. 
        a- first we created IsValid() to check one box and connected it to allValid() to check the 9 boxes 
            to check the whole border. 
        b- then each column
        c- each row 
        d- then we checked that the three of them  ===>  IsValidRow   IsValidCol  AllValid()

        return true---- so we move on. 
    */


 //#region checkNumbers
function IsValidBox(r, c, board) {

    /* we divde by (3) to check it's result with math.floor(), it it will result in decimals,
        then floor will turn it into an it, then we multiply the number again. */
    r = Math.floor(r / 3) * 3;
    c = Math.floor(c / 3) * 3;

    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    /* everytime we will be sending the starting (row = r) and (column = c) indecies of the
        9x9 box we are checking it's values. 
        we add (+3) to whatever starting points we get. 
    
        so for r =
    */

    for (let i = r; i < r + 3; i++) {

        for (let j = c; j < c + 3; j++) {

            let tmp = board[i][j];

            /* note: still not understanding what happend here 


            I think the (-1) because we want to use a sudoku number as an index for our array. 


                    Ex:  if the box element at those (i,j) indecies returns ===> 5  
                    so tmp = 5 
                    
                    arr[5-1] = arr[4] = 5 
                    
                    we satisfy this , so we put the element to 0 === > arr[4] = 0 

                    this will keep setting the arr elements to 0 

                    research: understand more 
                    
                    */


            if (tmp !== 0 && arr[tmp - 1] !== 0) 
            arr[tmp - 1] = 0;

            /* if it satisfies this statement, then it means:
            it not zero and    */
            else if (tmp !== 0 && arr[tmp - 1] === 0)
            return false;
        }
    }

    return true;
}



function IsValidRow(r, board) {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 9; i++) {
        let tmp = board[r][i];

        if (tmp !== 0 && arr[tmp - 1] !== 0) arr[tmp - 1] = 0;
        else if (tmp !== 0 && arr[tmp - 1] === 0) return false;
    }

    return true;
}

function IsValidCol(c, board) {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 9; i++) {
        let tmp = board[i][c];

        if (tmp !== 0 && arr[tmp - 1] !== 0) arr[tmp - 1] = 0;
        else if (tmp !== 0 && arr[tmp - 1] === 0) return false;
    }

    return true;
}

function IsValid(r, c, board) {
    return IsValidBox(r, c, board) && IsValidRow(r, board) && IsValidCol(c, board);
}

function AllValid(board) {
    let i = 0;
    while (i < 9 && IsValidRow(i, board) && IsValidCol(i, board)) i++;

    return i === 9 &&
        IsValidBox(0, 0, board) &&
        IsValidBox(0, 3, board) &&
        IsValidBox(0, 6, board) &&
        IsValidBox(3, 0, board) &&
        IsValidBox(3, 3, board) &&
        IsValidBox(3, 6, board) &&
        IsValidBox(6, 0, board) &&
        IsValidBox(6, 3, board) &&
        IsValidBox(6, 6, board);
}

//#endregion


/* 3- the board is generated and solved.  */
function Generate() {
    var board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],

        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],

        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ], empty = [];


    // this function throw 10 numbers randomly each time at the spaces in one box. 
    function Randomize() {
        var count = 0;
        while (count < 10) {
            let p1 = GetRandom(0), p2 = GetRandom(0), val = GetRandom(1);

            if (board[p1][p2] === 0) {
                board[p1][p2] = val;
                if (!AllValid(board)) {
                    count--;
                    board[p1][p2] = 0;
                }

                count++;
            }
        }

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) empty.push(`${i}${j}`);
            }
        }
    }

    
    // this solves the board using backTracking
    function Solve(index) {
        if (index === empty.length) return true;
        let r = parseInt(empty[index][0]), c = parseInt(empty[index][1]);

        for (let i = 1; i < 10; i++) {
            board[r][c] = i;

            let valid = IsValid(r, c, board);

            if (valid && Solve(index + 1)) return true;
        }

        board[r][c] = 0;

        return false;
    }


    // These are the functions call.. 
    // solve is 0 
    Randomize();
    Solve(0);


    // then we return the solved board. 
    console.log(board); // I used this for viewing the solved board.
 console.log ( empty); 
    return board;
}

/* 4- here we apply the diffucalty and generated the playable board.  */
function ApplyDifficulty(diff, board) {
    if (diff === 'h') diff = 50;
    else if (diff === 'm') diff = 45;
    else diff = 40;

    var num_solutions = { n: 0 }, count = 0, end = 80,

    /*  here we have the play_board array 
        which has the the board after we removed elements based on the required difficulity. 

        the more you remove elements.... the higher the diffuclity 
        Ex:   diif = "hard" == then we remove (50 elements)

        it takes time in removing elements as it has to check that there will be no other solution available.
        
    */
        play_board = [], removed_index = [], removed_val = [], given = [];

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            given.push(`${i}${j}`);
        }
    }

    Copy2DArray(board, play_board);


    while (count < diff && end !== -1) {
        let pos = GetRandom(0, end);
        let p1 = parseInt(given[pos][0]), p2 = parseInt(given[pos][1]);

        if (pos !== end)
            [given[pos], given[end]] = [given[end], given[pos]];
        end--;

        removed_val.push(play_board[p1][p2]);
        removed_index.push(`${p1}${p2}`);

        play_board[p1][p2] = 0;

        num_solutions.n = 0;
        TryAll(0, play_board, removed_index, num_solutions);

        if (num_solutions.n > 1) {
            play_board[p1][p2] = removed_val.pop();
            removed_index.pop();
        }
        else count++;
    }

    return play_board;
}


// TryAll is called inside ApplyDiffuctly as a check -- need to understand more. 
function TryAll(index, board, removed_index, num_solutions) {
    if (index === removed_index.length) {

        /* num_solutions is a class, because we needed a number that we can acumlate on... 
            and we didn't want to make it global.  */
        num_solutions.n++;
        return;
    }

    var r = parseInt(removed_index[index][0]), c = parseInt(removed_index[index][1]);

    for (let i = 1; i < 10; i++) {
        board[r][c] = i;

        if (IsValid(r, c, board)) {
            TryAll(index + 1, board, removed_index, num_solutions);

            if (num_solutions.n > 1) {
                board[r][c] = 0;
                return;
            }
        }
    }

    board[r][c] = 0;
}


/* 5- When the play button is pressed. this function will be called 
        it will generate both the solution board and the playable board.
        they are returned in a 1D array , but each of the boards are 2D arrays   */
function Play(diff) {
    var solved = Generate();
    var unsolved = ApplyDifficulty(diff, solved);

    var insert = []; 
    Copy2DArray(unsolved, insert);

    return [solved, unsolved,insert];
}
