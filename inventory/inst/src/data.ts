import { Children } from "react";

export function getData() {
  const data = [
    {
      instID: "INST-001",
      instName: "Microsoft",
      createdAt: "2023-01-10",
      createdBy: "Alice Johnson",
      status: "active",
      variantDetails: [
        {
          title: "Subscription",
          col1: "Office 365",
          col2: "Azure",
          col3: "Dynamics",
          col4: "Power BI",
        },
        {
          title: "Employees",
          col1: "180,000",
          col2: "Cloud",
          col3: "Enterprise",
          col4: "Consumer",
        },
      ],
    },
    {
      instID: "INST-002",
      instName: "Google",
      createdAt: "2022-11-05",
      createdBy: "Bob Smith",
      status: "active",
      variantDetails: [
        {
          title: "Subscription",
          col1: "G Suite",
          col2: "Cloud",
          col3: "Ads",
          col4: "YouTube",
        },
        {
          title: "Employees",
          col1: "150,000",
          col2: "Search",
          col3: "Cloud",
          col4: "AI",
        },
      ],
    },
    {
      instID: "INST-003",
      instName: "Amazon",
      createdAt: "2021-08-15",
      createdBy: "Carol Lee",
      status: "inactive",
      variantDetails: [
        {
          title: "Subscription",
          col1: "AWS",
          col2: "Prime",
          col3: "Marketplace",
          col4: "Alexa",
        },
        {
          title: "Employees",
          col1: "1,500,000",
          col2: "Retail",
          col3: "Cloud",
          col4: "Logistics",
        },
      ],
    },
    {
      instID: "INST-004",
      instName: "Apple",
      createdAt: "2020-03-20",
      createdBy: "David Kim",
      status: "inactive",
      variantDetails: [
        {
          title: "Subscription",
          col1: "iCloud",
          col2: "Apple Music",
          col3: "App Store",
          col4: "Apple TV+",
        },
        {
          title: "Employees",
          col1: "160,000",
          col2: "Hardware",
          col3: "Services",
          col4: "Retail",
        },
      ],
    },
    {
      instID: "INST-005",
      instName: "Meta",
      createdAt: "2021-12-01",
      createdBy: "Eve Martinez",
      status: "inactive",
      variantDetails: [
        {
          title: "Subscription",
          col1: "Facebook",
          col2: "Instagram",
          col3: "WhatsApp",
          col4: "Oculus",
        },
        {
          title: "Employees",
          col1: "86,000",
          col2: "Social",
          col3: "VR",
          col4: "AI",
        },
      ],
    },
  ];
  return data;
}
