    const rows = 10;
    const cols = 10;

    var playing = false;

    let grid = new Array(rows);
    let nextGrid = new Array(rows);

    var timer;
    const reproductionTime = 150;

    function initializeGrids() {
        for (var i = 0; i < rows; i++) {
            grid[i] = new Array(cols);
            nextGrid[i] = new Array(cols);
        }
    }

    function resetGrids() {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                grid[i][j] = 0;
                nextGrid[i][j] = 0;
            }
        }
    }

    function copyAndResetGrid() {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                grid[i][j] = nextGrid[i][j];
                nextGrid[i][j] = 0;
            }
        }
    }

   
    function initialize() {
        createTable();
        initializeGrids();
        resetGrids();
        setupControlButtons();
    }

    function createTable() {
        var gridContainer = document.getElementById('gridContainer');
        if (!gridContainer) {
            // Throw error
            console.error("Problem: No div for the drid table!");
        }
    var table = document.createElement("table");
    
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {//
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = handleCellClick;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
    }

    function handleCellClick() {
        var rowcol = this.id.split("_");
        var row = rowcol[0];
        var col = rowcol[1];
        
        var classes = this.getAttribute("class");
        if(classes.indexOf("live") > -1) {
            this.setAttribute("class", "dead");
            grid[row][col] = 0;
        } else {
            this.setAttribute("class", "live");
            grid[row][col] = 1;
        }
        
    }

    function updateView() {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var cell = document.getElementById(i + "_" + j);
                if (grid[i][j] == 0) {
                    cell.setAttribute("class", "dead");
                } else {
                    cell.setAttribute("class", "live");
                }
            }
        }
    }

    function setupControlButtons() {
        // COMEÇAR
        const startButton = document.getElementById('start');
        startButton.onclick = startButtonHandler;
        
        // LIMPAR
        const clearButton = document.getElementById('clear');
        clearButton.onclick = clearButtonHandler;
        
        // ALEATÓRIO
        const randomButton = document.getElementById("random");
        randomButton.onclick = handleRandomButton;

        // INSTRUÇÕES
        const helpButton = document.getElementById("bhelp");
        helpButton.onclick = handleHelpButton;

        // FECHAR INSTRUÇÔES
        const closeButton = document.getElementById("bttn");
        closeButton.onclick = handleCloseButton;
    }
    
    function handleHelpButton() {
        const infoBox = document.getElementById("help");

        {infoBox.style.display == 'none' ? infoBox.style.display !== 'none' : infoBox.style.display = 'block'}

        setInterval(handleHelpButton, 1000)
    }

    function handleCloseButton() {

        const closeBox = document.getElementById("help");

        {closeBox.style.opacity = 1 ? closeBox.style.opacity = 0 && closeBox.style.display == 'none' : closeBox.style.opacity = 1}
        
    }

    function handleRandomButton() {
        if (playing) return;
        clearButtonHandler();
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var isLive = Math.round(Math.random());
                if (isLive == 1) {
                    var cell = document.getElementById(i + "_" + j);
                    cell.setAttribute("class", "live");
                    grid[i][j] = 1;
                }
            }
        }
    }

    function clearButtonHandler() {
        console.log("Clear the game: stop playing, clear the grid");
        
        playing = false;
        var startButton = document.getElementById('start');
        startButton.innerHTML = "Start";    
        clearTimeout(timer);
        
        var cellsList = document.getElementsByClassName("live");

        var cells = [];
        for (var i = 0; i < cellsList.length; i++) {
            cells.push(cellsList[i]);
        }
        
        for (var i = 0; i < cells.length; i++) {
            cells[i].setAttribute("class", "dead");
        }
        resetGrids;
    }

    function startButtonHandler() {
        if (playing) {
            console.log("Pause the game");
            playing = false;
            this.innerHTML = "Continue";
            clearTimeout(timer);
        } else {
            console.log("Continue the game");
            playing = true;
            this.innerHTML = "Pause";
            play();
        }
    }

    function play() {
        computeNextGen();
        
        if (playing) {
            timer = setTimeout(play, reproductionTime);
        }
    }

    function computeNextGen() {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                applyRules(i, j);
            }
        }

        copyAndResetGrid();
        
        updateView();
    }



    function applyRules(row, col) {
        var numVizinhos = countNeighbors(row, col);
        if (grid[row][col] == 1) {
            if (numVizinhos < 2) {
                nextGrid[row][col] = 0;
            } else if (numVizinhos == 2 || numVizinhos == 3) {
                nextGrid[row][col] = 1;
            } else if (numVizinhos > 3) {
                nextGrid[row][col] = 0;
            }
        } else if (grid[row][col] == 0) {
                if (numVizinhos == 3) {
                    nextGrid[row][col] = 1;
                }
            }
        }
        
    function countNeighbors(row, col) {
        var count = 0;
        if (row-1 >= 0) {
            if (grid[row-1][col] == 1) count++;
        }
        if (row-1 >= 0 && col-1 >= 0) {
            if (grid[row-1][col-1] == 1) count++;
        }
        if (row-1 >= 0 && col+1 < cols) {
            if (grid[row-1][col+1] == 1) count++;
        }
        if (col-1 >= 0) {
            if (grid[row][col-1] == 1) count++;
        }
        if (col+1 < cols) {
            if (grid[row][col+1] == 1) count++;
        }
        if (row+1 < rows) {
            if (grid[row+1][col] == 1) count++;
        }
        if (row+1 < rows && col-1 >= 0) {
            if (grid[row+1][col-1] == 1) count++;
        }
        if (row+1 < rows && col+1 < cols) {
            if (grid[row+1][col+1] == 1) count++;
        }
        return count;
    }

// Start everything
window.onload = initialize;