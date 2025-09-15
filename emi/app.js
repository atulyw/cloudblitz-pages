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

// Print Quote Function
function printQuote() {
    console.log('Print button clicked');
    
    // Expand terms for printing
    const termsContent = document.getElementById('termsContent');
    const termsArrow = document.querySelector('.terms-arrow');
    
    if (termsContent && !termsContent.classList.contains('expanded')) {
        termsContent.classList.add('expanded');
        if (termsArrow) termsArrow.classList.add('rotated');
    }
    
    // Simple print - no timeout needed
    window.print();
}

// Download Excel Function
function downloadExcel() {
    console.log('Download Excel button clicked');
    
    // Expand terms for Excel
    const termsContent = document.getElementById('termsContent');
    const termsArrow = document.querySelector('.terms-arrow');
    
    if (termsContent && !termsContent.classList.contains('expanded')) {
        termsContent.classList.add('expanded');
        if (termsArrow) termsArrow.classList.add('rotated');
    }
    
    // Generate Excel file
    generateExcelFile();
}

// Download PDF Function
function downloadPDF() {
    console.log('Download PDF button clicked');
    
    // Expand terms for PDF
    const termsContent = document.getElementById('termsContent');
    const termsArrow = document.querySelector('.terms-arrow');
    
    if (termsContent && !termsContent.classList.contains('expanded')) {
        termsContent.classList.add('expanded');
        if (termsArrow) termsArrow.classList.add('rotated');
    }
    
    // Generate PDF file
    generateDetailedPDF();
}

