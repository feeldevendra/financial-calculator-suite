<?php
/**
 * Plugin Name: Financial Calculator Suite
 * Plugin URI:  https://github.com/feeldevendra/financial-calculator-suite
 * Description: A comprehensive suite of 16 interactive financial calculators with modern UI/UX, charts, and modals. Elementor/Astra friendly, responsive and client-side only.
 * Version:     1.0.0
 * Author:      Devendra Lodhi
 * Author URI:  https://www.devendra.bio, https://www.flyboost.in
 * Text Domain: financial-calculator-suite
 * Domain Path: /languages
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package FinancialCalculatorSuite
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Define constants
 */
define( 'FCS_PLUGIN_FILE', __FILE__ );
define( 'FCS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'FCS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'FCS_VERSION', '1.0.0' );

/**
 * Enqueue frontend assets
 */
function fcs_enqueue_assets() {
	// CSS
	wp_register_style(
		'fcs-style',
		FCS_PLUGIN_URL . 'assets/css/finance-calculator.css',
		array(),
		FCS_VERSION
	);
	wp_enqueue_style( 'fcs-style' );

	// jQuery UI datepicker (WP core)
	wp_enqueue_script( 'jquery-ui-core' );
	wp_enqueue_script( 'jquery-ui-datepicker' );

	// Chart.js from CDN (register & enqueue)
	wp_register_script(
		'chart-js',
		'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
		array(),
		'4.4.0',
		true
	);
	wp_enqueue_script( 'chart-js' );

	// Main plugin JS
	wp_register_script(
		'fcs-script',
		FCS_PLUGIN_URL . 'assets/js/finance-calculator.js',
		array( 'jquery', 'jquery-ui-datepicker', 'chart-js' ),
		FCS_VERSION,
		true
	);

	// Localize plugin data for JS
	$localize = array(
		'ajax_url'        => admin_url( 'admin-ajax.php' ),
		'plugin_url'      => FCS_PLUGIN_URL,
		'currency_symbol' => '₹',
		'locale'          => 'en-IN',
		'nonce'           => wp_create_nonce( 'fcs_nonce' ),
		'strings'         => array(
			'loading' => __( 'Loading...', 'financial-calculator-suite' ),
		),
	);
	wp_localize_script( 'fcs-script', 'FCS', $localize );

	wp_enqueue_script( 'fcs-script' );

	// Optional inline CSS for jQuery UI fallback
	$inline_css = ".ui-datepicker { font-size: 13px; }";
	wp_add_inline_style( 'fcs-style', $inline_css );
}
add_action( 'wp_enqueue_scripts', 'fcs_enqueue_assets' );

/**
 * Register shortcode: [finance_all_calculators]
 */
