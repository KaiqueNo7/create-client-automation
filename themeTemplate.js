export function generateThemeContent({ nameClient, colorPrimary, colorSecondary, logoFileName, bgPath, formAlignment }) {
return `$theme-color-primary: ${colorPrimary};
$theme-color-secondary: ${colorSecondary};

$theme-color-primary-text: #212121;
$theme-color-secondary-text: #424242;
$theme-color-tertiary-text: #757575;

$theme-color-notstarted: #f57c00;
$theme-color-inprogress: #1976d2;
$theme-color-approved: #388e3c;
$theme-color-failed: #d32f2f;
$theme-color-expired: #e0e0e0;

@import "bs4-overrides.scss";

$header-height: 75px;
$header-height-mobile: 60px;
$header-bgcolor: $white;

$brand-img-default-customer: url(/assets/${nameClient}/img/${logoFileName});
$brand-img-alt1-customer: url(/assets/${nameClient}/img/${logoFileName});
$brand-img-alt2-customer: url(/assets/${nameClient}/img/${logoFileName});
$brand-img-alt3-customer: url(/assets/${nameClient}/img/${logoFileName});

$brand-mini-img: url(/assets/${nameClient}/img/logo-medportal-mini.svg);
$brand-mini-size: 40px;

$login-cardheader-bg: $white;
$login-image-bg: url(/assets/${nameClient}/img/${bgPath});
$login-bg: $theme-color-expired;

$sidenav-score-color-default:darken($theme-color-secondary, 30%);

$sidenav-width: 110px;
$sidenav-height-mobile: 70px;
$sidenav-bgcolor: $white;

$sidenav-item-height: 85px;
$sidenav-item-textcolor: $theme-color-primary;
$sidenav-item-hover-textcolor: $gray-600;
$sidenav-item-active-textcolor: $theme-color-primary;

$content-bgcolor: $gray-200;

$course-title-textcolor: $theme-color-primary;
$course-detail-active-program: $theme-color-primary;

$progressbar-bgcolor: $gray-500;

$timeline-width: 320px;
$timeline-bgcolor: $white;

$timeline-module-textcolor: $gray-500;
$timeline-module-done-textcolor: $theme-color-primary;
$timeline-module-play-textcolor: $theme-color-primary;

$timeline-module-hover-bgcolor: $gray-100;

$timeline-step-line-color: $gray-400;

$timeline-step-icon-bgcolor: $gray-200;
$timeline-step-icon-bordercolor: $gray-400;
$timeline-step-icon-textcolor: $gray-400;

$timeline-step-icon-done-bgcolor: $gray-200;
$timeline-step-icon-done-bordercolor: $gray-400;
$timeline-step-icon-done-textcolor: darken($theme-color-primary, 10%);

$timeline-step-icon-play-bgcolor: darken($theme-color-primary, 10%);
$timeline-step-icon-play-bordercolor: $white;
$timeline-step-icon-play-textcolor: $white;

$timeline-step-play-bgcolor: lighten($theme-color-primary, 35%);

$timeline-step-title-textcolor: $gray-700;
$timeline-step-title-blocked-textcolor: $gray-500;
$timeline-step-title-done-textcolor: $theme-color-primary;
$timeline-step-title-play-textcolor: darken($theme-color-primary, 10%);

$timeline-step-hover-bgcolor: $gray-100;

$avoid-multilines: true;
$avoid-multilines-toolbox: true;
$color-pills-with-secondary: false;

$card-header-program: darken($theme-color-primary, 10%);

$toolbox-height: 60px;
$toolbox-bgcolor: $white;
$toolbox-title-textcolor: darken($theme-color-primary, 20%);
$toolbox-actions-item-textcolor: $theme-color-primary;

$view-bgcolor: $gray-200;

$tooltip-bg: $gray-800;

$ecommerce-enable:'inline-block';
$events-enable:none;

// Height logo definition
$brand-small-height: ($header-height + 8) / 2;
$brand-small-height-mobile: ($header-height-mobile + 10) / 2.5;

$brand-height: $header-height / 1.6;
$brand-height-mobile: $header-height-mobile / 2;

$brand-large-height: $header-height / 1.25;
$brand-large-height-mobile: $header-height-mobile / 1.5625;

// Variables set at _brand.css
// Mobile
$brand-logo-height-mobile-default: $brand-small-height-mobile;
$brand-background-size-mobile-default: auto $brand-small-height-mobile;
// Desktop
$brand-logo-height-default: $brand-small-height;
$brand-background-size-default: auto $brand-small-height;

$footer-brand-sponsor-height:25px;

// Login
$brand-logo-height-bg-login: 280px;
$brand-logo-height-login: 120px;
$login-box-align: '${formAlignment}';

// Toolbox alternative
$toolbox-alternative: false;
$course-title-lines: 3;
  `;
}
