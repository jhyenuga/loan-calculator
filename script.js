// Enhanced Loan Calculator with Fixed and Floating Interest Rates

class LoanCalculator {
    constructor() {
        this.quarterCounter = 0;
        this.initializeElements();
        this.attachEventListeners();
        this.initializeFloatingRateInputs();
    }

    initializeElements() {
        // Tab elements
        this.fixedRateTab = document.getElementById('fixedRateTab');
        this.floatingRateTab = document.getElementById('floatingRateTab');
        this.fixedRateSection = document.getElementById('fixedRateSection');
        this.floatingRateSection = document.getElementById('floatingRateSection');

        // Fixed rate elements
        this.principalInput = document.getElementById('principal');
        this.interestRateInput = document.getElementById('interestRate');
        this.tenureInput = document.getElementById('tenure');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.clearBtn = document.getElementById('clearBtn');

        // Floating rate elements
        this.floatingPrincipalInput = document.getElementById('floatingPrincipal');
        this.initialInterestRateInput = document.getElementById('initialInterestRate');
        this.floatingTenureInput = document.getElementById('floatingTenure');
        this.calculateFloatingBtn = document.getElementById('calculateFloatingBtn');
        this.clearFloatingBtn = document.getElementById('clearFloatingBtn');
        this.quarterlyRatesContainer = document.getElementById('quarterlyRatesContainer');
        this.addQuarterBtn = document.getElementById('addQuarterBtn');

        // Results elements
        this.resultsSection = document.getElementById('resultsSection');
        this.monthlyEMIElement = document.getElementById('monthlyEMI');
        this.totalAmountElement = document.getElementById('totalAmount');
        this.totalInterestElement = document.getElementById('totalInterest');
        this.emiTableBody = document.getElementById('emiTableBody');
    }

