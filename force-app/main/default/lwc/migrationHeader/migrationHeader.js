import { api, LightningElement } from "lwc";

export default class MigrationHeader extends LightningElement {
  // Public properties
  @api showAction;
  @api targetRegion;
  @api hostedRegion;
  @api orgToMigrate;

  // Getter for compliance text css style
  get complianceStyle() {
    let compliance = this.targetRegion.regionCompliance;
    if (compliance === "Ready to Go") {
      return "slds-truncate compliance-ready";
    } else if (compliance === "Proceed with Caution") {
      return "slds-truncate compliance-caution";
    } else {
      return "slds-truncate compliance-error";
    }
  }
}
