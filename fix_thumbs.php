<?php
require 'wp-load.php';
$users = get_users(['role' => 'subscriber', 'meta_key' => 'pbm_user_type', 'meta_value' => 'girl']);
foreach($users as $u) {
    $img = get_user_meta($u->ID, 'pbm_girl_img', true);
    if (empty($img) || $img === '[object Object]') {
        $images = get_user_meta($u->ID, 'pbm_girl_images', true);
        if ($images) {
            $images_array = json_decode($images, true);
            if (is_array($images_array) && count($images_array) > 0) {
                $first_image = $images_array[0];
                if (isset($first_image['url'])) {
                    update_user_meta($u->ID, 'pbm_girl_img', $first_image['url']);
                    update_user_meta($u->ID, 'pbm_girl_img_type', $first_image['type'] ?? 'image');
                    echo "Fixed thumbnail for: " . $u->display_name . "\n";
                }
            }
        }
    }
}
echo "Done.\n";
