jQuery(document).ready(function($) {

    /** -----------------------------
     * Modal Handling
     * -----------------------------
     */
    var $modal = $('#fcs-modal');

    function openCalculator(templateId) {
        // Load template into modal
        var templateHtml = $('#' + templateId).html();
        $modal.find('.fcs-modal-content').html(templateHtml);

        // Add close button if not exists
        if ($modal.find('.fcs-modal-close').length === 0) {
            $modal.find('.fcs-modal-content').prepend('<span class="fcs-modal-close">&times;</span>');
        }

        $modal.fadeIn();

        // Attach logic for loaded calculator
        attachCalculatorLogic(templateId);
    }

    // Close modal
    $modal.on('click', '.fcs-modal-close', function() {
        $modal.fadeOut();
        $modal.find('.fcs-modal-content').html('');
    });

    // Calculator button click
    $(document).on('click', '.fcs-calculator-btn', function() {
        var calcId = $(this).data('calc');
        openCalculator(calcId);
    });

    /** -----------------------------
     * Helpers
     * -----------------------------
     */
    function compoundInterest(principal, rate, time, freq) {
        return principal * Math.pow((1 + rate / 100 / freq), freq * time);
    }

    function formatCurrency(num) {
        return '₹' + parseFloat(num).toLocaleString('en-IN', {maximumFractionDigits: 2});
    }

    /** -----------------------------
     * Generic Chart Functions
     * -----------------------------
     */
    function drawLineChart(canvasId, labels, data, labelName) {
        var ctx = document.getElementById(canvasId);
        if (!ctx) return;
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: labelName,
                    data: data,
                    borderColor: '#43e97b',
                    fill: false,
                    tension: 0.3
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    function drawPieChart(canvasId, labels, data) {
        var ctx = document.getElementById(canvasId);
        if (!ctx) return;
        new Chart(ctx.getContext('2d'), {
            type: 'pie',
            data: { labels: labels, datasets: [{ data: data, backgroundColor: ['#38f9d7','#4facfe'] }] },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    /** -----------------------------
     * Attach Calculator Logic
     * -----------------------------
     */
    function attachCalculatorLogic(calcId) {

        /** --------- SIP Calculator --------- */
        if (calcId === 'sip-calculator') {
            $('#fcs-calc-sip').on('click', function() {
                var investment = parseFloat($('#sip-investment').val()) || 0;
                var rate = parseFloat($('#sip-return').val()) || 0;
                var period = parseFloat($('#sip-period').val()) || 0;
                var months = period * 12;
                var maturity = 0;

                for (var i = 1; i <= months; i++) {
                    maturity += investment * Math.pow(1 + rate / 100 / 12, months - i + 1);
                }

                $('#sip-result').html('Maturity Amount: ' + formatCurrency(maturity));

                // Charts
                drawLineChart('sip-line-chart', Array.from({length: months}, (_, i) => i + 1),
                    Array.from({length: months}, (_, i) => investment * (i + 1)), 'SIP Growth');

                var invested = investment * months;
                var returns = maturity - invested;
                drawPieChart('sip-pie-chart', ['Invested', 'Returns'], [invested, returns]);
            });
        }

        /** --------- Lumpsum Calculator --------- */
        if (calcId === 'lumpsum-calculator') {
            $('#fcs-calc-lumpsum').on('click', function() {
                var principal = parseFloat($('#lumpsum-amount').val()) || 0;
                var rate = parseFloat($('#lumpsum-return').val()) || 0;
                var period = parseFloat($('#lumpsum-period').val()) || 0;
                var freq = 1; // yearly compounding
                var maturity = compoundInterest(principal, rate, period, freq);

                $('#lumpsum-result').html('Maturity Amount: ' + formatCurrency(maturity));

                var labels = Array.from({length: period}, (_, i) => i + 1);
                var data = labels.map(y => compoundInterest(principal, rate, y, freq));
                drawLineChart('lumpsum-line-chart', labels, data, 'Growth');
            });
        }

        /** --------- Additional Calculators Placeholder --------- */
        // Repeat similar structure for Loan, Goal Planner, STP, SWP, FD, RD, etc.
        // Example:
        // if(calcId === 'loan-calculator') { ... }
    }

    /** -----------------------------
     * Fallback if Chart.js is missing
     * -----------------------------
     */
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded. Charts will not render.');
    }

});
