<?php
/**
 * Plugin Name: Financial Calculator Suite
 * Plugin URI: https://github.com/feeldevendra/financial-calculator-suite
 * Description: A comprehensive suite of 16 financial calculators with charts, modals, and modern UI/UX.
 * Version: 1.0.0
 * Author: Devendra Lodhi
 * Author URI: https://www.devendra.bio
 * Text Domain: financial-calculator-suite
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) exit; // Exit if accessed directly

// Plugin Constants
define('FCS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('FCS_PLUGIN_DIR', plugin_dir_path(__FILE__));

// Load plugin textdomain
function fcs_load_textdomain() {
    load_plugin_textdomain('financial-calculator-suite', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('plugins_loaded', 'fcs_load_textdomain');

// Enqueue CSS and JS
function fcs_enqueue_assets() {
    // CSS
    wp_enqueue_style(
        'fcs-style',
        FCS_PLUGIN_URL . 'assets/css/finance-calculator.css',
        array(),
        '1.0.0'
    );

    // jQuery
    wp_enqueue_script('jquery');

    // Chart.js CDN
    wp_enqueue_script(
        'chartjs',
        'https://cdn.jsdelivr.net/npm/chart.js',
        array(),
        '4.4.0',
        true
    );

    // Custom JS
    wp_enqueue_script(
        'fcs-script',
        FCS_PLUGIN_URL . 'assets/js/finance-calculator.js',
        array('jquery', 'chartjs'),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'fcs_enqueue_assets');

// Shortcode to render all calculators
function fcs_render_calculators_shortcode() {
    ob_start();
    ?>
    <div class="fcs-container">
        <div class="fcs-search-filter">
            <input type="text" id="fcs-search" placeholder="<?php esc_attr_e('Search calculators...', 'financial-calculator-suite'); ?>" />
            <div class="fcs-category-buttons">
                <button class="fcs-cat-btn" data-category="all"><?php esc_html_e('All', 'financial-calculator-suite'); ?></button>
                <button class="fcs-cat-btn" data-category="sip"><?php esc_html_e('SIP', 'financial-calculator-suite'); ?></button>
                <button class="fcs-cat-btn" data-category="loan"><?php esc_html_e('Loan', 'financial-calculator-suite'); ?></button>
                <button class="fcs-cat-btn" data-category="fd_rd"><?php esc_html_e('FD/RD', 'financial-calculator-suite'); ?></button>
                <button class="fcs-cat-btn" data-category="goal"><?php esc_html_e('Goal Planning', 'financial-calculator-suite'); ?></button>
                <button class="fcs-cat-btn" data-category="swp_stp"><?php esc_html_e('SWP/STP', 'financial-calculator-suite'); ?></button>
                <button class="fcs-cat-btn" data-category="misc"><?php esc_html_e('Misc', 'financial-calculator-suite'); ?></button>
            </div>
        </div>

        <div class="fcs-calculator-grid">
            <!-- JS will populate calculator cards here -->
        </div>

        <div id="fcs-modal" class="fcs-modal">
            <div class="fcs-modal-content">
                <span class="fcs-close">&times;</span>
                <div class="fcs-modal-body">
                    <!-- JS will render selected calculator template here -->
                </div>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('finance_all_calculators', 'fcs_render_calculators_shortcode');
