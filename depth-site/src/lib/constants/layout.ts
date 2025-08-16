// Centralized layout visibility rules for Header and Footer

export const HIDE_HEADER_ON_PATTERNS: Array<RegExp> = [
  /^\/embed\//,
  /^\/landing\//,
  /^\/reports\/fullscreen$/,
  // Hide global header inside app shells that render their own top bars
  /^\/admin(\/.*)?$/,
  /^\/portal(\/.*)?$/,
];

export const HIDE_FOOTER_ON_PATTERNS: Array<RegExp> = [
  /^\/portal\/auth\//,
  /^\/embed\//,
  /^\/landing\//,
  /^\/legal\/minimal$/,
];


