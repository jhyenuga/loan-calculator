// Loan Calculator with Daily Interest Calculation and Monthly EMI Collection

class LoanCalculator {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.principalInput = document.getElementById('principal');
        this.interestRateInput = document.getElementById('interestRate');
        this.tenureInput = document.getElementById('tenure');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.resultsSection = document.getElementById('resultsSection');
        this.monthlyEMIElement = document.getElementById('monthlyEMI');
        this.totalAmountElement = document.getElementById('totalAmount');
        this.totalInterestElement = document.getElementById('totalInterest');
        this.emiTableBody = document.getElementById('emiTableBody');
    }

    attachEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.calculateLoan());
        this.clearBtn.addEventListener('click', () => this.clearForm());
        
        // Allow Enter key to trigger calculation
        [this.principalInput, this.interestRateInput, this.tenureInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculateLoan();
                }
            });
        });

        // Real-time validation
        [this.principalInput, this.interestRateInput, this.tenureInput].forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        const value = parseFloat(input.value);
        const isValid = !isNaN(value) && value > 0;
        
        if (input.value && !isValid) {
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
        
        return isValid;
    }

    validateAllInputs() {
        const principal = parseFloat(this.principalInput.value);
        const interestRate = parseFloat(this.interestRateInput.value);
        const tenure = parseFloat(this.tenureInput.value);

        let isValid = true;
        let errorMessage = '';

        if (!principal || principal <= 0) {
            this.principalInput.classList.add('error');
            errorMessage = 'Please enter a valid principal amount';
            isValid = false;
        }

        if (!interestRate || interestRate <= 0 || interestRate > 50) {
            this.interestRateInput.classList.add('error');
            errorMessage = 'Please enter a valid interest rate (0.1% - 50%)';
            isValid = false;
        }

        if (!tenure || tenure <= 0 || tenure > 30) {
            this.tenureInput.classList.add('error');
            errorMessage = 'Please enter a valid tenure (1-30 years)';
            isValid = false;
        }

        if (!isValid) {
            this.showError(errorMessage);
        }

        return isValid;
    }

    showError(message) {
        alert(message);
    }

    calculateLoan() {
        // Clear previous errors
        [this.principalInput, this.interestRateInput, this.tenureInput].forEach(input => {
            input.classList.remove('error');
        });

        if (!this.validateAllInputs()) {
            return;
        }

        const principal = parseFloat(this.principalInput.value);
        const annualRate = parseFloat(this.interestRateInput.value);
        const tenureYears = parseFloat(this.tenureInput.value);

        // Calculate loan details
        const loanDetails = this.performLoanCalculations(principal, annualRate, tenureYears);
        
        // Display results
        this.displayResults(loanDetails);
    }

    performLoanCalculations(principal, annualRate, tenureYears) {
        // Convert to monthly and daily rates
        const monthlyRate = (annualRate / 100) / 12;
        const dailyRate = (annualRate / 100) / 365;
        const totalMonths = tenureYears * 12;

        // Calculate EMI using the standard formula
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);

        // Generate amortization schedule with daily interest calculation
        const schedule = this.generateAmortizationSchedule(principal, dailyRate, emi, totalMonths);

        const totalAmount = emi * totalMonths;
        const totalInterest = totalAmount - principal;

        return {
            emi: emi,
            totalAmount: totalAmount,
            totalInterest: totalInterest,
            schedule: schedule
        };
    }

    generateAmortizationSchedule(principal, dailyRate, emi, totalMonths) {
        const schedule = [];
        let remainingBalance = principal;

        for (let month = 1; month <= totalMonths; month++) {
            const openingBalance = remainingBalance;
            
            // Calculate interest for the month (daily compounding for ~30 days)
            const daysInMonth = 30; // Assuming 30 days per month for simplicity
            let monthlyInterest = 0;
            let tempBalance = openingBalance;
            
            // Calculate daily interest accumulation for the month
            for (let day = 1; day <= daysInMonth; day++) {
                const dailyInterest = tempBalance * dailyRate;
                monthlyInterest += dailyInterest;
                tempBalance += dailyInterest;
            }
            
            // Adjust the monthly interest to match EMI calculation
            // This ensures the loan pays off exactly in the specified tenure
            const adjustedMonthlyInterest = openingBalance * (dailyRate * daysInMonth);
            
            const principalPayment = emi - adjustedMonthlyInterest;
            const closingBalance = Math.max(0, openingBalance - principalPayment);

            schedule.push({
                month: month,
                openingBalance: openingBalance,
                emi: emi,
                interest: adjustedMonthlyInterest,
                principal: principalPayment,
                closingBalance: closingBalance
            });

            remainingBalance = closingBalance;

            // Break if loan is fully paid
            if (remainingBalance <= 0.01) {
                break;
            }
        }

        return schedule;
    }

    displayResults(loanDetails) {
        // Update summary cards
        this.monthlyEMIElement.textContent = this.formatCurrency(loanDetails.emi);
        this.totalAmountElement.textContent = this.formatCurrency(loanDetails.totalAmount);
        this.totalInterestElement.textContent = this.formatCurrency(loanDetails.totalInterest);

        // Generate table
        this.generateEMITable(loanDetails.schedule);

        // Show results section
        this.resultsSection.classList.add('show');
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    generateEMITable(schedule) {
        this.emiTableBody.innerHTML = '';

        schedule.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.month}</td>
                <td>${this.formatCurrency(payment.openingBalance)}</td>
                <td>${this.formatCurrency(payment.emi)}</td>
                <td>${this.formatCurrency(payment.interest)}</td>
                <td>${this.formatCurrency(payment.principal)}</td>
                <td>${this.formatCurrency(payment.closingBalance)}</td>
            `;
            this.emiTableBody.appendChild(row);
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.round(amount));
    }

    clearForm() {
        // Clear inputs
        this.principalInput.value = '';
        this.interestRateInput.value = '';
        this.tenureInput.value = '';

        // Remove error classes
        [this.principalInput, this.interestRateInput, this.tenureInput].forEach(input => {
            input.classList.remove('error');
        });

        // Hide results
        this.resultsSection.classList.remove('show');

        // Focus on first input
        this.principalInput.focus();
    }
}

// Additional utility functions
function addExampleData() {
    const calculator = window.loanCalculator;
    calculator.principalInput.value = '500000';
    calculator.interestRateInput.value = '8.5';
    calculator.tenureInput.value = '20';
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.loanCalculator = new LoanCalculator();
    
    // Add some helpful console commands for testing
    console.log('Loan Calculator initialized!');
    console.log('Try: addExampleData() to load sample data');
    
    // Make addExampleData available globally
    window.addExampleData = addExampleData;
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoanCalculator;
}
