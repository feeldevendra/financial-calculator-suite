<?php
/**
 * Plugin Name: Financial Calculator Suite
 * Plugin URI: https://github.com/feeldevendra/financial-calculator-suite
 * Description: A comprehensive suite of 16 financial calculators with charts, modals, and modern UI/UX.
 * Version: 1.0.0
 * Author: Devendra Lodhi
 * Author URI: https://www.devendra.bio
 * Text Domain: financial-calculator-suite
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

// Define plugin constants
define('FCS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('FCS_PLUGIN_PATH', plugin_dir_path(__FILE__));

/** -----------------------------
 * Enqueue CSS & JS
 * -----------------------------
 */
function fcs_enqueue_assets() {
    // CSS
    wp_enqueue_style('fcs-style', FCS_PLUGIN_URL . 'assets/css/finance-calculator.css', array(), '1.0.0');

    // JS
    wp_enqueue_script('jquery');
    wp_enqueue_script('chart-js', 'https://cdn.jsdelivr.net/npm/chart.js', array(), null, true);
    wp_enqueue_script('fcs-script', FCS_PLUGIN_URL . 'assets/js/finance-calculator.js', array('jquery', 'chart-js'), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'fcs_enqueue_assets');

/** -----------------------------
 * Shortcode to render all calculators
 * -----------------------------
 */
function fcs_render_calculators() {
    ob_start();
    ?>
    <div class="fcs-calculator-container">

        <!-- Search Bar -->
        <div class="fcs-search-bar">
            <input type="text" id="fcs-search" placeholder="Search calculators..." />
        </div>

        <!-- Categories -->
        <div class="fcs-categories" style="margin-bottom:20px;">
            <button class="fcs-category-btn" data-category="all">All</button>
            <button class="fcs-category-btn" data-category="sip">SIP</button>
            <button class="fcs-category-btn" data-category="loan">Loan</button>
            <button class="fcs-category-btn" data-category="fd-rd">FD/RD</button>
            <button class="fcs-category-btn" data-category="goal">Goal Planning</button>
            <button class="fcs-category-btn" data-category="swp-stp">SWP/STP</button>
            <button class="fcs-category-btn" data-category="misc">Misc</button>
        </div>

        <!-- Grid of Calculators -->
        <div class="fcs-grid">
            <?php
            $calculators = array(
                'SIP Calculator' => 'sip-calculator',
                'Lumpsum Calculator' => 'lumpsum-calculator',
                'Loan Calculator' => 'loan-calculator',
                'Goal Planner' => 'goal-planner-tabs',
                'Analyze SIP' => 'analyze-sip',
                'Compare SIP' => 'compare-sip',
                'Quick SIP' => 'quick-sip',
                'SIP Delay Cost' => 'sip-delay-cost',
                'Tenure Calculator' => 'tenure-calculator',
                'STP Calculator' => 'stp-calculator',
                'SWP Calculator' => 'swp-calculator',
                'Loan + SIP Calculator' => 'loan-sip-calculator',
                'FD Calculator' => 'fd-calculator',
                'RD Calculator' => 'rd-calculator',
                'Smoke Cost Calculator' => 'smoke-cost-calculator',
                'SIP + SWP Calculator' => 'sip-swp-calculator'
            );

            foreach($calculators as $name => $id) {
                echo '<div class="fcs-calculator-item" data-category="'.$id.'">';
                echo '<button class="fcs-calculator-btn" data-calc="'.$id.'">'.$name.'</button>';
                echo '</div>';
            }
            ?>
        </div>

        <!-- Modal -->
        <div id="fcs-modal">
            <div class="fcs-modal-content">
                <span class="fcs-modal-close">&times;</span>
                <!-- Calculator template will be loaded here dynamically -->
            </div>
        </div>

        <!-- Hidden Templates -->
        <div style="display:none;">
            <?php
            foreach($calculators as $name => $id) {
                $template_file = FCS_PLUGIN_PATH . "templates/{$id}.html";
                if(file_exists($template_file)) {
                    echo '<div id="'.$id.'">';
                    include($template_file);
                    echo '</div>';
                }
            }
            ?>
        </div>

    </div>

    <script>
        // Basic Search & Category Filtering
        jQuery(document).ready(function($){
            $('#fcs-search').on('keyup', function(){
                var val = $(this).val().toLowerCase();
                $('.fcs-calculator-item').each(function(){
                    $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
                });
            });

            $('.fcs-category-btn').on('click', function(){
                var cat = $(this).data('category');
                if(cat === 'all') {
                    $('.fcs-calculator-item').show();
                } else {
                    $('.fcs-calculator-item').hide();
                    $('.fcs-calculator-item[data-category*="'+cat+'"]').show();
                }
            });
        });
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('finance_all_calculators', 'fcs_render_calculators');

/** -----------------------------
 * Load Text Domain
 * -----------------------------
 */
function fcs_load_textdomain() {
    load_plugin_textdomain('financial-calculator-suite', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('plugins_loaded', 'fcs_load_textdomain');
