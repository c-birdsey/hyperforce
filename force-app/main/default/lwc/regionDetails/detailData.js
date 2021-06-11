export const productsData = [
  {
    Id: 1,
    Name: "Heroku",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  },
  {
    Id: 2,
    Name: "Marketing Cloud",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  },
  {
    Id: 3,
    Name: "B2B Commerce",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  },
  {
    Id: 4,
    Name: "Customer 360 Manager",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  },
  {
    Id: 5,
    Name: "Heroku",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  },
  {
    Id: 6,
    Name: "Marketing Cloud",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  },
  {
    Id: 7,
    Name: "B2B Commerce",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  },
  {
    Id: 8,
    Name: "Customer 360 Manager",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  },
  {
    Id: 9,
    Name: "Customer 360 Manager",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  },
  {
    Id: 10,
    Name: "Heroku",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  },
  {
    Id: 11,
    Name: "Marketing Cloud",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  },
  {
    Id: 12,
    Name: "B2B Commerce",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  },
  {
    Id: 13,
    Name: "Customer 360 Manager",
    Description:
      "Ut dolor culpa consectetur culpa incididunt duis anim aliqua amet consequat sit quis ad.",
    Tags: ["Compliant", "Pilot"]
  }
];

export const tableColumns = [
  { label: "Data Nationality", fieldName: "dataNationality", type: "text" },
  {
    label: "Number of Records",
    fieldName: "records",
    type: "number",
    cellAttributes: { alignment: "left" }
  },
  {
    label: "Network Latency (ms)",
    fieldName: "latency",
    type: "number",
    cellAttributes: { alignment: "left" }
  },
  {
    label: "Size (MB)",
    fieldName: "size",
    type: "number",
    cellAttributes: { alignment: "left" }
  },
  {
    label: "Compliance Status",
    fieldName: "compliance",
    type: "text",
    cellAttributes: {}
  },
  {
    type: "action",
    typeAttributes: {
      rowActions: [{ label: "Review Data Policies", name: "dataPolicies" }]
    }
  }
];

export const tableData = [
  {
    dataNationality: "Netherlands",
    records: 375,
    latency: 165.36,
    size: 125,
    compliance: "Compliant"
  },
  {
    dataNationality: "Sweden",
    records: 76,
    latency: 161.5,
    size: 150,
    compliance: "Compliant"
  },
  {
    dataNationality: "Norway",
    records: 23,
    latency: 135.34,
    size: 142,
    compliance: "Needs Attention"
  },
  {
    dataNationality: "Limburg",
    records: 90,
    latency: 167.43,
    size: 156,
    compliance: "Compliant"
  },
  {
    dataNationality: "Holland",
    records: 42,
    latency: 156.98,
    size: 175,
    compliance: "Compliant"
  }
];
