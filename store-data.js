/* ARMOR BIKE Storefront — published 2026-06-17 10:29 UTC */
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
  var categories = [
  {
    "id": "bikes",
    "label": "Bikes",
    "leaf": "Mountain Bikes",
    "crumb": [
      "Cycling",
      "Bikes"
    ],
    "mega": [
      [
        {
          "title": "Mountain Bikes",
          "links": [
            "Hardtail",
            "Full Suspension",
            "Trail",
            "Enduro",
            "Downhill",
            "Cross Country"
          ]
        }
      ],
      [
        {
          "title": "E-Bikes",
          "links": [
            "E-Mountain",
            "E-Trekking",
            "E-City",
            "E-Road",
            "E-Cargo"
          ]
        }
      ],
      [
        {
          "title": "Road & Gravel",
          "links": [
            "Road Bikes",
            "Gravel Bikes",
            "Cyclocross",
            "Triathlon"
          ]
        },
        {
          "title": "City & Trekking",
          "links": [
            "City Bikes",
            "Trekking",
            "Touring",
            "Folding"
          ]
        }
      ],
      [
        {
          "title": "Kids' Bikes",
          "links": [
            "Kids Mountain Bikes",
            "Balance Bikes",
            "16\" Wheels",
            "20\" Wheels",
            "24\" Wheels"
          ]
        }
      ]
    ],
    "facets": [
      {
        "kind": "range",
        "min": "310",
        "max": "2353"
      },
      {
        "kind": "toggles",
        "options": [
          {
            "label": "Sale %",
            "count": 14,
            "sale": true
          },
          {
            "label": "In stock",
            "count": 75
          }
        ]
      },
      {
        "kind": "check",
        "title": "Wheel Size",
        "options": [
          {
            "label": "29\" (622mm)",
            "count": 42
          },
          {
            "label": "27.5\" (584mm)",
            "count": 38
          },
          {
            "label": "26\" (559mm)",
            "count": 11
          },
          {
            "label": "24\" (507mm)",
            "count": 35
          },
          {
            "label": "20\" (406mm)",
            "count": 40
          },
          {
            "label": "16\" (305mm)",
            "count": 8
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Manufacturer",
        "options": [
          {
            "label": "Academy",
            "count": 10
          },
          {
            "label": "CUBE",
            "count": 24
          },
          {
            "label": "Canyon",
            "count": 16
          },
          {
            "label": "Orbea",
            "count": 12
          },
          {
            "label": "SCOTT",
            "count": 18
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Frame Size",
        "options": [
          {
            "label": "S",
            "count": 21
          },
          {
            "label": "M",
            "count": 34
          },
          {
            "label": "L",
            "count": 28
          },
          {
            "label": "XL",
            "count": 14
          }
        ],
        "more": false
      },
      {
        "kind": "color",
        "title": "Colors",
        "options": [
          {
            "color": "#9aa6b4",
            "count": 16
          },
          {
            "color": "#6d28d9",
            "count": 15
          },
          {
            "color": "#16181d",
            "count": 14
          },
          {
            "color": "#006ee0",
            "count": 13
          },
          {
            "color": "#ffd105",
            "count": 11
          },
          {
            "color": "#1a8a4f",
            "count": 8
          },
          {
            "color": "#f97316",
            "count": 7
          },
          {
            "color": "#14b8a6",
            "count": 7
          },
          {
            "color": "#e0004b",
            "count": 5
          },
          {
            "color": "#cbd4de",
            "count": 4
          },
          {
            "color": "#ec4899",
            "count": 2
          },
          {
            "color": "#8b5e3c",
            "count": 2
          }
        ]
      },
      {
        "kind": "check",
        "title": "Number Of Gears",
        "options": [
          {
            "label": "1 × 12",
            "count": 22
          },
          {
            "label": "1 × 11",
            "count": 19
          },
          {
            "label": "1 × 9",
            "count": 16
          },
          {
            "label": "2 × 11",
            "count": 14
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Brake Type",
        "options": [
          {
            "label": "Disc Brake",
            "count": 81
          },
          {
            "label": "Rim Brake",
            "count": 22
          }
        ],
        "more": false
      }
    ],
    "products": [
      {
        "manufacturer": "CUBE",
        "name": "Reaction Hybrid Pro 625 — 29\" E-Mountain",
        "spec": "2026 · grey / blue",
        "price": "2.299,00",
        "oldPrice": "2.799,00",
        "badge": "-18%",
        "note": "Ships in 24h"
      },
      {
        "manufacturer": "Canyon",
        "name": "Spectral 29 CF 8 — Trail Full Suspension",
        "spec": "2026 · stealth black",
        "price": "3.499,00"
      },
      {
        "manufacturer": "Orbea",
        "name": "Alma M30 — 29\" Cross-Country Hardtail",
        "spec": "2026 · metallic sunset",
        "price": "2.099,00",
        "badge": "New"
      },
      {
        "manufacturer": "SCOTT",
        "name": "Scale 970 — 29\" Mountain Bike",
        "spec": "2026 · black / lime",
        "price": "1.299,00",
        "oldPrice": "1.499,00",
        "note": "Only 3 left"
      },
      {
        "manufacturer": "Academy",
        "name": "Trail 5 — 24\" Kids Mountain Bike",
        "spec": "2026 · space grey",
        "price": "738,66"
      },
      {
        "manufacturer": "Marin",
        "name": "Rift Zone JR 24 — Kids Mountain Bike",
        "spec": "2026 · green / yellow fade",
        "price": "1.427,73",
        "badge": "Bestseller"
      }
    ]
  },
  {
    "id": "parts",
    "label": "Parts",
    "leaf": "Drivetrain",
    "crumb": [
      "Cycling",
      "Parts"
    ],
    "mega": [
      [
        {
          "title": "Drivetrain",
          "links": [
            "Cassettes",
            "Cranks",
            "Chains",
            "Chainrings",
            "Bottom Brackets",
            "Power Meters"
          ]
        },
        {
          "title": "Shifting Parts",
          "links": [
            "Groupsets",
            "Rear Derailleurs",
            "Shifters",
            "Hub Gears"
          ]
        }
      ],
      [
        {
          "title": "Cockpit",
          "links": [
            "Handlebars",
            "Stems",
            "Handlebar Tape",
            "Grips",
            "Headsets",
            "Bar Ends"
          ]
        },
        {
          "title": "Brakes",
          "links": [
            "Disc Brakes",
            "Rim Brakes",
            "Bleed Kits",
            "Brake Parts"
          ]
        }
      ],
      [
        {
          "title": "Wheels",
          "links": [
            "Wheelsets",
            "Hubs & Freewheels",
            "Rims",
            "Spokes & Nipples"
          ]
        },
        {
          "title": "Tires & Tubes",
          "links": [
            "Tires",
            "Inner Tubes",
            "Tubeless"
          ]
        }
      ],
      [
        {
          "title": "Pedals",
          "links": [
            "Flat Pedals",
            "Clipless Pedals",
            "Hybrid Pedals",
            "Cleats"
          ]
        },
        {
          "title": "Seatposts & Saddles",
          "links": [
            "Saddles",
            "Dropper Posts",
            "Rigid Posts",
            "Seat Clamps"
          ]
        }
      ]
    ],
    "facets": [
      {
        "kind": "range",
        "min": "12",
        "max": "899"
      },
      {
        "kind": "toggles",
        "options": [
          {
            "label": "Sale %",
            "count": 9,
            "sale": true
          },
          {
            "label": "In stock",
            "count": 142
          }
        ]
      },
      {
        "kind": "check",
        "title": "Part Type",
        "options": [
          {
            "label": "Drivetrain",
            "count": 64
          },
          {
            "label": "Brakes",
            "count": 38
          },
          {
            "label": "Wheels",
            "count": 27
          },
          {
            "label": "Cockpit",
            "count": 41
          },
          {
            "label": "Pedals",
            "count": 22
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Manufacturer",
        "options": [
          {
            "label": "Shimano",
            "count": 58
          },
          {
            "label": "SRAM",
            "count": 44
          },
          {
            "label": "DT Swiss",
            "count": 19
          },
          {
            "label": "Fox",
            "count": 12
          },
          {
            "label": "Race Face",
            "count": 16
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Material",
        "options": [
          {
            "label": "Aluminium",
            "count": 71
          },
          {
            "label": "Carbon",
            "count": 33
          },
          {
            "label": "Steel",
            "count": 24
          },
          {
            "label": "Titanium",
            "count": 9
          }
        ],
        "more": false
      },
      {
        "kind": "color",
        "title": "Colors",
        "options": [
          {
            "color": "#9aa6b4",
            "count": 16
          },
          {
            "color": "#6d28d9",
            "count": 15
          },
          {
            "color": "#16181d",
            "count": 14
          },
          {
            "color": "#006ee0",
            "count": 13
          },
          {
            "color": "#ffd105",
            "count": 11
          },
          {
            "color": "#1a8a4f",
            "count": 8
          },
          {
            "color": "#f97316",
            "count": 7
          },
          {
            "color": "#14b8a6",
            "count": 7
          },
          {
            "color": "#e0004b",
            "count": 5
          },
          {
            "color": "#cbd4de",
            "count": 4
          },
          {
            "color": "#ec4899",
            "count": 2
          },
          {
            "color": "#8b5e3c",
            "count": 2
          }
        ]
      }
    ],
    "products": [
      {
        "manufacturer": "Shimano",
        "name": "Deore XT M8100 Groupset — 1 × 12",
        "spec": "Disc · 10–51T",
        "price": "549,00",
        "oldPrice": "629,00",
        "badge": "-13%",
        "note": "Ships in 24h"
      },
      {
        "manufacturer": "SRAM",
        "name": "GX Eagle Cassette — 10–52T",
        "spec": "12-speed · XD",
        "price": "312,90"
      },
      {
        "manufacturer": "DT Swiss",
        "name": "XR 1700 Spline Wheelset — 29\"",
        "spec": "Centerlock · Boost",
        "price": "689,00",
        "badge": "New"
      },
      {
        "manufacturer": "Fox",
        "name": "36 Float Performance Fork — 160mm",
        "spec": "29\" · GRIP damper",
        "price": "899,00",
        "note": "Only 2 left"
      },
      {
        "manufacturer": "Shimano",
        "name": "Deore XT Disc Brake Set — Front + Rear",
        "spec": "4-piston · Ice-Tech",
        "price": "274,50",
        "oldPrice": "319,00"
      },
      {
        "manufacturer": "Race Face",
        "name": "Aeffect R Crank Set — 32T",
        "spec": "Boost · 170mm",
        "price": "189,90"
      }
    ]
  },
  {
    "id": "accessories",
    "label": "Accessories",
    "leaf": "Bags & Backpacks",
    "crumb": [
      "Cycling",
      "Accessories"
    ],
    "mega": [
      [
        {
          "title": "Bags & Backpacks",
          "links": [
            "Saddle Bags",
            "Frame Bags",
            "Panniers",
            "Backpacks",
            "Bar Bags"
          ]
        }
      ],
      [
        {
          "title": "Lights & Locks",
          "links": [
            "Front Lights",
            "Rear Lights",
            "Light Sets",
            "Frame Locks",
            "Chain Locks"
          ]
        }
      ],
      [
        {
          "title": "Care & Tools",
          "links": [
            "Multi-Tools",
            "Pumps",
            "Cleaning",
            "Lubricants",
            "Workstands"
          ]
        }
      ],
      [
        {
          "title": "Hydration",
          "links": [
            "Bottles",
            "Cages",
            "Hydration Packs"
          ]
        },
        {
          "title": "Protection",
          "links": [
            "Mudguards",
            "Frame Protection",
            "Bells"
          ]
        }
      ]
    ],
    "facets": [
      {
        "kind": "range",
        "min": "9",
        "max": "199"
      },
      {
        "kind": "toggles",
        "options": [
          {
            "label": "Sale %",
            "count": 6,
            "sale": true
          },
          {
            "label": "In stock",
            "count": 210
          }
        ]
      },
      {
        "kind": "check",
        "title": "Type",
        "options": [
          {
            "label": "Bags",
            "count": 48
          },
          {
            "label": "Locks",
            "count": 22
          },
          {
            "label": "Lights",
            "count": 36
          },
          {
            "label": "Pumps",
            "count": 18
          },
          {
            "label": "Bottles",
            "count": 41
          },
          {
            "label": "Mudguards",
            "count": 14
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Manufacturer",
        "options": [
          {
            "label": "Ortlieb",
            "count": 24
          },
          {
            "label": "Abus",
            "count": 19
          },
          {
            "label": "Lezyne",
            "count": 28
          },
          {
            "label": "Topeak",
            "count": 22
          },
          {
            "label": "SKS",
            "count": 17
          }
        ],
        "more": true
      },
      {
        "kind": "color",
        "title": "Colors",
        "options": [
          {
            "color": "#9aa6b4",
            "count": 16
          },
          {
            "color": "#6d28d9",
            "count": 15
          },
          {
            "color": "#16181d",
            "count": 14
          },
          {
            "color": "#006ee0",
            "count": 13
          },
          {
            "color": "#ffd105",
            "count": 11
          },
          {
            "color": "#1a8a4f",
            "count": 8
          },
          {
            "color": "#f97316",
            "count": 7
          },
          {
            "color": "#14b8a6",
            "count": 7
          },
          {
            "color": "#e0004b",
            "count": 5
          },
          {
            "color": "#cbd4de",
            "count": 4
          },
          {
            "color": "#ec4899",
            "count": 2
          },
          {
            "color": "#8b5e3c",
            "count": 2
          }
        ]
      }
    ],
    "products": [
      {
        "manufacturer": "Ortlieb",
        "name": "Back-Roller Classic Panniers — 40L",
        "spec": "Waterproof · pair",
        "price": "129,90",
        "badge": "Bestseller"
      },
      {
        "manufacturer": "Abus",
        "name": "Bordo 6000 Folding Lock — 90cm",
        "spec": "Security level 10",
        "price": "89,95",
        "oldPrice": "99,95",
        "badge": "-10%"
      },
      {
        "manufacturer": "Lezyne",
        "name": "Macro Drive 1300 Front Light",
        "spec": "1300 lumen · USB-C",
        "price": "64,90"
      },
      {
        "manufacturer": "Topeak",
        "name": "JoeBlow Sport III Floor Pump",
        "spec": "160 psi · gauge",
        "price": "44,90"
      },
      {
        "manufacturer": "Fidlock",
        "name": "TWIST Bottle 600 + Base Mount",
        "spec": "Magnetic · 600ml",
        "price": "34,90",
        "badge": "New"
      },
      {
        "manufacturer": "SKS",
        "name": "Bluemels Mudguard Set — 29\"",
        "spec": "Front + rear",
        "price": "39,99"
      }
    ]
  },
  {
    "id": "electronics",
    "label": "Electronics",
    "leaf": "Bike Computers",
    "crumb": [
      "Cycling",
      "Electronics"
    ],
    "mega": [
      [
        {
          "title": "Bike Computers",
          "links": [
            "GPS Computers",
            "Mounts",
            "Speed & Cadence",
            "Heart Rate"
          ]
        }
      ],
      [
        {
          "title": "Lights",
          "links": [
            "Front Lights",
            "Rear Lights",
            "Helmet Lights",
            "Light Sets"
          ]
        }
      ],
      [
        {
          "title": "Cameras & Audio",
          "links": [
            "Action Cameras",
            "Camera Mounts",
            "Headphones"
          ]
        }
      ],
      [
        {
          "title": "Power",
          "links": [
            "Power Banks",
            "Chargers",
            "Dynamos"
          ]
        },
        {
          "title": "Smart Trainers",
          "links": [
            "Direct Drive",
            "Wheel-On",
            "Rollers"
          ]
        }
      ]
    ],
    "facets": [
      {
        "kind": "range",
        "min": "99",
        "max": "699"
      },
      {
        "kind": "toggles",
        "options": [
          {
            "label": "Sale %",
            "count": 5,
            "sale": true
          },
          {
            "label": "In stock",
            "count": 64
          }
        ]
      },
      {
        "kind": "check",
        "title": "Type",
        "options": [
          {
            "label": "GPS Computers",
            "count": 22
          },
          {
            "label": "Action Cameras",
            "count": 11
          },
          {
            "label": "Lights",
            "count": 28
          },
          {
            "label": "Sensors",
            "count": 19
          },
          {
            "label": "Displays",
            "count": 9
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Manufacturer",
        "options": [
          {
            "label": "Garmin",
            "count": 26
          },
          {
            "label": "Wahoo",
            "count": 14
          },
          {
            "label": "GoPro",
            "count": 8
          },
          {
            "label": "Sigma",
            "count": 12
          },
          {
            "label": "Bosch",
            "count": 10
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Connectivity",
        "options": [
          {
            "label": "ANT+",
            "count": 38
          },
          {
            "label": "Bluetooth",
            "count": 41
          },
          {
            "label": "WiFi",
            "count": 17
          },
          {
            "label": "GPS",
            "count": 24
          }
        ],
        "more": false
      }
    ],
    "products": [
      {
        "manufacturer": "Garmin",
        "name": "Edge 1040 Solar — GPS Computer",
        "spec": "Solar · 45h battery",
        "price": "629,00",
        "badge": "Bestseller"
      },
      {
        "manufacturer": "Wahoo",
        "name": "ELEMNT BOLT V2 — GPS Computer",
        "spec": "Color · aero",
        "price": "279,90",
        "oldPrice": "299,90",
        "badge": "-7%"
      },
      {
        "manufacturer": "GoPro",
        "name": "HERO12 Black — Action Camera",
        "spec": "5.3K · HyperSmooth",
        "price": "399,00"
      },
      {
        "manufacturer": "Garmin",
        "name": "Varia RCT715 — Radar Rear Light",
        "spec": "Camera + radar",
        "price": "349,00",
        "badge": "New"
      },
      {
        "manufacturer": "Sigma",
        "name": "ROX 11.1 EVO — GPS Set",
        "spec": "With sensors",
        "price": "169,95"
      },
      {
        "manufacturer": "Bosch",
        "name": "Kiox 300 — Display Kit",
        "spec": "Smart System",
        "price": "159,90"
      }
    ]
  },
  {
    "id": "clothing",
    "label": "Clothing",
    "leaf": "Jerseys",
    "crumb": [
      "Cycling",
      "Clothing"
    ],
    "mega": [
      [
        {
          "title": "Jerseys & Tops",
          "links": [
            "Short Sleeve",
            "Long Sleeve",
            "Base Layers",
            "Wind Vests"
          ]
        }
      ],
      [
        {
          "title": "Shorts & Tights",
          "links": [
            "Bib Shorts",
            "Shorts",
            "Tights",
            "Trousers"
          ]
        }
      ],
      [
        {
          "title": "Jackets",
          "links": [
            "Rain Jackets",
            "Wind Jackets",
            "Thermal",
            "Gilets"
          ]
        }
      ],
      [
        {
          "title": "Accessories",
          "links": [
            "Gloves",
            "Socks",
            "Caps",
            "Arm Warmers"
          ]
        },
        {
          "title": "By Gender",
          "links": [
            "Men",
            "Women",
            "Kids"
          ]
        }
      ]
    ],
    "facets": [
      {
        "kind": "range",
        "min": "29",
        "max": "249"
      },
      {
        "kind": "toggles",
        "options": [
          {
            "label": "Sale %",
            "count": 12,
            "sale": true
          },
          {
            "label": "In stock",
            "count": 96
          }
        ]
      },
      {
        "kind": "check",
        "title": "Size",
        "options": [
          {
            "label": "XS",
            "count": 14
          },
          {
            "label": "S",
            "count": 38
          },
          {
            "label": "M",
            "count": 52
          },
          {
            "label": "L",
            "count": 47
          },
          {
            "label": "XL",
            "count": 29
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Gender",
        "options": [
          {
            "label": "Men",
            "count": 64
          },
          {
            "label": "Women",
            "count": 41
          },
          {
            "label": "Unisex",
            "count": 22
          }
        ],
        "more": false
      },
      {
        "kind": "check",
        "title": "Manufacturer",
        "options": [
          {
            "label": "Castelli",
            "count": 22
          },
          {
            "label": "GORE",
            "count": 18
          },
          {
            "label": "Assos",
            "count": 14
          },
          {
            "label": "Endura",
            "count": 20
          },
          {
            "label": "Maloja",
            "count": 11
          }
        ],
        "more": true
      },
      {
        "kind": "color",
        "title": "Colors",
        "options": [
          {
            "color": "#9aa6b4",
            "count": 16
          },
          {
            "color": "#6d28d9",
            "count": 15
          },
          {
            "color": "#16181d",
            "count": 14
          },
          {
            "color": "#006ee0",
            "count": 13
          },
          {
            "color": "#ffd105",
            "count": 11
          },
          {
            "color": "#1a8a4f",
            "count": 8
          },
          {
            "color": "#f97316",
            "count": 7
          },
          {
            "color": "#14b8a6",
            "count": 7
          },
          {
            "color": "#e0004b",
            "count": 5
          },
          {
            "color": "#cbd4de",
            "count": 4
          },
          {
            "color": "#ec4899",
            "count": 2
          },
          {
            "color": "#8b5e3c",
            "count": 2
          }
        ]
      }
    ],
    "products": [
      {
        "manufacturer": "Castelli",
        "name": "Free Aero RC — Bib Shorts",
        "spec": "Men's · black",
        "price": "159,95",
        "badge": "Bestseller"
      },
      {
        "manufacturer": "GORE",
        "name": "Spinshift GTX — Rain Jacket",
        "spec": "GORE-TEX · orange",
        "price": "199,99",
        "oldPrice": "249,99",
        "badge": "-20%"
      },
      {
        "manufacturer": "Assos",
        "name": "Mille GT Jersey C2 — Short Sleeve",
        "spec": "Men's · blue",
        "price": "89,90"
      },
      {
        "manufacturer": "Endura",
        "name": "MT500 Burner — Trail Shorts",
        "spec": "Men's · olive",
        "price": "99,99",
        "badge": "New"
      },
      {
        "manufacturer": "Maloja",
        "name": "NadelM. — Long Sleeve Jersey",
        "spec": "Women's · plum",
        "price": "79,90"
      },
      {
        "manufacturer": "Shimano",
        "name": "Vertex Thermal — Tights",
        "spec": "Unisex · black",
        "price": "119,95"
      }
    ]
  },
  {
    "id": "shoes",
    "label": "Shoes",
    "leaf": "Road Shoes",
    "crumb": [
      "Cycling",
      "Shoes"
    ],
    "mega": [
      [
        {
          "title": "Road Shoes",
          "links": [
            "Performance",
            "Endurance",
            "Triathlon",
            "Women's"
          ]
        }
      ],
      [
        {
          "title": "MTB Shoes",
          "links": [
            "Clipless",
            "Flat",
            "Gravel",
            "Winter"
          ]
        }
      ],
      [
        {
          "title": "Casual & Urban",
          "links": [
            "Commuter",
            "Lifestyle",
            "Sandals"
          ]
        }
      ],
      [
        {
          "title": "Accessories",
          "links": [
            "Insoles",
            "Cleats",
            "Shoe Covers",
            "Laces"
          ]
        }
      ]
    ],
    "facets": [
      {
        "kind": "range",
        "min": "99",
        "max": "449"
      },
      {
        "kind": "toggles",
        "options": [
          {
            "label": "Sale %",
            "count": 7,
            "sale": true
          },
          {
            "label": "In stock",
            "count": 58
          }
        ]
      },
      {
        "kind": "check",
        "title": "Shoe Size",
        "options": [
          {
            "label": "40",
            "count": 22
          },
          {
            "label": "41",
            "count": 31
          },
          {
            "label": "42",
            "count": 44
          },
          {
            "label": "43",
            "count": 41
          },
          {
            "label": "44",
            "count": 33
          },
          {
            "label": "45",
            "count": 18
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Discipline",
        "options": [
          {
            "label": "Road",
            "count": 36
          },
          {
            "label": "MTB",
            "count": 41
          },
          {
            "label": "Gravel",
            "count": 17
          },
          {
            "label": "Urban",
            "count": 12
          }
        ],
        "more": false
      },
      {
        "kind": "check",
        "title": "Manufacturer",
        "options": [
          {
            "label": "Shimano",
            "count": 24
          },
          {
            "label": "Five Ten",
            "count": 14
          },
          {
            "label": "Sidi",
            "count": 11
          },
          {
            "label": "Giro",
            "count": 19
          },
          {
            "label": "Fizik",
            "count": 16
          }
        ],
        "more": true
      },
      {
        "kind": "color",
        "title": "Colors",
        "options": [
          {
            "color": "#9aa6b4",
            "count": 16
          },
          {
            "color": "#6d28d9",
            "count": 15
          },
          {
            "color": "#16181d",
            "count": 14
          },
          {
            "color": "#006ee0",
            "count": 13
          },
          {
            "color": "#ffd105",
            "count": 11
          },
          {
            "color": "#1a8a4f",
            "count": 8
          },
          {
            "color": "#f97316",
            "count": 7
          },
          {
            "color": "#14b8a6",
            "count": 7
          },
          {
            "color": "#e0004b",
            "count": 5
          },
          {
            "color": "#cbd4de",
            "count": 4
          },
          {
            "color": "#ec4899",
            "count": 2
          },
          {
            "color": "#8b5e3c",
            "count": 2
          }
        ]
      }
    ],
    "products": [
      {
        "manufacturer": "Shimano",
        "name": "RC903 S-PHYRE — Road Shoe",
        "spec": "Carbon · BOA",
        "price": "379,95",
        "badge": "Bestseller"
      },
      {
        "manufacturer": "Five Ten",
        "name": "Freerider Pro — MTB Flat Shoe",
        "spec": "Stealth rubber",
        "price": "149,95",
        "oldPrice": "169,95",
        "badge": "-13%"
      },
      {
        "manufacturer": "Sidi",
        "name": "Wire 2 Carbon — Road Shoe",
        "spec": "Tecno-3 dial",
        "price": "449,00"
      },
      {
        "manufacturer": "Giro",
        "name": "Empire VR90 — MTB Shoe",
        "spec": "Lace-up · Vibram",
        "price": "259,95",
        "badge": "New"
      },
      {
        "manufacturer": "Northwave",
        "name": "Origin Plus 2 — Gravel Shoe",
        "spec": "SLW3 dial",
        "price": "139,95"
      },
      {
        "manufacturer": "Fizik",
        "name": "Terra Atlas — Gravel Shoe",
        "spec": "Velcro · grippy",
        "price": "159,00"
      }
    ]
  },
  {
    "id": "outdoor",
    "label": "Outdoor",
    "leaf": "Backpacks",
    "crumb": [
      "Outdoor"
    ],
    "mega": [
      [
        {
          "title": "Camping",
          "links": [
            "Tents",
            "Sleeping Bags",
            "Sleeping Mats",
            "Stoves"
          ]
        }
      ],
      [
        {
          "title": "Backpacks",
          "links": [
            "Daypacks",
            "Hiking Packs",
            "Hydration Packs"
          ]
        }
      ],
      [
        {
          "title": "Apparel",
          "links": [
            "Jackets",
            "Base Layers",
            "Trousers",
            "Footwear"
          ]
        }
      ],
      [
        {
          "title": "Navigation",
          "links": [
            "GPS Devices",
            "Compasses",
            "Headlamps"
          ]
        },
        {
          "title": "Accessories",
          "links": [
            "Trekking Poles",
            "Water Filters",
            "First Aid"
          ]
        }
      ]
    ],
    "facets": [
      {
        "kind": "range",
        "min": "39",
        "max": "249"
      },
      {
        "kind": "toggles",
        "options": [
          {
            "label": "Sale %",
            "count": 8,
            "sale": true
          },
          {
            "label": "In stock",
            "count": 73
          }
        ]
      },
      {
        "kind": "check",
        "title": "Category",
        "options": [
          {
            "label": "Backpacks",
            "count": 28
          },
          {
            "label": "Tents",
            "count": 14
          },
          {
            "label": "Sleeping",
            "count": 19
          },
          {
            "label": "Lighting",
            "count": 22
          },
          {
            "label": "Cooking",
            "count": 11
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Manufacturer",
        "options": [
          {
            "label": "Vaude",
            "count": 18
          },
          {
            "label": "The North Face",
            "count": 14
          },
          {
            "label": "Deuter",
            "count": 21
          },
          {
            "label": "Petzl",
            "count": 9
          },
          {
            "label": "Primus",
            "count": 7
          }
        ],
        "more": true
      },
      {
        "kind": "color",
        "title": "Colors",
        "options": [
          {
            "color": "#9aa6b4",
            "count": 16
          },
          {
            "color": "#6d28d9",
            "count": 15
          },
          {
            "color": "#16181d",
            "count": 14
          },
          {
            "color": "#006ee0",
            "count": 13
          },
          {
            "color": "#ffd105",
            "count": 11
          },
          {
            "color": "#1a8a4f",
            "count": 8
          },
          {
            "color": "#f97316",
            "count": 7
          },
          {
            "color": "#14b8a6",
            "count": 7
          },
          {
            "color": "#e0004b",
            "count": 5
          },
          {
            "color": "#cbd4de",
            "count": 4
          },
          {
            "color": "#ec4899",
            "count": 2
          },
          {
            "color": "#8b5e3c",
            "count": 2
          }
        ]
      }
    ],
    "products": [
      {
        "manufacturer": "Vaude",
        "name": "Asymmetric 42+8 — Hiking Backpack",
        "spec": "Green Shape · blue",
        "price": "179,90",
        "badge": "Bestseller"
      },
      {
        "manufacturer": "The North Face",
        "name": "Stormbreak 2 — Tent",
        "spec": "2-person · 3-season",
        "price": "199,95",
        "oldPrice": "234,95",
        "badge": "-15%"
      },
      {
        "manufacturer": "Deuter",
        "name": "Aircontact Lite 50+10 — Pack",
        "spec": "Trekking · slate",
        "price": "169,95"
      },
      {
        "manufacturer": "Petzl",
        "name": "Actik Core — Headlamp",
        "spec": "600 lumen · USB",
        "price": "64,95",
        "badge": "New"
      },
      {
        "manufacturer": "Primus",
        "name": "Lite+ — Stove System",
        "spec": "Integrated · 0.5L",
        "price": "99,90"
      },
      {
        "manufacturer": "Therm-a-Rest",
        "name": "NeoAir XLite — Sleeping Mat",
        "spec": "R-value 4.5",
        "price": "209,95"
      }
    ]
  },
  {
    "id": "moresports",
    "label": "More Sports",
    "leaf": "Running",
    "crumb": [
      "Sports"
    ],
    "mega": [
      [
        {
          "title": "Running",
          "links": [
            "Shoes",
            "Apparel",
            "Watches",
            "Accessories"
          ]
        }
      ],
      [
        {
          "title": "Swimming",
          "links": [
            "Wetsuits",
            "Goggles",
            "Caps",
            "Swimwear"
          ]
        }
      ],
      [
        {
          "title": "Fitness",
          "links": [
            "Smart Trainers",
            "Weights",
            "Mats",
            "Bands"
          ]
        }
      ],
      [
        {
          "title": "Winter",
          "links": [
            "Ski",
            "Snowboard",
            "Apparel",
            "Goggles"
          ]
        },
        {
          "title": "Triathlon",
          "links": [
            "Tri Suits",
            "Race Belts",
            "Transition"
          ]
        }
      ]
    ],
    "facets": [
      {
        "kind": "range",
        "min": "39",
        "max": "649"
      },
      {
        "kind": "toggles",
        "options": [
          {
            "label": "Sale %",
            "count": 10,
            "sale": true
          },
          {
            "label": "In stock",
            "count": 88
          }
        ]
      },
      {
        "kind": "check",
        "title": "Sport",
        "options": [
          {
            "label": "Running",
            "count": 34
          },
          {
            "label": "Swimming",
            "count": 18
          },
          {
            "label": "Fitness",
            "count": 26
          },
          {
            "label": "Winter",
            "count": 14
          },
          {
            "label": "Triathlon",
            "count": 9
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Manufacturer",
        "options": [
          {
            "label": "Garmin",
            "count": 16
          },
          {
            "label": "Speedo",
            "count": 11
          },
          {
            "label": "On",
            "count": 14
          },
          {
            "label": "Wahoo",
            "count": 9
          },
          {
            "label": "Salomon",
            "count": 12
          }
        ],
        "more": true
      }
    ],
    "products": [
      {
        "manufacturer": "Garmin",
        "name": "Forerunner 965 — Running Watch",
        "spec": "AMOLED · maps",
        "price": "649,00",
        "badge": "Bestseller"
      },
      {
        "manufacturer": "Speedo",
        "name": "Fastskin Pure Focus — Goggles",
        "spec": "Mirror · racing",
        "price": "39,95",
        "oldPrice": "49,95",
        "badge": "-20%"
      },
      {
        "manufacturer": "On",
        "name": "Cloudmonster — Running Shoe",
        "spec": "Max cushion",
        "price": "169,95"
      },
      {
        "manufacturer": "Wahoo",
        "name": "KICKR Core — Smart Trainer",
        "spec": "Direct drive",
        "price": "599,99",
        "badge": "New"
      },
      {
        "manufacturer": "Salomon",
        "name": "S/Lab Trail 5 — Hydration Vest",
        "spec": "Race fit · 5L",
        "price": "139,95"
      },
      {
        "manufacturer": "Arena",
        "name": "Powerskin Carbon — Race Suit",
        "spec": "FINA approved",
        "price": "289,00"
      }
    ]
  },
  {
    "id": "brands",
    "label": "Brands",
    "leaf": "All Brands",
    "crumb": [
      "Brands"
    ],
    "mega": [
      [
        {
          "title": "Popular",
          "links": [
            "CUBE",
            "Canyon",
            "Trek",
            "Specialized",
            "Giant"
          ]
        }
      ],
      [
        {
          "title": "Components",
          "links": [
            "Shimano",
            "SRAM",
            "DT Swiss",
            "Fox",
            "RockShox"
          ]
        }
      ],
      [
        {
          "title": "Apparel",
          "links": [
            "Castelli",
            "GORE",
            "Endura",
            "Assos",
            "Maloja"
          ]
        }
      ],
      [
        {
          "title": "Browse",
          "links": [
            "A – E",
            "F – J",
            "K – O",
            "P – T",
            "U – Z",
            "All Brands"
          ]
        }
      ]
    ],
    "facets": [
      {
        "kind": "range",
        "min": "749",
        "max": "4799"
      },
      {
        "kind": "toggles",
        "options": [
          {
            "label": "Sale %",
            "count": 18,
            "sale": true
          },
          {
            "label": "In stock",
            "count": 132
          }
        ]
      },
      {
        "kind": "check",
        "title": "Category",
        "options": [
          {
            "label": "Bikes",
            "count": 64
          },
          {
            "label": "Parts",
            "count": 88
          },
          {
            "label": "Clothing",
            "count": 52
          },
          {
            "label": "Accessories",
            "count": 47
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "First Letter",
        "options": [
          {
            "label": "A – E",
            "count": 24
          },
          {
            "label": "F – J",
            "count": 18
          },
          {
            "label": "K – O",
            "count": 21
          },
          {
            "label": "P – T",
            "count": 29
          },
          {
            "label": "U – Z",
            "count": 14
          }
        ],
        "more": false
      },
      {
        "kind": "check",
        "title": "Manufacturer",
        "options": [
          {
            "label": "CUBE",
            "count": 24
          },
          {
            "label": "Canyon",
            "count": 16
          },
          {
            "label": "Trek",
            "count": 19
          },
          {
            "label": "Specialized",
            "count": 22
          },
          {
            "label": "Giant",
            "count": 17
          }
        ],
        "more": true
      }
    ],
    "products": [
      {
        "manufacturer": "CUBE",
        "name": "Stereo One77 — Trail Full Suspension",
        "spec": "2026 · carbon",
        "price": "4.299,00",
        "badge": "Bestseller"
      },
      {
        "manufacturer": "Canyon",
        "name": "Ultimate CF SLX 8 — Road Bike",
        "spec": "2026 · Di2",
        "price": "4.799,00",
        "badge": "New"
      },
      {
        "manufacturer": "Trek",
        "name": "Marlin 7 Gen 3 — Hardtail",
        "spec": "2026 · matte black",
        "price": "949,00",
        "oldPrice": "1.049,00",
        "badge": "-10%"
      },
      {
        "manufacturer": "Specialized",
        "name": "Rockhopper Comp — 29\" MTB",
        "spec": "2026 · satin red",
        "price": "899,00"
      },
      {
        "manufacturer": "Giant",
        "name": "Talon 1 — 29\" Hardtail",
        "spec": "2026 · blue",
        "price": "799,00"
      },
      {
        "manufacturer": "SCOTT",
        "name": "Aspect 940 — 29\" Mountain Bike",
        "spec": "2026 · grey",
        "price": "749,00"
      }
    ]
  },
  {
    "id": "sale",
    "label": "SALE %",
    "accent": true,
    "leaf": "Bikes on Sale",
    "crumb": [
      "Sale"
    ],
    "mega": [
      [
        {
          "title": "Bikes on Sale",
          "links": [
            "Mountain Bikes",
            "E-Bikes",
            "Road & Gravel",
            "Kids' Bikes"
          ]
        }
      ],
      [
        {
          "title": "Parts on Sale",
          "links": [
            "Drivetrain",
            "Brakes",
            "Wheels",
            "Cockpit"
          ]
        }
      ],
      [
        {
          "title": "Clothing on Sale",
          "links": [
            "Jerseys",
            "Jackets",
            "Shorts",
            "Shoes"
          ]
        }
      ],
      [
        {
          "title": "Accessories on Sale",
          "links": [
            "Lights",
            "Locks",
            "Bags",
            "Electronics"
          ]
        }
      ]
    ],
    "facets": [
      {
        "kind": "range",
        "min": "129",
        "max": "1899"
      },
      {
        "kind": "toggles",
        "options": [
          {
            "label": "On sale only",
            "count": 248,
            "sale": true
          },
          {
            "label": "In stock",
            "count": 201
          }
        ]
      },
      {
        "kind": "check",
        "title": "Discount",
        "options": [
          {
            "label": "-10% or more",
            "count": 248
          },
          {
            "label": "-20% or more",
            "count": 162
          },
          {
            "label": "-30% or more",
            "count": 74
          },
          {
            "label": "-40% or more",
            "count": 21
          }
        ],
        "more": true
      },
      {
        "kind": "check",
        "title": "Category",
        "options": [
          {
            "label": "Bikes",
            "count": 48
          },
          {
            "label": "Parts",
            "count": 96
          },
          {
            "label": "Clothing",
            "count": 64
          },
          {
            "label": "Accessories",
            "count": 40
          }
        ],
        "more": false
      },
      {
        "kind": "check",
        "title": "Manufacturer",
        "options": [
          {
            "label": "CUBE",
            "count": 14
          },
          {
            "label": "GORE",
            "count": 11
          },
          {
            "label": "Shimano",
            "count": 22
          },
          {
            "label": "Giro",
            "count": 9
          },
          {
            "label": "Garmin",
            "count": 12
          }
        ],
        "more": true
      }
    ],
    "products": [
      {
        "manufacturer": "CUBE",
        "name": "Attain GTC SLT — Road Bike",
        "spec": "2025 · carbon",
        "price": "1.899,00",
        "oldPrice": "2.499,00",
        "badge": "-24%",
        "note": "Sale ends Sunday"
      },
      {
        "manufacturer": "GORE",
        "name": "C5 GTX — Trail Jacket",
        "spec": "Men's · black",
        "price": "149,99",
        "oldPrice": "219,99",
        "badge": "-32%",
        "note": "Sale ends Sunday"
      },
      {
        "manufacturer": "Shimano",
        "name": "XT M8100 — Disc Brake Set",
        "spec": "4-piston",
        "price": "219,00",
        "oldPrice": "289,00",
        "badge": "-24%",
        "note": "Sale ends Sunday"
      },
      {
        "manufacturer": "Giro",
        "name": "Aether MIPS — Road Helmet",
        "spec": "Spherical · matte",
        "price": "179,95",
        "oldPrice": "279,95",
        "badge": "-36%",
        "note": "Sale ends Sunday"
      },
      {
        "manufacturer": "Garmin",
        "name": "Edge 530 — GPS Computer",
        "spec": "ClimbPro",
        "price": "199,00",
        "oldPrice": "279,00",
        "badge": "-28%",
        "note": "Sale ends Sunday"
      },
      {
        "manufacturer": "Castelli",
        "name": "Perfetto RoS 2 — Jacket",
        "spec": "Men's · blue",
        "price": "129,95",
        "oldPrice": "184,95",
        "badge": "-30%",
        "note": "Sale ends Sunday"
      }
    ]
  }
];
  var images = [
  {
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781689835/n2ddykxfj0qcvpha3xmi.png",
    "alt": "Pedal_rainbow_EDM",
    "id": 1781689838263.5366,
    "source": "cloudinary"
  },
  {
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781689864/lcucsvoho7hcufbqvsp7.png",
    "alt": "Dropper Seat Post EDM",
    "id": 1781689867120.0613,
    "source": "cloudinary"
  },
  {
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781689874/i714pfle7gjl3e9mvat5.png",
    "alt": "LIGHT",
    "id": 1781689876480.3552,
    "source": "cloudinary"
  },
  {
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781689883/zqy1m58qoxjhwehrbswn.png",
    "alt": "HUB",
    "id": 1781689886134.6062,
    "source": "cloudinary"
  },
  {
    "id": 1781692031296.2617,
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781692029/fa3qwnjvepxqk4b4syte.png",
    "alt": "CO25-8148",
    "source": "cloudinary"
  }
];
  var hero = [
  {
    "id": 1781689895414.5752,
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781689835/n2ddykxfj0qcvpha3xmi.png",
    "alt": "Pedal_rainbow_EDM"
  },
  {
    "id": 1781692031296.3933,
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781692029/fa3qwnjvepxqk4b4syte.png",
    "alt": "CO25-8148"
  },
  {
    "id": 1781689899441.6396,
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781689883/zqy1m58qoxjhwehrbswn.png",
    "alt": "HUB"
  },
  {
    "id": 1781689896911.1091,
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781689864/lcucsvoho7hcufbqvsp7.png",
    "alt": "Dropper Seat Post EDM"
  },
  {
    "id": 1781689897937.1333,
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781689874/i714pfle7gjl3e9mvat5.png",
    "alt": "LIGHT"
  }
];
  var map = {};
  categories.forEach(function (c) { map[c.id] = c; });
  try {
    var _cms = localStorage.getItem('ARMOR_BIKE_CMS');
    if (_cms) { var _d = JSON.parse(_cms); if (_d) { if (Array.isArray(_d.categories) && _d.categories.length) { categories = _d.categories; map = {}; categories.forEach(function (c) { map[c.id] = c; }); } if (Array.isArray(_d.images) && _d.images.length) { images = _d.images; } if (Array.isArray(_d.hero) && _d.hero.length) { hero = _d.hero; } } }
  } catch (_e) {}
  window.STORE = { categories: categories, map: map, HEX: HEX, images: images, hero: hero };
})();