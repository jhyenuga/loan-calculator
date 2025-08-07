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
        this.maxGainTab = document.getElementById('maxGainTab');
        this.fixedRateSection = document.getElementById('fixedRateSection');
        this.floatingRateSection = document.getElementById('floatingRateSection');
        this.maxGainSection = document.getElementById('maxGainSection');

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

        // Max Gain Calculator elements
        this.maxGainPrincipalInput = document.getElementById('maxGainPrincipal');
        this.maxGainInitialRateInput = document.getElementById('maxGainInitialRate');
        this.maxGainTenureInput = document.getElementById('maxGainTenure');
        this.calculateMaxGainBtn = document.getElementById('calculateMaxGainBtn');
        this.clearMaxGainBtn = document.getElementById('clearMaxGainBtn');
        this.maxGainQuarterlyRatesContainer = document.getElementById('maxGainQuarterlyRatesContainer');
        this.addMaxGainQuarterBtn = document.getElementById('addMaxGainQuarterBtn');
        this.additionalPaymentsContainer = document.getElementById('additionalPaymentsContainer');
        this.addPaymentBtn = document.getElementById('addPaymentBtn');
        this.withdrawalsContainer = document.getElementById('withdrawalsContainer');
        this.addWithdrawalBtn = document.getElementById('addWithdrawalBtn');

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
        this.maxGainTab.addEventListener('click', () => this.switchToMaxGain());

        // Fixed rate calculator
        this.calculateBtn.addEventListener('click', () => this.calculateFixedLoan());
        this.clearBtn.addEventListener('click', () => this.clearFixedForm());

        // Floating rate calculator
        this.calculateFloatingBtn.addEventListener('click', () => this.calculateFloatingLoan());
        this.clearFloatingBtn.addEventListener('click', () => this.clearFloatingForm());
        this.addQuarterBtn.addEventListener('click', () => this.addQuarterInput());
        this.floatingTenureInput.addEventListener('input', () => this.updateQuarterInputs());

        // Max Gain Calculator
        this.calculateMaxGainBtn.addEventListener('click', () => this.calculateMaxGain());
        this.clearMaxGainBtn.addEventListener('click', () => this.clearMaxGainForm());
        this.addMaxGainQuarterBtn.addEventListener('click', () => this.addMaxGainQuarterInput());
        this.addPaymentBtn.addEventListener('click', () => this.addPaymentInput());
        this.addWithdrawalBtn.addEventListener('click', () => this.addWithdrawalInput());
        this.maxGainTenureInput.addEventListener('input', () => this.updateMaxGainQuarterInputs());

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
        this.maxGainTab.classList.remove('active');
        this.fixedRateSection.style.display = 'block';
        this.floatingRateSection.style.display = 'none';
        this.maxGainSection.style.display = 'none';
        this.resultsSection.classList.remove('show');
    }

    switchToFloatingRate() {
        this.floatingRateTab.classList.add('active');
        this.fixedRateTab.classList.remove('active');
        this.maxGainTab.classList.remove('active');
        this.floatingRateSection.style.display = 'block';
        this.fixedRateSection.style.display = 'none';
        this.maxGainSection.style.display = 'none';
        this.resultsSection.classList.remove('show');
    }

    switchToMaxGain() {
        this.maxGainTab.classList.add('active');
        this.fixedRateTab.classList.remove('active');
        this.floatingRateTab.classList.remove('active');
        this.maxGainSection.style.display = 'block';
        this.fixedRateSection.style.display = 'none';
        this.floatingRateSection.style.display = 'none';
        this.resultsSection.classList.remove('show');
        this.initializeMaxGainInputs();
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
                Enter revised interest rates for the specified fiscal quarter.
            `;
        }
    }

    addQuarterInput() {
        this.quarterCounter++;
        const quarterDiv = document.createElement('div');
        quarterDiv.className = 'quarter-input-group';
        
        // Generate dropdown options for fiscal quarters
        const fiscalQuarterOptions = this.generateFiscalQuarterOptions();
        
        // Determine if this is the first quarter (for default selection)
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        let isFirstQuarter = false;
        let defaultSelection = '';
        
        if (this.quarterCounter === 1) {
            // First quarter input should represent the current fiscal quarter
            isFirstQuarter = true;
            // Set default selection to current quarter
            const currentQuarterInfo = this.getFiscalQuarterInfo(1);
            defaultSelection = `${currentQuarterInfo.actualQuarter}-${currentQuarterInfo.yearOffset}`;
        }
        
        quarterDiv.innerHTML = `
            <div>
                <label>Select Fiscal Quarter</label>
                <select class="quarter-selector" data-quarter="${this.quarterCounter}" onchange="loanCalculator.updateQuarterInfo(this)">
                    <option value="">Select Quarter...</option>
                    ${fiscalQuarterOptions}
                </select>
                <small class="quarter-period" style="display: none;"></small>
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
        
        // Set default selection for the first quarter
        if (isFirstQuarter && defaultSelection) {
            const selectElement = quarterDiv.querySelector('.quarter-selector');
            selectElement.value = defaultSelection;
            this.updateQuarterInfo(selectElement);
        }
    }

    generateFiscalQuarterOptions() {
        const options = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        
        // Generate options for current year and next 5 years
        for (let yearOffset = 0; yearOffset <= 5; yearOffset++) {
            const fiscalYear = currentYear + yearOffset;
            const fyLabel = yearOffset === 0 ? 'FY' : `FY Year ${yearOffset + 1}`;
            
            const quarters = [
                { value: `1-${yearOffset}`, label: `Q1 (${fyLabel}) - Apr-Jun ${fiscalYear}`, period: 'Apr - Jun' },
                { value: `2-${yearOffset}`, label: `Q2 (${fyLabel}) - Jul-Sep ${fiscalYear}`, period: 'Jul - Sep' },
                { value: `3-${yearOffset}`, label: `Q3 (${fyLabel}) - Oct-Dec ${fiscalYear}`, period: 'Oct - Dec' },
                { value: `4-${yearOffset}`, label: `Q4 (${fyLabel}) - Jan-Mar ${fiscalYear + 1}`, period: 'Jan - Mar' }
            ];
            
            quarters.forEach(quarter => {
                options.push(`<option value="${quarter.value}" data-period="${quarter.period}">${quarter.label}</option>`);
            });
        }
        
        return options.join('');
    }

    generateFiscalMonthOptions(maxTenure = 5) {
        const options = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        
        // Calculate maximum months based on tenure
        const maxMonths = maxTenure * 12;
        
        // Generate fiscal months starting from April of current year
        let monthCounter = 1;
        for (let yearOffset = 0; yearOffset <= Math.ceil(maxTenure) && monthCounter <= maxMonths; yearOffset++) {
            const fiscalYear = currentYear + yearOffset;
            const fyLabel = yearOffset === 0 ? 'FY' : `FY Year ${yearOffset + 1}`;
            
            const fiscalMonths = [
                { month: 4, name: 'April', year: fiscalYear },
                { month: 5, name: 'May', year: fiscalYear },
                { month: 6, name: 'June', year: fiscalYear },
                { month: 7, name: 'July', year: fiscalYear },
                { month: 8, name: 'August', year: fiscalYear },
                { month: 9, name: 'September', year: fiscalYear },
                { month: 10, name: 'October', year: fiscalYear },
                { month: 11, name: 'November', year: fiscalYear },
                { month: 12, name: 'December', year: fiscalYear },
                { month: 1, name: 'January', year: fiscalYear + 1 },
                { month: 2, name: 'February', year: fiscalYear + 1 },
                { month: 3, name: 'March', year: fiscalYear + 1 }
            ];
            
            fiscalMonths.forEach(monthInfo => {
                if (monthCounter <= maxMonths) {
                    const label = `${monthInfo.name} ${monthInfo.year} (${fyLabel})`;
                    options.push(`<option value="${monthCounter}">${label}</option>`);
                    monthCounter++;
                }
            });
        }
        
        return options.join('');
    }

    updateQuarterInfo(selectElement) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const periodSpan = selectElement.closest('.quarter-input-group').querySelector('.quarter-period');
        
        if (selectedOption.value) {
            const period = selectedOption.getAttribute('data-period');
            periodSpan.textContent = period;
            periodSpan.style.display = 'block';
        } else {
            periodSpan.style.display = 'none';
        }
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
        const quarterInputGroups = this.quarterlyRatesContainer.querySelectorAll('.quarter-input-group');
        const totalQuarters = Math.ceil(tenureYears * 4);
        const quarterlyRates = [];
        
        // Create a map of selected quarters to their rates
        const quarterRateMap = new Map();
        
        quarterInputGroups.forEach(group => {
            const selector = group.querySelector('.quarter-selector');
            const rateInput = group.querySelector('.quarter-rate');
            
            if (selector.value && rateInput.value && !isNaN(parseFloat(rateInput.value))) {
                // Parse the selected quarter (format: "quarter-yearOffset")
                const [quarter, yearOffset] = selector.value.split('-').map(Number);
                const quarterKey = `${quarter}-${yearOffset}`;
                quarterRateMap.set(quarterKey, parseFloat(rateInput.value));
            }
        });
        
        // Get current fiscal quarter info to determine the starting point
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
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
        
        let currentRate = initialRate;
        
        // Fill quarterly rates array
        for (let monthIndex = 0; monthIndex < totalQuarters * 3; monthIndex += 3) {
            const quarterOffset = Math.floor(monthIndex / 3);
            const yearOffset = Math.floor((currentFiscalQuarter - 1 + quarterOffset) / 4);
            const quarterIndex = (currentFiscalQuarter - 1 + quarterOffset) % 4 + 1;
            const quarterKey = `${quarterIndex}-${yearOffset}`;
            
            // Check if we have a rate specified for this quarter
            if (quarterRateMap.has(quarterKey)) {
                currentRate = quarterRateMap.get(quarterKey);
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
            const fiscalMonthInfo = this.getFiscalMonthInfo(month);

            schedule.push({
                month: month,
                fiscalMonth: fiscalMonthInfo,
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

    getFiscalMonthInfo(calendarMonth) {
        // Get current date info
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        
        // Determine current fiscal quarter and month within that quarter
        let currentFiscalQuarter, currentFiscalMonthInQuarter;
        if (currentMonth >= 4 && currentMonth <= 6) {
            currentFiscalQuarter = 1;
            currentFiscalMonthInQuarter = currentMonth - 3; // Apr=1, May=2, Jun=3
        } else if (currentMonth >= 7 && currentMonth <= 9) {
            currentFiscalQuarter = 2;
            currentFiscalMonthInQuarter = currentMonth - 6; // Jul=1, Aug=2, Sep=3
        } else if (currentMonth >= 10 && currentMonth <= 12) {
            currentFiscalQuarter = 3;
            currentFiscalMonthInQuarter = currentMonth - 9; // Oct=1, Nov=2, Dec=3
        } else {
            currentFiscalQuarter = 4;
            currentFiscalMonthInQuarter = currentMonth + 3; // Jan=1, Feb=2, Mar=3
        }
        
        // Calculate which quarter and month this calendar month represents
        const monthsFromStart = calendarMonth - 1;
        const quarterOffset = Math.floor(monthsFromStart / 3);
        const monthInQuarter = (monthsFromStart % 3) + 1;
        const yearOffset = Math.floor((currentFiscalQuarter - 1 + quarterOffset) / 4);
        const quarterIndex = (currentFiscalQuarter - 1 + quarterOffset) % 4;
        
        const fiscalQuarters = [
            { quarter: 'Q1', monthNames: ['Apr', 'May', 'Jun'] },
            { quarter: 'Q2', monthNames: ['Jul', 'Aug', 'Sep'] },
            { quarter: 'Q3', monthNames: ['Oct', 'Nov', 'Dec'] },
            { quarter: 'Q4', monthNames: ['Jan', 'Feb', 'Mar'] }
        ];
        
        const quarterInfo = fiscalQuarters[quarterIndex];
        const monthName = quarterInfo.monthNames[monthInQuarter - 1];
        const displayYear = yearOffset + 1;
        
        return `${monthName} (${quarterInfo.quarter} FY${displayYear})`;
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

        for (let month = 1; month <= totalMonths; month++) {
            const openingBalance = remainingBalance;
            
            // Calculate interest for the month (daily compounding for ~30 days)
            const daysInMonth = 30; // Assuming 30 days per month for simplicity
            
            // Adjust the monthly interest to match EMI calculation
            const adjustedMonthlyInterest = openingBalance * (dailyRate * daysInMonth);
            
            const principalPayment = emi - adjustedMonthlyInterest;
            const closingBalance = Math.max(0, openingBalance - principalPayment);

            // Get fiscal month info for display
            const fiscalMonthInfo = this.getFiscalMonthInfo(month);

            schedule.push({
                month: month,
                fiscalMonth: fiscalMonthInfo,
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
        if (loanDetails.isFloating || loanDetails.isMaxGain) {
            this.monthlyEMIElement.textContent = this.formatCurrency(loanDetails.emi) + ' (Avg)';
        } else {
            this.monthlyEMIElement.textContent = this.formatCurrency(loanDetails.emi);
        }
        this.totalAmountElement.textContent = this.formatCurrency(loanDetails.totalAmount);
        this.totalInterestElement.textContent = this.formatCurrency(loanDetails.totalInterest);

        // Generate table
        this.generateEMITable(loanDetails.schedule, loanDetails.isFloating, loanDetails.isMaxGain);

        // Show results section
        this.resultsSection.classList.add('show');
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    generateEMITable(schedule, isFloating = false, isMaxGain = false) {
        this.emiTableBody.innerHTML = '';

        // Update table header based on calculator type
        const tableHeader = document.querySelector('#emiTable thead tr');
        
        // Remove existing dynamic columns
        const existingDynamicCols = tableHeader.querySelectorAll('.fiscal-quarter-column, .rate-column, .additional-payment-column, .withdrawal-column, .overdraft-column');
        existingDynamicCols.forEach(col => col.remove());

        if (isMaxGain) {
            // For Max Gain, add all columns
            const fiscalQuarterHeader = document.createElement('th');
            fiscalQuarterHeader.textContent = 'Fiscal Quarter';
            fiscalQuarterHeader.className = 'fiscal-quarter-column';
            tableHeader.insertBefore(fiscalQuarterHeader, tableHeader.children[2]);
            
            const rateHeader = document.createElement('th');
            rateHeader.textContent = 'Rate (%)';
            rateHeader.className = 'rate-column';
            tableHeader.insertBefore(rateHeader, tableHeader.children[4]);
            
            // Add additional payment column after Principal
            const additionalPaymentHeader = document.createElement('th');
            additionalPaymentHeader.textContent = 'Additional Payment';
            additionalPaymentHeader.className = 'additional-payment-column';
            tableHeader.insertBefore(additionalPaymentHeader, tableHeader.children[8]);
            
            // Add withdrawal column
            const withdrawalHeader = document.createElement('th');
            withdrawalHeader.textContent = 'Withdrawal';
            withdrawalHeader.className = 'withdrawal-column';
            tableHeader.insertBefore(withdrawalHeader, tableHeader.children[9]);
            
            // Add overdraft account column
            const overdraftHeader = document.createElement('th');
            overdraftHeader.textContent = 'Overdraft Account';
            overdraftHeader.className = 'overdraft-column';
            tableHeader.insertBefore(overdraftHeader, tableHeader.children[10]);
            
        } else if (isFloating) {
            // For floating rate, just add fiscal quarter and rate
            const fiscalQuarterHeader = document.createElement('th');
            fiscalQuarterHeader.textContent = 'Fiscal Quarter';
            fiscalQuarterHeader.className = 'fiscal-quarter-column';
            tableHeader.insertBefore(fiscalQuarterHeader, tableHeader.children[2]);
            
            const rateHeader = document.createElement('th');
            rateHeader.textContent = 'Rate (%)';
            rateHeader.className = 'rate-column';
            tableHeader.insertBefore(rateHeader, tableHeader.children[4]);
        }

        schedule.forEach(payment => {
            const row = document.createElement('tr');
            
            if (isMaxGain) {
                row.innerHTML = `
                    <td>${payment.month}</td>
                    <td class="fiscal-month-cell">${payment.fiscalMonth}</td>
                    <td><span class="fiscal-quarter-info">${payment.fiscalQuarter}</span></td>
                    <td>${this.formatCurrency(payment.openingBalance)}</td>
                    <td>${payment.interestRate.toFixed(2)}%</td>
                    <td>${this.formatCurrency(payment.emi)}</td>
                    <td>${this.formatCurrency(payment.interest)}</td>
                    <td>${this.formatCurrency(payment.principal)}</td>
                    <td>${this.formatCurrency(payment.additionalPayment || 0)}</td>
                    <td>${this.formatCurrency(payment.withdrawal || 0)}</td>
                    <td>${this.formatCurrency(payment.overdraftAccount || 0)}</td>
                    <td>${this.formatCurrency(payment.closingBalance)}</td>
                `;
            } else if (isFloating) {
                row.innerHTML = `
                    <td>${payment.month}</td>
                    <td class="fiscal-month-cell">${payment.fiscalMonth}</td>
                    <td><span class="fiscal-quarter-info">${payment.fiscalQuarter}</span></td>
                    <td>${this.formatCurrency(payment.openingBalance)}</td>
                    <td>${payment.interestRate.toFixed(2)}%</td>
                    <td>${this.formatCurrency(payment.emi)}</td>
                    <td>${this.formatCurrency(payment.interest)}</td>
                    <td>${this.formatCurrency(payment.principal)}</td>
                    <td>${this.formatCurrency(payment.closingBalance)}</td>
                `;
            } else {
                row.innerHTML = `
                    <td>${payment.month}</td>
                    <td class="fiscal-month-cell">${payment.fiscalMonth}</td>
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

    // Max Gain Calculator Methods
    initializeMaxGainInputs() {
        // Clear existing inputs
        this.maxGainQuarterlyRatesContainer.innerHTML = '';
        this.additionalPaymentsContainer.innerHTML = '';
        this.withdrawalsContainer.innerHTML = '';
        
        // Add default quarter inputs
        this.addMaxGainQuarterInput();
        this.addMaxGainQuarterInput();
    }

    addMaxGainQuarterInput() {
        this.quarterCounter++;
        const quarterDiv = document.createElement('div');
        quarterDiv.className = 'quarter-input-group';
        
        // Generate dropdown options for fiscal quarters
        const fiscalQuarterOptions = this.generateFiscalQuarterOptions();
        
        quarterDiv.innerHTML = `
            <div>
                <label>Select Fiscal Quarter</label>
                <select class="quarter-selector" data-quarter="${this.quarterCounter}" onchange="loanCalculator.updateQuarterInfo(this)">
                    <option value="">Select Quarter...</option>
                    ${fiscalQuarterOptions}
                </select>
                <small class="quarter-period" style="display: none;"></small>
            </div>
            <div>
                <input type="number" class="quarter-rate" placeholder="Enter rate % (leave blank if unchanged)" 
                       min="0.1" step="0.1" max="50" data-quarter="${this.quarterCounter}">
            </div>
            <div>
                <button type="button" class="remove-quarter-btn" onclick="loanCalculator.removeQuarterInput(this)">Remove</button>
            </div>
        `;
        this.maxGainQuarterlyRatesContainer.appendChild(quarterDiv);
    }

    addPaymentInput() {
        const paymentDiv = document.createElement('div');
        paymentDiv.className = 'quarter-input-group';
        
        // Get tenure to determine max months for dropdown
        const tenure = parseFloat(this.maxGainTenureInput.value) || 5;
        const fiscalMonthOptions = this.generateFiscalMonthOptions(tenure);
        
        paymentDiv.innerHTML = `
            <div>
                <label>Select Month</label>
                <select class="payment-month" style="width: 100%;">
                    <option value="">Select Month...</option>
                    ${fiscalMonthOptions}
                </select>
            </div>
            <div>
                <input type="number" class="payment-amount" placeholder="Enter additional payment amount" min="0" step="1000">
            </div>
            <div>
                <button type="button" class="remove-quarter-btn" onclick="loanCalculator.removePaymentInput(this)">Remove</button>
            </div>
        `;
        this.additionalPaymentsContainer.appendChild(paymentDiv);
    }

    addWithdrawalInput() {
        const withdrawalDiv = document.createElement('div');
        withdrawalDiv.className = 'quarter-input-group';
        
        // Get tenure to determine max months for dropdown
        const tenure = parseFloat(this.maxGainTenureInput.value) || 5;
        const fiscalMonthOptions = this.generateFiscalMonthOptions(tenure);
        
        withdrawalDiv.innerHTML = `
            <div>
                <label>Select Month</label>
                <select class="withdrawal-month" style="width: 100%;">
                    <option value="">Select Month...</option>
                    ${fiscalMonthOptions}
                </select>
            </div>
            <div>
                <input type="number" class="withdrawal-amount" placeholder="Enter withdrawal amount" min="0" step="1000">
            </div>
            <div>
                <button type="button" class="remove-quarter-btn" onclick="loanCalculator.removeWithdrawalInput(this)">Remove</button>
            </div>
        `;
        this.withdrawalsContainer.appendChild(withdrawalDiv);
    }

    removePaymentInput(button) {
        const paymentDiv = button.closest('.quarter-input-group');
        paymentDiv.remove();
    }

    removeWithdrawalInput(button) {
        const withdrawalDiv = button.closest('.quarter-input-group');
        withdrawalDiv.remove();
    }

    updateMaxGainQuarterInputs() {
        const tenure = parseFloat(this.maxGainTenureInput.value);
        if (tenure && tenure > 0) {
            const requiredQuarters = Math.ceil(tenure * 4);
            const currentQuarters = this.maxGainQuarterlyRatesContainer.querySelectorAll('.quarter-input-group').length;
            
            if (requiredQuarters > currentQuarters) {
                for (let i = currentQuarters; i < requiredQuarters; i++) {
                    this.addMaxGainQuarterInput();
                }
            }
            
            // Update existing fiscal month dropdowns
            this.updateFiscalMonthDropdowns(tenure);
        }
    }

    updateFiscalMonthDropdowns(tenure) {
        const fiscalMonthOptions = this.generateFiscalMonthOptions(tenure);
        
        // Update additional payment dropdowns
        const paymentSelects = this.additionalPaymentsContainer.querySelectorAll('.payment-month');
        paymentSelects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = `<option value="">Select Month...</option>${fiscalMonthOptions}`;
            if (currentValue && currentValue <= tenure * 12) {
                select.value = currentValue;
            }
        });
        
        // Update withdrawal dropdowns
        const withdrawalSelects = this.withdrawalsContainer.querySelectorAll('.withdrawal-month');
        withdrawalSelects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = `<option value="">Select Month...</option>${fiscalMonthOptions}`;
            if (currentValue && currentValue <= tenure * 12) {
                select.value = currentValue;
            }
        });
    }

    calculateMaxGain() {
        // Validate inputs
        const principal = parseFloat(this.maxGainPrincipalInput.value);
        const initialRate = parseFloat(this.maxGainInitialRateInput.value);
        const tenureYears = parseFloat(this.maxGainTenureInput.value);

        if (!principal || !initialRate || !tenureYears) {
            alert('Please fill in all required fields (Principal Amount, Initial Interest Rate, and Loan Tenure).');
            return;
        }

        if (principal <= 0 || initialRate <= 0 || tenureYears <= 0) {
            alert('Please enter positive values for all fields.');
            return;
        }

        // Get quarterly rates, additional payments, and withdrawals
        const quarterlyRates = this.getMaxGainQuarterlyRates(initialRate, tenureYears);
        const additionalPayments = this.getAdditionalPayments();
        const withdrawals = this.getWithdrawals();
        
        // Validate withdrawals against overdraft account balance
        const validationResult = this.validateWithdrawals(additionalPayments, withdrawals, tenureYears);
        if (!validationResult.isValid) {
            alert(validationResult.errorMessage);
            return;
        }
        
        const loanDetails = this.performMaxGainCalculations(principal, quarterlyRates, tenureYears, additionalPayments, withdrawals);
        
        // Display results
        this.displayResults(loanDetails);
    }

    validateWithdrawals(additionalPayments, withdrawals, tenureYears) {
        const totalMonths = tenureYears * 12;
        let overdraftBalance = 0;
        
        for (let month = 1; month <= totalMonths; month++) {
            const additionalPayment = additionalPayments.get(month) || 0;
            const withdrawal = withdrawals.get(month) || 0;
            
            // Update overdraft balance with additional payment
            overdraftBalance += additionalPayment;
            
            // Check if withdrawal exceeds available overdraft balance
            if (withdrawal > overdraftBalance) {
                const monthName = this.getMonthDisplayName(month);
                return {
                    isValid: false,
                    errorMessage: `Invalid withdrawal in ${monthName}: ₹${this.formatNumber(withdrawal)} exceeds available overdraft balance of ₹${this.formatNumber(overdraftBalance)}. Please reduce the withdrawal amount or add more payments in earlier months.`
                };
            }
            
            // Apply withdrawal
            overdraftBalance -= withdrawal;
        }
        
        return { isValid: true };
    }

    getMonthDisplayName(monthNumber) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        
        // Calculate which fiscal month this represents
        let fiscalYear = currentYear;
        let fiscalMonth;
        
        // Fiscal year starts in April
        if (currentMonth >= 4) {
            fiscalMonth = currentMonth - 3 + (monthNumber - 1);
        } else {
            fiscalYear = currentYear - 1;
            fiscalMonth = currentMonth + 9 + (monthNumber - 1);
        }
        
        const adjustedYear = fiscalYear + Math.floor((fiscalMonth - 1) / 12);
        const adjustedMonth = ((fiscalMonth - 1) % 12) + 1;
        
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Convert to fiscal month
        let displayMonth;
        if (adjustedMonth >= 4) {
            displayMonth = adjustedMonth;
        } else {
            displayMonth = adjustedMonth;
        }
        
        return `Month ${monthNumber} - ${monthNames[((monthNumber - 1 + 3) % 12)]} ${adjustedYear}`;
    }

    formatNumber(amount) {
        return new Intl.NumberFormat('en-IN').format(Math.round(amount));
    }

    getMaxGainQuarterlyRates(initialRate, tenureYears) {
        const quarterInputGroups = this.maxGainQuarterlyRatesContainer.querySelectorAll('.quarter-input-group');
        const totalQuarters = Math.ceil(tenureYears * 4);
        const quarterlyRates = [];
        
        // Create a map of selected quarters to their rates
        const quarterRateMap = new Map();
        
        quarterInputGroups.forEach(group => {
            const selector = group.querySelector('.quarter-selector');
            const rateInput = group.querySelector('.quarter-rate');
            
            if (selector.value && rateInput.value && !isNaN(parseFloat(rateInput.value))) {
                const [quarter, yearOffset] = selector.value.split('-').map(Number);
                const quarterKey = `${quarter}-${yearOffset}`;
                quarterRateMap.set(quarterKey, parseFloat(rateInput.value));
            }
        });
        
        // Get current fiscal quarter info
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
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
        
        let currentRate = initialRate;
        
        // Fill quarterly rates array
        for (let monthIndex = 0; monthIndex < totalQuarters * 3; monthIndex += 3) {
            const quarterOffset = Math.floor(monthIndex / 3);
            const yearOffset = Math.floor((currentFiscalQuarter - 1 + quarterOffset) / 4);
            const quarterIndex = (currentFiscalQuarter - 1 + quarterOffset) % 4 + 1;
            const quarterKey = `${quarterIndex}-${yearOffset}`;
            
            if (quarterRateMap.has(quarterKey)) {
                currentRate = quarterRateMap.get(quarterKey);
            }
            
            quarterlyRates.push(currentRate);
        }

        return quarterlyRates;
    }

    getAdditionalPayments() {
        const paymentInputs = this.additionalPaymentsContainer.querySelectorAll('.quarter-input-group');
        const payments = new Map();
        
        paymentInputs.forEach(group => {
            const monthInput = group.querySelector('.payment-month');
            const amountInput = group.querySelector('.payment-amount');
            
            if (monthInput.value && amountInput.value && !isNaN(parseFloat(amountInput.value))) {
                const month = parseInt(monthInput.value);
                const amount = parseFloat(amountInput.value);
                payments.set(month, amount);
            }
        });
        
        return payments;
    }

    getWithdrawals() {
        const withdrawalInputs = this.withdrawalsContainer.querySelectorAll('.quarter-input-group');
        const withdrawals = new Map();
        
        withdrawalInputs.forEach(group => {
            const monthInput = group.querySelector('.withdrawal-month');
            const amountInput = group.querySelector('.withdrawal-amount');
            
            if (monthInput.value && amountInput.value && !isNaN(parseFloat(amountInput.value))) {
                const month = parseInt(monthInput.value);
                const amount = parseFloat(amountInput.value);
                withdrawals.set(month, amount);
            }
        });
        
        return withdrawals;
    }

    performMaxGainCalculations(principal, quarterlyRates, tenureYears, additionalPayments, withdrawals) {
        const totalMonths = tenureYears * 12;
        const schedule = [];
        let remainingBalance = principal;
        let totalInterestPaid = 0;
        let totalAmountPaid = 0;
        let overdraftAccount = 0;

        for (let month = 1; month <= totalMonths; month++) {
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
            
            // Calculate interest
            const daysInMonth = 30;
            const adjustedMonthlyInterest = openingBalance * (dailyRate * daysInMonth);
            
            const regularPrincipalPayment = emi - adjustedMonthlyInterest;
            
            // Get additional payment for this month
            const additionalPayment = additionalPayments.get(month) || 0;
            
            // Get withdrawal for this month
            const withdrawal = withdrawals.get(month) || 0;
            
            // Calculate total principal payment (additional payments reduce loan, withdrawals don't)
            const totalPrincipalPayment = regularPrincipalPayment + additionalPayment;
            
            // Update overdraft account (validation ensures this won't go negative)
            overdraftAccount += additionalPayment - withdrawal;
            
            // Withdrawals are added back to closing balance (money comes back to you)
            const closingBalance = Math.max(0, openingBalance - totalPrincipalPayment + withdrawal);

            // Get fiscal quarter and month info
            const fiscalQuarterInfo = this.getFiscalQuarterDisplayInfo(month);
            const fiscalMonthInfo = this.getFiscalMonthInfo(month);

            schedule.push({
                month: month,
                fiscalMonth: fiscalMonthInfo,
                fiscalQuarter: fiscalQuarterInfo.quarter,
                interestRate: currentQuarterRate,
                openingBalance: openingBalance,
                emi: emi,
                interest: adjustedMonthlyInterest,
                principal: regularPrincipalPayment,
                additionalPayment: additionalPayment,
                withdrawal: withdrawal,
                overdraftAccount: overdraftAccount,
                closingBalance: closingBalance
            });

            totalInterestPaid += adjustedMonthlyInterest;
            totalAmountPaid += emi + additionalPayment; // withdrawals don't count as loan payments
            remainingBalance = closingBalance;

            if (remainingBalance <= 0.01) {
                break;
            }
        }

        const averageEMI = schedule.reduce((sum, payment) => sum + payment.emi, 0) / schedule.length;

        return {
            emi: averageEMI,
            totalAmount: totalAmountPaid,
            totalInterest: totalInterestPaid,
            schedule: schedule,
            isFloating: true,
            isMaxGain: true
        };
    }

    clearMaxGainForm() {
        this.maxGainPrincipalInput.value = '';
        this.maxGainInitialRateInput.value = '';
        this.maxGainTenureInput.value = '';
        this.maxGainQuarterlyRatesContainer.innerHTML = '';
        this.additionalPaymentsContainer.innerHTML = '';
        this.withdrawalsContainer.innerHTML = '';
        this.resultsSection.classList.remove('show');
        this.quarterCounter = 0;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.round(amount));
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
