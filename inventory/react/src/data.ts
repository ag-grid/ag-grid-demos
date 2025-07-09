import { Children } from "react";

export function getData() {
  const data = [
    {
      customerID: "C-001",
      quotationID: "Q-10001",
      quotationDate: "2024-05-01",
      customerName: "Maria Barden",
      email: "maria@example.com",
      quantity: 6,
      dateCreated: "2024-01-01",
      dateSubmitted: "2024-01-02",
      category: "Soft Rock",
      phone: "+1 234 567 890",
      lastQuotationAt: "1977-02-02",
      status: "active",
      TotalQuotations: 12,
      incoming: 45,
      image: "rumours",
      price: 40,
      sold: 15,
      priceIncrease: 5, // in percentage
      variants: 3,
      size: 3,
      die: 3,
      noOfLots: 4,
      variantDetails:
        [
          {
            "title": "Machine Type",
            "col1": "Digital",
            "col2": "Flex",
            "col3": "Digital",
            "col4": "Flex",
          },
          {
            "title": "Total Colors",
            "col1": "4",
            "col2": "4",
            "col3": "4",
            "col4": "4",
            children: [
              {
                "title": "color per version",
                "col1": "4",
                "col2": "4",
                "col3": "4",
                "col4": "4"
              },
              {
                "title": "number of versions / copies",
                "col1": "1",
                "col2": "1",
                "col3": "1",
                "col4": "1"
              }
            ]
          },

          {
            "title": "Layout Across",
            "col1": "4",
            "col2": "4",
            "col3": "1",
            "col4": "1"
          },
          {
            "title": "Quantity",
            "col1": "0",
            "col2": "45",
            "col3": "1",
            "col4": "1"
          },
          {
            "title": "Stock",

            "col2": 590,
            "col3": "1",
            "col4": "1",
            children: [

              {
                "title": "Stock Width",
                "col1": "8",
                "col2": "8",
                "col3": "1",
                "col4": "1"
              },
              {
                "title": "Quantity Margin",
                "col1": "0.2",
                "col2": "0.2",
                "col3": "1",
                "col4": "1"
              },
              {
                "title": "Quantity (Stock)",
                "col1": "",
                "col2": "13.5",
                "col3": "1",
                "col4": "1"
              },
              {
                "title": "Repeat",
                "col1": "10.5",
                "col2": "10.5",
                "col3": "1",
                "col4": "1"
              },
              {
                "title": "Cost per MSI (Stock)",
                "col1": "0.52",
                "col2": "0.52",
                "col3": "1",
                "col4": "1"
              },
              {
                "title": "MSI (Stock)",
                "col1": "",
                "col2": "1134",
                "col3": "1",
                "col4": "1"
              }]
          },
          {
            "title": "Cold Foil",
            children: [
              {
                "title": "width",
                "col1": "8",
                "col2": "0.2",
                "col3": "1",
                "col4": "1"
              },
              {
                "title": "Quantity Margin (Cold Foil)",
                "col1": "0.2",
                "col3": "1",
                "col4": "1"
              },
              {
                "title": "Quantity",
                "col1": "",
                "col3": "1",
                "col4": "1"
              },
              {
                "title": "Repeat",
                "col1": "",
                "col3": "1",
                "col4": "1"
              },
              {
                "title": "Cost per MSI",
                "col1": "",
                "col3": "1",
                "col4": "1"
              },
              {
                "title": "MSI",
                "col1": ""
              }]
          },
          {
            "title": "Quantity Margin (Laminate)",
            "col1": "0.2"
          },
          {
            "title": "Quantity (Laminate)",
            "col1": ""
          },
          {
            "title": "Laminate Material A (Gloss)",
            "col1": "0.1",
            "col2": "0.1"
          },
          {
            "title": "Laminate Material B (Matt)",
            "col1": "0.2",
            "col2": "0.2"
          },
          {
            "title": "Laminate Material C (Printable)",
            "col1": "0.3",
            "col2": "0.3"
          },
          {
            "title": "Laminate Material D (Soft Touch)",
            "col1": "0.38",
            "col2": "0.38"
          },
          {
            "title": "Make Ready",
            "col1": "100",
            "col2": "100"
          },
          {
            "title": "Run Time (hrs)",
            "col1": "",
            "col2": "69.48529412"
          },
          {
            "title": "Ink Cost",
            "col1": "",
            "col2": "200"
          },
          {
            "title": "[Flex] Per Color",
            "col2": "50"
          },
          {
            "title": "[Flex] Number of Colors",
            "col2": "4"
          },
          {
            "title": "[Digital] Area in MSI",
            "col1": ""
          },
          {
            "title": "Wash [Flex]",
            "col2": "40"
          },
          {
            "title": "Wash Cost per Color",
            "col2": "10"
          },
          {
            "title": "Wash Number of Colors",
            "col2": "4"
          },
          {
            "title": "Plate",
            "col2": "100"
          },
          {
            "title": "Finish",
            "col1": "0",
            "col2": "30"
          },
          {
            "title": "Quantity per roll/packs",
            "col2": "750"
          },
          {
            "title": "Number of rolls/packs",
            "col2": "60"
          },
          {
            "title": "Cost per roll",
            "col2": "0.5"
          },
          {
            "title": "Cost",
            "col1": "",
            "col2": "1129.485294"
          },
          {
            "title": "Markup Option",
            "col1": "B",
            "col2": "A"
          },
          {
            "title": "Markup A",
            "col1": "0.40",
            "col2": "0.40"
          },
          {
            "title": "Markup B",
            "col1": "0.52",
            "col2": "0.52"
          },
          {
            "title": "Markup C",
            "col1": "0.45",
            "col2": "0.45"
          },
          {
            "title": "Markup %",
            "col1": "0.52",
            "col2": "0.52"
          },
          {
            "title": "Markup $",
            "col1": "",
            "col2": "452"
          },
          {
            "title": "Total",
            "col1": "",
            "col2": "1581.485294"
          },
          {
            "title": "Total After Less",
            "col1": "",
            "col2": "1581.485294"
          },
          {
            "title": "Quantity (in thousand / M)",
            "col2": "45"
          },
          {
            "title": "Calculated Cost",
            "col1": "",
            "col2": "35.14"
          },
          {
            "title": "Estimate To Send",
            "col1": "Digital",
            "col2": "Flex"
          },
          {
            "title": "Cost Per Thousand",
            "col1": "",
            "col2": "35.14"
          }
        ]

      ,
    },
    {
      customerID: "C-001",
      quotationID: "Q-10002",
      quotationDate: "2024-05-03",
      customerName: "Maria Barden",
      email: "Adele@gmail.com",
      quantity: 6,
      dateCreated: "2024-01-01",
      dateSubmitted: "2024-01-02",
      category: "Pop",
      lastQuotationAt: "1977-02-02",
      phone: "+1 234 567 890",
      status: "draft",
      available: 0,
      incoming: 0,
      image: "futurenostalgia",
      price: 29,
      sold: 5,
      priceIncrease: 10,
      variants: 1,
      size: 3,
      die: 3,
      noOfLots: 4,
      variantDetails: [
        {
          title: "Future Nostalgia",
          quantity: 0,
          dateCreated: "2024-01-01",
          dateSubmitted: "2024-01-02",
          format: "LP, Limited Edition, Magenta",
          label: "Warner Records",
          cat: "5054197954467",
          country: "Worldwide",
          year: "2024",
        },
      ],
    },
    {
      customerID: "C-003",
      quotationID: "Q-10003",
      customerName: "Dougles Smith",
      email: "Adele@gmail.com",
      category: "Synth-pop",
      lastQuotationAt: "1977-02-02",
      phone: "+1 234 567 890",
      status: "active",
      available: 25,
      incoming: 0,
      image: "actually",
      price: 25,
      sold: 7,
      priceIncrease: 10,
      variants: 2,
      size: 3,
      die: 3,
      noOfLots: 4,
      variantDetails: [
        {
          title: "Actually",
          quantity: 13,
          format: "LP, Album, Reissue, 180 Gram",
          label: "Parlophone",
          cat: "0190295832612",
          country: "USA & Europe",
          year: "2018",
        },
        {
          title: "Actually / Further Listening 1987-1988",
          quantity: 12,
          format: "CD, Album, Compilation; All Media, Reissue, Remastered",
          label: "Warner Records",
          cat: "01902958262222",
          country: "Europe",
          year: "2018",
        },
      ],
    },
    {
      customerID: "C-004",
      quotationID: "Q-10004",
      quotationDate: "2024-05-04",
      customerName: "Baseden Smith",
      email: "amy@example.com",
      category: "Rhythm & Blues",
      lastQuotationAt: "1977-02-02",
      quantity: 6,
      dateCreated: "2024-01-01",
      dateSubmitted: "2024-01-02",
      phone: "+1 234 567 890",
      status: "paused",
      available: 3,
      incoming: 19,
      image: "backtoblack",
      price: 33,
      sold: 39,
      priceIncrease: 5,
      variants: 4,
      size: 3,
      die: 3,
      noOfLots: 4,
      variantDetails: [
        {
          title: "Back to Black",
          quantity: 1,
          format: "CD, Album, Enhanced",
          label: "Island Records Group",
          cat: "171 304-1",
          country: "UK",
          year: "2006",
        },
        {
          title: "Back to Black The Album Remixes",
          quantity: 0,
          format: "2×CD, Promo",
          label: "Island Records Ltd",
          cat: "AMYCDPRO15",
          country: "Europe",
          year: "2007",
        },
        {
          title: "Back to Black",
          quantity: 0,
          format: "LP, Album, Picture Disc, Reissue",
          label: "Island Records",
          cat: "3579647",
          country: "Europe",
          year: "2023",
        },
        {
          title: "Back to Black",
          quantity: 4,
          format: "LP, Album, Limited Edition, Reissue, Pink",
          label: "Republic Records",
          cat: "B0030246-01 ST01",
          country: "US",
          year: "2024",
        },
      ],
    },
    {
      customerID: "C-005",
      quotationID: "Q-10005",
      quotationDate: "2024-05-05",

      customerName: "In A Dream",
      email: "sivan@example.com",
      category: "Pop",
      lastQuotationAt: "1977-02-02",
      phone: "+1 234 567 890",
      status: "draft",
      quantity: 6,
      dateCreated: "2024-01-01",
      dateSubmitted: "2024-01-02",
      available: 0,
      incoming: 0,
      image: "inadream",
      price: 35,
      sold: 10,
      priceIncrease: 30,
      variants: 2,
      size: 3,
      die: 3,
      noOfLots: 4,
      variantDetails: [
        {
          title: "In A Dream",
          available: 0,
          format: "CD, EP",
          label: "Capitol Records",
          cat: "DR3AM01",
          country: "US",
          year: "2020",
        },
        {
          title: "In A Dream",
          available: 0,
          format: "LP, EP, Blue Mist",
          label: "EMI",
          cat: "DR3AM02",
          country: "Europe",
          year: "2020",
        },
      ],
    },
    {
      customerID: "C-001",
      quotationID: "Q-10006",
      quotationDate: "2024-05-06",
      customerName: "Maria Barden",
      email: "Adele@gmail.com",
      category: "Pop",
      lastQuotationAt: "1977-02-02",
      phone: "+1 234 567 890",
      quantity: 6,
      dateCreated: "2024-01-01",
      dateSubmitted: "2024-01-02",
      status: "active",
      available: 5,
      incoming: 10,
      image: "21",
      price: 28,
      sold: 4,
      priceIncrease: 12,
      variants: 2,
      size: 3,
      die: 3,
      noOfLots: 4,
      variantDetails: [
        {
          title: "21",
          available: 1,
          format: "LP, Album, Stereo",
          label: "XL Recordings",
          cat: "XLLP 520",
          country: "Europe",
          year: "2011",
        },
        {
          title: "21",
          available: 4,
          format: "CD, Album, Limited Edition",
          label: "XL Recordings",
          cat: "XLLP 520 E",
          country: "Europe",
          year: "2011",
        },
      ],
    },


    {
      customerID: "C-001",
      quotationID: "Q-10007",
      quotationDate: "2024-05-07",
      customerName: "Maria Barden",
      email: "Adele@gmail.com",
      artist: "Daft Punk",
      category: "Electronic",
      year: "2001",
      status: "paused",
      quantity: 6,
      dateCreated: "2024-01-01",
      dateSubmitted: "2024-01-02",
      available: 7,
      incoming: 0,
      image: "discovery",
      price: 20,
      sold: 2,
      priceIncrease: 5,
      variants: 3,
      size: 3,
      die: 3,
      noOfLots: 4,
      variantDetails: [
        {
          title: "Discovery",
          available: 7,
          format: "2×LP, Album, Reissue, Gatefold",
          label: "ADA",
          cat: "0190296617164",
          country: "Europe",
          year: "2023",
        },
        {
          title: "Discovery",
          available: 0,
          format: "2×LP, Album, Reissue, Gatefold",
          label: "ADA",
          cat: "0190296617164",
          country: "USA & Europe",
          year: "2021",
        },
        {
          title: "Discovery",
          available: 0,
          format: "2×LP, Album, Reissue",
          label: "Parlophone",
          cat: "7243 8496061 2",
          country: "Europe",
          year: "2018",
        },
      ],
    },


  ];
  return data;
}
