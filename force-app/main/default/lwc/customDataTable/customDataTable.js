import { LightningElement, api, wire } from "lwc";
import getOrgData from "@salesforce/apex/OrgController.getAllOrgData";
import getRegionData from "@salesforce/apex/RegionController.getAllRegionData";

export default class DataTable extends LightningElement {
  // Public properties
  @api tableView;

  // Private properties
  orgs;
  regions;

  // Get org data
  @wire(getOrgData)
  wiredOrgs({ error, data }) {
    if (data) {
      const orgArr = [];
      data.forEach((el) => {
        let org = {
          name: el.Name,
          id: el.Org_ID__c,
          code: el.Code__c,
          infrastructure: el.Infrastructure__c,
          type: el.Org_Type__c,
          region: el.Region__c,
          status: el.Status__c,
          long: el.Longitude__c,
          lat: el.Latitude__c,
          compliance: el.Compliance__c
        };
        orgArr.push(org);
      });
      this.orgs = orgArr;
    } else if (error) {
      console.log(error);
      this.orgs = undefined;
    }
  }

  // Get region data
  @wire(getRegionData)
  wiredRegions({ error, data }) {
    if (data) {
      const regionArr = [];
      data.forEach((el) => {
        let region = {
          recordId: el.Id,
          name: el.Name,
          code: el.Code__c,
          availability: el.Availability__c,
          zones: el.Available_Zones__c,
          boundary: el.Boundary__c,
          capacity: el.Capacity__c,
          instances: el.Instances__c,
          latency: el.Latency__c,
          compliance: el.Compliance__c,
          long: el.Longitude__c,
          lat: el.Latitude__c
        };
        regionArr.push(region);
      });
      this.regions = regionArr;
    } else if (error) {
      console.log(error);
      this.regions = undefined;
    }
  }

  // Getter return true for region table view, false for org table view
  get tableViewBool() {
    return this.tableView === "regions" ? true : false;
  }

  // Data table column definition for org view
  orgColumns = [
    {
      label: "Org Name",
      fieldName: "name",
      type: "text",
      cellAttributes: { alignment: "left" }
    },
    {
      label: "Host Region",
      fieldName: "region",
      type: "text",
      cellAttributes: { alignment: "left" }
    },
    {
      label: "Org ID",
      fieldName: "id",
      type: "text",
      cellAttributes: { alignment: "left" }
    },
    {
      label: "Infrastructure",
      fieldName: "infrastructure",
      type: "text",
      cellAttributes: { alignment: "left" }
    },
    {
      label: "Org Type",
      fieldName: "type",
      type: "text",
      cellAttributes: { alignment: "left" }
    },
    {
      label: "Status",
      fieldName: "status",
      type: "text",
      cellAttributes: { alignment: "left" }
    },
    {
      label: "Compliance",
      fieldName: "compliance",
      type: "image",
      cellAttributes: { alignment: "left" },
      typeAttributes: {
        status: { fieldName: "compliance" },
        entry: { fieldName: "compliance" }
      }
    }
  ];

  // Data table column definition for region view
  regionColumns = [
    {
      label: "Hyperforce Readiness/Region",
      fieldName: "hyperforce_readiness",
      type: "image",
      typeAttributes: {
        status: { fieldName: "availability" },
        entry: { fieldName: "name" }
      },
      cellAttributes: { alignment: "left" }
    },
    {
      label: "No. of Instances",
      fieldName: "instances",
      type: "number",
      cellAttributes: { alignment: "left" }
    },
    {
      label: "Data Stored & Processed",
      fieldName: "name",
      type: "text",
      cellAttributes: { alignment: "left" }
    },
    {
      label: "Network Latency Avg (ms)",
      fieldName: "latency",
      type: "number",
      cellAttributes: { alignment: "left" }
    },
    {
      label: "Available Capacity (units)",
      fieldName: "capacity",
      type: "number",
      cellAttributes: { alignment: "left" }
    },
    {
      label: "Compliance Assessment",
      fieldName: "compliance",
      type: "image",
      cellAttributes: { alignment: "left" },
      typeAttributes: {
        status: { fieldName: "compliance" },
        entry: { fieldName: "compliance" }
      }
    }
  ];
}
