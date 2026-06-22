/* ARMOR BIKE Storefront — published 2026-06-22 11:44 UTC */
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
            "Chain Locks",
            "Cable Lock"
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
      },
      {
        "manufacturer": "ARMOR",
        "name": "CO25-8148",
        "spec": "CABLE LOCK  DIA:18MMX1000MM  W/PP MESH MATERIAL",
        "badge": "",
        "note": "",
        "leaf": "Cable Lock",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782125693/faoniry4vtq9vhlu1bfg.png",
            "alt": "CO25-8164 PK"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782125692/yxcgeevhayyqqv3m9qib.png",
            "alt": "BLK COLOR"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782125693/jmacagsdurenblrim1ll.png",
            "alt": "CO25-8164BL"
          }
        ]
      },
      {
        "manufacturer": "ARMOR",
        "name": "CO25-81348",
        "spec": "CABLE LOCK  10MMX1200MM W/WOVEN KNIT COVER  ",
        "badge": "",
        "note": "",
        "leaf": "Cable Lock",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782125934/agmzbzhs0d1r7wwjyrry.png",
            "alt": "PC2124 BLUE-Photoroom"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782125934/rpb3xjjhiapxo1gmolbf.png",
            "alt": "PC2124-Photoroom"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782125935/mavevycdws5zgytnya1z.png",
            "alt": "PC2124 RED-Photoroom"
          }
        ]
      },
      {
        "manufacturer": "ARMOR",
        "name": "CO25-81351",
        "spec": "CABLE LOCK  DIA 10MMX1200MM  5-DIGIT RESETTABLE COMBINETION W/WOVEN KNIT COVER",
        "badge": "",
        "note": "",
        "leaf": "Cable Lock",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127013/vttk9gdnpg4buvrkufjm.jpg",
            "alt": "PC2133-RED"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127013/xvuvvsmklwkn1ixadiwe.png",
            "alt": "PC2133-Photoroom"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127013/aupwkdv6kllwemmpwjyt.png",
            "alt": "PC2133-BLK-BLUE COLOR-Photoroom (1)"
          }
        ],
        "productId": "prd_mqp4evng_fo79jg",
        "sourceKey": "",
        "ownerId": "1782120827997",
        "ownerUsername": "rita",
        "ownerName": "rita",
        "createdAt": "2026-06-22T11:16:57.915Z",
        "updatedAt": "2026-06-22T11:16:57.915Z",
        "updatedBy": "rita"
      },
      {
        "manufacturer": "ARMOR",
        "name": "CO25-81369",
        "spec": "CABLE LOCK DIA 10MMX1200MM  W/2 SPARE KEY",
        "badge": "",
        "note": "",
        "leaf": "Cable Lock",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127194/l6vpcta9rexi23hvxf9o.png",
            "alt": "BLACK"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127194/n98pwyy3d1bxldjl0gm3.png",
            "alt": "BLUE"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127194/onkzqdcottt8z7kodlpi.png",
            "alt": "GREEN"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127195/n4nuya5u9g2x2ixrjdkm.png",
            "alt": "圖片1"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127195/slp3moasz9kly22tgbxy.jpg",
            "alt": "RED"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127195/b1nvl6stiqmoh0ocukci.png",
            "alt": "PC2105"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127196/f5xbzrschaqyoq2erets.png",
            "alt": "PURPLE COLOR SAMPLE 8MMX1000MM-Photoroom (3)"
          }
        ],
        "productId": "prd_mqp4izgv_22skyx",
        "sourceKey": "",
        "ownerId": "1782120827997",
        "ownerUsername": "rita",
        "ownerName": "rita",
        "createdAt": "2026-06-22T11:20:09.487Z",
        "updatedAt": "2026-06-22T11:20:09.487Z",
        "updatedBy": "rita"
      },
      {
        "manufacturer": "ARMOR",
        "name": "CO25-81379",
        "spec": "CABLE LOCK  DIA 10MMX1200MM 4-RESETTABLE COMBINATION ",
        "badge": "",
        "note": "",
        "leaf": "Cable Lock",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127373/ykj8jiulejscogshdqle.png",
            "alt": "unnamed (1)-Photoroom"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127373/qvdntzcelxyj3pnlajwc.png",
            "alt": "PC2145(1)-Photoroom"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127373/gnoymcvkzu9usqxqmgzq.png",
            "alt": "PURPLE"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127374/rugsxwurxh93yow1e3u3.png",
            "alt": "279C BLUE-Photoroom"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127374/l98odrvoub9ebjolkwcg.png",
            "alt": "185C RED-Photoroom"
          }
        ],
        "productId": "prd_mqp4mopc_o47wb6",
        "sourceKey": "",
        "ownerId": "1782120827997",
        "ownerUsername": "rita",
        "ownerName": "rita",
        "createdAt": "2026-06-22T11:23:02.160Z",
        "updatedAt": "2026-06-22T11:23:02.160Z",
        "updatedBy": "rita"
      },
      {
        "manufacturer": "ARMOR",
        "name": "CO25-8170",
        "spec": "FOLDING LOCK  760MM   W/2 SPARE KEYS",
        "badge": "",
        "note": "",
        "leaf": "Foldng Lock",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127629/kpourr1iypp1rqtzyjvo.png",
            "alt": "CO25-8170"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127629/xjylcrzzrgprsndfaypw.jpg",
            "alt": "CO25-8170-2"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127629/lz5phpzwy2ndzw3n77pf.png",
            "alt": "CO25-8170-4"
          },
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127629/ecdfmays6a8p39zfwqof.png",
            "alt": "CO25-8170-3"
          }
        ],
        "productId": "prd_mqp4s1zg_9xjdwb",
        "sourceKey": "",
        "ownerId": "1782120827997",
        "ownerUsername": "rita",
        "ownerName": "rita",
        "createdAt": "2026-06-22T11:27:12.652Z",
        "updatedAt": "2026-06-22T11:27:12.652Z",
        "updatedBy": "rita"
      },
      {
        "manufacturer": "ARMOR ",
        "name": "CO25-81253",
        "spec": "U LOCK  SIZE 180MMX260MM CALBE:10MMX1200MM W/2 BARSS KEYS",
        "badge": "",
        "note": "",
        "leaf": "U lock",
        "images": [
          {
            "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782127890/xpasaut2owckax3dnh28.png",
            "alt": "CO25-81253"
          }
        ],
        "productId": "prd_mqp4xp3o_v3puym",
        "sourceKey": "prd_mqp4xp3o_v3puym",
        "ownerId": "1782120827997",
        "ownerUsername": "rita",
        "ownerName": "rita",
        "createdAt": "2026-06-22T11:31:35.892Z",
        "updatedAt": "2026-06-22T11:32:35.925Z",
        "updatedBy": "rita"
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
    "products": []
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
    "products": []
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
    "products": []
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
    "id": 1782125184940.2637,
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782125183/yc5ldbceqxhmghlug0em.png",
    "alt": "CO25-81348 (3)",
    "source": "cloudinary"
  }
];
  var badges = [];
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
    "id": 1782125184940.7253,
    "url": "https://res.cloudinary.com/dvzdptb3i/image/upload/v1782125183/yc5ldbceqxhmghlug0em.png",
    "alt": "CO25-81348 (3)"
  }
];
  var map = {};
  categories.forEach(function (c) { map[c.id] = c; });
  window.STORE = { categories: categories, map: map, HEX: HEX, images: images, badges: badges, hero: hero };
})();
