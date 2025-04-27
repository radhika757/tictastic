const themeSelector = document.getElementById('theme-selector');
const mainContainer = document.getElementById('main-container');
const resetButton = document.getElementById('reset-button');
const cells = document.querySelectorAll('.cells'); 
const tabsContainer = document.getElementById('tabs-container');
const tabsTriggers = document.querySelectorAll('.tabs-trigger');

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