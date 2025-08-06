# Enhanced Loan Calculator

A comprehensive loan calculator built with HTML, CSS, and JavaScript that supports both **Fixed Rate** and **Floating Rate** loan calculations with daily interest compounding and monthly EMI collections.

## Features

### Dual Calculator Types
- **Fixed Rate Calculator**: Traditional loan calculator with constant interest rate
- **Floating Rate Calculator**: Advanced calculator with quarterly interest rate revisions

### Core Functionality
- **Principal Amount Input**: Enter the loan amount
- **Interest Rate Management**: 
  - Fixed: Single annual interest rate (0.1% - 50%)
  - Floating: Initial rate + quarterly rate changes
- **Tenure Input**: Loan duration in years (1-30 years)
- **Daily Interest Calculation**: Interest is calculated daily on the outstanding principal
- **Monthly EMI Collection**: EMI collected monthly with breakdown of interest and principal components

### Floating Rate Features
- **Quarterly Rate Revision**: Interest rates can be changed every quarter (3 months)
- **Rate Propagation**: If no rate change is specified, the previous rate continues
- **Dynamic EMI Calculation**: EMI recalculated each quarter based on new rates and remaining tenure
- **Comprehensive Tracking**: Shows which rate was applied in each month

### Advanced Features
- **Detailed Amortization Schedule**: Complete month-by-month breakdown showing:
  - Opening balance for each month
  - Current interest rate (for floating rate loans)
  - EMI amount (varies for floating rate)
  - Interest component (calculated daily, collected monthly)
  - Principal component
  - Closing balance
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Validation**: Input validation with error highlighting
- **Professional UI**: Modern gradient design with smooth animations
- **Tab-based Interface**: Easy switching between fixed and floating rate calculators

## How It Works

### Fixed Rate Calculator
1. **Standard EMI Calculation**: Uses the traditional EMI formula with fixed interest rate
2. **Daily Interest**: Interest is calculated daily on the outstanding principal balance
3. **Fixed Monthly Collection**: Same EMI amount throughout the loan tenure

### Floating Rate Calculator
1. **Quarterly Rate Revision**: Interest rates can change every 3 months
2. **Dynamic EMI Calculation**: EMI is recalculated each quarter based on:
   - Current interest rate for that quarter
   - Remaining outstanding balance
   - Remaining loan tenure
3. **Rate Propagation Rule**: If no new rate is specified for a quarter, the previous quarter's rate continues
4. **Daily Interest Calculation**: Interest is still calculated daily within each quarter

### Interest Calculation Logic
1. **Daily Interest**: Interest is calculated daily on the outstanding principal balance
2. **Monthly Collection**: EMI is collected monthly with two components:
   - **Interest Component**: Accumulated daily interest for the month
   - **Principal Component**: Remaining EMI amount after interest deduction
3. **Balance Reduction**: Principal component reduces the outstanding balance

### EMI Formulas

#### Fixed Rate EMI Formula
```
EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
```

#### Floating Rate EMI Formula (calculated each quarter)
```
EMI = Outstanding_Balance × r × (1 + r)^remaining_months / ((1 + r)^remaining_months - 1)
```

Where:
- P = Principal loan amount (or outstanding balance for floating rate)
- r = Monthly interest rate (Annual rate / 12)
- n = Total number of months (or remaining months for floating rate)

## Files Structure

```
LoanCalculator/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript logic and calculations
└── README.md           # This documentation file
```

## Usage

### Fixed Rate Calculator
1. **Select Fixed Rate Tab**: Click on "Fixed Rate Calculator" tab
2. **Enter Loan Details**:
   - Principal Amount (in ₹)
   - Annual Interest Rate (%)
   - Loan Tenure (years)
3. **Calculate**: Click "Calculate EMI" button
4. **View Results**: 
   - Summary cards show fixed EMI, total amount, and total interest
   - Detailed table shows month-by-month breakdown

### Floating Rate Calculator
1. **Select Floating Rate Tab**: Click on "Floating Rate Calculator" tab
2. **Enter Basic Details**:
   - Principal Amount (in ₹)
   - Initial Annual Interest Rate (%)
   - Loan Tenure (years)
3. **Set Quarterly Rates**:
   - Enter new interest rates for specific quarters
   - Leave blank if rate remains unchanged from previous quarter
   - Use "Add Quarter" button to add more quarters if needed
4. **Calculate**: Click "Calculate Floating EMI" button
5. **View Results**: 
   - Summary shows average EMI, total amount, and total interest
   - Detailed table includes rate changes and varying EMI amounts

### General Usage
- **Clear**: Use "Clear" button to reset all fields
- **Tab Switching**: Switch between calculators without losing data
- **Responsive**: Works on all device sizes

## Example Calculations

### Fixed Rate Example
**Input:**
- Principal: ₹5,00,000
- Interest Rate: 8.5% annually
- Tenure: 20 years

**Output:**
- Monthly EMI: ₹4,299
- Total Amount: ₹1,03,17,760
- Total Interest: ₹5,31,760

### Floating Rate Example
**Input:**
- Principal: ₹10,00,000
- Initial Rate: 7.5% annually
- Tenure: 15 years
- Rate Changes:
  - Q1-Q4: 7.5%
  - Q5-Q8: 8.0%
  - Q9-Q12: 8.5%
  - Q13+: 9.0%

**Output:**
- Average EMI: ₹9,456
- Total Amount: ₹1,70,20,800
- Total Interest: ₹70,20,800
- **Note**: EMI varies each quarter based on rate changes

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
addExampleData()           // Load sample data for current calculator
addFloatingExampleData()   // Load sample floating rate data and switch to floating calculator
```

### Manual Testing Scenarios

#### Fixed Rate Testing
- Small amounts (₹10,000) with short tenure (1 year)
- Large amounts (₹1 crore) with long tenure (30 years)
- Different interest rates (1% - 30%)

#### Floating Rate Testing
- **Increasing Rates**: Start at 7% and increase by 0.5% each quarter
- **Decreasing Rates**: Start at 12% and decrease by 0.25% each quarter
- **Volatile Rates**: Alternate between high and low rates each quarter
- **Stable Periods**: Keep rates unchanged for several quarters

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to contribute by:
1. Adding new features
2. Improving the UI/UX
3. Optimizing calculations
4. Adding more validation
5. Improving accessibility
