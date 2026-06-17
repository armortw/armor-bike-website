/* ============================================================
   ARMOR BIKE Storefront — demo data
   Exposed as window.STORE for the prototype app.
   ============================================================ */
(function () {
  var HEX = {
    grey: '#9aa6b4', black: '#16181d', white: '#ffffff', silver: '#cbd4de',
    blue: '#006ee0', red: '#e0004b', yellow: '#ffd105', green: '#1a8a4f',
    orange: '#f97316', purple: '#6d28d9', teal: '#14b8a6', pink: '#ec4899', brown: '#8b5e3c'
  };

  // ---- shorthand builders -------------------------------------
  function g(title, links) { return { title: title, links: links }; }
  function chk(title, options, more) { return { kind: 'check', title: title, options: options, more: !!more }; }
  function col(title, opts) { return { kind: 'color', title: title, options: opts }; }
  function opt(label, count) { return { label: label, count: count }; }
  function sw(color, count) { return { color: color, count: count }; }
  function range(min, max) { return { kind: 'range', min: min, max: max }; }
  function toggles(options) { return { kind: 'toggles', options: options }; }

  var colorsBig = col('Colors', [
    sw(HEX.grey, 16), sw(HEX.purple, 15), sw(HEX.black, 14), sw(HEX.blue, 13),
    sw(HEX.yellow, 11), sw(HEX.green, 8), sw(HEX.orange, 7), sw(HEX.teal, 7),
    sw(HEX.red, 5), sw(HEX.silver, 4), sw(HEX.pink, 2), sw(HEX.brown, 2)
  ]);

  var categories = [
    {
      id: 'bikes', label: 'Bikes', leaf: 'Mountain Bikes', crumb: ['Cycling', 'Bikes'],
      mega: [
        [g('Mountain Bikes', ['Hardtail', 'Full Suspension', 'Trail', 'Enduro', 'Downhill', 'Cross Country'])],
        [g('E-Bikes', ['E-Mountain', 'E-Trekking', 'E-City', 'E-Road', 'E-Cargo'])],
        [g('Road & Gravel', ['Road Bikes', 'Gravel Bikes', 'Cyclocross', 'Triathlon']),
         g('City & Trekking', ['City Bikes', 'Trekking', 'Touring', 'Folding'])],
        [g("Kids' Bikes", ['Kids Mountain Bikes', 'Balance Bikes', '16" Wheels', '20" Wheels', '24" Wheels'])]
      ],
      facets: [
        range('310', '2353'),
        toggles([{ label: 'Sale %', count: 14, sale: true }, { label: 'In stock', count: 75 }]),
        chk('Wheel Size', [opt('29" (622mm)', 42), opt('27.5" (584mm)', 38), opt('26" (559mm)', 11), opt('24" (507mm)', 35), opt('20" (406mm)', 40), opt('16" (305mm)', 8)], true),
        chk('Manufacturer', [opt('Academy', 10), opt('CUBE', 24), opt('Canyon', 16), opt('Orbea', 12), opt('SCOTT', 18)], true),
        chk('Frame Size', [opt('S', 21), opt('M', 34), opt('L', 28), opt('XL', 14)]),
        colorsBig,
        chk('Number Of Gears', [opt('1 × 12', 22), opt('1 × 11', 19), opt('1 × 9', 16), opt('2 × 11', 14)], true),
        chk('Brake Type', [opt('Disc Brake', 81), opt('Rim Brake', 22)])
      ],
      products: [
        { manufacturer: 'CUBE', name: 'Reaction Hybrid Pro 625 — 29" E-Mountain', spec: '2026 · grey / blue', price: '2.299,00', oldPrice: '2.799,00', badge: '-18%', note: 'Ships in 24h' },
        { manufacturer: 'Canyon', name: 'Spectral 29 CF 8 — Trail Full Suspension', spec: '2026 · stealth black', price: '3.499,00' },
        { manufacturer: 'Orbea', name: 'Alma M30 — 29" Cross-Country Hardtail', spec: '2026 · metallic sunset', price: '2.099,00', badge: 'New' },
        { manufacturer: 'SCOTT', name: 'Scale 970 — 29" Mountain Bike', spec: '2026 · black / lime', price: '1.299,00', oldPrice: '1.499,00', note: 'Only 3 left' },
        { manufacturer: 'Academy', name: 'Trail 5 — 24" Kids Mountain Bike', spec: '2026 · space grey', price: '738,66' },
        { manufacturer: 'Marin', name: 'Rift Zone JR 24 — Kids Mountain Bike', spec: '2026 · green / yellow fade', price: '1.427,73', badge: 'Bestseller' }
      ]
    },
    {
      id: 'parts', label: 'Parts', leaf: 'Drivetrain', crumb: ['Cycling', 'Parts'],
      mega: [
        [g('Drivetrain', ['Cassettes', 'Cranks', 'Chains', 'Chainrings', 'Bottom Brackets', 'Power Meters']),
         g('Shifting Parts', ['Groupsets', 'Rear Derailleurs', 'Shifters', 'Hub Gears'])],
        [g('Cockpit', ['Handlebars', 'Stems', 'Handlebar Tape', 'Grips', 'Headsets', 'Bar Ends']),
         g('Brakes', ['Disc Brakes', 'Rim Brakes', 'Bleed Kits', 'Brake Parts'])],
        [g('Wheels', ['Wheelsets', 'Hubs & Freewheels', 'Rims', 'Spokes & Nipples']),
         g('Tires & Tubes', ['Tires', 'Inner Tubes', 'Tubeless'])],
        [g('Pedals', ['Flat Pedals', 'Clipless Pedals', 'Hybrid Pedals', 'Cleats']),
         g('Seatposts & Saddles', ['Saddles', 'Dropper Posts', 'Rigid Posts', 'Seat Clamps'])]
      ],
      facets: [
        range('12', '899'),
        toggles([{ label: 'Sale %', count: 9, sale: true }, { label: 'In stock', count: 142 }]),
        chk('Part Type', [opt('Drivetrain', 64), opt('Brakes', 38), opt('Wheels', 27), opt('Cockpit', 41), opt('Pedals', 22)], true),
        chk('Manufacturer', [opt('Shimano', 58), opt('SRAM', 44), opt('DT Swiss', 19), opt('Fox', 12), opt('Race Face', 16)], true),
        chk('Material', [opt('Aluminium', 71), opt('Carbon', 33), opt('Steel', 24), opt('Titanium', 9)]),
        colorsBig
      ],
      products: [
        { manufacturer: 'Shimano', name: 'Deore XT M8100 Groupset — 1 × 12', spec: 'Disc · 10–51T', price: '549,00', oldPrice: '629,00', badge: '-13%', note: 'Ships in 24h' },
        { manufacturer: 'SRAM', name: 'GX Eagle Cassette — 10–52T', spec: '12-speed · XD', price: '312,90' },
        { manufacturer: 'DT Swiss', name: 'XR 1700 Spline Wheelset — 29"', spec: 'Centerlock · Boost', price: '689,00', badge: 'New' },
        { manufacturer: 'Fox', name: '36 Float Performance Fork — 160mm', spec: '29" · GRIP damper', price: '899,00', note: 'Only 2 left' },
        { manufacturer: 'Shimano', name: 'Deore XT Disc Brake Set — Front + Rear', spec: '4-piston · Ice-Tech', price: '274,50', oldPrice: '319,00' },
        { manufacturer: 'Race Face', name: 'Aeffect R Crank Set — 32T', spec: 'Boost · 170mm', price: '189,90' }
      ]
    },
    {
      id: 'accessories', label: 'Accessories', leaf: 'Bags & Backpacks', crumb: ['Cycling', 'Accessories'],
      mega: [
        [g('Bags & Backpacks', ['Saddle Bags', 'Frame Bags', 'Panniers', 'Backpacks', 'Bar Bags'])],
        [g('Lights & Locks', ['Front Lights', 'Rear Lights', 'Light Sets', 'Frame Locks', 'Chain Locks'])],
        [g('Care & Tools', ['Multi-Tools', 'Pumps', 'Cleaning', 'Lubricants', 'Workstands'])],
        [g('Hydration', ['Bottles', 'Cages', 'Hydration Packs']),
         g('Protection', ['Mudguards', 'Frame Protection', 'Bells'])]
      ],
      facets: [
        range('9', '199'),
        toggles([{ label: 'Sale %', count: 6, sale: true }, { label: 'In stock', count: 210 }]),
        chk('Type', [opt('Bags', 48), opt('Locks', 22), opt('Lights', 36), opt('Pumps', 18), opt('Bottles', 41), opt('Mudguards', 14)], true),
        chk('Manufacturer', [opt('Ortlieb', 24), opt('Abus', 19), opt('Lezyne', 28), opt('Topeak', 22), opt('SKS', 17)], true),
        colorsBig
      ],
      products: [
        { manufacturer: 'Ortlieb', name: 'Back-Roller Classic Panniers — 40L', spec: 'Waterproof · pair', price: '129,90', badge: 'Bestseller' },
        { manufacturer: 'Abus', name: 'Bordo 6000 Folding Lock — 90cm', spec: 'Security level 10', price: '89,95', oldPrice: '99,95', badge: '-10%' },
        { manufacturer: 'Lezyne', name: 'Macro Drive 1300 Front Light', spec: '1300 lumen · USB-C', price: '64,90' },
        { manufacturer: 'Topeak', name: 'JoeBlow Sport III Floor Pump', spec: '160 psi · gauge', price: '44,90' },
        { manufacturer: 'Fidlock', name: 'TWIST Bottle 600 + Base Mount', spec: 'Magnetic · 600ml', price: '34,90', badge: 'New' },
        { manufacturer: 'SKS', name: 'Bluemels Mudguard Set — 29"', spec: 'Front + rear', price: '39,99' }
      ]
    },
    {
      id: 'electronics', label: 'Electronics', leaf: 'Bike Computers', crumb: ['Cycling', 'Electronics'],
      mega: [
        [g('Bike Computers', ['GPS Computers', 'Mounts', 'Speed & Cadence', 'Heart Rate'])],
        [g('Lights', ['Front Lights', 'Rear Lights', 'Helmet Lights', 'Light Sets'])],
        [g('Cameras & Audio', ['Action Cameras', 'Camera Mounts', 'Headphones'])],
        [g('Power', ['Power Banks', 'Chargers', 'Dynamos']),
         g('Smart Trainers', ['Direct Drive', 'Wheel-On', 'Rollers'])]
      ],
      facets: [
        range('99', '699'),
        toggles([{ label: 'Sale %', count: 5, sale: true }, { label: 'In stock', count: 64 }]),
        chk('Type', [opt('GPS Computers', 22), opt('Action Cameras', 11), opt('Lights', 28), opt('Sensors', 19), opt('Displays', 9)], true),
        chk('Manufacturer', [opt('Garmin', 26), opt('Wahoo', 14), opt('GoPro', 8), opt('Sigma', 12), opt('Bosch', 10)], true),
        chk('Connectivity', [opt('ANT+', 38), opt('Bluetooth', 41), opt('WiFi', 17), opt('GPS', 24)])
      ],
      products: [
        { manufacturer: 'Garmin', name: 'Edge 1040 Solar — GPS Computer', spec: 'Solar · 45h battery', price: '629,00', badge: 'Bestseller' },
        { manufacturer: 'Wahoo', name: 'ELEMNT BOLT V2 — GPS Computer', spec: 'Color · aero', price: '279,90', oldPrice: '299,90', badge: '-7%' },
        { manufacturer: 'GoPro', name: 'HERO12 Black — Action Camera', spec: '5.3K · HyperSmooth', price: '399,00' },
        { manufacturer: 'Garmin', name: 'Varia RCT715 — Radar Rear Light', spec: 'Camera + radar', price: '349,00', badge: 'New' },
        { manufacturer: 'Sigma', name: 'ROX 11.1 EVO — GPS Set', spec: 'With sensors', price: '169,95' },
        { manufacturer: 'Bosch', name: 'Kiox 300 — Display Kit', spec: 'Smart System', price: '159,90' }
      ]
    },
    {
      id: 'clothing', label: 'Clothing', leaf: 'Jerseys', crumb: ['Cycling', 'Clothing'],
      mega: [
        [g('Jerseys & Tops', ['Short Sleeve', 'Long Sleeve', 'Base Layers', 'Wind Vests'])],
        [g('Shorts & Tights', ['Bib Shorts', 'Shorts', 'Tights', 'Trousers'])],
        [g('Jackets', ['Rain Jackets', 'Wind Jackets', 'Thermal', 'Gilets'])],
        [g('Accessories', ['Gloves', 'Socks', 'Caps', 'Arm Warmers']),
         g('By Gender', ['Men', 'Women', 'Kids'])]
      ],
      facets: [
        range('29', '249'),
        toggles([{ label: 'Sale %', count: 12, sale: true }, { label: 'In stock', count: 96 }]),
        chk('Size', [opt('XS', 14), opt('S', 38), opt('M', 52), opt('L', 47), opt('XL', 29)], true),
        chk('Gender', [opt('Men', 64), opt('Women', 41), opt('Unisex', 22)]),
        chk('Manufacturer', [opt('Castelli', 22), opt('GORE', 18), opt('Assos', 14), opt('Endura', 20), opt('Maloja', 11)], true),
        colorsBig
      ],
      products: [
        { manufacturer: 'Castelli', name: 'Free Aero RC — Bib Shorts', spec: "Men's · black", price: '159,95', badge: 'Bestseller' },
        { manufacturer: 'GORE', name: 'Spinshift GTX — Rain Jacket', spec: 'GORE-TEX · orange', price: '199,99', oldPrice: '249,99', badge: '-20%' },
        { manufacturer: 'Assos', name: 'Mille GT Jersey C2 — Short Sleeve', spec: "Men's · blue", price: '89,90' },
        { manufacturer: 'Endura', name: 'MT500 Burner — Trail Shorts', spec: "Men's · olive", price: '99,99', badge: 'New' },
        { manufacturer: 'Maloja', name: 'NadelM. — Long Sleeve Jersey', spec: "Women's · plum", price: '79,90' },
        { manufacturer: 'Shimano', name: 'Vertex Thermal — Tights', spec: 'Unisex · black', price: '119,95' }
      ]
    },
    {
      id: 'shoes', label: 'Shoes', leaf: 'Road Shoes', crumb: ['Cycling', 'Shoes'],
      mega: [
        [g('Road Shoes', ['Performance', 'Endurance', 'Triathlon', "Women's"])],
        [g('MTB Shoes', ['Clipless', 'Flat', 'Gravel', 'Winter'])],
        [g('Casual & Urban', ['Commuter', 'Lifestyle', 'Sandals'])],
        [g('Accessories', ['Insoles', 'Cleats', 'Shoe Covers', 'Laces'])]
      ],
      facets: [
        range('99', '449'),
        toggles([{ label: 'Sale %', count: 7, sale: true }, { label: 'In stock', count: 58 }]),
        chk('Shoe Size', [opt('40', 22), opt('41', 31), opt('42', 44), opt('43', 41), opt('44', 33), opt('45', 18)], true),
        chk('Discipline', [opt('Road', 36), opt('MTB', 41), opt('Gravel', 17), opt('Urban', 12)]),
        chk('Manufacturer', [opt('Shimano', 24), opt('Five Ten', 14), opt('Sidi', 11), opt('Giro', 19), opt('Fizik', 16)], true),
        colorsBig
      ],
      products: [
        { manufacturer: 'Shimano', name: 'RC903 S-PHYRE — Road Shoe', spec: 'Carbon · BOA', price: '379,95', badge: 'Bestseller' },
        { manufacturer: 'Five Ten', name: 'Freerider Pro — MTB Flat Shoe', spec: 'Stealth rubber', price: '149,95', oldPrice: '169,95', badge: '-13%' },
        { manufacturer: 'Sidi', name: 'Wire 2 Carbon — Road Shoe', spec: 'Tecno-3 dial', price: '449,00' },
        { manufacturer: 'Giro', name: 'Empire VR90 — MTB Shoe', spec: 'Lace-up · Vibram', price: '259,95', badge: 'New' },
        { manufacturer: 'Northwave', name: 'Origin Plus 2 — Gravel Shoe', spec: 'SLW3 dial', price: '139,95' },
        { manufacturer: 'Fizik', name: 'Terra Atlas — Gravel Shoe', spec: 'Velcro · grippy', price: '159,00' }
      ]
    },
    {
      id: 'outdoor', label: 'Outdoor', leaf: 'Backpacks', crumb: ['Outdoor'],
      mega: [
        [g('Camping', ['Tents', 'Sleeping Bags', 'Sleeping Mats', 'Stoves'])],
        [g('Backpacks', ['Daypacks', 'Hiking Packs', 'Hydration Packs'])],
        [g('Apparel', ['Jackets', 'Base Layers', 'Trousers', 'Footwear'])],
        [g('Navigation', ['GPS Devices', 'Compasses', 'Headlamps']),
         g('Accessories', ['Trekking Poles', 'Water Filters', 'First Aid'])]
      ],
      facets: [
        range('39', '249'),
        toggles([{ label: 'Sale %', count: 8, sale: true }, { label: 'In stock', count: 73 }]),
        chk('Category', [opt('Backpacks', 28), opt('Tents', 14), opt('Sleeping', 19), opt('Lighting', 22), opt('Cooking', 11)], true),
        chk('Manufacturer', [opt('Vaude', 18), opt('The North Face', 14), opt('Deuter', 21), opt('Petzl', 9), opt('Primus', 7)], true),
        colorsBig
      ],
      products: [
        { manufacturer: 'Vaude', name: 'Asymmetric 42+8 — Hiking Backpack', spec: 'Green Shape · blue', price: '179,90', badge: 'Bestseller' },
        { manufacturer: 'The North Face', name: 'Stormbreak 2 — Tent', spec: '2-person · 3-season', price: '199,95', oldPrice: '234,95', badge: '-15%' },
        { manufacturer: 'Deuter', name: 'Aircontact Lite 50+10 — Pack', spec: 'Trekking · slate', price: '169,95' },
        { manufacturer: 'Petzl', name: 'Actik Core — Headlamp', spec: '600 lumen · USB', price: '64,95', badge: 'New' },
        { manufacturer: 'Primus', name: 'Lite+ — Stove System', spec: 'Integrated · 0.5L', price: '99,90' },
        { manufacturer: 'Therm-a-Rest', name: 'NeoAir XLite — Sleeping Mat', spec: 'R-value 4.5', price: '209,95' }
      ]
    },
    {
      id: 'moresports', label: 'More Sports', leaf: 'Running', crumb: ['Sports'],
      mega: [
        [g('Running', ['Shoes', 'Apparel', 'Watches', 'Accessories'])],
        [g('Swimming', ['Wetsuits', 'Goggles', 'Caps', 'Swimwear'])],
        [g('Fitness', ['Smart Trainers', 'Weights', 'Mats', 'Bands'])],
        [g('Winter', ['Ski', 'Snowboard', 'Apparel', 'Goggles']),
         g('Triathlon', ['Tri Suits', 'Race Belts', 'Transition'])]
      ],
      facets: [
        range('39', '649'),
        toggles([{ label: 'Sale %', count: 10, sale: true }, { label: 'In stock', count: 88 }]),
        chk('Sport', [opt('Running', 34), opt('Swimming', 18), opt('Fitness', 26), opt('Winter', 14), opt('Triathlon', 9)], true),
        chk('Manufacturer', [opt('Garmin', 16), opt('Speedo', 11), opt('On', 14), opt('Wahoo', 9), opt('Salomon', 12)], true)
      ],
      products: [
        { manufacturer: 'Garmin', name: 'Forerunner 965 — Running Watch', spec: 'AMOLED · maps', price: '649,00', badge: 'Bestseller' },
        { manufacturer: 'Speedo', name: 'Fastskin Pure Focus — Goggles', spec: 'Mirror · racing', price: '39,95', oldPrice: '49,95', badge: '-20%' },
        { manufacturer: 'On', name: 'Cloudmonster — Running Shoe', spec: 'Max cushion', price: '169,95' },
        { manufacturer: 'Wahoo', name: 'KICKR Core — Smart Trainer', spec: 'Direct drive', price: '599,99', badge: 'New' },
        { manufacturer: 'Salomon', name: 'S/Lab Trail 5 — Hydration Vest', spec: 'Race fit · 5L', price: '139,95' },
        { manufacturer: 'Arena', name: 'Powerskin Carbon — Race Suit', spec: 'FINA approved', price: '289,00' }
      ]
    },
    {
      id: 'brands', label: 'Brands', leaf: 'All Brands', crumb: ['Brands'],
      mega: [
        [g('Popular', ['CUBE', 'Canyon', 'Trek', 'Specialized', 'Giant'])],
        [g('Components', ['Shimano', 'SRAM', 'DT Swiss', 'Fox', 'RockShox'])],
        [g('Apparel', ['Castelli', 'GORE', 'Endura', 'Assos', 'Maloja'])],
        [g('Browse', ['A – E', 'F – J', 'K – O', 'P – T', 'U – Z', 'All Brands'])]
      ],
      facets: [
        range('749', '4799'),
        toggles([{ label: 'Sale %', count: 18, sale: true }, { label: 'In stock', count: 132 }]),
        chk('Category', [opt('Bikes', 64), opt('Parts', 88), opt('Clothing', 52), opt('Accessories', 47)], true),
        chk('First Letter', [opt('A – E', 24), opt('F – J', 18), opt('K – O', 21), opt('P – T', 29), opt('U – Z', 14)]),
        chk('Manufacturer', [opt('CUBE', 24), opt('Canyon', 16), opt('Trek', 19), opt('Specialized', 22), opt('Giant', 17)], true)
      ],
      products: [
        { manufacturer: 'CUBE', name: 'Stereo One77 — Trail Full Suspension', spec: '2026 · carbon', price: '4.299,00', badge: 'Bestseller' },
        { manufacturer: 'Canyon', name: 'Ultimate CF SLX 8 — Road Bike', spec: '2026 · Di2', price: '4.799,00', badge: 'New' },
        { manufacturer: 'Trek', name: 'Marlin 7 Gen 3 — Hardtail', spec: '2026 · matte black', price: '949,00', oldPrice: '1.049,00', badge: '-10%' },
        { manufacturer: 'Specialized', name: 'Rockhopper Comp — 29" MTB', spec: '2026 · satin red', price: '899,00' },
        { manufacturer: 'Giant', name: 'Talon 1 — 29" Hardtail', spec: '2026 · blue', price: '799,00' },
        { manufacturer: 'SCOTT', name: 'Aspect 940 — 29" Mountain Bike', spec: '2026 · grey', price: '749,00' }
      ]
    },
    {
      id: 'sale', label: 'SALE %', accent: true, leaf: 'Bikes on Sale', crumb: ['Sale'],
      mega: [
        [g('Bikes on Sale', ['Mountain Bikes', 'E-Bikes', 'Road & Gravel', "Kids' Bikes"])],
        [g('Parts on Sale', ['Drivetrain', 'Brakes', 'Wheels', 'Cockpit'])],
        [g('Clothing on Sale', ['Jerseys', 'Jackets', 'Shorts', 'Shoes'])],
        [g('Accessories on Sale', ['Lights', 'Locks', 'Bags', 'Electronics'])]
      ],
      facets: [
        range('129', '1899'),
        toggles([{ label: 'On sale only', count: 248, sale: true }, { label: 'In stock', count: 201 }]),
        chk('Discount', [opt('-10% or more', 248), opt('-20% or more', 162), opt('-30% or more', 74), opt('-40% or more', 21)], true),
        chk('Category', [opt('Bikes', 48), opt('Parts', 96), opt('Clothing', 64), opt('Accessories', 40)]),
        chk('Manufacturer', [opt('CUBE', 14), opt('GORE', 11), opt('Shimano', 22), opt('Giro', 9), opt('Garmin', 12)], true)
      ],
      products: [
        { manufacturer: 'CUBE', name: 'Attain GTC SLT — Road Bike', spec: '2025 · carbon', price: '1.899,00', oldPrice: '2.499,00', badge: '-24%', note: 'Sale ends Sunday' },
        { manufacturer: 'GORE', name: 'C5 GTX — Trail Jacket', spec: "Men's · black", price: '149,99', oldPrice: '219,99', badge: '-32%', note: 'Sale ends Sunday' },
        { manufacturer: 'Shimano', name: 'XT M8100 — Disc Brake Set', spec: '4-piston', price: '219,00', oldPrice: '289,00', badge: '-24%', note: 'Sale ends Sunday' },
        { manufacturer: 'Giro', name: 'Aether MIPS — Road Helmet', spec: 'Spherical · matte', price: '179,95', oldPrice: '279,95', badge: '-36%', note: 'Sale ends Sunday' },
        { manufacturer: 'Garmin', name: 'Edge 530 — GPS Computer', spec: 'ClimbPro', price: '199,00', oldPrice: '279,00', badge: '-28%', note: 'Sale ends Sunday' },
        { manufacturer: 'Castelli', name: 'Perfetto RoS 2 — Jacket', spec: "Men's · blue", price: '129,95', oldPrice: '184,95', badge: '-30%', note: 'Sale ends Sunday' }
      ]
    }
  ];

  var images = [];
  var hero = [];
  var map = {};
  categories.forEach(function (c) { map[c.id] = c; });

  // Load CMS overrides saved from the admin panel
  try {
    var _cms = localStorage.getItem('ARMOR_BIKE_CMS');
    if (_cms) {
      var _data = JSON.parse(_cms);
      if (_data) {
        if (Array.isArray(_data.categories) && _data.categories.length) {
          categories = _data.categories;
          map = {};
          categories.forEach(function (c) { map[c.id] = c; });
        }
        if (Array.isArray(_data.images) && _data.images.length) {
          images = _data.images;
        }
        if (Array.isArray(_data.hero)) {
          hero = _data.hero;
        }
      }
    }
  } catch (_e) {}

  window.STORE = { categories: categories, map: map, HEX: HEX, images: images, hero: hero };
})();
