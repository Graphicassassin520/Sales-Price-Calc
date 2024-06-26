document.addEventListener('DOMContentLoaded', () => {
    const salesPriceInput = document.getElementById('salesPrice');
    const aprSelect = document.getElementById('apr');
    const numPaymentsSelect = document.getElementById('numPayments');
    const downPaymentDisplay = document.getElementById('downPayment');
    const monthlyPaymentDisplay = document.getElementById('monthlyPayment');
    const salesPriceError = document.getElementById('salesPriceError');
    const aprError = document.getElementById('aprError');
    const numPaymentsError = document.getElementById('numPaymentsError');
    const clearButton = document.getElementById('clearButton');

    loadStoredValues();

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }

    function parseCurrency(value) {
        return parseFloat(value.replace(/[^0-9.-]+/g, ""));
    }

    function calculateDownPayment(price) {
        return price * 0.15;
    }

    function calculateMonthlyPayment(price, apr, numPayments) {
        const loanAmount = price - calculateDownPayment(price);
        const monthlyRate = apr / 100 / 12;
        const baseMonthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow((1 + monthlyRate), -numPayments));
        return baseMonthlyPayment + 10; // Adding $10 to the final payment
    }

    function validateInput(value, field, fieldName) {
        if (isNaN(value) || value <= 0) {
            field.textContent = `Please enter a valid ${fieldName}.`;
            field.classList.add('active');
            return false;
        } else {
            field.textContent = '';
            field.classList.remove('active');
            return true;
        }
    }

    function updateDownPaymentDisplay(downPayment) {
        downPaymentDisplay.textContent = formatCurrency(downPayment);
    }

    function updateMonthlyPaymentDisplay(monthlyPayment) {
        monthlyPaymentDisplay.textContent = formatCurrency(monthlyPayment);
    }

    function updatePayments() {
        const salesPrice = parseCurrency(salesPriceInput.value);
        const apr = parseFloat(aprSelect.value);
        const numPayments = parseInt(numPaymentsSelect.value, 10);

        const isSalesPriceValid = validateInput(salesPrice, salesPriceError, "sales price");
        const isAprValid = validateInput(apr, aprError, "APR");
        const isNumPaymentsValid = validateInput(numPayments, numPaymentsError, "number of payments");

        if (!isSalesPriceValid || !isAprValid || !isNumPaymentsValid) {
            updateDownPaymentDisplay(0);
            updateMonthlyPaymentDisplay(0);
            document.querySelector('.results').classList.remove('active');
            return;
        }

        const downPayment = calculateDownPayment(salesPrice);
        const monthlyPayment = calculateMonthlyPayment(salesPrice, apr, numPayments);

        updateDownPaymentDisplay(downPayment);
        updateMonthlyPaymentDisplay(monthlyPayment);
        document.querySelector('.results').classList.add('active');

        // Save values to local storage
        localStorage.setItem('salesPrice', salesPriceInput.value);
        localStorage.setItem('apr', aprSelect.value);
        localStorage.setItem('numPayments', numPaymentsSelect.value);
    }

    function clearInputs() {
        salesPriceInput.value = '';
        aprSelect.value = '16.9';
        numPaymentsSelect.value = '120';
        salesPriceError.textContent = '';
        aprError.textContent = '';
        numPaymentsError.textContent = '';
        updateDownPaymentDisplay(0);
        updateMonthlyPaymentDisplay(0);
        document.querySelector('.results').classList.remove('active');

        // Clear local storage
        localStorage.removeItem('salesPrice');
        localStorage.removeItem('apr');
        localStorage.removeItem('numPayments');
    }

    function loadStoredValues() {
        const storedSalesPrice = localStorage.getItem('salesPrice');
        const storedApr = localStorage.getItem('apr');
        const storedNumPayments = localStorage.getItem('numPayments');

        if (storedSalesPrice) {
            salesPriceInput.value = storedSalesPrice;
        }
        if (storedApr) {
            aprSelect.value = storedApr;
        }
        if (storedNumPayments) {
            numPaymentsSelect.value = storedNumPayments;
        }
        updatePayments();
    }

    function attachEventListeners() {
        salesPriceInput.addEventListener('input', updatePayments);

        salesPriceInput.addEventListener('blur', () => {
            const value = parseCurrency(salesPriceInput.value);
            salesPriceInput.value = value ? formatCurrency(value) : '';
        });

        aprSelect.addEventListener('change', updatePayments);
        numPaymentsSelect.addEventListener('change', updatePayments);
        clearButton.addEventListener('click', clearInputs);
    }

    attachEventListeners();
});

// Export functions for unit testing
module.exports = {
    calculateDownPayment,
    calculateMonthlyPayment
};