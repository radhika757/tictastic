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

    xplayer.style.color = xColor;
    oplayer.style.color = oColor;

    // Remove previous styles
    xplayer.style.backgroundColor = '';
    xplayer.style.color = '';
    oplayer.style.backgroundColor = '';
    oplayer.style.color = '';

    // Apply highlight to the current player
    if (currentMark === 'X') {
        xplayer.style.backgroundColor = activeBg;
        xplayer.style.color = activeText;
        oplayer.style.backgroundColor = '';
        oplayer.style.color = '';
    } else {
        oplayer.style.backgroundColor = activeBg;
        oplayer.style.color = activeText;
        xplayer.style.backgroundColor = '';
        xplayer.style.color = '';
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
        cell.style.border = `2px solid ${cellBorder}`;
        cell.style.backgroundColor = cellBg; 
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

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return cells[a].classList.contains('occupied') && 
               cells[b].classList.contains('occupied') && 
               cells[c].classList.contains('occupied') &&
               cells[a].textContent === cells[b].textContent &&
               cells[a].textContent === cells[c].textContent;
    });
}
// Function to check for a draw
function checkDraw() {
    return [...cells].every(cell => cell.classList.contains('occupied'));
}
   
// Function for resetting the game
function resetGame() {
    cells.forEach((cell) => {
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
            }
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
});
