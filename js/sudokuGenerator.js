function CopyArray(a1, a2) {
    for (let i = 0; i < 9; i++) {
        a2.push([]);
        for (let j = 0; j < 9; j++) {
            a2[i].push(a1[i][j]);
        }
    }
}

function GetRandom(min, max) {
    if (max === undefined)
        max = min === 0 ? 8 : 9;
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function IsValidBox(r, c, board) {
    r = Math.floor(r / 3) * 3;
    c = Math.floor(c / 3) * 3;

    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = r; i < r + 3; i++) {
        for (let j = c; j < c + 3; j++) {
            let tmp = board[i][j];

            if (tmp !== 0 && arr[tmp - 1] !== 0) arr[tmp - 1] = 0;
            else if (tmp !== 0 && arr[tmp - 1] === 0) return false;
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

function Generate() {
    let board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],

        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],

        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    let empty = [];

    function Randomize() {
        let cnt = 0;
        while (cnt < 10) {
            let p1 = GetRandom(0), p2 = GetRandom(0), val = GetRandom(1);

            if (board[p1][p2] === 0) {
                board[p1][p2] = val;
                if (!AllValid(board)) {
                    cnt--;
                    board[p1][p2] = 0;
                }

                cnt++;
            }
        }

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) empty.push(`${i}${j}`);
            }
        }
    }

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

    Randomize();
    Solve(0);

    return board;
}

function ApplyDifficulty(diff, board) {
    let num_solutions = { n: 0 }, cnt = 0;
    let play_board = [], removed_index = [], removed_val = [];
    let left = [], start = 0, end = 80;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            left.push(`${i}${j}`);
        }
    }

    CopyArray(board, play_board);

    if (diff === 'h') diff = 50; else if (diff === 'm') diff = 45; else if (diff === 'e') diff = 40;

    while (cnt < diff && end !== -1) {
        let pos = GetRandom(start, end);
        let p1 = parseInt(left[pos][0]), p2 = parseInt(left[pos][1]);

        removed_val.push(play_board[p1][p2]);
        removed_index.push(`${p1}${p2}`);

        play_board[p1][p2] = 0;

        let tmp_board = [];
        CopyArray(play_board, tmp_board);

        num_solutions.n = 0;
        TryAll(0, tmp_board, removed_index, num_solutions);

        if (num_solutions.n > 1) {
            play_board[p1][p2] = removed_val.pop();
            removed_index.pop();
        }
        else cnt++;

        if (pos !== end) [left[pos], left[end]] = [left[end], left[pos]];
        end--;
    }

    return [play_board, removed_index];
}

function TryAll(index, tmp_board, removed_index, num_solutions) {
    if (index === removed_index.length) {
        num_solutions.n++;
        return;
    }

    let r = parseInt(removed_index[index][0]), c = parseInt(removed_index[index][1]);

    for (let i = 1; i < 10; i++) {
        tmp_board[r][c] = i;

        let valid = IsValid(r, c, tmp_board);

        if (valid) {
            TryAll(index + 1, tmp_board, removed_index, num_solutions);
            if (num_solutions.n > 1) return;
        }
    }

    tmp_board[r][c] = 0;
}

function Play(diff) {
    let board = Generate();
    let unsolved = ApplyDifficulty(diff, board);

    return [board, unsolved]
}
