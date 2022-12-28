document.body.onload = BodyLoad;

var EMPTY = '#e3e3e3', NORMAL = '#207bff', ERROR = '#fc4e4e',
    H_EMPTY = '#d0c4e8', H_AREA = '#7d4efc', H_CELL = '#00e8f2', H_OCC = '#7a49a5',
    //write
    CellWritten = '#ff6e31',
    numberIsDone = '#579bb1'
wrongNumber = '#ff597B'
    ;



//todo: Karim should erase elements from board_inserted
// note: If no element in board_inserted == 0 , then "YOU WIN"
var board_solved, board_unsolved, board_inserted;
var numberSelected = null;
var numberUsageArr = [], undoArr = [];
var mistakeCount = 0;

/* 1-  this will insert each tile id automatically when the board is generated. 
    we could have done this manually, but this is better. 
*/

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
    board_inserted = game[2];


}

function BodyLoad() {
    SetIds();
    SetCellOnClick();
    BuildBoard('e');
    SetSudoku();

    toggleSelectedNumbers();
    toggleNotes();
    resetNumberUsage();
    eventListenerCall();

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

    console.log(evt.target);
    console.log(evt.target.id[1], evt.target.id[2]);


    /* the id is a string, which can be considered an array of characters.
        our ID format is -- cij 
        so to get the second char we use id[1] --> row
        so to get the third char we use id[2] --> column
        then we transform it from string to integer, to use it as an array index.
         */
    var r = parseInt(evt.target.id[1]), c = parseInt(evt.target.id[2]);




    //Kareem if erase is on

    /* note: I think I need to make the eraser toggled also for karim ?  */

    //call to highlight if needed
    Highlight(r, c);
    //to check if input is wrong solution wise, and highlight call
    //HighlightSolutionError(r,c);
    //to check if the input caused a game rule violation call
    //HighlightRuleError(); //NOT YET WORKING

    //Raouf write -- moved it below as the highlight was overriding the final cell background color. 

    //writes nothing if numberSelected is 0 ==> (no number is toggled)
    if (numberSelected)
        cellWrite(r, c);

}



// document.getElementsByClassName('numControl')[1].addEventListener('click', function () { console.log("1 was pressed") });

function cellWrite(r, c, currentNumber) {

    var selectedCell = document.getElementById(`c${r}${c}`);

    // if (currentNumber) was un-defined as an input --> then we set a value to it
    if (!currentNumber)
        currentNumber = numberSelected;

    //Todo: Karim should input the Hint values into the board_unsolved

    /* the first if statement makes sure that 
        1- the cell is empty in board_unsolved
        2- the same number is not already in the cell. */

        //lesson: as long as the if statment condition was not met 
        
    if ((board_unsolved[r][c] == 0) && (currentNumber !== board_inserted[r][c]) && numberUsageArr[currentNumber - 1] !== 9) {

        
        numberUsageTracker('add', currentNumber);

        if (currentNumber !== board_solved[r][c]) {

            mistakeCounter();
            selectedCell.innerText = currentNumber;
            selectedCell.style.backgroundColor = wrongNumber;

            //todo: Karim should call the numberUsageTracker and remove a decrese the count
            // numberUsageTracker('remove', numberSelected);

            board_inserted[r][c] = currentNumber;
            undoArr.push(`${currentNumber}${r}${c}w`);
        }
        else {
            selectedCell.innerText = currentNumber;
            selectedCell.style.backgroundColor = CellWritten;

            board_inserted[r][c] = currentNumber;
          
            undoArr.push(`${currentNumber}${r}${c}w`);

        }

        console.log(numberUsageArr); // testing
        console.log(undoArr); // testing

    }
}

//lesson:  here we group all the event listeners 
function eventListenerCall() {
    document.getElementById("undo").addEventListener("click", undoNumber);
    document.getElementById("notes").addEventListener("click", takingNotes);
    // document.getElementById("eraser").addEventListener("click",EraseNumber);
    // document.getElementById("idea").addEventListener("click",EraseNumber);


}

function takingNotes() {
    // called by the eventListener
}

function cellScrap() {
    // to remove the deleted cell from board_inserted
}



function undoNumber() {


    if (undoArr.length !== 0) {

        var indexOfLastElement = undoArr.length - 1;

        var number = parseInt(undoArr[indexOfLastElement][0]);
        var r = parseInt(undoArr[indexOfLastElement][1]);
        var c = parseInt(undoArr[indexOfLastElement][2]);
        var lastOperation = undoArr[indexOfLastElement][3];

        var selectedCell = document.getElementById(`c${r}${c}`);

        /*      w ---> write  ... r ---> remove
         if last operation was 'write' === then to undo it we delete the cell.
    
        */

        if (lastOperation == 'w') {
            selectedCell.innerText = '';
            selectedCell.style.backgroundColor = EMPTY;

            board_inserted[r][c] = 0;
            numberUsageTracker('remove', number);
            console.log("number should be decresed by the tracker ?");
            undoArr.pop();

        }

        /*   todo: Karim should include this line in the erase function, so the 'r'
                    would activate the re-writing of deleted element
        undoArr.push(`${numberSelected}${r}${c}r`); 
         */
        if (lastOperation == 'r') {
            cellWrite(r, c, number);
            undoArr.pop();
        }


    }



}


