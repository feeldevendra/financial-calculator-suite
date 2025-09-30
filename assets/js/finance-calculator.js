jQuery(document).ready(function($) {
    // Modal container
    var $modal = $('#fcs-modal');

    // Function to open modal with selected calculator template
    function openCalculator(templateId) {
        var templateHtml = $('#' + templateId).html();
        $modal.find('.fcs-modal-content').html(templateHtml);
        $modal.fadeIn();
    }

    // Close modal
    $modal.on('click', '.fcs-modal-close', function() {
        $modal.fadeOut();
        $modal.find('.fcs-modal-content').html('');
    });

    // Handle calculator button clicks
    $('.fcs-calculator-btn').on('click', function() {
        var calcId = $(this).data('calc');
        openCalculator(calcId);
    });

    /** -----------------------------
     * CALCULATOR LOGIC FUNCTIONS
     * -----------------------------
     */

    // Helper: Compound Interest
    function compoundInterest(principal, rate, time, freq) {
        var n = freq; // times compounded per year
        return principal * Math.pow((1 + rate / 100 / n), n * time);
    }

    // Helper: Format currency
    function formatCurrency(num) {
        return '₹' + parseFloat(num).toLocaleString('en-IN', {maximumFractionDigits: 2});
    }

    /** -----------------------------
     * SIP Calculator
     * -----------------------------
     */
    $(document).on('click', '#fcs-calc-sip', function() {
        var investment = parseFloat($('#sip-investment').val()) || 0;
        var rate = parseFloat($('#sip-return').val()) || 0;
        var period = parseFloat($('#sip-period').val()) || 0;
        var freq = 12; // monthly
        var months = period * 12;
        var maturity = 0;

        for (var i = 1; i <= months; i++) {
            maturity += investment * Math.pow(1 + rate / 100 / 12, months - i + 1);
        }

        $('#sip-result').html('Maturity Amount: ' + formatCurrency(maturity));

        // Chart
        var ctx = document.getElementById('sip-line-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: months}, (_, i) => i + 1),
                datasets: [{
                    label: 'SIP Growth',
                    data: Array.from({length: months}, (_, i) => investment * (i + 1)),
                    borderColor: '#43e97b',
                    fill: false,
                    tension: 0.3
                }]
            }
        });

        // Pie Chart: Invested vs Returns
        var invested = investment * months;
        var returns = maturity - invested;
        var ctxPie = document.getElementById('sip-pie-chart').getContext('2d');
        new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: ['Invested', 'Returns'],
                datasets: [{
                    data: [invested, returns],
                    backgroundColor: ['#38f9d7','#4facfe']
                }]
            }
        });
    });

    /** -----------------------------
     * Other calculators' logic will follow similar structure
     * Each button click event with ID triggers calculation and charts
     * -----------------------------
     */

    // Example: Lumpsum Calculator
    $(document).on('click', '#fcs-calc-lumpsum', function() {
        var principal = parseFloat($('#lumpsum-amount').val()) || 0;
        var rate = parseFloat($('#lumpsum-return').val()) || 0;
        var period = parseFloat($('#lumpsum-period').val()) || 0;
        var freq = 1; // yearly compounding
        var maturity = compoundInterest(principal, rate, period, freq);
        $('#lumpsum-result').html('Maturity Amount: ' + formatCurrency(maturity));

        // Charts
        var ctx = document.getElementById('lumpsum-line-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: period}, (_, i) => i + 1),
                datasets: [{
                    label: 'Growth',
                    data: Array.from({length: period}, (_, i) => compoundInterest(principal, rate, i+1, freq)),
                    borderColor: '#43e97b',
                    fill: false
                }]
            }
        });
    });

    /** -----------------------------
     * Fallback for missing Chart.js
     * -----------------------------
     */
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded. Charts will not render.');
    }
});
