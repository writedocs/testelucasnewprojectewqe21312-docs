const { getTextColor } = require(".");
const { LOGO_SIZES, BLACKS, WHITES } = require("../../variables");
const { adjustLightness, addTransparency } = require("./color");

function definePrimaryColors(mainColor) {
  return {
    '--ifm-color-primary': mainColor,
    '--ifm-color-primary-dark': adjustLightness(mainColor, -0.2),
    '--ifm-color-primary-darker': adjustLightness(mainColor, -0.3),
    '--ifm-color-primary-darkest': adjustLightness(mainColor, -0.4),
    '--ifm-color-primary-light': adjustLightness(mainColor, 0.2),
    '--ifm-color-primary-lighter': adjustLightness(mainColor, 0.3),
    '--ifm-color-primary-lightest': adjustLightness(mainColor, 0.4),
    '--transparent-main-color': addTransparency(mainColor, 0.08),
    '--transparent-second-color': addTransparency(mainColor, 0.05),
  }
}

function defineNavbarColors(mainColor, navbarFinalColor, borderColor = '#ffffff33') {
  let navbarLight = adjustLightness(navbarFinalColor, 0.2);
  let navbarDark = adjustLightness(navbarFinalColor, -0.2);
  let navbarBorderColor = borderColor;

  if (WHITES.includes(navbarFinalColor)) {
    navbarLight = addTransparency(mainColor, 0.15);
    navbarDark = addTransparency(mainColor, 0.30);
    navbarBorderColor = '#9c9c9c';
  }

  if (BLACKS.includes(navbarFinalColor)){
    navbarLight = addTransparency(mainColor, 0.15);
    navbarDark = addTransparency(mainColor, 0.30);
  }

  return {
    '--navbar-color': navbarFinalColor,
    '--navbar-color-light': navbarLight,
    '--navbar-color-dark': navbarDark,
    '--navbar-link-border-hover-color': navbarBorderColor,
  }
}

function defineIcons(isDark) {
  return {
    '--guides-icon': isDark ? 'var(--guidesIconDark)' : 'var(--guidesIconLight)',
    '--home-icon': isDark ? 'var(--homeIconDark)' : 'var(--homeIconLight)',
    '--api-icon': isDark ? 'var(--apiIconDark)' : 'var(--apiIconLight)',
    '--changelog-icon': isDark ? 'var(--changelogIconDark)' : 'var(--changelogIconLight)',
  }
}

function defineNavbarItems(mainColor, isDark, luminance, logoSize = null) {
  return {
    '--navbar-logo-height': logoSize ? LOGO_SIZES[logoSize] : LOGO_SIZES.small,
    '--navbar-font-color': luminance,
    '--navbar-item-background-color': mainColor,
    '--navbar-item-border-color': mainColor,
    '--navbar-item-font-color': isDark ? BLACKS[0]: WHITES[0],
    '--navbar-link-hover': isDark ? addTransparency(BLACKS[0], 0) : addTransparency(WHITES[0], 0),
    '--navbar-link-active': isDark ? addTransparency(BLACKS[0], 0.1) : addTransparency(WHITES[0], 0.1),
    '--navbar-active-text-color': getTextColor(mainColor),
  }
}

module.exports = {
  definePrimaryColors,
  defineNavbarColors,
  defineIcons,
  defineNavbarItems,
}
