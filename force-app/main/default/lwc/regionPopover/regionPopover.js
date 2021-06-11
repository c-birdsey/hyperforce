import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import FLAGS from "@salesforce/resourceUrl/flag_icons";

export default class Popover extends NavigationMixin(LightningElement) {
  @api
  popoverNubbin;

  @api
  popoverRegion;

  connectedCallback() {
    this.migrationPageRef = {
      type: "standard__recordPage",
      attributes: {
        recordId: this.popoverRegion.recordId,
        objectApiName: "Region__c",
        actionName: "view"
      }
    };
    this[NavigationMixin.GenerateUrl](this.migrationPageRef).then(
      (url) => (this.url = url)
    );
  }

  handleViewDetails(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this[NavigationMixin.Navigate](this.migrationPageRef);
  }

  // Getter for flag icon
  get flagIcon() {
    return FLAGS + "/" + this.popoverRegion.code + ".png";
  }

  // Getter for section class
  get sectionClassBlock() {
    return "slds-popover slds-popover_medium " + this.popoverNubbin;
  }

  // Getter for compliance text styles
  get complianceStyle() {
    let style = "slds-text-body_small popover-data-text";
    if (this.popoverRegion.compliance === "Ready to Go") {
      style += " text-ready";
    } else if (this.popoverRegion.compliance === "Proceed with Caution") {
      style += " text-caution";
    } else {
      style += " text-error";
    }
    return style;
  }
}