    attachEventListeners() {
        // Tab switching
        this.fixedRateTab.addEventListener('click', () => this.switchToFixedRate());
        this.floatingRateTab.addEventListener('click', () => this.switchToFloatingRate());

        // Fixed rate calculator
        this.calculateBtn.addEventListener('click', () => this.calculateFixedLoan());
        this.clearBtn.addEventListener('click', () => this.clearFixedForm());

        // Floating rate calculator
        this.calculateFloatingBtn.addEventListener('click', () => this.calculateFloatingLoan());
        this.clearFloatingBtn.addEventListener('click', () => this.clearFloatingForm());
        this.addQuarterBtn.addEventListener('click', () => this.addQuarterInput());
        this.floatingTenureInput.addEventListener('input', () => this.updateQuarterInputs());

        // Allow Enter key to trigger calculation for fixed rate
        [this.principalInput, this.interestRateInput, this.tenureInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculateFixedLoan();
                }
            });
        });

        // Allow Enter key to trigger calculation for floating rate
        [this.floatingPrincipalInput, this.initialInterestRateInput, this.floatingTenureInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculateFloatingLoan();
                }
            });
        });

        // Real-time validation
        [this.principalInput, this.interestRateInput, this.tenureInput,
         this.floatingPrincipalInput, this.initialInterestRateInput, this.floatingTenureInput].forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
        });
    }

    switchToFixedRate() {
        this.fixedRateTab.classList.add('active');
        this.floatingRateTab.classList.remove('active');
        this.fixedRateSection.style.display = 'block';
        this.floatingRateSection.style.display = 'none';
        this.resultsSection.classList.remove('show');
    }

    switchToFloatingRate() {
        this.floatingRateTab.classList.add('active');
        this.fixedRateTab.classList.remove('active');
        this.floatingRateSection.style.display = 'block';
        this.fixedRateSection.style.display = 'none';
        this.resultsSection.classList.remove('show');
    }

    initializeFloatingRateInputs() {
        // Add initial quarter inputs
        this.addQuarterInput();
        this.addQuarterInput();
        this.addQuarterInput();
        this.addQuarterInput();
        
        // Add current date information
        this.displayCurrentDateInfo();
    }

    displayCurrentDateInfo() {
        const currentDate = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('en-US', options);
        
        const currentMonth = currentDate.getMonth() + 1;
        let currentFiscalQuarter = '';
        let currentPeriod = '';
        
        if (currentMonth >= 4 && currentMonth <= 6) {
            currentFiscalQuarter = 'Q1';
            currentPeriod = 'April - June';
        } else if (currentMonth >= 7 && currentMonth <= 9) {
            currentFiscalQuarter = 'Q2';
            currentPeriod = 'July - September';
        } else if (currentMonth >= 10 && currentMonth <= 12) {
            currentFiscalQuarter = 'Q3';
            currentPeriod = 'October - December';
        } else {
            currentFiscalQuarter = 'Q4';
            currentPeriod = 'January - March';
        }
        
        // Update the info text to include current date context
        const infoTextElement = document.querySelector('.floating-rates-section .info-text');
        if (infoTextElement) {
            infoTextElement.innerHTML = `
                <strong>Today is ${formattedDate}</strong> - Currently in fiscal ${currentFiscalQuarter} (${currentPeriod})<br>
                Enter interest rates for each fiscal quarter starting from the current period. The first quarter represents the current fiscal quarter. Leave blank if rate remains unchanged for that quarter.
            `;
        }
    }

    addQuarterInput() {
        this.quarterCounter++;
        const quarterDiv = document.createElement('div');
        quarterDiv.className = 'quarter-input-group';
        
        // Calculate fiscal quarter details
        const fiscalQuarter = this.getFiscalQuarterInfo(this.quarterCounter);
        
        // Determine if this is the current quarter
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        let isCurrentQuarter = false;
        
        if (this.quarterCounter === 1) {
            // First quarter input should represent the current fiscal quarter
            isCurrentQuarter = true;
        }
        
        const currentIndicator = isCurrentQuarter ? '<span class="current-quarter-badge">Current</span>' : '';
        
        quarterDiv.innerHTML = `
            <div>
                <label>${fiscalQuarter.label} ${currentIndicator}</label>
                <small class="quarter-period">${fiscalQuarter.period}</small>
            </div>
            <div>
                <input type="number" class="quarter-rate" placeholder="Enter rate % (leave blank if unchanged)" 
                       min="0.1" step="0.1" max="50" data-quarter="${this.quarterCounter}">
            </div>
            <div>
                <button type="button" class="remove-quarter-btn" onclick="loanCalculator.removeQuarterInput(this)">Remove</button>
            </div>
        `;
        this.quarterlyRatesContainer.appendChild(quarterDiv);
    }

    getFiscalQuarterInfo(quarterNumber) {
        // Get current date to determine starting quarter
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
        const currentYear = currentDate.getFullYear();
        
        // Determine which fiscal quarter we're currently in
        let currentFiscalQuarter;
        if (currentMonth >= 4 && currentMonth <= 6) {
            currentFiscalQuarter = 1; // Q1: Apr-Jun
        } else if (currentMonth >= 7 && currentMonth <= 9) {
            currentFiscalQuarter = 2; // Q2: Jul-Sep
        } else if (currentMonth >= 10 && currentMonth <= 12) {
            currentFiscalQuarter = 3; // Q3: Oct-Dec
        } else {
            currentFiscalQuarter = 4; // Q4: Jan-Mar
        }
        
        // Calculate which quarter this input represents
        const quarterIndex = (currentFiscalQuarter - 1 + quarterNumber - 1) % 4;
        const yearOffset = Math.floor((currentFiscalQuarter - 1 + quarterNumber - 1) / 4);
        
        const fiscalQuarters = [
            { label: 'Q1 (FY)', period: 'Apr - Jun', months: [4, 5, 6] },
            { label: 'Q2 (FY)', period: 'Jul - Sep', months: [7, 8, 9] },
            { label: 'Q3 (FY)', period: 'Oct - Dec', months: [10, 11, 12] },
            { label: 'Q4 (FY)', period: 'Jan - Mar', months: [1, 2, 3] }
        ];
        
        const quarterInfo = fiscalQuarters[quarterIndex];
        
        if (yearOffset > 0) {
            return {
                label: `${quarterInfo.label} Year ${yearOffset + 1}`,
                period: quarterInfo.period,
                months: quarterInfo.months,
                actualQuarter: quarterIndex + 1,
                yearOffset: yearOffset
            };
        } else {
            return {
                label: quarterInfo.label,
                period: quarterInfo.period,
                months: quarterInfo.months,
                actualQuarter: quarterIndex + 1,
                yearOffset: yearOffset
            };
        }
    }

    removeQuarterInput(button) {
        const quarterDiv = button.closest('.quarter-input-group');
        quarterDiv.remove();
        this.renumberQuarters();
    }

    renumberQuarters() {
        const quarterInputs = this.quarterlyRatesContainer.querySelectorAll('.quarter-input-group');
        quarterInputs.forEach((quarterDiv, index) => {
            const quarterNumber = index + 1;
            const fiscalQuarter = this.getFiscalQuarterInfo(quarterNumber);
            
            const label = quarterDiv.querySelector('label');
            const periodSpan = quarterDiv.querySelector('.quarter-period');
            const input = quarterDiv.querySelector('.quarter-rate');
            
            // Add current indicator for the first quarter
            const currentIndicator = quarterNumber === 1 ? '<span class="current-quarter-badge">Current</span>' : '';
            label.innerHTML = `${fiscalQuarter.label} ${currentIndicator}`;
            
            if (periodSpan) {
                periodSpan.textContent = fiscalQuarter.period;
            }
            input.setAttribute('data-quarter', quarterNumber);
        });
        this.quarterCounter = quarterInputs.length;
    }

    updateQuarterInputs() {
        const tenure = parseFloat(this.floatingTenureInput.value);
        if (tenure && tenure > 0) {
            const requiredQuarters = Math.ceil(tenure * 4); // 4 quarters per year
            const currentQuarters = this.quarterlyRatesContainer.querySelectorAll('.quarter-input-group').length;
            
            if (requiredQuarters > currentQuarters) {
                for (let i = currentQuarters; i < requiredQuarters; i++) {
                    this.addQuarterInput();
                }
            }
        }
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

    validateFixedInputs() {
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

    validateFloatingInputs() {
        const principal = parseFloat(this.floatingPrincipalInput.value);
        const interestRate = parseFloat(this.initialInterestRateInput.value);
        const tenure = parseFloat(this.floatingTenureInput.value);

        let isValid = true;
        let errorMessage = '';

        if (!principal || principal <= 0) {
            this.floatingPrincipalInput.classList.add('error');
            errorMessage = 'Please enter a valid principal amount';
            isValid = false;
        }

        if (!interestRate || interestRate <= 0 || interestRate > 50) {
            this.initialInterestRateInput.classList.add('error');
            errorMessage = 'Please enter a valid initial interest rate (0.1% - 50%)';
            isValid = false;
        }

        if (!tenure || tenure <= 0 || tenure > 30) {
            this.floatingTenureInput.classList.add('error');
            errorMessage = 'Please enter a valid tenure (1-30 years)';
            isValid = false;
        }

        if (!isValid) {
            this.showError(errorMessage);
        }

        return isValid;
    }

    validateAllInputs() {
        return this.validateFixedInputs();
    }

    showError(message) {
        alert(message);
    }

    calculateFixedLoan() {
        // Clear previous errors
        [this.principalInput, this.interestRateInput, this.tenureInput].forEach(input => {
            input.classList.remove('error');
        });

        if (!this.validateFixedInputs()) {
            return;
        }

        const principal = parseFloat(this.principalInput.value);
        const annualRate = parseFloat(this.interestRateInput.value);
        const tenureYears = parseFloat(this.tenureInput.value);

        // Calculate loan details
        const loanDetails = this.performFixedLoanCalculations(principal, annualRate, tenureYears);
        
        // Display results
        this.displayResults(loanDetails);
    }

    calculateFloatingLoan() {
        // Clear previous errors
        [this.floatingPrincipalInput, this.initialInterestRateInput, this.floatingTenureInput].forEach(input => {
            input.classList.remove('error');
        });

        if (!this.validateFloatingInputs()) {
            return;
        }

        const principal = parseFloat(this.floatingPrincipalInput.value);
        const initialRate = parseFloat(this.initialInterestRateInput.value);
        const tenureYears = parseFloat(this.floatingTenureInput.value);

        // Get quarterly rates
        const quarterlyRates = this.getQuarterlyRates(initialRate, tenureYears);

        // Calculate floating loan details
        const loanDetails = this.performFloatingLoanCalculations(principal, quarterlyRates, tenureYears);
        
        // Display results
        this.displayResults(loanDetails);
    }

    getQuarterlyRates(initialRate, tenureYears) {
        const quarterInputs = this.quarterlyRatesContainer.querySelectorAll('.quarter-rate');
        const totalQuarters = Math.ceil(tenureYears * 4);
        const quarterlyRates = [];

        let currentRate = initialRate;
        
        for (let quarter = 0; quarter < totalQuarters; quarter++) {
            if (quarter < quarterInputs.length) {
                const inputValue = quarterInputs[quarter].value;
                if (inputValue && !isNaN(parseFloat(inputValue))) {
                    currentRate = parseFloat(inputValue);
                }
            }
            quarterlyRates.push(currentRate);
        }

        return quarterlyRates;
    }

    performFloatingLoanCalculations(principal, quarterlyRates, tenureYears) {
        const totalMonths = tenureYears * 12;
        const schedule = [];
        let remainingBalance = principal;
        let totalInterestPaid = 0;
        let totalAmountPaid = 0;

        // Get current date for month/year calculation
        const currentDate = new Date();

        for (let month = 1; month <= totalMonths; month++) {
            // Map calendar month to fiscal quarter
            const fiscalQuarterIndex = this.getfiscalQuarterIndex(month);
            const currentQuarterRate = quarterlyRates[Math.min(fiscalQuarterIndex, quarterlyRates.length - 1)];
            const monthlyRate = (currentQuarterRate / 100) / 12;
            const dailyRate = (currentQuarterRate / 100) / 365;
            
            const openingBalance = remainingBalance;
            
            // Calculate remaining months for EMI calculation
            const remainingMonths = totalMonths - month + 1;
            
            // Calculate EMI for remaining tenure with current rate
            let emi;
            if (remainingMonths === 1) {
                emi = remainingBalance + (remainingBalance * monthlyRate);
            } else {
                emi = (remainingBalance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
                      (Math.pow(1 + monthlyRate, remainingMonths) - 1);
            }
            
            // Calculate interest (daily compounding for ~30 days)
            const daysInMonth = 30;
            const adjustedMonthlyInterest = openingBalance * (dailyRate * daysInMonth);
            
            const principalPayment = emi - adjustedMonthlyInterest;
            const closingBalance = Math.max(0, openingBalance - principalPayment);

            // Get fiscal quarter info for display
            const fiscalQuarterInfo = this.getFiscalQuarterDisplayInfo(month);
            
            // Calculate actual month and year
            const actualDate = new Date(currentDate);
            actualDate.setMonth(actualDate.getMonth() + month - 1);
            const actualMonthYear = this.formatMonthYear(actualDate);

            schedule.push({
                month: month,
                actualMonthYear: actualMonthYear,
                fiscalQuarter: fiscalQuarterInfo.quarter,
                fiscalPeriod: fiscalQuarterInfo.period,
                interestRate: currentQuarterRate,
                openingBalance: openingBalance,
                emi: emi,
                interest: adjustedMonthlyInterest,
                principal: principalPayment,
                closingBalance: closingBalance
            });

            totalInterestPaid += adjustedMonthlyInterest;
            totalAmountPaid += emi;
            remainingBalance = closingBalance;

            if (remainingBalance <= 0.01) {
                break;
            }
        }

        // Calculate average EMI for display
        const averageEMI = totalAmountPaid / schedule.length;

        return {
            emi: averageEMI,
            totalAmount: totalAmountPaid,
            totalInterest: totalInterestPaid,
            schedule: schedule,
            isFloating: true
        };
    }

    getfiscalQuarterIndex(calendarMonth) {
        // Get current date to determine starting point
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
        
        // Determine which fiscal quarter we're currently in
        let currentFiscalQuarter;
        if (currentMonth >= 4 && currentMonth <= 6) {
            currentFiscalQuarter = 1; // Q1: Apr-Jun
        } else if (currentMonth >= 7 && currentMonth <= 9) {
            currentFiscalQuarter = 2; // Q2: Jul-Sep
        } else if (currentMonth >= 10 && currentMonth <= 12) {
            currentFiscalQuarter = 3; // Q3: Oct-Dec
        } else {
            currentFiscalQuarter = 4; // Q4: Jan-Mar
        }
        
        // Calculate how many months into the loan we are
        const loanYear = Math.floor((calendarMonth - 1) / 12);
        const monthInLoanYear = ((calendarMonth - 1) % 12) + 1;
        
        // Calculate which quarter this month falls into, starting from current fiscal quarter
        const monthsFromStart = calendarMonth - 1;
        const quarterFromStart = Math.floor(monthsFromStart / 3);
        
        return quarterFromStart;
    }

    getFiscalQuarterDisplayInfo(calendarMonth) {
        // Get current date info
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        
        // Determine current fiscal quarter
        let currentFiscalQuarter;
        if (currentMonth >= 4 && currentMonth <= 6) {
            currentFiscalQuarter = 1;
        } else if (currentMonth >= 7 && currentMonth <= 9) {
            currentFiscalQuarter = 2;
        } else if (currentMonth >= 10 && currentMonth <= 12) {
            currentFiscalQuarter = 3;
        } else {
            currentFiscalQuarter = 4;
        }
        
        // Calculate which quarter this calendar month represents
        const monthsFromStart = calendarMonth - 1;
        const quarterOffset = Math.floor(monthsFromStart / 3);
        const yearOffset = Math.floor((currentFiscalQuarter - 1 + quarterOffset) / 4);
        const quarterIndex = (currentFiscalQuarter - 1 + quarterOffset) % 4;
        
        const fiscalQuarters = [
            { quarter: 'Q1', period: 'Apr-Jun' },
            { quarter: 'Q2', period: 'Jul-Sep' },
            { quarter: 'Q3', period: 'Oct-Dec' },
            { quarter: 'Q4', period: 'Jan-Mar' }
        ];
        
        const quarterInfo = fiscalQuarters[quarterIndex];
        const displayYear = yearOffset + 1;
        
        return { 
            quarter: `${quarterInfo.quarter} FY${displayYear}`, 
            period: quarterInfo.period 
        };
    }

    performFixedLoanCalculations(principal, annualRate, tenureYears) {
        // Convert to monthly and daily rates
        const monthlyRate = (annualRate / 100) / 12;
        const dailyRate = (annualRate / 100) / 365;
        const totalMonths = tenureYears * 12;

        // Calculate EMI using the standard formula
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);

        // Generate amortization schedule with daily interest calculation
        const schedule = this.generateFixedAmortizationSchedule(principal, dailyRate, emi, totalMonths);

        const totalAmount = emi * totalMonths;
        const totalInterest = totalAmount - principal;

        return {
            emi: emi,
            totalAmount: totalAmount,
            totalInterest: totalInterest,
            schedule: schedule,
            isFloating: false
        };
    }

    generateFixedAmortizationSchedule(principal, dailyRate, emi, totalMonths) {
        const schedule = [];
        let remainingBalance = principal;
        
        // Get current date for month/year calculation
        const currentDate = new Date();

        for (let month = 1; month <= totalMonths; month++) {
            const openingBalance = remainingBalance;
            
            // Calculate interest for the month (daily compounding for ~30 days)
            const daysInMonth = 30; // Assuming 30 days per month for simplicity
            
            // Adjust the monthly interest to match EMI calculation
            const adjustedMonthlyInterest = openingBalance * (dailyRate * daysInMonth);
            
            const principalPayment = emi - adjustedMonthlyInterest;
            const closingBalance = Math.max(0, openingBalance - principalPayment);

            // Calculate actual month and year
            const actualDate = new Date(currentDate);
            actualDate.setMonth(actualDate.getMonth() + month - 1);
            const actualMonthYear = this.formatMonthYear(actualDate);

            schedule.push({
                month: month,
                actualMonthYear: actualMonthYear,
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
        if (loanDetails.isFloating) {
            this.monthlyEMIElement.textContent = this.formatCurrency(loanDetails.emi) + ' (Avg)';
        } else {
            this.monthlyEMIElement.textContent = this.formatCurrency(loanDetails.emi);
        }
        this.totalAmountElement.textContent = this.formatCurrency(loanDetails.totalAmount);
        this.totalInterestElement.textContent = this.formatCurrency(loanDetails.totalInterest);

        // Generate table
        this.generateEMITable(loanDetails.schedule, loanDetails.isFloating);

        // Show results section
        this.resultsSection.classList.add('show');
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    generateEMITable(schedule, isFloating = false) {
        this.emiTableBody.innerHTML = '';

        // Update table header if needed
        const tableHeader = document.querySelector('#emiTable thead tr');
        
        // Add Month/Year column if not present
        if (!tableHeader.querySelector('.month-year-column')) {
            const monthYearHeader = document.createElement('th');
            monthYearHeader.textContent = 'Month/Year';
            monthYearHeader.className = 'month-year-column';
            tableHeader.insertBefore(monthYearHeader, tableHeader.children[1]); // Insert after Month column
        }
        
        if (isFloating && !tableHeader.querySelector('.fiscal-quarter-column')) {
            const fiscalQuarterHeader = document.createElement('th');
            fiscalQuarterHeader.textContent = 'Fiscal Quarter';
            fiscalQuarterHeader.className = 'fiscal-quarter-column';
            tableHeader.insertBefore(fiscalQuarterHeader, tableHeader.children[3]); // Insert after Opening Balance
            
            const rateHeader = document.createElement('th');
            rateHeader.textContent = 'Rate (%)';
            rateHeader.className = 'rate-column';
            tableHeader.insertBefore(rateHeader, tableHeader.children[5]); // Insert before Interest column
        } else if (!isFloating) {
            const fiscalQuarterCol = tableHeader.querySelector('.fiscal-quarter-column');
            const rateCol = tableHeader.querySelector('.rate-column');
            if (fiscalQuarterCol) fiscalQuarterCol.remove();
            if (rateCol) rateCol.remove();
        }

        schedule.forEach(payment => {
            const row = document.createElement('tr');
            
            if (isFloating) {
                row.innerHTML = `
                    <td>${payment.month}</td>
                    <td class="month-year-cell">${payment.actualMonthYear}</td>
                    <td>${this.formatCurrency(payment.openingBalance)}</td>
                    <td><span class="fiscal-quarter-info">${payment.fiscalQuarter}</span></td>
                    <td>${this.formatCurrency(payment.emi)}</td>
                    <td>${payment.interestRate.toFixed(2)}%</td>
                    <td>${this.formatCurrency(payment.interest)}</td>
                    <td>${this.formatCurrency(payment.principal)}</td>
                    <td>${this.formatCurrency(payment.closingBalance)}</td>
                `;
            } else {
                row.innerHTML = `
                    <td>${payment.month}</td>
                    <td class="month-year-cell">${payment.actualMonthYear}</td>
                    <td>${this.formatCurrency(payment.openingBalance)}</td>
                    <td>${this.formatCurrency(payment.emi)}</td>
                    <td>${this.formatCurrency(payment.interest)}</td>
                    <td>${this.formatCurrency(payment.principal)}</td>
                    <td>${this.formatCurrency(payment.closingBalance)}</td>
                `;
            }
            
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

    formatMonthYear(date) {
        const options = { 
            year: 'numeric', 
            month: 'short'
        };
        return date.toLocaleDateString('en-US', options);
    }

    clearFixedForm() {
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

    clearFloatingForm() {
        // Clear inputs
        this.floatingPrincipalInput.value = '';
        this.initialInterestRateInput.value = '';
        this.floatingTenureInput.value = '';

        // Clear quarterly rates
        this.quarterlyRatesContainer.innerHTML = '';
        this.quarterCounter = 0;
        this.initializeFloatingRateInputs();

        // Remove error classes
        [this.floatingPrincipalInput, this.initialInterestRateInput, this.floatingTenureInput].forEach(input => {
            input.classList.remove('error');
        });

        // Hide results
        this.resultsSection.classList.remove('show');

        // Focus on first input
        this.floatingPrincipalInput.focus();
    }

    clearForm() {
        this.clearFixedForm();
    }
}

// Additional utility functions
function addExampleData() {
    const calculator = window.loanCalculator;
    if (calculator.fixedRateTab.classList.contains('active')) {
        calculator.principalInput.value = '500000';
        calculator.interestRateInput.value = '8.5';
        calculator.tenureInput.value = '20';
    } else {
        calculator.floatingPrincipalInput.value = '500000';
        calculator.initialInterestRateInput.value = '8.5';
        calculator.floatingTenureInput.value = '20';
        
        // Add some sample floating rates
        const quarterInputs = calculator.quarterlyRatesContainer.querySelectorAll('.quarter-rate');
        if (quarterInputs.length >= 4) {
            quarterInputs[0].value = '8.5'; // Q1
            quarterInputs[1].value = '9.0'; // Q2
            quarterInputs[2].value = '8.75'; // Q3
            quarterInputs[3].value = '9.25'; // Q4
        }
    }
}

function addFloatingExampleData() {
    const calculator = window.loanCalculator;
    calculator.switchToFloatingRate();
    calculator.floatingPrincipalInput.value = '1000000';
    calculator.initialInterestRateInput.value = '7.5';
    calculator.floatingTenureInput.value = '15';
    
    // Add progressive rate increases aligned with fiscal quarters
    const quarterInputs = calculator.quarterlyRatesContainer.querySelectorAll('.quarter-rate');
    const rates = [7.5, 7.75, 8.0, 8.25, 8.5, 8.75, 9.0, 9.25]; // Rates for Q1 FY1, Q2 FY1, Q3 FY1, Q4 FY1, Q1 FY2, etc.
    quarterInputs.forEach((input, index) => {
        if (index < rates.length) {
            input.value = rates[index];
        }
    });
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.loanCalculator = new LoanCalculator();
    
    // Add some helpful console commands for testing
    console.log('Enhanced Loan Calculator initialized!');
    console.log('Available commands:');
    console.log('- addExampleData() - Load sample data for current calculator');
    console.log('- addFloatingExampleData() - Load sample floating rate data');
    
    // Make utility functions available globally
    window.addExampleData = addExampleData;
    window.addFloatingExampleData = addFloatingExampleData;
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoanCalculator;
}
