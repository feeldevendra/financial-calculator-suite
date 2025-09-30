<?php
/**
 * Uninstall file for Financial Calculator Suite
 *
 * This file will be executed when the plugin is deleted from WordPress.
 * It should remove any plugin-specific options, transients, or custom database entries.
 *
 * @package FinancialCalculatorSuite
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

/**
 * Remove plugin options (if any)
 * Currently, this plugin is client-side only and does not store options.
 * Add any options removal code below if you decide to save settings in the future.
 */

// Example (commented out for now):
// delete_option( 'fcs_some_option_name' );
// delete_site_option( 'fcs_some_network_option' );

/**
 * Remove transients (if used)
 */
// Example (commented out):
// global $wpdb;
// $wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_fcs_%'" );

/**
 * Note:
 * - This plugin does not create custom tables or options by default.
 * - Uninstalling will not affect any user content outside plugin-generated UI.
 */

