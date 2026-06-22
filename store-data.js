/* ARMOR BIKE Storefront — published 2026-06-22 10:48 UTC */
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
    "products": [],
    "accent": false
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
    "products": []
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
        },
        {
          "title": "E-PUMP",
          "links": [
            "MINI",
            "BIG"
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
        "manufacturer": "ARMOR ",
        "name": "VK8145",
        "spec": "SIZE: 70X48X32 mm , 2X500mAH 3.7V ",
        "price": "USD 17.00 / SET ",
        "oldPrice": "",
        "badge": "Hot Deal",
        "note": "",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781757157/lhhrwcz7nyhq9hpdfcqp.jpg",
            "alt": "EP 1"
          }
        ]
      },
      {
        "manufacturer": "ARMOR ",
        "name": "VK-8149 ",
        "spec": "SIZE:74X54X30MM , 500mAH X 2 7.4V ",
        "price": "USD 15.70 /PCE ",
        "oldPrice": "",
        "badge": "",
        "note": "",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781776419/c6glrwcou5ktgxy1gan7.jpg",
            "alt": "VK 8149"
          }
        ]
      },
      {
        "manufacturer": "ARMOR ",
        "name": "VK-8146",
        "spec": "SIZE: 70X50X30MM 600mAH X 2 7.4V ",
        "price": "USD 16.25 / SET ",
        "oldPrice": "",
        "badge": "",
        "note": "",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781776844/sz8yngv1qrasbdhwum6e.jpg",
            "alt": "VK-8146"
          }
        ]
      },
      {
        "manufacturer": "ARMOR ",
        "name": "VK-8302 ",
        "spec": "SIZE: 66X50X134mm , 2000mAHX2 7.4V ",
        "price": "USD 9.70/ SET ",
        "oldPrice": "",
        "badge": "",
        "note": "",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781780146/kb5dib4nlu9bcbb0yco5.jpg",
            "alt": "VK-8302"
          }
        ]
      },
      {
        "manufacturer": "ARMOR ",
        "name": "VK-8150",
        "spec": "SIZE: 90X97X150mm 1500mAH X3 ",
        "price": "",
        "oldPrice": "",
        "badge": "Hot Deal",
        "note": "",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781780637/gtzkzryhvnsam2pmvmee.jpg",
            "alt": "EP 2"
          }
        ]
      },
      {
        "manufacturer": "ARMOR ",
        "name": "VK-8152",
        "spec": "SIZE:66X46X160mm 2000mAHX2 7.4V ",
        "price": "USD 10.90/SET ",
        "oldPrice": "",
        "badge": "",
        "note": "",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781780933/nituehudj7k7ntlygdph.jpg",
            "alt": "VK-8152"
          }
        ]
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
    "products": []
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
    "products": []
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
    "products": []
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
  },
  {
    "id": 1781780424350.3518,
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781780420/vqohexxku4odxj28vtv3.png",
    "alt": "Gemini_Generated_Image_ug12mug12mug12mu -0617",
    "source": "cloudinary"
  },
  {
    "id": 1782125111497.547,
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782125109/g4vzn7ldspd1uxsowllo.png",
    "alt": "CO25-81348 (3)",
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
  },
  {
    "id": 1781780424350.115,
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1781780420/vqohexxku4odxj28vtv3.png",
    "alt": "E PUMP "
  },
  {
    "id": 1782125111497.9978,
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782125109/g4vzn7ldspd1uxsowllo.png",
    "alt": "CO25-81348 (3)"
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