function fcs_render_all_calculators_shortcode( $atts = array() ) {
	$atts = shortcode_atts(
		array(
			'layout' => 'grid',
		),
		$atts,
		'finance_all_calculators'
	);

	ob_start();
	?>

	<div id="fcs-app" class="fcs-wrapper">
		<header class="fcs-header">
			<div class="fcs-search">
				<input type="search" id="fcs-search-input" placeholder="<?php esc_attr_e( 'Search calculators (e.g., SIP, Loan)...', 'financial-calculator-suite' ); ?>" aria-label="<?php esc_attr_e( 'Search calculators', 'financial-calculator-suite' ); ?>">
				<button id="fcs-search-clear" title="<?php esc_attr_e( 'Clear search', 'financial-calculator-suite' ); ?>">×</button>
			</div>

			<nav class="fcs-categories" role="navigation" aria-label="<?php esc_attr_e( 'Calculator categories', 'financial-calculator-suite' ); ?>">
				<button class="fcs-cat-btn active" data-cat="all"><?php esc_html_e( 'All', 'financial-calculator-suite' ); ?></button>
				<button class="fcs-cat-btn" data-cat="sip"><?php esc_html_e( 'SIP', 'financial-calculator-suite' ); ?></button>
				<button class="fcs-cat-btn" data-cat="loan"><?php esc_html_e( 'Loan', 'financial-calculator-suite' ); ?></button>
				<button class="fcs-cat-btn" data-cat="fd-rd"><?php esc_html_e( 'FD/RD', 'financial-calculator-suite' ); ?></button>
				<button class="fcs-cat-btn" data-cat="goal"><?php esc_html_e( 'Goal Planning', 'financial-calculator-suite' ); ?></button>
				<button class="fcs-cat-btn" data-cat="stp-swp"><?php esc_html_e( 'SWP/STP', 'financial-calculator-suite' ); ?></button>
				<button class="fcs-cat-btn" data-cat="misc"><?php esc_html_e( 'Misc', 'financial-calculator-suite' ); ?></button>
			</nav>
		</header>

		<main class="fcs-main">
			<section class="fcs-grid" id="fcs-calculator-grid">
				<?php
				$calculators = array(
					array( 'id' => 'sip',          'title' => 'SIP Calculator',          'cat' => 'sip' ),
					array( 'id' => 'lumpsum',      'title' => 'Lumpsum Investment',     'cat' => 'sip' ),
					array( 'id' => 'loan',         'title' => 'Loan Calculator',        'cat' => 'loan' ),
					array( 'id' => 'goal',         'title' => 'Goal Planner',           'cat' => 'goal' ),
					array( 'id' => 'analyze_sip',  'title' => 'Analyze Your SIP',       'cat' => 'sip' ),
					array( 'id' => 'compare_sip',  'title' => 'Compare SIP',            'cat' => 'sip' ),
					array( 'id' => 'quick_sip',    'title' => 'Quick SIP',              'cat' => 'sip' ),
					array( 'id' => 'sip_delay',    'title' => 'SIP Delay Cost',         'cat' => 'sip' ),
					array( 'id' => 'tenure',       'title' => 'Tenure Calculator',      'cat' => 'sip' ),
					array( 'id' => 'stp',          'title' => 'STP Calculator',         'cat' => 'stp-swp' ),
					array( 'id' => 'swp',          'title' => 'SWP Calculator',         'cat' => 'stp-swp' ),
					array( 'id' => 'loan_sip',     'title' => 'Loan + SIP',             'cat' => 'loan' ),
					array( 'id' => 'fd',           'title' => 'FD Calculator',          'cat' => 'fd-rd' ),
					array( 'id' => 'rd',           'title' => 'RD Calculator',          'cat' => 'fd-rd' ),
					array( 'id' => 'smoke_cost',   'title' => 'Smoke Cost Calculator',  'cat' => 'misc' ),
					array( 'id' => 'sip_swp',      'title' => 'SIP + SWP Calculator',   'cat' => 'stp-swp' ),
				);

				foreach ( $calculators as $calc ) : ?>
					<button class="fcs-grid-item" data-id="<?php echo esc_attr( $calc['id'] ); ?>" data-category="<?php echo esc_attr( $calc['cat'] ); ?>">
						<span class="fcs-icon" aria-hidden="true">💹</span>
						<span class="fcs-title"><?php echo esc_html( $calc['title'] ); ?></span>
					</button>
				<?php endforeach; ?>
			</section>
		</main>

		<!-- Modal container -->
		<div id="fcs-modal-overlay" class="fcs-modal-overlay" aria-hidden="true">
			<div id="fcs-modal" class="fcs-modal" role="dialog" aria-modal="true" aria-labelledby="fcs-modal-title">
				<button id="fcs-modal-close" class="fcs-modal-close" aria-label="<?php esc_attr_e( 'Close calculator', 'financial-calculator-suite' ); ?>">×</button>
				<div id="fcs-modal-content" class="fcs-modal-content">
					<div class="fcs-loading"><?php esc_html_e( 'Loading...', 'financial-calculator-suite' ); ?></div>
				</div>
			</div>
		</div>

	</div> <!-- #fcs-app -->

	<?php
	// Load Goal Planner template from templates folder if exists
	$goal_template_path = FCS_PLUGIN_DIR . 'templates/goal-planner-tabs.html';
	if ( file_exists( $goal_template_path ) ) {
		$goal_html = wp_kses_post( file_get_contents( $goal_template_path ) );
		printf( '<script type="text/template" id="tmpl-fcs-goal-planner">%s</script>', $goal_html );
	}

	return ob_get_clean();
}
add_shortcode( 'finance_all_calculators', 'fcs_render_all_calculators_shortcode' );

/**
 * Load plugin textdomain
 */
function fcs_load_textdomain() {
	load_plugin_textdomain( 'financial-calculator-suite', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'plugins_loaded', 'fcs_load_textdomain' );

/**
 * Notes:
 * - All calculation logic, modal handling, advanced options, validation and charts are handled in assets/js/finance-calculator.js
 * - Templates are safe, minimal, and enhanced by JS dynamically.
 */

