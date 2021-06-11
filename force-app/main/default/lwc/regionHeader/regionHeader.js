import { api, LightningElement, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { NavigationMixin } from "lightning/navigation";
import { publish, MessageContext } from "lightning/messageService";
import selectedRegion from "@salesforce/messageChannel/SelectedRegion__c";

const FIELDS = [
  "Region__c.Name",
  "Region__c.Availability__c",
  "Region__c.Available_Zones__c",
  "Region__c.Boundary__c",
  "Region__c.Capacity__c",
  "Region__c.Instances__c",
  "Region__c.Latency__c",
  "Region__c.Compliance__c"
];

export default class RegionHeader extends NavigationMixin(LightningElement) {
  @api recordId;

  @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
  region;

  @wire(MessageContext)
  messageContext;

  handleScheduleMigration() {
    this.publishMessage();
    this[NavigationMixin.Navigate]({
      type: "standard__navItemPage",
      attributes: {
        apiName: "orgMigrationAssistant"
      }
    });
  }

  publishMessage() {
    let targetRegion = {
      regionId: this.recordId,
      regionName: this.region.data.fields.Name.value,
      regionCompliance: this.region.data.fields.Compliance__c.value
    };
    const payload = {
      type: "updateTarget",
      targetRegion: targetRegion
    };
    console.log("sending updated target");
    publish(this.messageContext, selectedRegion, payload);
  }

  get regionName() {
    return this.region.data.fields.Name.value;
  }

  get availability() {
    return this.region.data.fields.Availability__c.value;
  }

  get boundary() {
    return this.region.data.fields.Boundary__c.value;
  }

  get capacity() {
    return this.region.data.fields.Capacity__c.value;
  }

  get instances() {
    return this.region.data.fields.Instances__c.value;
  }

  get latency() {
    return this.region.data.fields.Latency__c.value;
  }

  get compliance() {
    return this.region.data.fields.Compliance__c.value;
  }

  get complianceStyle() {
    let compliance = this.region.data.fields.Compliance__c.value;
    if (compliance === "Ready to Go") {
      return "slds-truncate compliance-ready";
    } else if (compliance === "Proceed with Caution") {
      return "slds-truncate compliance-caution";
    } else {
      return "slds-truncate compliance-error";
    }
  }
}
