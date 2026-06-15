<?php
/**
 * Night Club Theme functions and definitions
 */

function night_club_theme_enqueue_assets() {
    $theme_dir = get_template_directory();
    $theme_uri = get_template_directory_uri();
    $manifest_path = $theme_dir . '/dist/.vite/manifest.json'; // Vite 5+ default manifest path

    // If manifest doesn't exist (e.g. during development), we might need another approach
    // but for production build, we read the manifest.
    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), true);
        
        if (isset($manifest['src/main.jsx'])) {
            $entry = $manifest['src/main.jsx'];
            
            // Enqueue JS
            wp_enqueue_script(
                'night-club-app',
                $theme_uri . '/dist/' . $entry['file'],
                [],
                filemtime( $theme_dir . '/dist/' . $entry['file'] ),
                true
            );

            wp_add_inline_script(
                'night-club-app',
                'window.paschaCurrentUser = ' . wp_json_encode( array(
                    'logged_in' => is_user_logged_in(),
                    'is_admin'  => current_user_can( 'manage_options' ),
                ) ) . ';',
                'before'
            );

            // Enqueue CSS
            if (isset($entry['css'])) {
                foreach ($entry['css'] as $index => $css_file) {
                    wp_enqueue_style(
                        'night-club-style-' . $index,
                        $theme_uri . '/dist/' . $css_file,
                        [],
                        filemtime( $theme_dir . '/dist/' . $css_file )
                    );
                }
            }
        }
    } else {
        // Fallback for dev if needed, or just a warning
        if (is_user_logged_in()) {
            add_action('wp_footer', function() {
                echo "<!-- Vite manifest not found at: " . esc_html($manifest_path) . " -->";
            });
        }
    }
}
add_action('wp_enqueue_scripts', 'night_club_theme_enqueue_assets');

// Ensure React Router works by redirecting all non-file requests to index.php
function night_club_theme_rewrite_rules() {
    add_rewrite_rule('^[^/]+\.(js|css|png|jpg|jpeg|gif|svg|ico)$', '', 'bottom'); // Let static files pass
    add_rewrite_rule('^.*$', 'index.php', 'bottom');
}
// add_action('init', 'night_club_theme_rewrite_rules'); // Uncomment if you want WP to handle all routing to React

// Theme Support
function night_club_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'night_club_theme_setup');

// Disable default WordPress login/register redirect for React Router compatibility
remove_action('template_redirect', 'wp_redirect_admin_locations', 1000);

// Ensure React Router handles auth routes
add_action('init', function() {
    add_rewrite_rule('^(login|register|forgot-password|registration-form|work-with-us|girls|profile|appointment|user-dashboard|girl-dashboard|legal-notice|privacy-policy)/?', 'index.php', 'top');
    flush_rewrite_rules();
});
add_filter('query_vars', function($vars) {
    $vars[] = 'auth_page';
    return $vars;
});

add_action('wp_footer', function() {
    ?>
    <script>
        (function () {
            if (window.location.pathname.replace(/\/+$/, '') !== '/work-with-us/nightclub') {
                return;
            }

            var link = document.createElement('a');
            link.href = '/girls/nightclub';
            link.textContent = 'View Nightclub Girls';
            link.style.cssText = [
                'position:fixed',
                'right:24px',
                'bottom:24px',
                'z-index:9999',
                'background:#E3087E',
                'color:#fff',
                'padding:14px 18px',
                'border-radius:999px',
                'font:700 12px/1.2 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
                'letter-spacing:.12em',
                'text-transform:uppercase',
                'text-decoration:none',
                'box-shadow:0 10px 30px rgba(227,8,126,.35)'
            ].join(';');

            document.body.appendChild(link);
        })();
    </script>
    <?php
});
