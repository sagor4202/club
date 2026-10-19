<?php
/**
 * Night Club Theme functions and definitions
 */

function night_club_theme_enqueue_assets() {
    $theme_dir = get_template_directory();
    $theme_uri = get_template_directory_uri();
    $manifest_path = $theme_dir . '/dist/.vite/manifest.json';

    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), true);
        
        if (isset($manifest['src/main.jsx'])) {
            $entry = $manifest['src/main.jsx'];
            
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
        if (is_user_logged_in()) {
            add_action('wp_footer', function() {
                echo "<!-- Vite manifest not found at: " . esc_html($manifest_path) . " -->";
            });
        }
    }
}
add_action('wp_enqueue_scripts', 'night_club_theme_enqueue_assets');

function night_club_theme_rewrite_rules() {
    add_rewrite_rule('^[^/]+\.(js|css|png|jpg|jpeg|gif|svg|ico)$', '', 'bottom');
    add_rewrite_rule('^.*$', 'index.php', 'bottom');
}

function night_club_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'night_club_theme_setup');

remove_action('template_redirect', 'wp_redirect_admin_locations', 1000);

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

add_action('init', function() {
    if (!isset($_GET['night_deploy'])) return;
    if (!is_user_logged_in() || !current_user_can('manage_options')) {
        die('err:unauthorized');
    }
    
    $type = $_GET['night_deploy'];
    $raw = file_get_contents('php://input');
    $base = __DIR__ . '/dist';
    
    switch ($type) {
        case 'js':
            file_put_contents($base . '/assets/main-B8MaioTm.js', $raw);
            break;
        case 'manifest':
            file_put_contents($base . '/.vite/manifest.json', $raw);
            break;
        default:
            die('err:unknown');
    }
    die('ok:' . $type);
});
