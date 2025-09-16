// Subvention rates mapping
const subventionRates = {
    18: 16.71,
    12: 11.87,
    9: 9.31,
    6: 6.64
};

// DOM elements
const courseName = document.getElementById('courseName');
const totalFee = document.getElementById('totalFee');
const regularFees = document.getElementById('regularFees');
const payAfterPlacement = document.getElementById('payAfterPlacement');
const upfront = document.getElementById('upfront');
const discount = document.getElementById('discount');
const tenure = document.getElementById('tenure');

// Result elements
const rateElement = document.getElementById('rate');
const loanAmountElement = document.getElementById('loanAmount');
const subventionAmountElement = document.getElementById('subventionAmount');
const emiAmountElement = document.getElementById('emiAmount');

// Processing fee elements
const processingLoanAmountElement = document.getElementById('processingLoanAmount');
const processingFeeElement = document.getElementById('processingFee');
const stampDutyElement = document.getElementById('stampDuty');
const processingSubtotalElement = document.getElementById('processingSubtotal');
const gstAmountElement = document.getElementById('gstAmount');
const totalProcessingFeeElement = document.getElementById('totalProcessingFee');

// Format number in Indian currency style
function formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '—';
    }
    
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format percentage
function formatPercentage(rate) {
    if (rate === null || rate === undefined || isNaN(rate)) {
        return '—';
    }
    
    return `${rate.toFixed(2)}%`;
}

// Calculate EMI and update results
function calculateAndUpdate() {
    // Get input values
    const totalFeeValue = parseFloat(totalFee.value) || 0;
    const regularFeesValue = parseFloat(regularFees.value) || 0;
    const payAfterPlacementValue = parseFloat(payAfterPlacement.value) || 0;
    const upfrontValue = parseFloat(upfront.value) || 0;
    const discountValue = parseFloat(discount.value) || 0;
    const tenureValue = parseInt(tenure.value) || null;
    
    // Calculate loan amount (only regular fees are included in loan calculation)
    // Loan Amount = max(Regular Fees - Upfront - Discount, 0)
    const loanAmount = Math.max(regularFeesValue - upfrontValue - discountValue, 0);
    
    // Get subvention rate
    const subventionRate = tenureValue ? subventionRates[tenureValue] : null;
    
    // Calculate subvention amount
    const subventionAmount = subventionRate ? (loanAmount * subventionRate / 100) : null;
    
    // Calculate EMI
    const emiAmount = tenureValue ? (loanAmount / tenureValue) : null;
    
    // Calculate processing fees
    const processingFee = loanAmount * 0.02; // 2% processing fee
    const stampDuty = 200; // Fixed stamp duty
    const processingSubtotal = processingFee + stampDuty;
    const gstAmount = processingSubtotal * 0.18; // 18% GST
    const totalProcessingFee = processingSubtotal + gstAmount;
    
    // Update DOM elements
    rateElement.textContent = formatPercentage(subventionRate);
    loanAmountElement.textContent = formatCurrency(loanAmount);
    subventionAmountElement.textContent = formatCurrency(subventionAmount);
    emiAmountElement.textContent = formatCurrency(emiAmount);
    
    // Update processing fee elements
    processingLoanAmountElement.textContent = formatCurrency(loanAmount);
    processingFeeElement.textContent = formatCurrency(processingFee);
    stampDutyElement.textContent = formatCurrency(stampDuty);
    processingSubtotalElement.textContent = formatCurrency(processingSubtotal);
    gstAmountElement.textContent = formatCurrency(gstAmount);
    totalProcessingFeeElement.textContent = formatCurrency(totalProcessingFee);
}

// Add event listeners to all input elements
function addEventListeners() {
    const inputs = [courseName, totalFee, regularFees, payAfterPlacement, upfront, discount, tenure];
    
    inputs.forEach(input => {
        input.addEventListener('input', calculateAndUpdate);
        input.addEventListener('change', calculateAndUpdate);
    });
}

// Toggle Terms & Conditions
function toggleTerms() {
    const termsContent = document.getElementById('termsContent');
    const termsArrow = document.querySelector('.terms-arrow');
    
    if (termsContent.classList.contains('expanded')) {
        termsContent.classList.remove('expanded');
        termsArrow.classList.remove('rotated');
    } else {
        termsContent.classList.add('expanded');
        termsArrow.classList.add('rotated');
    }
}








// Initialize the application
function init() {
    addEventListeners();
    calculateAndUpdate(); // Calculate initial values
    
    console.log('Application initialized');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
