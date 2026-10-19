<?php
require 'wp-load.php';
$users = get_users(['role' => 'subscriber', 'meta_key' => 'pbm_user_type', 'meta_value' => 'girl']);
foreach($users as $u) {
    if (in_array($u->display_name, ['Sara Romania', 'Seline', 'Selina'])) {
        echo "=== " . $u->display_name . " ===\n";
        echo "Thumbnail (img): " . get_user_meta($u->ID, 'pbm_girl_img', true) . "\n";
        echo "Images: " . get_user_meta($u->ID, 'pbm_girl_images', true) . "\n\n";
    }
}
