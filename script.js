const themeSelector = document.getElementById('theme-selector');
const mainContainer = document.getElementById('main-container');
const resetButton = document.getElementById('reset-button');
const cells = document.getElementById('cells');

// Function to apply a theme
function applyTheme(theme) {    
    const rootStyles = getComputedStyle(document.documentElement);
    
    // Get CSS variable values for the selected theme
    const boardBg = rootStyles.getPropertyValue(`--${theme}BoardBg`).trim();
    const buttonBg = rootStyles.getPropertyValue(`--${theme}ButtonBg`).trim();
    const cellBg = rootStyles.getPropertyValue(`--${theme}CellBorder`).trim();
    
    // Apply styles dynamically
    mainContainer.style.backgroundColor = boardBg;
    mainContainer.style.color = cellBg; // Example: Apply cell background as text color

    // update the reset button style
    resetButton.style.backgroundColor = buttonBg;
    resetButton.onmouseover = () => (resetButton.style.backgroundColor = buttonHoverBg);
    resetButton.onmouseout = () => (resetButton.style.backgroundColor = buttonBg);

    //update the cell styles
    cells.style.borderColor = cellBg;
    // cells.onmouseover = () => (cells.style.borderColor = buttonHoverBg);
    // cells.onmouseout = () => (cells.style.borderColor = buttonBg);
}

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