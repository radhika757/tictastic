const themeSelector = document.getElementById('theme-selector');
const mainContainer = document.getElementById('main-container');
const resetButton = document.getElementById('reset-button');
const cells = document.querySelectorAll('.cells'); 
const tabsContainer = document.getElementById('tabs-container');
const tabsTriggers = document.querySelectorAll('.tabs-trigger');
const xplayer = document.getElementById('x-player');
const oplayer = document.getElementById('o-player');
const player1 = document.getElementById('play1');
const player2 = document.getElementById('play2');
const turnIndicator = document.getElementById('turn-indicator');
let currentPlayerName = "Player 1"
let gameMode = 'human'; // 'human' for 2 players, 'computer' for vs computer
let gameOver = false;
let isComputerTurn = false;
let currentPlayer = 'human'; // Default to human player
let currentMark = 'X'; // Start with X

// Function to set the theme of current player.
function setCurrentPlayerTheme() {
    const theme = themeSelector.value;
    const rootStyles = getComputedStyle(document.documentElement);
    const xColor = rootStyles.getPropertyValue(`--${theme}XColor`).trim();
    const oColor = rootStyles.getPropertyValue(`--${theme}OColor`).trim();

    // Remove previous background highlights only, NOT the color!
    xplayer.style.backgroundColor = '';
    oplayer.style.backgroundColor = '';

    // Set the color for X and O player labels
    xplayer.style.color = xColor;
    oplayer.style.color = oColor;

    // Highlight the current player
    const activeBg = '#222'; // or use a theme variable if you have one
    const activeText = '#fff';

    if (currentMark === 'X') {
        xplayer.style.backgroundColor = activeBg;
        xplayer.style.color = activeText;
        oplayer.style.backgroundColor = '';
        oplayer.style.color = oColor;
    } else {
        oplayer.style.backgroundColor = activeBg;
        oplayer.style.color = activeText;
        xplayer.style.backgroundColor = '';
        xplayer.style.color = xColor;
    }
}

// Function to apply a theme
function applyTheme(theme) {      
    const rootStyles = getComputedStyle(document.documentElement);    
    // Get CSS variable values for the selected theme
    const boardBg = rootStyles.getPropertyValue(`--${theme}BoardBg`).trim();    
    const buttonBg = rootStyles.getPropertyValue(`--${theme}ButtonBg`).trim();
    const cellBorder = rootStyles.getPropertyValue(`--${theme}CellBorder`).trim(); 
    const cellBg = rootStyles.getPropertyValue(`--${theme}CellBg`).trim();
    const buttonHoverBg = rootStyles.getPropertyValue(`--${theme}ButtonHoverBg`).trim();
    
    // Apply styles dynamically
    mainContainer.style.backgroundColor = boardBg;
    // mainContainer.style.color = cellBg;

    // update the reset button style
    resetButton.style.backgroundColor = buttonBg;
    resetButton.onmouseover = () => (resetButton.style.backgroundColor = buttonHoverBg);
    resetButton.onmouseout = () => (resetButton.style.backgroundColor = buttonBg);

      // Update the cell styles
    cells.forEach((cell) => {
    // Only update background if not currently highlighted as a win
    if (!cell.classList.contains('win')) {
        cell.style.backgroundColor = cellBg;
    }
    cell.style.border = `2px solid ${cellBorder}`;
});
}

// Function to handle tab change
function handleTabChange(selectedValue) {
    gameMode = selectedValue;
    tabsTriggers.forEach((tab) => {
        if (tab.dataset.value === selectedValue) {
            tab.classList.add('bg-black', 'text-white'); // Active tab styles
            tab.classList.remove('bg-gray-200', 'dark:bg-gray-700');
            tab.style.backgroundColor = '#000'; // Ensure active is black
            tab.style.color = '#fff';
        } else {
            tab.classList.remove('bg-black', 'text-white', 'bg-gray-200', 'dark:bg-gray-700');
            tab.style.backgroundColor = '#303030'; // Inactive background
            tab.style.color = '#686868';           // Inactive text
        }
    });

    // Perform actions based on the selected tab
    if (selectedValue === 'human') {
        player1.innerText = 'Player 1';
        player2.innerText = 'Player 2';
        currentPlayerName = "Player 1";
        currentPlayer = 'human';
        // Add functionality for 2 Players mode
    } else if (selectedValue === 'computer') {
        // Functionality for Computer mode
         player1.innerText = 'You';
        player2.innerText = 'Computer';
        currentPlayer = 'human';
    }
    resetGame();
    updateTurnIndicator(); 
}

