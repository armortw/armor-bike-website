/* ARMOR BIKE Storefront — published 2026-06-17 08:12 UTC */
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
  var images = [
  {
    "id": 1,
    "url": "https://placehold.co/1400x560/111827/ffffff?text=Armor+Website+Hero+1",
    "alt": "Armor_Website_Hero-1"
  },
  {
    "id": 2,
    "url": "https://placehold.co/1400x560/0f3460/ffffff?text=Armor+Website+Hero+2",
    "alt": "Armor_Website_Hero-2"
  },
  {
    "id": 3,
    "url": "https://placehold.co/1400x560/1a1a2e/ffffff?text=Armor+Website+Hero+3",
    "alt": "Armor_Website_Hero-3"
  },
  {
    "id": 4,
    "url": "https://placehold.co/1400x560/16213e/ffffff?text=Armor+Website+Hero+4",
    "alt": "Armor_Website_Hero-4"
  }
];
  var hero = [];
  var map = {};
  categories.forEach(function (c) { map[c.id] = c; });
  try {
    var _cms = localStorage.getItem('ARMOR_BIKE_CMS');
    if (_cms) { var _d = JSON.parse(_cms); if (_d) { if (Array.isArray(_d.categories) && _d.categories.length) { categories = _d.categories; map = {}; categories.forEach(function (c) { map[c.id] = c; }); } if (Array.isArray(_d.images) && _d.images.length) { images = _d.images; } if (Array.isArray(_d.hero)) { hero = _d.hero; } } }
  } catch (_e) {}
  window.STORE = { categories: categories, map: map, HEX: HEX, images: images, hero: hero };
})();