function mistakeCounter() {



    if(mistakeCount === 2)
    {
        // alert("You lose"); 
        document.getElementById("mistakes").innerText = `mistakes: 3/3`;
    }
    else
    {
        document.getElementById("mistakes").innerText = `mistakes: ${++mistakeCount}/3`;

    }

}

//todo: Karim should call if the eraser is used. 
function numberUsageTracker(operation, targetNumber) {


    /* operation keywords-- 'add' --- 'remove'
    array is from 0 to 8 , while our numbering is from 1 to 9 */


    if (operation == 'add') {
        if (numberUsageArr[targetNumber - 1] >= 8) {
            targetAbutton(targetNumber - 1).style.backgroundColor = numberIsDone;
            numberUsageArr[targetNumber - 1]++;
            console.log("number is done ");
            return false;
        }
        else {
            numberUsageArr[targetNumber - 1]++;
            return true
        }
    }

    if (operation == 'remove') {
        numberUsageArr[targetNumber - 1]--;
        targetAbutton(targetNumber - 1).style.backgroundColor = '';
        return true;
    }



    // resetNumberUsage();

}

//todo: I think I should put it in the onload
function resetNumberUsage() {
    //called only once during onload()
    for (var i = 0; i < 9; i++)
        numberUsageArr[i] = 0;
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

function numberClicked() {
    var current = document.getElementsByClassName("numSelected");

    /* 3- we check first if we the same key is pressed , if true -- we remove the selection
     if false --> we   */

    // console.log(this.classList.contains("numSelected")); // testing

    if (this.classList.contains("numSelected")) {
        current[0].className = current[0].className.replace("numSelected", "");
        // console.log("same Btn were selected")

        /* note: This is important to make sure nothing is stored when selecting an already selected number */
        numberSelected = 0;
    }
    else {
        if (current.length > 0) {
            current[0].className = current[0].className.replace("numSelected", "");
            this.classList.add("numSelected");
        }
        else {
            this.classList.add("numSelected");
        }
        numberSelected = parseInt(this.value);
    }

}







function toggleNotes() {

    document.getElementsByClassName("notesStyle")[0].addEventListener("click", function () {
        var current = document.getElementsByClassName("notesSelected");

        if (this.classList.contains("notesSelected")) {
            current[0].className = current[0].className.replace("notesSelected", "");
            // console.log("notesBtnOff")
        }
        else {
            this.classList.add("notesSelected");
        }

    });
}


/* create a 9 elements array and increase by 1 or decrease based on inputing elements */


/*  
        //todo:  General notes //lesson:


    // const button = document.querySelector('#notes');

    // button.addEventListener('click', () => {
    //     button.classList.toggle('active');
    //     console.log("clicked")
    // });



    // document.getElementById(`c${0}${0}`).addEventListener("click",function (){



    //     document.getElementById(`c${0}${0}`).innerText = board_solved[0][0];

    // })




    // document.getElementById(`c${0}${0}`).innerText = board_unsolved[0][0];

    /* note: 
    
        We would need to create more arrays to take care of special cases. 
        
        given = []  -- stores the values from the unsolved array 
                        + any value that we get from the hint 
                        
        -- a) anything written in that array, cannot be overwritten by other values
            b) cannot be deleted. 
            
        empty = [] -- stored the empty spaces that we can write in.    
        
        */


/* research: Raouf's Task summary
 
 
        focus on the line at the bottom ... 
        make every button can:
                1- write
                2- delete
                3- notes

        what your function calls at the end, only matters later on. 



        before writing on the spot: 

            1- check if the tile has number or empty 
            2- if it has a number, is it written by me before OR (it was given by me or the hint)
            3- if it was written by me, then we replace it by the number I pressed. 


            remember: if the button is clicked 9 times ... then  it should be grey out 

            else ==> do nothing. 


    for the (undo button) ==> it's going to be a stack ---
            we store the "ij" at the end
            and if we undo, we return the value from the end of the stack again. 

            mistakes are not included ?

            "ijn"  i,j  and n==> the number 

            and we use pop() and push() with that encoding. 

            then we call the write(i,j,n), to write the number again.
            and writing this time doesn't count as a mistake if I had a mistake before !! 

            that's what mistakes are not included meant 

            if I want to undo the number I just wrote...

            then I send write (i,j,"") -- an empty cell, to clear what was written.



            note: Inside write() , mistake() is called. 

            so handle that it doesn't call mistake() if we are in the undo mode. 
        

function write() {

    /* var empty ["11","12", ] 
        var given ["03", "14" ]  
        -- we split them to get the indcies 
    we compare the values with the original board solution 

            given.push(`${i} ${j}`)


    note: only one from the eraser or the number buttons can be pressed at a time.. 

            but we can be pressing the pen and a number. 


    for the bottom row --- 

    document.getElementByClassName("toggle")[0].onclick(toggle)
    
    all of them have the same class for toggle 
    but different id's ---- n1,n2,n3
    function toggle ()
    {
            event.target ===> should return the button that has been pressed !!! .
    }

    use an even/t
    
    board_unsolved[i][j] == board_solved[i][j]

}

*/