jQuery(document).ready(function($) {

    /* =============================
       1. List of Calculators
       ============================= */
    const calculators = [
        { id: 'sip', name: 'SIP Calculator', category: 'sip', template: 'sip-calculator.html' },
        { id: 'lumpsum', name: 'Lumpsum Calculator', category: 'fd_rd', template: 'lumpsum-calculator.html' },
        { id: 'loan', name: 'Loan Calculator', category: 'loan', template: 'loan-calculator.html' },
        { id: 'goal', name: 'Goal Planner', category: 'goal', template: 'goal-planner.html' },
        { id: 'analyze-sip', name: 'Analyze SIP', category: 'sip', template: 'analyze-sip.html' },
        { id: 'compare-sip', name: 'Compare SIP', category: 'sip', template: 'compare-sip.html' },
        { id: 'quick-sip', name: 'Quick SIP', category: 'sip', template: 'quick-sip.html' },
        { id: 'sip-delay', name: 'SIP Delay Cost', category: 'sip', template: 'sip-delay.html' },
        { id: 'tenure', name: 'Tenure Calculator', category: 'misc', template: 'tenure-calculator.html' },
        { id: 'stp', name: 'STP Calculator', category: 'swp_stp', template: 'stp-calculator.html' },
        { id: 'swp', name: 'SWP Calculator', category: 'swp_stp', template: 'swp-calculator.html' },
        { id: 'loan-sip', name: 'Loan + SIP', category: 'loan', template: 'loan-sip-calculator.html' },
        { id: 'fd', name: 'FD Calculator', category: 'fd_rd', template: 'fd-calculator.html' },
        { id: 'rd', name: 'RD Calculator', category: 'fd_rd', template: 'rd-calculator.html' },
        { id: 'smoke-cost', name: 'Smoke Cost Calculator', category: 'misc', template: 'smoke-cost-calculator.html' },
        { id: 'sip-swp', name: 'SIP + SWP Calculator', category: 'swp_stp', template: 'sip-swp-calculator.html' },
    ];

    const pluginURL = fcs_vars.plugin_url || '';

    /* =============================
       2. Render Calculator Cards
       ============================= */
    function renderCards(filter = 'all') {
        const $grid = $('.fcs-calculator-grid');
        $grid.empty();
        calculators.forEach(calc => {
            if (filter === 'all' || calc.category === filter) {
                const card = `<div class="fcs-calculator-card" data-id="${calc.id}" data-template="${calc.template}">
                                <h3>${calc.name}</h3>
                                <p>Click to open</p>
                              </div>`;
                $grid.append(card);
            }
        });
    }

    renderCards(); // Initial render all

    /* =============================
       3. Category Filter
       ============================= */
    $('.fcs-cat-btn').on('click', function() {
        const category = $(this).data('category');
        renderCards(category);
    });

    /* =============================
       4. Search Filter
       ============================= */
    $('#fcs-search').on('input', function() {
        const search = $(this).val().toLowerCase();
        $('.fcs-calculator-card').each(function() {
            const name = $(this).find('h3').text().toLowerCase();
            $(this).toggle(name.includes(search));
        });
    });

    /* =============================
       5. Modal Logic
       ============================= */
    const $modal = $('#fcs-modal');
    const $modalBody = $modal.find('.fcs-modal-body');

    // Open modal
    $(document).on('click', '.fcs-calculator-card', function() {
        const templateFile = $(this).data('template');
        $.get(pluginURL + 'templates/' + templateFile, function(data) {
            $modalBody.html(data);
            $modal.fadeIn();
        });
    });

    // Close modal
    $('.fcs-close, .fcs-modal').on('click', function(e) {
        if (e.target !== this && !$(e.target).hasClass('fcs-close')) return;
        $modal.fadeOut(function() {
            $modalBody.empty();
        });
    });

    /* =============================
       6. Example Calculation Functions
       ============================= */
    // SIP Calculator
    $(document).on('click', '#fcs-calc-sip', function() {
        const P = parseFloat($('#sip-investment').val());
        const r = parseFloat($('#sip-return').val()) / 100 / 12;
        const n = parseFloat($('#sip-period').val()) * 12;

        if (isNaN(P) || isNaN(r) || isNaN(n)) {
            alert('Please enter valid numbers');
            return;
        }

        // SIP formula FV = P * ((1+r)^n - 1)/r * (1+r)
        const FV = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

        $('#sip-result').text('Future Value: ₹' + FV.toFixed(2));

        // Line chart for growth
        const labels = [];
        const data = [];
        for (let i = 1; i <= n; i++) {
            labels.push(i);
            data.push(P * ((Math.pow(1 + r, i) - 1) / r) * (1 + r));
        }

        const ctx = document.getElementById('sip-chart').getContext('2d');
        if (window.sipChart) window.sipChart.destroy();
        window.sipChart = new Chart(ctx, {
            type: 'line',
            data: { labels: labels, datasets: [{ label: 'SIP Growth', data: data, borderColor: '#43e97b', fill: true, backgroundColor: 'rgba(67,233,123,0.2)' }] },
            options: { responsive: true, plugins: { legend: { display: true } } }
        });
    });

    // Placeholder: Similar functions will be added for all other calculators
});
