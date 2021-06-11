import { LightningElement, wire } from "lwc";
import { getSObjectValue } from "@salesforce/apex";
import getOrgModalData from "@salesforce/apex/OrgController.getOrgModalData";
import getRegionModalData from "@salesforce/apex/RegionController.getRegionModalData";
import getRegion from "@salesforce/apex/RegionController.getRegion";
import getOrg from "@salesforce/apex/OrgController.getOrg";
import { publish, MessageContext } from "lightning/messageService";
import selectedRegion from "@salesforce/messageChannel/SelectedRegion__c";

import AVAILABILITY from "@salesforce/schema/Region__c.Availability__c";
import COMPLIANCE from "@salesforce/schema/Region__c.Compliance__c";
import ZONES from "@salesforce/schema/Region__c.Available_Zones__c";
import INSTANCES from "@salesforce/schema/Region__c.Instances__c";
import ID from "@salesforce/schema/Region__c.Id";
import NAME from "@salesforce/schema/Region__c.Name";
import HOSTED_REGION from "@salesforce/schema/Org__c.Region__c";

export default class MigrationModal extends LightningElement {
  // Public properties
  orgs;
  regions;
  selectedOrg;
  selectedRegion;

  @wire(getRegion, { regionName: "$selectedRegion" })
  regionRecord;

  @wire(getOrg, { orgName: "$selectedOrg" })
  orgRecord;

  @wire(MessageContext)
  messageContext;

  get availability() {
    return this.regionRecord.data
      ? getSObjectValue(this.regionRecord.data, AVAILABILITY)
      : "";
  }

  get compliance() {
    return this.regionRecord.data
      ? getSObjectValue(this.regionRecord.data, COMPLIANCE)
      : "";
  }

  get zones() {
    return this.regionRecord.data
      ? getSObjectValue(this.regionRecord.data, ZONES)
      : "";
  }

  get instances() {
    return this.regionRecord.data
      ? getSObjectValue(this.regionRecord.data, INSTANCES)
      : "";
  }

  get complianceStyle() {
    let compliance = this.regionRecord.data
      ? getSObjectValue(this.regionRecord.data, COMPLIANCE)
      : "";
    if (compliance === "Ready to Go") {
      return "compliance-ready";
    } else if (compliance === "Proceed with Caution") {
      return "compliance-caution";
    } else {
      return "compliance-error";
    }
  }

  get isDisabled() {
    return this.selectedOrg && this.selectedRegion ? false : true;
  }

  // Get Salesforce org data
  @wire(getOrgModalData)
  wiredOrgs({ error, data }) {
    if (data) {
      const orgArr = [];
      data.forEach((element) => {
        let comboOption = {
          label: element.Name,
          value: element.Name
        };
        orgArr.push(comboOption);
      });
      this.orgs = orgArr;
    } else if (error) {
      console.log(error);
      this.orgs = undefined;
    }
  }

  // Get Salesforce org data
  @wire(getRegionModalData)
  wiredRegions({ error, data }) {
    if (data) {
      const regionArr = [];
      data.forEach((element) => {
        let comboOption = {
          label: element.Name,
          value: element.Name
        };
        regionArr.push(comboOption);
      });
      this.regions = regionArr;
    } else if (error) {
      console.log(error);
      this.regions = undefined;
    }
  }

  handleOrgChange(e) {
    this.selectedOrg = e.detail.value;
  }

  handleRegionChange(e) {
    this.selectedRegion = e.detail.value;
  }

  handleCancel() {
    const custEvent = new CustomEvent("cancel", {});
    this.dispatchEvent(custEvent);
  }

  handleSave() {
    // Build target region and org payload
    let targetRegion = {
      regionId: getSObjectValue(this.regionRecord.data, ID),
      regionName: getSObjectValue(this.regionRecord.data, NAME),
      regionCompliance: getSObjectValue(this.regionRecord.data, COMPLIANCE)
    };

    let hostedRegion = getSObjectValue(this.orgRecord.data, HOSTED_REGION);

    // Message published on initial component render to initialize private properties
    const payload = {
      type: "renderResponse",
      activeOrg: this.selectedOrg,
      activeRegion: hostedRegion,
      targetRegion: targetRegion
    };
    publish(this.messageContext, selectedRegion, payload);

    const custEvent = new CustomEvent("save", {});
    this.dispatchEvent(custEvent);
  }
}
