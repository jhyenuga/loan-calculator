# Loan Calculator

A comprehensive loan calculator built with HTML, CSS, and JavaScript that calculates EMI with daily interest compounding and monthly collections.

## Features

### Core Functionality
- **Principal Amount Input**: Enter the loan amount
- **Interest Rate Input**: Annual interest rate (0.1% - 50%)
- **Tenure Input**: Loan duration in years (1-30 years)
- **Daily Interest Calculation**: Interest is calculated daily on the outstanding principal
- **Monthly EMI Collection**: Fixed EMI collected monthly with breakdown of interest and principal components

### Advanced Features
- **Detailed Amortization Schedule**: Complete month-by-month breakdown showing:
  - Opening balance for each month
  - EMI amount
  - Interest component (calculated daily, collected monthly)
  - Principal component
  - Closing balance
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Validation**: Input validation with error highlighting
- **Professional UI**: Modern gradient design with smooth animations

## How It Works

### Interest Calculation Logic
1. **Daily Interest**: Interest is calculated daily on the outstanding principal balance
2. **Monthly Collection**: EMI is collected monthly with two components:
   - **Interest Component**: Accumulated daily interest for the month
   - **Principal Component**: Remaining EMI amount after interest deduction
3. **Balance Reduction**: Principal component reduces the outstanding balance

### EMI Formula
The calculator uses the standard EMI formula with monthly compounding:
```
EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
```
Where:
- P = Principal loan amount
- r = Monthly interest rate (Annual rate / 12)
- n = Total number of months

### Daily Interest Simulation
While the EMI is calculated using monthly rates, the interest component is adjusted to simulate daily interest accumulation, providing a more accurate representation of how banks typically calculate interest.

## Files Structure

```
LoanCalculator/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript logic and calculations
└── README.md           # This documentation file
```

## Usage

1. **Open the Calculator**: Open `index.html` in any modern web browser
2. **Enter Loan Details**:
   - Principal Amount (in ₹)
   - Annual Interest Rate (%)
   - Loan Tenure (years)
3. **Calculate**: Click "Calculate EMI" button
4. **View Results**: 
   - Summary cards show EMI, total amount, and total interest
   - Detailed table shows month-by-month breakdown
5. **Clear**: Use "Clear" button to reset all fields

## Example Calculation

**Input:**
- Principal: ₹5,00,000
- Interest Rate: 8.5% annually
- Tenure: 20 years

**Output:**
- Monthly EMI: ₹4,299
- Total Amount: ₹1,03,17,760
- Total Interest: ₹5,31,760

## Technical Implementation

### JavaScript Features
- **Object-Oriented Design**: Uses ES6 class structure
- **Input Validation**: Real-time validation with error handling
- **Responsive Event Handling**: Keyboard and mouse interactions
- **Currency Formatting**: Indian Rupee formatting with proper locale

### CSS Features
- **CSS Grid & Flexbox**: Modern layout techniques
- **Gradient Backgrounds**: Attractive visual design
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Hover effects and transitions
- **Table Styling**: Professional data presentation

### HTML Features
- **Semantic Structure**: Proper HTML5 elements
- **Accessibility**: Proper labels and form structure
- **Mobile Viewport**: Responsive meta tags

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Modifying Interest Calculation
To adjust the daily interest calculation method, modify the `generateAmortizationSchedule` function in `script.js`.

### Styling Changes
Update `styles.css` to change colors, fonts, or layout. The CSS uses CSS custom properties for easy theme customization.

### Additional Features
The modular JavaScript structure makes it easy to add features like:
- Different payment frequencies
- Extra payment calculations
- Loan comparison tools
- Export to PDF functionality

## Testing

### Console Commands
Open browser developer tools and use:
```javascript
addExampleData()  // Load sample data for testing
```

### Manual Testing
Test with various scenarios:
- Small amounts (₹10,000)
- Large amounts (₹1 crore)
- Different interest rates (1% - 30%)
- Short tenure (1 year)
- Long tenure (30 years)

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to contribute by:
1. Adding new features
2. Improving the UI/UX
3. Optimizing calculations
4. Adding more validation
5. Improving accessibility
