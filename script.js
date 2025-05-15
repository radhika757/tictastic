const themeSelector = document.getElementById('theme-selector');
const mainContainer = document.getElementById('main-container');
const resetButton = document.getElementById('reset-button');
const cells = document.querySelectorAll('.cells'); 
const tabsContainer = document.getElementById('tabs-container');
const tabsTriggers = document.querySelectorAll('.tabs-trigger');
let gameMode = 'human'; // 'human' for 2 players, 'computer' for vs computer
let gameOver = false;
let isComputerTurn = false;
let currentPlayer = 'human'; // Default to human player
let currentMark = 'X'; // Start with X

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
    // cells.onmouseover = () => (cells.style.borderColor = buttonHoverBg);
    // cells.onmouseout = () => (cells.style.borderColor = buttonBg);
}

// Function to handle tab change
function handleTabChange(selectedValue) {
    gameMode = selectedValue;
    tabsTriggers.forEach((tab) => {
      if (tab.dataset.value === selectedValue) {
        tab.classList.add('bg-blue-500', 'text-white'); // Active tab styles
        tab.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
      } else {
        tab.classList.remove('bg-blue-500', 'text-white');
        tab.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
      }
    });
  
    // Perform actions based on the selected tab
    if (selectedValue === 'human') {
      console.log('2 Players mode selected');
      // Add functionality for 2 Players mode
    } else if (selectedValue === 'computer') {
      console.log('vs Computer mode selected');
      // Add functionality for vs Computer mode
    }
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
   
// handle cell click 
function handleCellClick(event) {
    const cell = event.target;
    if (cell.classList.contains('cells')) {
        console.log('Cell clicked:', cell);
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
       console.log(currentMark, 'currentMark');
        cell.style.pointerEvents = 'none'; // Disable further clicks on this cell

        // Check for a win or draw
        if (checkWin()) {
            console.log(`${currentPlayer} wins!`);
            alert(`${currentPlayer} wins!`);
            gameOver = true;
        } else if (checkDraw()) {
            alert('It\'s a draw!');
            gameOver = true;
        } else {
          // Switch turns
            if (gameMode === 'human') {
                currentMark = currentMark === 'X' ? 'O' : 'X';
            } else if (gameMode === 'computer') {
                currentMark = currentMark === 'X' ? 'O' : 'X';
                isComputerTurn = !isComputerTurn;
                currentPlayer = currentPlayer === 'human' ? 'computer' : 'human';
                // computer move logic
            }
        }
    }
}

// Add event listeners to cells
cells.forEach((cell) => {
    cell.addEventListener('click', handleCellClick);
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
    handleTabChange('human'); // Default to "2 Players" mode
  });

// Listen for changes in the select dropdown
themeSelector.addEventListener("change", (event) => {
    const selectedTheme = event.target.value;
    applyTheme(selectedTheme);
});

// Apply the default theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const selectedTheme = themeSelector.value; // auto-grabs the selected one
    applyTheme(selectedTheme);
}); 