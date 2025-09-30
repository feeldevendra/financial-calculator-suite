/* ==========================================================
   Financial Calculator Suite - JS
   Author: Devendra Lodhi / FlyBoost
   Portfolio: www.devendra.bio
   Agency: www.flyboost.in
   File: finance-calculator.js
========================================================== */

jQuery(document).ready(function ($) {
  const $wrapper = $('#fcs-app');
  const $modal = $('#fcs-modal-overlay');
  const $modalContent = $('#fcs-modal-content');

  /* ---------- Modal Functions ---------- */
  function openModal(html) {
    $modalContent.html(html);
    $modal.addClass('active');
  }

  function closeModal() {
    $modal.removeClass('active');
    $modalContent.empty();
  }

  $('#fcs-modal-close').on('click', closeModal);
  $modal.on('click', function (e) {
    if (e.target === this) closeModal();
  });

  /* ---------- Category Filter ---------- */
  $('.fcs-cat-btn').on('click', function () {
    const category = $(this).data('cat');
    $('.fcs-cat-btn').removeClass('active');
    $(this).addClass('active');

    $('.fcs-grid-item').each(function () {
      const itemCat = $(this).data('category');
      if (category === 'all' || category === itemCat) $(this).show();
      else $(this).hide();
    });
  });

  /* ---------- Search Filter ---------- */
  $('#fcs-search-input').on('input', function () {
    const query = $(this).val().toLowerCase();
    $('.fcs-grid-item').each(function () {
      const title = $(this).find('.fcs-title').text().toLowerCase();
      $(this).toggle(title.includes(query));
    });
  });

  $('#fcs-search-clear').on('click', function () {
    $('#fcs-search-input').val('').trigger('input');
  });

  /* ---------- Advanced Toggle ---------- */
  $wrapper.on('change', '.fcs-advanced-toggle', function () {
    $(this).closest('form').find('.fcs-advanced').slideToggle();
  });

  /* ---------- Modal Calculator Open ---------- */
  $('.fcs-grid-item').on('click', function () {
    const calcId = $(this).data('id');
    const template = $(`#tmpl-fcs-${calcId}`).html();
    if (template) openModal(template);
    initDatepicker();
    initCalcButtons();
  });

  /* ---------- Datepicker Initialization ---------- */
  function initDatepicker() {
    $('.fcs-datepicker').datepicker({
      dateFormat: 'dd-mm-yy',
      changeMonth: true,
      changeYear: true,
    });
  }

  /* ---------- Calculator Buttons ---------- */
  function initCalcButtons() {
    $('.fcs-calc-btn').off('click').on('click', function () {
      const $calc = $(this).closest('.fcs-calculator');
      const type = $(this).data('calc');

      switch (type) {
        case 'sip': sipCalc($calc); break;
        case 'lumpsum': lumpsumCalc($calc); break;
        case 'loan': loanCalc($calc); break;
        case 'fd': fdCalc($calc); break;
        case 'rd': rdCalc($calc); break;
        case 'goal': goalCalc($calc); break;
        case 'stp': stpCalc($calc); break;
        case 'swp': swpCalc($calc); break;
        case 'compare_sip': compareSipCalc($calc); break;
        case 'quick_sip': quickSipCalc($calc); break;
        case 'sip_delay': sipDelayCalc($calc); break;
        case 'tenure': tenureCalc($calc); break;
        case 'loan_sip': loanSipCalc($calc); break;
        case 'analyze_sip': analyzeSipCalc($calc); break;
        case 'smoke_cost': smokeCostCalc($calc); break;
        case 'sip_swp': sipSwpCalc($calc); break;
        default: console.warn('Calculator not implemented:', type);
      }
    });
  }

  /* ---------- Helper Functions ---------- */
  function formatCurrency(num) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);
  }

  function renderChart($calc, labels, data) {
    const ctx = $calc.find('.fcs-chart')[0].getContext('2d');
    if ($calc.data('chart')) $calc.data('chart').destroy();
    const chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Growth', data, borderColor: '#28a745', backgroundColor: 'rgba(40,167,69,0.2)', fill: true }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
    $calc.data('chart', chart);
  }

  /* ---------- Calculator Implementations ---------- */

  // SIP
  function sipCalc($calc) {
    const monthly = parseFloat($calc.find('input[name="monthly"]').val()) || 0;
    const rate = parseFloat($calc.find('input[name="rate"]').val()) / 100 || 0;
    const period = parseInt($calc.find('input[name="period"]').val()) || 0;
    const unit = $calc.find('select[name="period_unit"]').val();
    const months = unit === 'months' ? period : period * 12;

    const fv = monthly * ((Math.pow(1 + rate / 12, months) - 1) / (rate / 12));
    $calc.find('.fcs-results').html(`Future Value: <strong>${formatCurrency(fv)}</strong>`);

    const labels = Array.from({ length: months }, (_, i) => i + 1);
    const data = labels.map(i => monthly * ((Math.pow(1 + rate / 12, i) - 1) / (rate / 12)));
    renderChart($calc, labels, data);
  }

  // Lumpsum
  function lumpsumCalc($calc) {
    const principal = parseFloat($calc.find('input[name="principal"]').val()) || 0;
    const rate = parseFloat($calc.find('input[name="rate"]').val()) / 100 || 0;
    const period = parseInt($calc.find('input[name="period"]').val()) || 0;
    const unit = $calc.find('select[name="period_unit"]').val();
    const years = unit === 'months' ? period / 12 : period;

    const fv = principal * Math.pow(1 + rate, years);
    $calc.find('.fcs-results').html(`Future Value: <strong>${formatCurrency(fv)}</strong>`);

    const labels = Array.from({ length: Math.ceil(years) }, (_, i) => i + 1);
    const data = labels.map(i => principal * Math.pow(1 + rate, i));
    renderChart($calc, labels, data);
  }

  // Loan
  function loanCalc($calc) {
    const principal = parseFloat($calc.find('input[name="loan_amount"]').val()) || 0;
    const rate = parseFloat($calc.find('input[name="rate"]').val()) / 100 || 0;
    const tenure = parseInt($calc.find('input[name="tenure"]').val()) || 0;
    const unit = $calc.find('select[name="tenure_unit"]').val();
    const months = unit === 'months' ? tenure : tenure * 12;

    const monthlyRate = rate / 12;
    const emi = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
    $calc.find('.fcs-results').html(`Monthly EMI: <strong>${formatCurrency(emi)}</strong>`);

    const labels = Array.from({ length: months }, (_, i) => i + 1);
    const data = labels.map(i => emi * (i + 1));
    renderChart($calc, labels, data);
  }

  // FD
  function fdCalc($calc) {
    const principal = parseFloat($calc.find('input[name="fd_amount"]').val()) || 0;
    const rate = parseFloat($calc.find('input[name="rate"]').val()) / 100 || 0;
    const term = parseInt($calc.find('input[name="term"]').val()) || 0;
    const unit = $calc.find('select[name="term_unit"]').val();
    let years = term;
    if (unit === 'months') years = term / 12;
    if (unit === 'days') years = term / 365;

    const fv = principal * Math.pow(1 + rate, years);
    $calc.find('.fcs-results').html(`Maturity Value: <strong>${formatCurrency(fv)}</strong>`);

    const labels = Array.from({ length: Math.ceil(years) }, (_, i) => i + 1);
    const data = labels.map(i => principal * Math.pow(1 + rate, i));
    renderChart($calc, labels, data);
  }

  // RD
  function rdCalc($calc) {
    const recurring = parseFloat($calc.find('input[name="recurring"]').val()) || 0;
    const rate = parseFloat($calc.find('input[name="rate"]').val()) / 100 || 0;
    const period = parseInt($calc.find('input[name="period"]').val()) || 0;
    const unit = $calc.find('select[name="period_unit"]').val();
    const months = unit === 'months' ? period : period * 12;

    const fv = recurring * ((Math.pow(1 + rate / 12, months) - 1) / (rate / 12)) * (1 + rate / 12);
    $calc.find('.fcs-results').html(`Maturity Value: <strong>${formatCurrency(fv)}</strong>`);

    const labels = Array.from({ length: months }, (_, i) => i + 1);
    const data = labels.map(i => recurring * ((Math.pow(1 + rate / 12, i) - 1) / (rate / 12)) * (1 + rate / 12));
    renderChart($calc, labels, data);
  }

  // Goal Planner
  function goalCalc($calc) {
    const target = parseFloat($calc.find('.fcs-goal-target').val()) || 0;
    const current = parseFloat($calc.find('.fcs-goal-current').val()) || 0;
    const years = parseFloat($calc.find('.fcs-goal-years').val()) || 0;
    const rate = parseFloat($calc.find('.fcs-goal-return').val()) / 100 || 0;
    const monthly = (target - current * Math.pow(1 + rate, years)) * (rate / 12) / (Math.pow(1 + rate / 12, years * 12) - 1);

    $calc.find('.fcs-results').html(`Monthly Investment Required: <strong>${formatCurrency(monthly)}</strong>`);

    const labels = Array.from({ length: years * 12 }, (_, i) => i + 1);
    const data = labels.map(i => monthly * ((Math.pow(1 + rate / 12, i) - 1) / (rate / 12)));
    renderChart($calc, labels, data);
  }

  // STP (Systematic Transfer Plan)
  function stpCalc($calc) {
    const amount = parseFloat($calc.find('input[name="stp_amount"]').val()) || 0;
    const rateFrom = parseFloat($calc.find('input[name="rate_from"]').val()) / 100 || 0;
    const rateTo = parseFloat($calc.find('input[name="rate_to"]').val()) / 100 || 0;
    const months = parseInt($calc.find('input[name="months"]').val()) || 0;

    const fv = amount * ((Math.pow(1 + rateTo / 12, months) - 1) / (rateTo / 12));
    $calc.find('.fcs-results').html(`Future Value: <strong>${formatCurrency(fv)}</strong>`);

    const labels = Array.from({ length: months }, (_, i) => i + 1);
    const data = labels.map(i => amount * ((Math.pow(1 + rateTo / 12, i) - 1) / (rateTo / 12)));
    renderChart($calc, labels, data);
  }

  // SWP (Systematic Withdrawal Plan)
  function swpCalc($calc) {
    const principal = parseFloat($calc.find('input[name="swp_principal"]').val()) || 0;
    const rate = parseFloat($calc.find('input[name="swp_rate"]').val()) / 100 || 0;
    const months = parseInt($calc.find('input[name="swp_months"]').val()) || 0;

    const withdrawal = principal * rate / 12 / (1 - Math.pow(1 + rate / 12, -months));
    $calc.find('.fcs-results').html(`Monthly Withdrawal: <strong>${formatCurrency(withdrawal)}</strong>`);

    const labels = Array.from({ length: months }, (_, i) => i + 1);
    const data = labels.map(i => principal * Math.pow(1 + rate / 12, i) - withdrawal * ((Math.pow(1 + rate / 12, i) - 1) / (rate / 12)));
    renderChart($calc, labels, data);
  }

  // Compare SIP
  function compareSipCalc($calc) {
    const sip1 = parseFloat($calc.find('input[name="sip1"]').val()) || 0;
    const rate1 = parseFloat($calc.find('input[name="rate1"]').val()) / 100 || 0;
    const sip2 = parseFloat($calc.find('input[name="sip2"]').val()) || 0;
    const rate2 = parseFloat($calc.find('input[name="rate2"]').val()) / 100 || 0;
    const months = parseInt($calc.find('input[name="months"]').val()) || 0;

    const fv1 = sip1 * ((Math.pow(1 + rate1 / 12, months) - 1) / (rate1 / 12));
    const fv2 = sip2 * ((Math.pow(1 + rate2 / 12, months) - 1) / (rate2 / 12));

    $calc.find('.fcs-results').html(`SIP1 FV: <strong>${formatCurrency(fv1)}</strong><br>SIP2 FV: <strong>${formatCurrency(fv2)}</strong>`);

    const labels = Array.from({ length: months }, (_, i) => i + 1);
    const data1 = labels.map(i => sip1 * ((Math.pow(1 + rate1 / 12, i) - 1) / (rate1 / 12)));
    const data2 = labels.map(i => sip2 * ((Math.pow(1 + rate2 / 12, i) - 1) / (rate2 / 12)));

    renderChart($calc, labels, data1);
    renderChart($calc, labels, data2);
  }

  // Quick SIP (simple variant of SIP)
  function quickSipCalc($calc) { sipCalc($calc); }

  // SIP Delay (impact of delayed SIP)
  function sipDelayCalc($calc) {
    const monthly = parseFloat($calc.find('input[name="monthly"]').val()) || 0;
    const rate = parseFloat($calc.find('input[name="rate"]').val()) / 100 || 0;
    const period = parseInt($calc.find('input[name="period"]').val()) || 0;
    const delay = parseInt($calc.find('input[name="delay"]').val()) || 0;
    const months = period * 12;
    const fv = monthly * ((Math.pow(1 + rate / 12, months - delay) - 1) / (rate / 12));
    $calc.find('.fcs-results').html(`Future Value after Delay: <strong>${formatCurrency(fv)}</strong>`);
  }

  // Tenure Calculator
  function tenureCalc($calc) {
    const principal = parseFloat($calc.find('input[name="principal"]').val()) || 0;
    const emi = parseFloat($calc.find('input[name="emi"]').val()) || 0;
    const rate = parseFloat($calc.find('input[name="rate"]').val()) / 100 || 0;
    const months = Math.log(emi / (emi - principal * rate / 12)) / Math.log(1 + rate / 12);
    $calc.find('.fcs-results').html(`Tenure: <strong>${Math.ceil(months)} months</strong>`);
  }

  // Loan + SIP
  function loanSipCalc($calc) {
    const loanAmount = parseFloat($calc.find('input[name="loan_amount"]').val()) || 0;
    const rate = parseFloat($calc.find('input[name="rate"]').val()) / 100 || 0;
    const emi = parseFloat($calc.find('input[name="emi"]').val()) || 0;
    const months = Math.log(emi / (emi - loanAmount * rate / 12)) / Math.log(1 + rate / 12);
    $calc.find('.fcs-results').html(`Loan Tenure: <strong>${Math.ceil(months)} months</strong>`);
  }

  // Analyze SIP
  function analyzeSipCalc($calc) {
    const monthly = parseFloat($calc.find('input[name="monthly"]').val()) || 0;
    const rate = parseFloat($calc.find('input[name="rate"]').val()) / 100 || 0;
    const period = parseInt($calc.find('input[name="period"]').val()) || 0;
    const months = period * 12;
    const fv = monthly * ((Math.pow(1 + rate / 12, months) - 1) / (rate / 12));
    $calc.find('.fcs-results').html(`Future Value: <strong>${formatCurrency(fv)}</strong>`);
  }

  // Smoke Cost
  function smokeCostCalc($calc) {
    const packs = parseFloat($calc.find('input[name="packs"]').val()) || 0;
    const price = parseFloat($calc.find('input[name="price"]').val()) || 0;
    const years = parseInt($calc.find('input[name="years"]').val()) || 0;
    const total = packs * price * 365 * years;
    $calc.find('.fcs-results').html(`Money Spent: <strong>${formatCurrency(total)}</strong>`);
  }

  // SIP + SWP
  function sipSwpCalc($calc) {
    sipCalc($calc); swpCalc($calc);
  }

  // Initialize for default template
  initDatepicker();
  initCalcButtons();
});