// Generate Excel file using SheetJS
function generateExcelFile() {
    try {
        console.log('Generating Excel file...');
        
        // Get current date
        const currentDate = new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Get form data
        const studentName = document.getElementById('studentName').value || 'N/A';
        const city = document.getElementById('city').value || 'N/A';
        const center = document.getElementById('center').value || 'N/A';
        const courseName = document.getElementById('courseName').value || 'N/A';
        const totalFee = document.getElementById('totalFee').value || '0';
        const regularFees = document.getElementById('regularFees').value || '0';
        const payAfterPlacement = document.getElementById('payAfterPlacement').value || '0';
        const upfront = document.getElementById('upfront').value || '0';
        const discount = document.getElementById('discount').value || '0';
        const tenure = document.getElementById('tenure').value || 'N/A';
        
        // Get calculated values
        const rate = document.getElementById('rate').textContent;
        const loanAmount = document.getElementById('loanAmount').textContent;
        const subventionAmount = document.getElementById('subventionAmount').textContent;
        const emiAmount = document.getElementById('emiAmount').textContent;
        const processingFee = document.getElementById('processingFee').textContent;
        const stampDuty = document.getElementById('stampDuty').textContent;
        const processingSubtotal = document.getElementById('processingSubtotal').textContent;
        const gstAmount = document.getElementById('gstAmount').textContent;
        const totalProcessingFee = document.getElementById('totalProcessingFee').textContent;
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Student Information Sheet
        const studentData = [
            ['CloudBlitz Education Finance Calculator'],
            ['Smart EMI Planning for Your Learning Journey'],
            [''],
            ['Generated on:', currentDate],
            [''],
            ['STUDENT INFORMATION'],
            ['Student Name', studentName],
            ['City', city],
            ['Center', center],
            ['Course', courseName]
        ];
        
        const studentWS = XLSX.utils.aoa_to_sheet(studentData);
        XLSX.utils.book_append_sheet(wb, studentWS, 'Student Info');
        
        // Fee Breakdown Sheet
        const feeData = [
            ['FEE BREAKDOWN'],
            ['Total Course Fee', `₹${parseInt(totalFee).toLocaleString('en-IN')}`],
            ['Regular Fees (Loan Eligible)', `₹${parseInt(regularFees).toLocaleString('en-IN')}`],
            ['Pay After Placement', `₹${parseInt(payAfterPlacement).toLocaleString('en-IN')}`],
            ['Upfront Payment', `₹${parseInt(upfront).toLocaleString('en-IN')}`],
            ['Discount', `₹${parseInt(discount).toLocaleString('en-IN')}`],
            ['Loan Tenure', `${tenure} months`]
        ];
        
        const feeWS = XLSX.utils.aoa_to_sheet(feeData);
        XLSX.utils.book_append_sheet(wb, feeWS, 'Fee Breakdown');
        
        // EMI Calculation Results Sheet
        const emiData = [
            ['EMI CALCULATION RESULTS'],
            ['Subvention Rate', rate],
            ['Loan Amount', loanAmount],
            ['Institute Subvention', subventionAmount],
            ['Monthly EMI', emiAmount]
        ];
        
        const emiWS = XLSX.utils.aoa_to_sheet(emiData);
        XLSX.utils.book_append_sheet(wb, emiWS, 'EMI Results');
        
        // Processing Fees Sheet
        const processingData = [
            ['PROCESSING FEES'],
            ['Processing Fee (2%)', processingFee],
            ['Stamp Duty', stampDuty],
            ['Subtotal', processingSubtotal],
            ['GST (18%)', gstAmount],
            ['Total Processing Fee', totalProcessingFee]
        ];
        
        const processingWS = XLSX.utils.aoa_to_sheet(processingData);
        XLSX.utils.book_append_sheet(wb, processingWS, 'Processing Fees');
        
        // Summary Sheet (Main)
        const summaryData = [
            ['CloudBlitz Education Finance Calculator'],
            ['Smart EMI Planning for Your Learning Journey'],
            [''],
            ['Generated on:', currentDate],
            [''],
            ['STUDENT INFORMATION'],
            ['Student Name', studentName],
            ['City', city],
            ['Center', center],
            ['Course', courseName],
            [''],
            ['FEE BREAKDOWN'],
            ['Total Course Fee', `₹${parseInt(totalFee).toLocaleString('en-IN')}`],
            ['Regular Fees (Loan Eligible)', `₹${parseInt(regularFees).toLocaleString('en-IN')}`],
            ['Pay After Placement', `₹${parseInt(payAfterPlacement).toLocaleString('en-IN')}`],
            ['Upfront Payment', `₹${parseInt(upfront).toLocaleString('en-IN')}`],
            ['Discount', `₹${parseInt(discount).toLocaleString('en-IN')}`],
            ['Loan Tenure', `${tenure} months`],
            [''],
            ['EMI CALCULATION RESULTS'],
            ['Subvention Rate', rate],
            ['Loan Amount', loanAmount],
            ['Institute Subvention', subventionAmount],
            ['Monthly EMI', emiAmount],
            [''],
            ['PROCESSING FEES'],
            ['Processing Fee (2%)', processingFee],
            ['Stamp Duty', stampDuty],
            ['Subtotal', processingSubtotal],
            ['GST (18%)', gstAmount],
            ['Total Processing Fee', totalProcessingFee],
            [''],
            ['IMPORTANT DISCLAIMERS'],
            ['• This is an illustrative calculation based on institute subvention'],
            ['• Results are indicative only and do not represent an offer or approval'],
            ['• Final EMI, fees, and charges will be defined by the bank after credit assessment'],
            ['• Processing fees are payable by the student upfront'],
            ['• CloudBlitz bears the interest cost through subvention to the lender'],
            ['• Bank/NBFC decision is final and binding'],
            [''],
            ['CONTACT INFORMATION'],
            ['For queries, contact: loan.support@cloudblitz.in']
        ];
        
        const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
        
        // Terms & Conditions Sheet
        const termsData = [
            ['🔹 UPDATED TERMS & CONDITIONS (WITH EMI DISCLAIMER)'],
            [''],
            ['1) PURPOSE & SCOPE'],
            ['This calculator provides an illustrative no-cost EMI computation based on institute subvention to the lending partner.'],
            ['Results are indicative only and do not represent an offer, sanction, or approval.'],
            [''],
            ['2) SUBVENTION & NO-COST EMI'],
            ['"No-Cost EMI" to the student means ⚡ CloudBlitz will bear the full interest cost by paying subvention directly to the bank/NBFC.'],
            ['Students repay only the principal loan amount in EMIs, without any additional interest burden.'],
            [''],
            ['3) PROCESSING FEES'],
            ['A processing fee (%) is charged by the lender on the loan amount.'],
            ['⚠️ This processing fee is payable by the student, in addition to any upfront payment.'],
            ['The calculator includes this cost in its computation.'],
            [''],
            ['4) ASSUMPTIONS & DISCLAIMERS'],
            ['EMI shown is Loan Amount ÷ Tenure (interest paid by CloudBlitz).'],
            ['Processing Fee is a student-only cost and is due upfront.'],
            ['⚠️ Important: The EMI displayed by this calculator is tentative. The final EMI, fees, and charges will be defined by the bank after credit assessment and loan approval.'],
            ['Taxes or ancillary charges (if any) are not included.'],
            [''],
            ['5) ELIGIBILITY & DOCUMENTATION'],
            ['Student eligibility, co-applicant requirements, KYC, and bank statement verification are determined by the lender\'s policies.'],
            ['Account Aggregator (AA) flow, if used, requires the applicant\'s OTP consent.'],
            [''],
            ['6) VARIATIONS & CHANGES'],
            ['Rates, tenures, processing fees, and policies are subject to change without notice.'],
            ['Final approval, EMI amount, and charges rest with the lender.'],
            [''],
            ['7) LIABILITY & DISCLAIMER'],
            ['CloudBlitz and its partners are not liable for financial decisions made solely on calculator output.'],
            ['The bank/NBFC decision is final and binding.'],
            [''],
            ['8) CONTACT'],
            ['For updated subvention rates, processing fees, and EMI confirmation, contact CloudBlitz Loan Support:'],
            ['Email: loan.support@cloudblitz.in'],
            [''],
            ['ADDITIONAL TERMS & CONDITIONS'],
            [''],
            ['9) LOAN APPLICATION PROCESS'],
            ['• Student must meet lender\'s eligibility criteria'],
            ['• Complete KYC documentation required'],
            ['• Bank statement verification mandatory'],
            ['• Co-applicant may be required based on loan amount'],
            ['• Credit assessment will be conducted by the lender'],
            [''],
            ['10) REPAYMENT TERMS'],
            ['• EMI payments start after course completion or as per agreement'],
            ['• Late payment charges may apply as per lender\'s policy'],
            ['• Prepayment options available subject to lender\'s terms'],
            ['• Default may affect credit score and future loan eligibility'],
            [''],
            ['11) INSTITUTE SUBVENTION'],
            ['• CloudBlitz pays subvention directly to the lender'],
            ['• Subvention rates are subject to change'],
            ['• Subvention is applicable only for approved courses'],
            ['• Student must complete the course to avail subvention benefits'],
            [''],
            ['12) DATA PRIVACY & SECURITY'],
            ['• Student information is shared with lenders for loan processing'],
            ['• Data is protected as per applicable privacy laws'],
            ['• Information may be used for credit assessment and verification'],
            ['• Students consent to data sharing by using this calculator'],
            [''],
            ['13) DISPUTE RESOLUTION'],
            ['• Any disputes will be resolved through mutual discussion'],
            ['• Legal jurisdiction as per lender\'s terms'],
            ['• CloudBlitz acts as facilitator, not party to loan agreement'],
            ['• Final loan terms are between student and lender'],
            [''],
            ['14) FORCE MAJEURE'],
            ['• CloudBlitz is not liable for delays due to circumstances beyond control'],
            ['• Includes but not limited to natural disasters, government actions, pandemics'],
            ['• Students will be informed of any significant delays'],
            [''],
            ['15) AMENDMENTS'],
            ['• These terms may be updated without prior notice'],
            ['• Updated terms will be posted on CloudBlitz website'],
            ['• Continued use implies acceptance of updated terms'],
            [''],
            ['IMPORTANT NOTICE'],
            ['This calculator is for estimation purposes only. All loan approvals, EMI amounts, interest rates, and terms are subject to the lender\'s final assessment and approval. CloudBlitz does not guarantee loan approval or specific terms. Students are advised to read all loan documents carefully before signing.'],
            [''],
            ['Generated on:', currentDate],
            ['CloudBlitz Education Finance Calculator'],
            ['For support: loan.support@cloudblitz.in']
        ];
        
        const termsWS = XLSX.utils.aoa_to_sheet(termsData);
        XLSX.utils.book_append_sheet(wb, termsWS, 'Terms & Conditions');
        
        // Save the Excel file
        const fileName = `CloudBlitz_EMI_Quote_${studentName.replace(/\s+/g, '_')}_${currentDate.replace(/\s+/g, '_')}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        console.log('Excel file generated successfully');
        alert('Excel quote downloaded successfully!');
        
    } catch (error) {
        console.error('Excel generation error:', error);
        alert('Excel generation failed. Please try again or use the print option.');
    }
}

// Generate detailed PDF with comprehensive terms and conditions
function generateDetailedPDF() {
    try {
        console.log('Generating detailed PDF...');
        
        // Check if jsPDF is available
        if (typeof window.jspdf === 'undefined') {
            console.error('jsPDF library not loaded');
            alert('PDF library not available. Please refresh the page and try again.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Set default font and colors
        doc.setFont('helvetica');
        doc.setTextColor(0, 0, 0);
        
        // Get current date
        const currentDate = new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Get form data
        const studentName = document.getElementById('studentName').value || 'N/A';
        const city = document.getElementById('city').value || 'N/A';
        const center = document.getElementById('center').value || 'N/A';
        const courseName = document.getElementById('courseName').value || 'N/A';
        const totalFee = document.getElementById('totalFee').value || '0';
        const regularFees = document.getElementById('regularFees').value || '0';
        const payAfterPlacement = document.getElementById('payAfterPlacement').value || '0';
        const upfront = document.getElementById('upfront').value || '0';
        const discount = document.getElementById('discount').value || '0';
        const tenure = document.getElementById('tenure').value || 'N/A';
        
        // Get calculated values
        const rate = document.getElementById('rate').textContent;
        const loanAmount = document.getElementById('loanAmount').textContent;
        const subventionAmount = document.getElementById('subventionAmount').textContent;
        const emiAmount = document.getElementById('emiAmount').textContent;
        const processingFee = document.getElementById('processingFee').textContent;
        const stampDuty = document.getElementById('stampDuty').textContent;
        const processingSubtotal = document.getElementById('processingSubtotal').textContent;
        const gstAmount = document.getElementById('gstAmount').textContent;
        const totalProcessingFee = document.getElementById('totalProcessingFee').textContent;
        
        // Header with professional styling
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, 210, 25, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('CloudBlitz Education Finance Calculator', 105, 12, { align: 'center' });
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${currentDate}`, 105, 18, { align: 'center' });
        
        // Reset text color
        doc.setTextColor(0, 0, 0);
        
        // Student Information Section with card design
        doc.setFillColor(248, 249, 250);
        doc.rect(15, 35, 180, 35, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(15, 35, 180, 35, 'S');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('STUDENT INFORMATION', 25, 45);
        
        // Student Information - Clean layout
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        let yPos = 52;
        
        doc.text('Student Name:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(studentName, 80, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('City:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(city, 80, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Center:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(center, 80, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Course:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(courseName, 80, yPos);
        
        // Fee Breakdown Section with card design
        doc.setFillColor(248, 249, 250);
        doc.rect(15, 80, 180, 50, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(15, 80, 180, 50, 'S');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('FEE BREAKDOWN', 25, 90);
        
        // Fee Breakdown - Clean layout
        yPos = 97;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        doc.text('Total Course Fee:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(`₹${parseInt(totalFee).toLocaleString('en-IN')}`, 120, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Regular Fees (Loan Eligible):', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(`₹${parseInt(regularFees).toLocaleString('en-IN')}`, 120, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Pay After Placement:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(`₹${parseInt(payAfterPlacement).toLocaleString('en-IN')}`, 120, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Upfront Payment:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(`₹${parseInt(upfront).toLocaleString('en-IN')}`, 120, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Discount:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(`₹${parseInt(discount).toLocaleString('en-IN')}`, 120, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Loan Tenure:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(`${tenure} months`, 120, yPos);
        
        // EMI Calculation Results Section with card design
        doc.setFillColor(248, 249, 250);
        doc.rect(15, 140, 180, 35, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(15, 140, 180, 35, 'S');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('EMI CALCULATION RESULTS', 25, 150);
        
        // EMI Calculation Results - Clean layout
        yPos = 157;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        doc.text('Subvention Rate:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(rate, 120, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Loan Amount:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(loanAmount, 120, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Institute Subvention:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(subventionAmount, 120, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Monthly EMI:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(emiAmount, 120, yPos);
        
        // Processing Fees Section with highlighted card design
        doc.setFillColor(255, 248, 220);
        doc.rect(15, 185, 180, 40, 'F');
        doc.setDrawColor(255, 193, 7);
        doc.rect(15, 185, 180, 40, 'S');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 140, 0);
        doc.text('PROCESSING FEES', 25, 195);
        
        // Processing Fees - Clean layout with highlight
        yPos = 202;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        doc.text('Processing Fee (2%):', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(processingFee, 120, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Stamp Duty:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(stampDuty, 120, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Subtotal:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(processingSubtotal, 120, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('GST (18%):', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(gstAmount, 120, yPos);
        
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        doc.text('Total Processing Fee:', 25, yPos);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(220, 38, 38);
        doc.text(totalProcessingFee, 120, yPos);
        
        // Add new page for terms and conditions
        doc.addPage();
        
        // Terms & Conditions Header with professional styling
        doc.setFillColor(220, 53, 69);
        doc.rect(0, 0, 210, 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('TERMS & CONDITIONS', 105, 12, { align: 'center' });
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Updated Terms & Conditions (with EMI disclaimer)', 105, 17, { align: 'center' });
        
        // Reset text color
        doc.setTextColor(0, 0, 0);
        
        // Terms & Conditions Table
        const termsData = [
            ['1) PURPOSE & SCOPE', 'This calculator provides an illustrative no-cost EMI computation based on institute subvention to the lending partner. Results are indicative only and do not represent an offer, sanction, or approval.'],
            ['2) SUBVENTION & NO-COST EMI', '"No-Cost EMI" to the student means CloudBlitz will bear the full interest cost by paying subvention directly to the bank/NBFC. Students repay only the principal loan amount in EMIs, without any additional interest burden.'],
            ['3) PROCESSING FEES', 'A processing fee (%) is charged by the lender on the loan amount. This processing fee is payable by the student, in addition to any upfront payment. The calculator includes this cost in its computation.'],
            ['4) ASSUMPTIONS & DISCLAIMERS', 'EMI shown is Loan Amount ÷ Tenure (interest paid by CloudBlitz). Processing Fee is a student-only cost and is due upfront. The EMI displayed by this calculator is tentative. The final EMI, fees, and charges will be defined by the bank after credit assessment and loan approval.'],
            ['5) ELIGIBILITY & DOCUMENTATION', 'Student eligibility, co-applicant requirements, KYC, and bank statement verification are determined by the lender\'s policies. Account Aggregator (AA) flow, if used, requires the applicant\'s OTP consent.'],
            ['6) VARIATIONS & CHANGES', 'Rates, tenures, processing fees, and policies are subject to change without notice. Final approval, EMI amount, and charges rest with the lender.'],
            ['7) LIABILITY & DISCLAIMER', 'CloudBlitz and its partners are not liable for financial decisions made solely on calculator output. The bank/NBFC decision is final and binding.'],
            ['8) CONTACT', 'For updated subvention rates, processing fees, and EMI confirmation, contact CloudBlitz Loan Support: loan.support@cloudblitz.in']
        ];
        
        doc.autoTable({
            startY: 30,
            head: [['Section', 'Details']],
            body: termsData,
            theme: 'grid',
            headStyles: { 
                fillColor: [220, 53, 69],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 9
            },
            styles: { 
                fontSize: 8, 
                cellPadding: 3,
                lineColor: [200, 200, 200],
                lineWidth: 0.2
            },
            columnStyles: {
                0: { cellWidth: 30, halign: 'left' },
                1: { cellWidth: 160, halign: 'left' }
            }
        });
        
        // Additional Terms Section with styling
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(108, 117, 125);
        doc.text('ADDITIONAL TERMS & CONDITIONS', 20, doc.lastAutoTable.finalY + 8);
        
        // Additional Terms Table
        const additionalTermsData = [
            ['9) LOAN APPLICATION PROCESS', 'Student must meet lender\'s eligibility criteria. Complete KYC documentation required. Bank statement verification mandatory. Co-applicant may be required based on loan amount. Credit assessment will be conducted by the lender.'],
            ['10) REPAYMENT TERMS', 'EMI payments start after course completion or as per agreement. Late payment charges may apply as per lender\'s policy. Prepayment options available subject to lender\'s terms. Default may affect credit score and future loan eligibility.'],
            ['11) INSTITUTE SUBVENTION', 'CloudBlitz pays subvention directly to the lender. Subvention rates are subject to change. Subvention is applicable only for approved courses. Student must complete the course to avail subvention benefits.'],
            ['12) DATA PRIVACY & SECURITY', 'Student information is shared with lenders for loan processing. Data is protected as per applicable privacy laws. Information may be used for credit assessment and verification. Students consent to data sharing by using this calculator.'],
            ['13) DISPUTE RESOLUTION', 'Any disputes will be resolved through mutual discussion. Legal jurisdiction as per lender\'s terms. CloudBlitz acts as facilitator, not party to loan agreement. Final loan terms are between student and lender.'],
            ['14) FORCE MAJEURE', 'CloudBlitz is not liable for delays due to circumstances beyond control. Includes but not limited to natural disasters, government actions, pandemics. Students will be informed of any significant delays.'],
            ['15) AMENDMENTS', 'These terms may be updated without prior notice. Updated terms will be posted on CloudBlitz website. Continued use implies acceptance of updated terms.']
        ];
        
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 12,
            head: [['Section', 'Details']],
            body: additionalTermsData,
            theme: 'grid',
            headStyles: { 
                fillColor: [108, 117, 125],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 9
            },
            styles: { 
                fontSize: 8, 
                cellPadding: 3,
                lineColor: [200, 200, 200],
                lineWidth: 0.2
            },
            columnStyles: {
                0: { cellWidth: 30, halign: 'left' },
                1: { cellWidth: 160, halign: 'left' }
            }
        });
        
        // Important Notice Section with highlighted box
        doc.setFillColor(255, 243, 205);
        doc.rect(15, doc.lastAutoTable.finalY + 8, 180, 25, 'F');
        doc.setDrawColor(255, 193, 7);
        doc.rect(15, doc.lastAutoTable.finalY + 8, 180, 25, 'S');
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 140, 0);
        doc.text('IMPORTANT NOTICE', 25, doc.lastAutoTable.finalY + 16);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const noticeText = 'This calculator is for estimation purposes only. All loan approvals, EMI amounts, interest rates, and terms are subject to the lender\'s final assessment and approval. CloudBlitz does not guarantee loan approval or specific terms. Students are advised to read all loan documents carefully before signing.';
        doc.text(noticeText, 25, doc.lastAutoTable.finalY + 22, { maxWidth: 160 });
        
        // Contact Information with styling
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('CONTACT INFORMATION', 20, doc.lastAutoTable.finalY + 35);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text('For queries, contact: loan.support@cloudblitz.in', 20, doc.lastAutoTable.finalY + 42);
        
        // Footer with styling
        doc.setFillColor(248, 249, 250);
        doc.rect(0, 280, 210, 15, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(108, 117, 125);
        doc.text('CloudBlitz Education Finance Calculator - Generated on ' + currentDate, 105, 288, { align: 'center' });
        
        // Save the PDF
        const fileName = `CloudBlitz_EMI_Quote_${studentName.replace(/\s+/g, '_')}_${currentDate.replace(/\s+/g, '_')}.pdf`;
        doc.save(fileName);
        
        console.log('PDF generated successfully');
        alert('PDF quote downloaded successfully!');
        
    } catch (error) {
        console.error('PDF generation error:', error);
        console.log('Falling back to simple PDF generation...');
        
        // Fallback: Generate simple PDF without autoTable
        try {
            generateSimplePDF();
        } catch (fallbackError) {
            console.error('Fallback PDF generation also failed:', fallbackError);
            alert('PDF generation failed. Please use the Excel option or print the page.');
        }
    }
}

// Simple PDF generation fallback
function generateSimplePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Get current date
    const currentDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Get form data
    const studentName = document.getElementById('studentName').value || 'N/A';
    const city = document.getElementById('city').value || 'N/A';
    const center = document.getElementById('center').value || 'N/A';
    const courseName = document.getElementById('courseName').value || 'N/A';
    const totalFee = document.getElementById('totalFee').value || '0';
    const regularFees = document.getElementById('regularFees').value || '0';
    const payAfterPlacement = document.getElementById('payAfterPlacement').value || '0';
    const upfront = document.getElementById('upfront').value || '0';
    const discount = document.getElementById('discount').value || '0';
    const tenure = document.getElementById('tenure').value || 'N/A';
    
    // Get calculated values
    const rate = document.getElementById('rate').textContent;
    const loanAmount = document.getElementById('loanAmount').textContent;
    const subventionAmount = document.getElementById('subventionAmount').textContent;
    const emiAmount = document.getElementById('emiAmount').textContent;
    const processingFee = document.getElementById('processingFee').textContent;
    const stampDuty = document.getElementById('stampDuty').textContent;
    const processingSubtotal = document.getElementById('processingSubtotal').textContent;
    const gstAmount = document.getElementById('gstAmount').textContent;
    const totalProcessingFee = document.getElementById('totalProcessingFee').textContent;
    
    let yPosition = 20;
    
    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CloudBlitz Education Finance Calculator', 105, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${currentDate}`, 105, yPosition, { align: 'center' });
    
    yPosition += 20;
    
    // Student Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT INFORMATION', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student Name: ${studentName}`, 20, yPosition);
    yPosition += 6;
    doc.text(`City: ${city}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Center: ${center}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Course: ${courseName}`, 20, yPosition);
    
    yPosition += 15;
    
    // Fee Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FEE BREAKDOWN', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Course Fee: ₹${parseInt(totalFee).toLocaleString('en-IN')}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Regular Fees (Loan Eligible): ₹${parseInt(regularFees).toLocaleString('en-IN')}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Pay After Placement: ₹${parseInt(payAfterPlacement).toLocaleString('en-IN')}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Upfront Payment: ₹${parseInt(upfront).toLocaleString('en-IN')}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Discount: ₹${parseInt(discount).toLocaleString('en-IN')}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Loan Tenure: ${tenure} months`, 20, yPosition);
    
    yPosition += 15;
    
    // EMI Calculation Results
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EMI CALCULATION RESULTS', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Subvention Rate: ${rate}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Loan Amount: ${loanAmount}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Institute Subvention: ${subventionAmount}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Monthly EMI: ${emiAmount}`, 20, yPosition);
    
    yPosition += 15;
    
    // Processing Fees
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PROCESSING FEES', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Processing Fee (2%): ${processingFee}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Stamp Duty: ${stampDuty}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Subtotal: ${processingSubtotal}`, 20, yPosition);
    yPosition += 6;
    doc.text(`GST (18%): ${gstAmount}`, 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Processing Fee: ${totalProcessingFee}`, 20, yPosition);
    
    yPosition += 20;
    
    // Important Disclaimers
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORTANT DISCLAIMERS', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const disclaimers = [
        '• This is an illustrative calculation based on institute subvention',
        '• Results are indicative only and do not represent an offer or approval',
        '• Final EMI, fees, and charges will be defined by the bank after credit assessment',
        '• Processing fees are payable by the student upfront',
        '• CloudBlitz bears the interest cost through subvention to the lender',
        '• Bank/NBFC decision is final and binding'
    ];
    
    disclaimers.forEach(disclaimer => {
        doc.text(disclaimer, 20, yPosition);
        yPosition += 5;
    });
    
    yPosition += 10;
    
    // Contact Information
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('For queries, contact: loan.support@cloudblitz.in', 20, yPosition);
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('CloudBlitz Education Finance Calculator - Generated on ' + currentDate, 105, 285, { align: 'center' });
    
    // Save the PDF
    const fileName = `CloudBlitz_EMI_Quote_${studentName.replace(/\s+/g, '_')}_${currentDate.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
    
    console.log('Simple PDF generated successfully');
    alert('PDF quote downloaded successfully!');
}

// Download as HTML file (fallback method)
function downloadAsHTML() {
    console.log('Starting HTML download...');
    
    try {
        // Get current date
        const currentDate = new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Get form data
        const studentName = document.getElementById('studentName').value || 'N/A';
        const city = document.getElementById('city').value || 'N/A';
        const center = document.getElementById('center').value || 'N/A';
        const courseName = document.getElementById('courseName').value || 'N/A';
        const totalFee = document.getElementById('totalFee').value || '0';
        const regularFees = document.getElementById('regularFees').value || '0';
        const payAfterPlacement = document.getElementById('payAfterPlacement').value || '0';
        const upfront = document.getElementById('upfront').value || '0';
        const discount = document.getElementById('discount').value || '0';
        const tenure = document.getElementById('tenure').value || 'N/A';
        
        // Get calculated values
        const rate = document.getElementById('rate').textContent;
        const loanAmount = document.getElementById('loanAmount').textContent;
        const subventionAmount = document.getElementById('subventionAmount').textContent;
        const emiAmount = document.getElementById('emiAmount').textContent;
        const processingFee = document.getElementById('processingFee').textContent;
        const stampDuty = document.getElementById('stampDuty').textContent;
        const processingSubtotal = document.getElementById('processingSubtotal').textContent;
        const gstAmount = document.getElementById('gstAmount').textContent;
        const totalProcessingFee = document.getElementById('totalProcessingFee').textContent;
        
        console.log('Form data collected:', { studentName, city, center, courseName });
        
        // Create HTML content
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CloudBlitz EMI Quote - ${studentName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; background: #667eea; color: white; padding: 20px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .section h3 { margin-top: 0; color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .label { font-weight: bold; }
        .value { color: #667eea; font-weight: bold; }
        .highlight { background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .total { background: #ffa500; color: white; padding: 15px; border-radius: 5px; text-align: center; font-weight: bold; }
        .disclaimer { background: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0; }
        .contact { background: #e8f5e8; padding: 15px; border-radius: 5px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CloudBlitz Education Finance Calculator</h1>
        <p>Smart EMI Planning for Your Learning Journey</p>
        <p>Generated on: ${currentDate}</p>
    </div>
    
    <div class="section">
        <h3>Student Information</h3>
        <div class="row"><span class="label">Student Name:</span> <span class="value">${studentName}</span></div>
        <div class="row"><span class="label">City:</span> <span class="value">${city}</span></div>
        <div class="row"><span class="label">Center:</span> <span class="value">${center}</span></div>
        <div class="row"><span class="label">Course:</span> <span class="value">${courseName}</span></div>
    </div>
    
    <div class="section">
        <h3>Fee Breakdown</h3>
        <div class="row"><span class="label">Total Course Fee:</span> <span class="value">₹${parseInt(totalFee).toLocaleString('en-IN')}</span></div>
        <div class="row"><span class="label">Regular Fees (Loan Eligible):</span> <span class="value">₹${parseInt(regularFees).toLocaleString('en-IN')}</span></div>
        <div class="row"><span class="label">Pay After Placement:</span> <span class="value">₹${parseInt(payAfterPlacement).toLocaleString('en-IN')}</span></div>
        <div class="row"><span class="label">Upfront Payment:</span> <span class="value">₹${parseInt(upfront).toLocaleString('en-IN')}</span></div>
        <div class="row"><span class="label">Discount:</span> <span class="value">₹${parseInt(discount).toLocaleString('en-IN')}</span></div>
        <div class="row"><span class="label">Loan Tenure:</span> <span class="value">${tenure} months</span></div>
    </div>
    
    <div class="section">
        <h3>EMI Calculation Results</h3>
        <div class="row"><span class="label">Subvention Rate:</span> <span class="value">${rate}</span></div>
        <div class="row"><span class="label">Loan Amount:</span> <span class="value">${loanAmount}</span></div>
        <div class="row"><span class="label">Institute Subvention:</span> <span class="value">${subventionAmount}</span></div>
        <div class="row"><span class="label">Monthly EMI:</span> <span class="value">${emiAmount}</span></div>
    </div>
    
    <div class="section">
        <h3>Processing Fees</h3>
        <div class="row"><span class="label">Processing Fee (2%):</span> <span class="value">${processingFee}</span></div>
        <div class="row"><span class="label">Stamp Duty:</span> <span class="value">${stampDuty}</span></div>
        <div class="row"><span class="label">Subtotal:</span> <span class="value">${processingSubtotal}</span></div>
        <div class="row"><span class="label">GST (18%):</span> <span class="value">${gstAmount}</span></div>
        <div class="total">Total Processing Fee: ${totalProcessingFee}</div>
    </div>
    
    <div class="disclaimer">
        <h3>Important Disclaimers</h3>
        <ul>
            <li>This is an illustrative calculation based on institute subvention</li>
            <li>Results are indicative only and do not represent an offer or approval</li>
            <li>Final EMI, fees, and charges will be defined by the bank after credit assessment</li>
            <li>Processing fees are payable by the student upfront</li>
            <li>CloudBlitz bears the interest cost through subvention to the lender</li>
            <li>Bank/NBFC decision is final and binding</li>
        </ul>
    </div>
    
    <div class="contact">
        <h3>Contact Information</h3>
        <p>For queries, contact: <strong>loan.support@cloudblitz.in</strong></p>
    </div>
    
    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
        CloudBlitz Education Finance Calculator - Generated on ${currentDate}
    </div>
</body>
</html>`;
        
        // Create and download the file
        console.log('Creating blob and downloading...');
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CloudBlitz_EMI_Quote_${studentName.replace(/\s+/g, '_')}_${currentDate.replace(/\s+/g, '_')}.html`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Download completed successfully');
        alert('Quote downloaded successfully! Check your downloads folder.');
        
    } catch (error) {
        console.error('HTML download error:', error);
        alert('Download failed: ' + error.message + '. Please try the print option instead.');
        window.print();
    }
}

// Initialize the application
function init() {
    addEventListeners();
    calculateAndUpdate(); // Calculate initial values
    
    // Test button functionality
    console.log('Application initialized');
    console.log('Print button:', document.getElementById('printBtn'));
    console.log('Download Excel button:', document.getElementById('downloadBtn'));
    console.log('Download PDF button:', document.getElementById('pdfBtn'));
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