// Function to check for a win
function checkWin() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            cells[a].classList.contains('occupied') &&
            cells[b].classList.contains('occupied') &&
            cells[c].classList.contains('occupied') &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent
        ) {
            return combination; // Return the winning cells
        }
    }
    return null;
}
// Function to check for a draw
function checkDraw() {
    return [...cells].every(cell => cell.classList.contains('occupied'));
}
   
// Function for resetting the game
function resetGame() {
    cells.forEach((cell) => {
        cell.classList.remove('win');
        cell.style.backgroundColor = ''; 
        cell.classList.remove('occupied');
        cell.textContent = '';
        cell.style.pointerEvents = 'auto'; // Re-enable clicks
    });
    gameOver = false;
    currentMark = 'X'; // Reset to X
    isComputerTurn = false; // Reset computer turn
    currentPlayer = 'human'; // Reset to human player
    updateTurnIndicator();
}

function highlightWinningCells(combo) {
    const theme = themeSelector.value;
    const rootStyles = getComputedStyle(document.documentElement);
    const winHighlight = rootStyles.getPropertyValue(`--${theme}WinHighlight`).trim();

    combo.forEach(index => {
        cells[index].style.backgroundColor = winHighlight;
    });
}

// handle cell click 
function handleCellClick(event) {
    const theme = themeSelector.value;
    const rootStyles = getComputedStyle(document.documentElement);
    const xColor = rootStyles.getPropertyValue(`--${theme}XColor`).trim();
    const oColor = rootStyles.getPropertyValue(`--${theme}OColor`).trim();
    
    const cell = event.target;
    if (cell.classList.contains('cells')) {
      // Return if the cell is already occupied or if the game is 
      // over or if its the computer's turn and computer is playing
         if (
            cell.classList.contains('occupied') ||
            gameOver ||
            (gameMode === 'computer' && isComputerTurn)
        ) {
            return;
        }
        // Mark the cell as occupied
        cell.classList.add('occupied');
        cell.textContent = currentMark;
        cell.style.pointerEvents = 'none'; // Disable further clicks on this cell
        cell.style.color = currentMark === 'X' ? xColor : oColor;
        // Check for a win or draw
        if (checkWin()) {
            gameOver = true;
        } else if (checkDraw()) {
            gameOver = true;
        } else {
          // Switch turns
            if (gameMode === 'human') {
                currentMark = currentMark === 'X' ? 'O' : 'X';
                 currentPlayerName = currentPlayerName === 'Player 1' ? 'Player 2' : 'Player 1';
                updateTurnIndicator();
            } else if (gameMode === 'computer') {
                currentMark = currentMark === 'X' ? 'O' : 'X';
                isComputerTurn = !isComputerTurn;
                currentPlayer = currentPlayer === 'human' ? 'computer' : 'human';
                updateTurnIndicator();
                // computer move logic
                
                // short delay for computer move 
                setTimeout(() => {
                    makeComputerMove();
                }, 1000)
            }
        }
        const winCombo = checkWin();
if (winCombo) {
    gameOver = true;
    highlightWinningCells(winCombo);
    // ...any other win logic
}
    }
}

function updateTurnIndicator() {
    if (gameMode === 'human') {
        turnIndicator.innerText = currentPlayerName === 'Player 1'
            ? "Player 1's Turn"
            : "Player 2's Turn";
    } else if (gameMode === 'computer') {
        turnIndicator.innerText = currentPlayer === 'human'
            ? "Your Turn"
            : "Computer's Turn";
    }
}

