/* ARMOR BIKE Storefront — published 2026-06-17 08:22 UTC */
(function () {
  var HEX = {
    grey: '#9aa6b4',
    black: '#16181d',
    white: '#ffffff',
    silver: '#cbd4de',
    blue: '#006ee0',
    red: '#e0004b',
    yellow: '#ffd105',
    green: '#1a8a4f',
    orange: '#f97316',
    purple: '#6d28d9',
    teal: '#14b8a6',
    pink: '#ec4899',
    brown: '#8b5e3c'
  };
  var categories = [];
  var images = [];
  var hero = [];
  var map = {};
  categories.forEach(function (c) { map[c.id] = c; });
  try {
    var _cms = localStorage.getItem('ARMOR_BIKE_CMS');
    if (_cms) { var _d = JSON.parse(_cms); if (_d) { if (Array.isArray(_d.categories) && _d.categories.length) { categories = _d.categories; map = {}; categories.forEach(function (c) { map[c.id] = c; }); } if (Array.isArray(_d.images) && _d.images.length) { images = _d.images; } if (Array.isArray(_d.hero)) { hero = _d.hero; } } }
  } catch (_e) {}
  window.STORE = { categories: categories, map: map, HEX: HEX, images: images, hero: hero };
})();