<?php
/**
 * Plugin Name: Career Page Popup Fix
 * Description: Stabilizes the floating popup trigger on the Career page only.
 * Version: 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', function() {
	$settings = get_post_meta( 20442, '_elementor_page_settings', true );
	if ( ! is_array( $settings ) ) {
		return;
	}

	$changed = false;

	if ( ( $settings['horizontal_position'] ?? '' ) !== 'right' ) {
		$settings['horizontal_position'] = 'right';
		$changed = true;
	}

	$margin = $settings['margin'] ?? array();
	if ( is_array( $margin ) ) {
		$desired = array(
			'unit'     => 'px',
			'top'      => '0',
			'right'    => '20',
			'bottom'   => '0',
			'left'     => '50',
			'isLinked' => false,
		);

		if ( array_diff_assoc( $desired, $margin ) || array_diff_assoc( $margin, $desired ) ) {
			$settings['margin'] = $desired;
			$changed = true;
		}
	}

	if ( $changed ) {
		update_post_meta( 20442, '_elementor_page_settings', $settings );
	}
}, 20 );

add_action( 'wp_default_scripts', function( $scripts ) {
	if ( is_admin() || ! isset( $scripts->registered['jquery'] ) ) {
		return;
	}

	if ( isset( $scripts->registered['jquery']->deps ) && is_array( $scripts->registered['jquery']->deps ) ) {
		$scripts->registered['jquery']->deps = array_diff( $scripts->registered['jquery']->deps, array( 'jquery-migrate' ) );
	}
} );

add_action( 'wp_enqueue_scripts', function() {
	if ( is_admin() || ! is_page( 'career' ) ) {
		return;
	}

	$css = <<<'CSS'
.career-popup-floating {
	position: fixed !important;
	left: 24px !important;
	right: auto !important;
	bottom: 36px !important;
	top: auto !important;
	z-index: 9999 !important;
	margin: 0 !important;
}

.career-popup-floating .elementor-widget-container {
	margin: 0 !important;
	padding: 0 !important;
}

.career-popup-floating .elementor-icon-wrapper {
	text-align: center !important;
}

.career-popup-floating .elementor-icon {
	width: 62px;
	height: 62px;
	display: inline-flex !important;
	align-items: center;
	justify-content: center;
	border-radius: 999px;
	background: #35a7b2;
	color: #ffffff !important;
	box-shadow: 0 18px 40px rgba(53, 167, 178, 0.28);
	text-decoration: none !important;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.career-popup-floating .elementor-icon:hover,
.career-popup-floating .elementor-icon:focus-visible {
	transform: translateY(-2px);
	box-shadow: 0 22px 44px rgba(53, 167, 178, 0.34);
}

.career-popup-floating .elementor-icon i,
.career-popup-floating .elementor-icon svg {
	font-size: 24px !important;
	width: 24px;
	height: 24px;
	line-height: 1;
	color: inherit !important;
	fill: currentColor !important;
}

#elementor-popup-modal-20442 {
	justify-content: flex-end !important;
	align-items: center !important;
	padding-left: 20px;
	padding-right: 20px;
}

#elementor-popup-modal-20442 .dialog-widget-content {
	margin-top: 0 !important;
	background: #ffffff !important;
	border-radius: 14px !important;
	box-shadow: 2px 8px 23px 3px rgba(0, 0, 0, 0.2) !important;
	animation: careerPopupSlideRight 0.38s cubic-bezier(0.22, 1, 0.36, 1) !important;
	transform-origin: right center;
}

#elementor-popup-modal-20442 .elementor.elementor-20442,
#elementor-popup-modal-20442 .elementor-element.elementor-element-d3965a5,
#elementor-popup-modal-20442 .e-con-inner {
	background: #ffffff !important;
}

#elementor-popup-modal-20442 .elementor.elementor-20442 {
	position: relative !important;
}

#elementor-popup-modal-20442 .career-inline-close {
	position: absolute;
	top: 10px;
	right: 10px;
	width: 32px;
	height: 32px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: 0;
	border-radius: 999px;
	background: rgba(53, 167, 178, 0.1);
	color: #35a7b2;
	cursor: pointer;
	z-index: 10002;
	padding: 0;
	overflow: visible;
}

#elementor-popup-modal-20442 .career-inline-close:hover,
#elementor-popup-modal-20442 .career-inline-close:focus-visible {
	background: rgba(53, 167, 178, 0.16);
	color: #006971;
	outline: none;
}

#elementor-popup-modal-20442 .career-inline-close::before,
#elementor-popup-modal-20442 .career-inline-close::after {
	content: "";
	position: absolute;
	width: 14px;
	height: 2px;
	border-radius: 999px;
	background: currentColor;
}

#elementor-popup-modal-20442 .career-inline-close::before {
	transform: rotate(45deg);
}

#elementor-popup-modal-20442 .career-inline-close::after {
	transform: rotate(-45deg);
}

#elementor-popup-modal-20442 .dialog-message {
	width: min(320px, calc(100vw - 40px)) !important;
	max-width: 320px !important;
	margin-left: auto !important;
	margin-right: 0 !important;
	display: flex !important;
	justify-content: flex-end !important;
}

@media (min-width: 768px) {
	#elementor-popup-modal-20442 {
		justify-content: flex-start !important;
		align-items: flex-start !important;
		padding: 0 !important;
	}

	#elementor-popup-modal-20442 .dialog-message {
		position: fixed !important;
		left: 96px !important;
		bottom: 24px !important;
		top: auto !important;
		right: auto !important;
		margin: 0 !important;
		justify-content: flex-start !important;
		z-index: 100000 !important;
	}

	#elementor-popup-modal-20442 .dialog-widget-content {
		margin-top: 0 !important;
	}
}

#elementor-popup-modal-20442 .dialog-close-button {
	top: -8px !important;
	right: 10px !important;
	left: auto !important;
	width: 32px !important;
	height: 32px !important;
	display: flex !important;
	align-items: center !important;
	justify-content: center !important;
	border-radius: 999px !important;
	background: rgba(53, 167, 178, 0.1) !important;
	color: #35a7b2 !important;
	font-size: 14px !important;
	line-height: 1 !important;
	padding: 0 !important;
	z-index: 10001 !important;
	pointer-events: auto !important;
	cursor: pointer !important;
}

@media (min-width: 768px) {
	#elementor-popup-modal-20442 .dialog-close-button {
		display: flex !important;
		opacity: 1 !important;
		visibility: visible !important;
		position: absolute !important;
		top: 10px !important;
		right: 10px !important;
	}
}

#elementor-popup-modal-20442 .dialog-close-button i,
#elementor-popup-modal-20442 .dialog-close-button svg {
	width: 14px !important;
	height: 14px !important;
	font-size: 14px !important;
	fill: currentColor !important;
}

#elementor-popup-modal-20442 .dialog-close-button:hover,
#elementor-popup-modal-20442 .dialog-close-button:focus-visible {
	background: rgba(53, 167, 178, 0.16) !important;
	color: #006971 !important;
}

#form-field-field_677d20b.is-selected {
	border-color: #35a7b2 !important;
	background: #f7fcfc !important;
	box-shadow: 0 0 0 3px rgba(53, 167, 178, 0.08) !important;
}

#form-field-field_677d20b.is-selected::after {
	content: attr(data-file-label) !important;
	color: #575757 !important;
	font-size: 15px !important;
	font-weight: 400 !important;
	line-height: 1.45 !important;
	text-align: center !important;
	padding-right: 0 !important;
}

.career-upload-list {
	margin-top: 12px;
	display: grid;
	gap: 8px;
}

.career-upload-list[hidden] {
	display: none !important;
}

.career-upload-item {
	display: grid;
	grid-template-columns: 20px 1fr 18px;
	gap: 10px;
	align-items: center;
	padding: 12px 14px;
	border-radius: 8px;
	border: 1px solid #18c37e;
	background: #103a32;
	color: #ffffff;
}

.career-upload-item::before {
	content: "";
	width: 18px;
	height: 18px;
	margin-top: 2px;
	background: no-repeat center/contain url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2318c37e' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z'/%3E%3Cpath d='M14 2v5h5'/%3E%3C/svg%3E");
	display: block;
}

.career-upload-name {
	display: block;
	font-size: 14px;
	font-weight: 600;
	line-height: 1.25;
	word-break: break-word;
}

.career-upload-size {
	display: block;
	margin-top: 2px;
	color: rgba(255, 255, 255, 0.72);
	font-size: 12px;
	line-height: 1.3;
}

.career-upload-remove {
	width: 18px;
	height: 18px;
	border: 0;
	padding: 0;
	background: no-repeat center/contain url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ff6b6b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6h18'/%3E%3Cpath d='M8 6V4h8v2'/%3E%3Cpath d='M19 6l-1 14H6L5 6'/%3E%3Cpath d='M10 11v6'/%3E%3Cpath d='M14 11v6'/%3E%3C/svg%3E");
	cursor: pointer;
	opacity: 0.95;
}

.career-upload-remove:hover,
.career-upload-remove:focus-visible {
	opacity: 1;
	outline: none;
	transform: scale(1.05);
}

.career-upload-error {
	margin-top: 8px;
	color: #c62828;
	font-size: 13px;
	line-height: 1.4;
}

body.career-popup-open .career-popup-floating {
	opacity: 0 !important;
	visibility: hidden !important;
	pointer-events: none !important;
}

#elementor-popup-modal-20442.career-popup-closing .dialog-widget-content {
	animation: careerPopupSlideOutRight 0.28s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

@keyframes careerPopupSlideRight {
	0% {
		opacity: 0;
		transform: translateX(38px);
	}
	100% {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes careerPopupSlideOutRight {
	0% {
		opacity: 1;
		transform: translateX(0);
	}
	100% {
		opacity: 0;
		transform: translateX(34px);
	}
}

@media (min-width: 1440px) {
	.elementor-20381 .elementor-element.elementor-element-d253885,
	.elementor-20381 .elementor-element.elementor-element-e6c6fcc,
	.elementor-20381 .elementor-element.elementor-element-897862b {
		--content-width: 1540px;
		--padding-left: 32px;
		--padding-right: 32px;
	}

	.elementor-20381 .elementor-element.elementor-element-4e39995 {
		--min-height: 820px;
	}

	.elementor-20381 .elementor-element.elementor-element-122c682 .wcf--video-box img,
	.elementor-20381 .elementor-element.elementor-element-122c682 .wcf--video-box .thumb video {
		height: 820px;
	}

	.elementor-20381 .elementor-element.elementor-element-b6c6a0b .wcf--title {
		font-size: 76px;
		line-height: 82px;
	}

	.elementor-20381 .elementor-element.elementor-element-02e0e5f .wcf--title,
	.elementor-20381 .elementor-element.elementor-element-48d0302 .wcf--title {
		font-size: 86px;
		line-height: 86px;
	}

	.elementor-20381 .elementor-element.elementor-element-5756e17 {
		--margin-bottom: 96px;
	}
}

@media (min-width: 1680px) {
	.elementor-20381 .elementor-element.elementor-element-d253885,
	.elementor-20381 .elementor-element.elementor-element-e6c6fcc,
	.elementor-20381 .elementor-element.elementor-element-897862b {
		--content-width: 1660px;
		--padding-left: 40px;
		--padding-right: 40px;
	}

	.elementor-20381 .elementor-element.elementor-element-4e39995 {
		--width: 41%;
		--min-height: 860px;
	}

	.elementor-20381 .elementor-element.elementor-element-8ee130a {
		--width: 47%;
	}

	.elementor-20381 .elementor-element.elementor-element-122c682 .wcf--video-box img,
	.elementor-20381 .elementor-element.elementor-element-122c682 .wcf--video-box .thumb video {
		height: 860px;
	}

	.elementor-20381 .elementor-element.elementor-element-b6c6a0b .wcf--title {
		font-size: 84px;
		line-height: 88px;
	}

	.elementor-20381 .elementor-element.elementor-element-02e0e5f .wcf--title,
	.elementor-20381 .elementor-element.elementor-element-48d0302 .wcf--title {
		font-size: 94px;
		line-height: 94px;
	}

	.elementor-20381 .elementor-element.elementor-element-3db53a5 .wcf--text,
	.elementor-20381 .elementor-element.elementor-element-3db53a5 .wcf--text *,
	.elementor-20381 .elementor-element.elementor-element-816b17c .elementor-icon-list-item > .elementor-icon-list-text,
	.elementor-20381 .elementor-element.elementor-element-816b17c .elementor-icon-list-item > a {
		font-size: 18px;
		line-height: 30px;
	}
}

@media (min-width: 1920px) {
	.elementor-20381 .elementor-element.elementor-element-d253885,
	.elementor-20381 .elementor-element.elementor-element-e6c6fcc,
	.elementor-20381 .elementor-element.elementor-element-897862b {
		--content-width: 1760px;
		--padding-left: 52px;
		--padding-right: 52px;
	}

	.elementor-20381 .elementor-element.elementor-element-d253885 {
		--padding-top: 72px;
		--padding-bottom: 170px;
	}

	.elementor-20381 .elementor-element.elementor-element-e6c6fcc,
	.elementor-20381 .elementor-element.elementor-element-897862b {
		--padding-top: 170px;
		--padding-bottom: 80px;
	}

	.elementor-20381 .elementor-element.elementor-element-4e39995 {
		--min-height: 920px;
	}

	.elementor-20381 .elementor-element.elementor-element-122c682 .wcf--video-box img,
	.elementor-20381 .elementor-element.elementor-element-122c682 .wcf--video-box .thumb video {
		height: 920px;
	}

	.elementor-20381 .elementor-element.elementor-element-b6c6a0b .wcf--title {
		font-size: 92px;
		line-height: 96px;
	}

	.elementor-20381 .elementor-element.elementor-element-02e0e5f .wcf--title,
	.elementor-20381 .elementor-element.elementor-element-48d0302 .wcf--title {
		font-size: 104px;
		line-height: 102px;
	}

	.elementor-20381 .elementor-element.elementor-element-613a45b .wcf__btn a,
	.elementor-20381 .elementor-element.elementor-element-898ea83 .wcf__btn a,
	.elementor-20381 .elementor-element.elementor-element-aad41a5 .wcf__btn a,
	.elementor-20381 .elementor-element.elementor-element-99f9537 .wcf__btn a,
	.elementor-20381 .elementor-element.elementor-element-434d869 .wcf__btn a {
		padding: 18px 32px;
		font-size: 17px;
	}
}

@media (max-width: 767px) {
	.career-popup-floating {
		left: 16px !important;
		right: auto !important;
		bottom: 24px !important;
	}

	.career-popup-floating .elementor-icon {
		width: 56px;
		height: 56px;
	}

	.career-popup-floating .elementor-icon i,
	.career-popup-floating .elementor-icon svg {
		font-size: 22px !important;
		width: 22px;
		height: 22px;
	}

	#elementor-popup-modal-20442 {
		position: fixed !important;
		inset: 0 !important;
		justify-content: center !important;
		align-items: center !important;
		background: transparent !important;
		padding-left: 10px;
		padding-right: 10px;
		overflow-y: auto !important;
		-webkit-overflow-scrolling: touch;
	}

	#elementor-popup-modal-20442 .dialog-message {
		position: relative !important;
		top: auto !important;
		right: auto !important;
		left: auto !important;
		bottom: auto !important;
		width: min(320px, calc(100vw - 20px)) !important;
		max-width: calc(100vw - 20px) !important;
		margin: auto !important;
		justify-content: center !important;
	}

	#elementor-popup-modal-20442 .dialog-widget-content {
		margin-top: 121px !important;
		margin-left: 20px !important;
		margin-right: auto !important;
		max-height: calc(100vh - 92px) !important;
		overflow-y: auto !important;
		-webkit-overflow-scrolling: touch;
	}
}
CSS;

	$js = <<<'JS'
(function () {
	function getPopupModule() {
		return window.elementorProFrontend &&
			window.elementorProFrontend.modules &&
			window.elementorProFrontend.modules.popup &&
			typeof window.elementorProFrontend.modules.popup.showPopup === 'function'
			? window.elementorProFrontend.modules.popup
			: null;
	}

	function decodeBase64Json(value) {
		if (!value) {
			return null;
		}

		try {
			return JSON.parse(window.atob(value));
		} catch (e) {
			return null;
		}
	}

	function decodePopupSettings(link) {
		if (!link) {
			return null;
		}

		var href = link.getAttribute('href') || '';
		var decoded = href;

		try {
			decoded = decodeURIComponent(href);
		} catch (e) {}

		var settingsMatch = decoded.match(/settings=([^&]+)/);
		if (settingsMatch && settingsMatch[1]) {
			var parsedSettings = decodeBase64Json(settingsMatch[1]);
			if (parsedSettings && parsedSettings.id) {
				return parsedSettings;
			}
		}

		var directMatch = decoded.match(/"id":"?(\d+)"?/);
		if (directMatch && directMatch[1]) {
			return { id: directMatch[1], toggle: false };
		}

		var queryMatch = decoded.match(/id=(\d+)/);
		if (queryMatch && queryMatch[1]) {
			return { id: queryMatch[1], toggle: false };
		}

		return null;
	}

	function openCareerPopup(link, event) {
		var popupModule = getPopupModule();
		var settings = decodePopupSettings(link);

		if (!popupModule || !settings || !settings.id) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		popupModule.showPopup({
			id: String(settings.id),
			toggle: !!settings.toggle
		});
	}

	function bindCareerPopup() {
		var widget = document.querySelector('.elementor-20381 .elementor-element.elementor-element-bdf36d5');
		if (!widget) {
			return;
		}

		if (!widget.classList.contains('career-popup-floating')) {
			widget.classList.add('career-popup-floating');
			document.body.appendChild(widget);
		}

		var link = widget.querySelector('a');
		if (!link || link.dataset.careerPopupBound === 'yes') {
			return;
		}

		link.dataset.careerPopupBound = 'yes';
		link.style.pointerEvents = 'auto';
		widget.style.pointerEvents = 'auto';

		['click', 'touchend'].forEach(function (eventName) {
			link.addEventListener(eventName, function (event) {
				openCareerPopup(link, event);
			}, true);
		});
	}

	function bindUploadFeedback() {
		var input = document.getElementById('form-field-field_677d20b');
		if (input) {
			input.setAttribute('accept', '.pdf,application/pdf');
			input.setAttribute('data-file-label', 'Click to upload your CV\A PDF (max 2MB)');
			ensureUploadUi(input);
		}

		if (document.body.dataset.careerUploadDelegatedBound === 'yes') {
			return;
		}

		document.body.dataset.careerUploadDelegatedBound = 'yes';

		document.addEventListener('change', function (event) {
			var changedInput = event.target;
			if (!changedInput || changedInput.id !== 'form-field-field_677d20b') {
				return;
			}

			changedInput.setAttribute('accept', '.pdf,application/pdf');
			handleUploadChange(changedInput);
		}, true);
	}

	function ensureUploadUi(input) {
		if (!input) {
			return null;
		}

		var wrapper = input.closest('.elementor-field-group') || input.parentNode;
		if (!wrapper) {
			return null;
		}

		var list = wrapper.querySelector('.career-upload-list');
		if (!list) {
			list = document.createElement('div');
			list.className = 'career-upload-list';
			list.hidden = true;
			wrapper.appendChild(list);
		}

		var error = wrapper.querySelector('.career-upload-error');
		if (!error) {
			error = document.createElement('div');
			error.className = 'career-upload-error';
			error.hidden = true;
			wrapper.appendChild(error);
		}

		return { list: list, error: error };
	}

	function formatUploadSize(bytes) {
		if (!bytes || bytes < 1024 * 1024) {
			return (bytes / 1024).toFixed(2) + ' KB';
		}
		return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
	}

	function isPdfUpload(file) {
		var name = (file.name || '').toLowerCase();
		var type = (file.type || '').toLowerCase();
		return type === 'application/pdf' || name.endsWith('.pdf');
	}

	function handleUploadChange(input) {
		var ui = ensureUploadUi(input);
		if (!ui) {
			return;
		}

		var list = ui.list;
		var error = ui.error;
		var files = input.files || [];

		list.innerHTML = '';
		list.hidden = true;
		error.hidden = true;
		error.textContent = '';

		if (!files.length) {
			input.classList.remove('is-selected');
			input.setAttribute('data-file-label', 'Click to upload your CV\A PDF (max 2MB)');
			return;
		}

		var invalidFile = Array.prototype.find.call(files, function (file) {
			return !isPdfUpload(file);
		});

		if (invalidFile) {
			input.value = '';
			input.classList.remove('is-selected');
			input.setAttribute('data-file-label', 'Only PDF files are allowed\APlease upload a PDF');
			error.hidden = false;
			error.textContent = 'Only PDF files are allowed.';
			return;
		}

		var label = files.length === 1
			? files[0].name + '\A' + formatUploadSize(files[0].size || 0)
			: files.length + ' files selected';

		input.classList.add('is-selected');
		input.setAttribute('data-file-label', label);

		Array.prototype.forEach.call(files, function (file) {
			var item = document.createElement('div');
			item.className = 'career-upload-item';
			item.innerHTML =
				'<div>' +
					'<span class="career-upload-name"></span>' +
					'<span class="career-upload-size"></span>' +
				'</div>' +
				'<button type="button" class="career-upload-remove" aria-label="Remove file"></button>';
			item.querySelector('.career-upload-name').textContent = file.name || 'PDF file';
			item.querySelector('.career-upload-size').textContent = formatUploadSize(file.size || 0);
			item.querySelector('.career-upload-remove').addEventListener('click', function () {
				input.value = '';
				input.classList.remove('is-selected');
				input.setAttribute('data-file-label', 'Click to upload your CV\A PDF (max 2MB)');
				list.innerHTML = '';
				list.hidden = true;
			});
			list.appendChild(item);
		});

		list.hidden = false;
	}

	function syncPopupState() {
		var popup = document.getElementById('elementor-popup-modal-20442');
		if (!popup) {
			document.body.classList.remove('career-popup-open');
			return;
		}

		var popupVisible = popup.style.display !== 'none' && !popup.hasAttribute('hidden') && popup.getAttribute('aria-hidden') !== 'true';
		document.body.classList.toggle('career-popup-open', popupVisible);
		if (popupVisible) {
			popup.classList.remove('career-popup-closing');
			delete popup.dataset.careerPopupClosing;
		}
	}

	function enforcePopupRightSide() {
		var popup = document.getElementById('elementor-popup-modal-20442');
		if (!popup) {
			return;
		}

		popup.style.setProperty('justify-content', 'flex-end', 'important');
		popup.style.setProperty('align-items', 'center', 'important');

		var dialogMessage = popup.querySelector('.dialog-message');
		if (dialogMessage) {
			dialogMessage.style.setProperty('display', 'flex', 'important');
			dialogMessage.style.setProperty('width', 'min(320px, calc(100vw - 40px))', 'important');
			dialogMessage.style.setProperty('max-width', '320px', 'important');

			if (window.innerWidth >= 768) {
				dialogMessage.style.setProperty('position', 'fixed', 'important');
				dialogMessage.style.setProperty('left', '96px', 'important');
				dialogMessage.style.setProperty('bottom', '24px', 'important');
				dialogMessage.style.setProperty('right', 'auto', 'important');
				dialogMessage.style.setProperty('top', 'auto', 'important');
				dialogMessage.style.setProperty('margin', '0', 'important');
				dialogMessage.style.setProperty('justify-content', 'flex-start', 'important');
				dialogMessage.style.setProperty('z-index', '100000', 'important');
			} else {
				dialogMessage.style.setProperty('position', 'relative', 'important');
				dialogMessage.style.setProperty('left', 'auto', 'important');
				dialogMessage.style.setProperty('bottom', 'auto', 'important');
				dialogMessage.style.setProperty('right', 'auto', 'important');
				dialogMessage.style.setProperty('top', 'auto', 'important');
				dialogMessage.style.setProperty('margin', 'auto', 'important');
				dialogMessage.style.setProperty('justify-content', 'center', 'important');
			}
		}

		var dialogContent = popup.querySelector('.dialog-widget-content');
		if (dialogContent) {
			dialogContent.style.setProperty('transform-origin', 'right center', 'important');

			if (window.innerWidth >= 768) {
				dialogContent.style.setProperty('margin-top', '0', 'important');
				dialogContent.style.setProperty('margin-left', '0', 'important');
				dialogContent.style.setProperty('margin-right', '0', 'important');
			}
		}
	}

	function performAnimatedClose(event) {
		var popup = document.getElementById('elementor-popup-modal-20442');
		var popupModule = getPopupModule();
		if (!popup || !popupModule || typeof popupModule.closePopup !== 'function') {
			return;
		}

		if (popup.dataset.careerPopupClosing === 'yes') {
			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}
			return;
		}

		popup.dataset.careerPopupClosing = 'yes';
		popup.classList.add('career-popup-closing');
		document.body.classList.remove('career-popup-open');

		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		window.setTimeout(function () {
			popupModule.closePopup({ id: '20442' }, event || { target: popup });
			popup.classList.remove('career-popup-closing');
			delete popup.dataset.careerPopupClosing;
		}, 260);
	}

	function bindPopupStateWatchers() {
		var popup = document.getElementById('elementor-popup-modal-20442');
		if (!popup || popup.dataset.careerPopupObserved === 'yes') {
			enforcePopupRightSide();
			ensureInlineCloseButton();
			syncPopupState();
			return;
		}

		popup.dataset.careerPopupObserved = 'yes';

		var observer = new MutationObserver(syncPopupState);
		observer.observe(popup, {
			attributes: true,
			attributeFilter: ['style', 'class', 'hidden', 'aria-hidden']
		});

		var closeButton = popup.querySelector('.dialog-close-button');
		if (closeButton && closeButton.dataset.careerPopupCloseBound !== 'yes') {
			closeButton.dataset.careerPopupCloseBound = 'yes';
			['click', 'touchend'].forEach(function (eventName) {
				closeButton.addEventListener(eventName, function (event) {
					performAnimatedClose(event);
				}, true);
			});
		}

		if (popup.dataset.careerPopupOverlayBound !== 'yes') {
			popup.dataset.careerPopupOverlayBound = 'yes';
			['click', 'touchend'].forEach(function (eventName) {
				popup.addEventListener(eventName, function (event) {
					if (event.target === popup) {
						performAnimatedClose(event);
					}
				}, true);
			});
		}

		enforcePopupRightSide();
		ensureInlineCloseButton();
		syncPopupState();
	}

	function ensureInlineCloseButton() {
		var popupRoot = document.querySelector('#elementor-popup-modal-20442 .elementor.elementor-20442');
		if (!popupRoot) {
			return;
		}

		var inlineClose = popupRoot.querySelector('.career-inline-close');
		if (!inlineClose) {
			inlineClose = document.createElement('button');
			inlineClose.type = 'button';
			inlineClose.className = 'career-inline-close';
			inlineClose.setAttribute('aria-label', 'Close popup');
			popupRoot.appendChild(inlineClose);
		}

		if (inlineClose.dataset.careerPopupCloseBound === 'yes') {
			return;
		}

		inlineClose.dataset.careerPopupCloseBound = 'yes';
		['click', 'touchend'].forEach(function (eventName) {
			inlineClose.addEventListener(eventName, function (event) {
				performAnimatedClose(event);
			}, true);
		});
	}

		if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			bindCareerPopup();
			bindPopupStateWatchers();
			ensureInlineCloseButton();
			bindUploadFeedback();
		});
	} else {
		bindCareerPopup();
		bindPopupStateWatchers();
		ensureInlineCloseButton();
		bindUploadFeedback();
	}

	window.addEventListener('load', function () {
		bindCareerPopup();
		bindPopupStateWatchers();
		ensureInlineCloseButton();
		bindUploadFeedback();
	});
	document.addEventListener('elementor/popup/show', function () {
		bindCareerPopup();
		bindPopupStateWatchers();
		enforcePopupRightSide();
		ensureInlineCloseButton();
		bindUploadFeedback();
		syncPopupState();
	});
	document.addEventListener('elementor/popup/hide', function () {
		document.body.classList.remove('career-popup-open');
		var popup = document.getElementById('elementor-popup-modal-20442');
		if (popup) {
			popup.classList.remove('career-popup-closing');
			delete popup.dataset.careerPopupClosing;
		}
	});
	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape' || event.key === 'Esc') {
			var popup = document.getElementById('elementor-popup-modal-20442');
			if (popup && document.body.classList.contains('career-popup-open')) {
				performAnimatedClose(event);
			}
		}
	}, true);
	window.addEventListener('elementor/frontend/init', function () {
		bindCareerPopup();
		bindPopupStateWatchers();
		ensureInlineCloseButton();
		bindUploadFeedback();
	});
})();
JS;

	wp_register_style( 'career-page-popup-fix', false );
	wp_enqueue_style( 'career-page-popup-fix' );
	wp_add_inline_style( 'career-page-popup-fix', $css );

	wp_register_script( 'career-page-popup-fix', '', array(), null, true );
	wp_enqueue_script( 'career-page-popup-fix' );
	wp_add_inline_script( 'career-page-popup-fix', $js );
}, 99 );