function setCurrentPlayerTheme() {
    const theme = themeSelector.value;
    const rootStyles = getComputedStyle(document.documentElement);
    const xColor = rootStyles.getPropertyValue(`--${theme}XColor`).trim();
    const oColor = rootStyles.getPropertyValue(`--${theme}OColor`).trim();

    // Remove previous background highlights only, NOT the color!
    xplayer.style.backgroundColor = '';
    oplayer.style.backgroundColor = '';

    // Set the color for X and O player labels
    xplayer.style.color = xColor;
    oplayer.style.color = oColor;

    // Highlight the current player
    const activeBg = '#222'; // or use a theme variable if you have one
    const activeText = '#fff';

    if (currentMark === 'X') {
        xplayer.style.backgroundColor = activeBg;
        xplayer.style.color = activeText;
        oplayer.style.backgroundColor = '';
        oplayer.style.color = oColor;
    } else {
        oplayer.style.backgroundColor = activeBg;
        oplayer.style.color = activeText;
        xplayer.style.backgroundColor = '';
        xplayer.style.color = xColor;
    }
}

function makeComputerMove() {
    if (gameOver) return;

    // Find all empty cells
    const emptyCells = Array.from(cells).filter(cell => !cell.classList.contains('occupied'));
    if (emptyCells.length === 0) return;

    // Pick a random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    // Get theme colors
    const theme = themeSelector.value;
    const rootStyles = getComputedStyle(document.documentElement);
    const oColor = rootStyles.getPropertyValue(`--${theme}OColor`).trim();

    // Mark the cell for the computer
    randomCell.classList.add('occupied');
    randomCell.textContent = 'O';
    randomCell.style.pointerEvents = 'none';
    randomCell.style.color = oColor;

    // Check for win/draw
    if (checkWin()) {
        gameOver = true;
        updateTurnIndicator();
        return;
    } else if (checkDraw()) {
        gameOver = true;
        updateTurnIndicator();
        return;
    }

    // Switch back to human
    currentMark = 'X';
    isComputerTurn = false;
    currentPlayer = 'human';
    updateTurnIndicator();
}

// Event Listener for setting the current player theme
xplayer.addEventListener('click', () => {
    currentMark = 'X';
    currentPlayer = 'human';
    setCurrentPlayerTheme();
});

oplayer.addEventListener('click', () => {
    currentMark = 'O';
    currentPlayer = 'human';
    setCurrentPlayerTheme();
});

//Event listener for reset button
resetButton.addEventListener('click', () => {
    resetGame();
});

// Event listeners to cells
cells.forEach((cell) => {
    cell.addEventListener('click', handleCellClick);
    cell.style.fontSize = '35px'; 
    cell.style.fontWeight = '900';
}
);

  // Add event listeners to tabs
tabsTriggers.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selectedValue = tab.dataset.value;
      handleTabChange(selectedValue);
    });
  });
  
  // Set default tab on page load
  document.addEventListener('DOMContentLoaded', () => {
    const theme = themeSelector.value;
    const rootStyles = getComputedStyle(document.documentElement);
    const xColor = rootStyles.getPropertyValue(`--${theme}XColor`).trim();
    const oColor = rootStyles.getPropertyValue(`--${theme}OColor`).trim();
    xplayer.style.color = xColor;
    oplayer.style.color = oColor;
    handleTabChange('human'); // Default to "2 Players" mode
    const selectedTheme = themeSelector.value; // auto-grabs the selected one
    applyTheme(selectedTheme);
    updateTurnIndicator();
  });

// Listen for changes in the select dropdown
themeSelector.addEventListener("change", (event) => {
    const selectedTheme = event.target.value;
    applyTheme(selectedTheme);
    setCurrentPlayerTheme();

    // Update color of all occupied cells
    const rootStyles = getComputedStyle(document.documentElement);
    const xColor = rootStyles.getPropertyValue(`--${selectedTheme}XColor`).trim();
    const oColor = rootStyles.getPropertyValue(`--${selectedTheme}OColor`).trim();
    cells.forEach((cell) => {
        if (cell.classList.contains('occupied')) {
            cell.style.color = cell.textContent === 'X' ? xColor : oColor;
        }
    });
});
