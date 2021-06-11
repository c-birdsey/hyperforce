import { LightningElement, api } from "lwc";
import FLAGS from "@salesforce/resourceUrl/flag_icons";

export default class Popover extends LightningElement {
  // Public properties
  @api popoverNubbin;
  @api popoverRegion;

  // Getter for flag icon from static resource
  get flagIcon() {
    return FLAGS + "/" + this.popoverRegion.code + ".png";
  }

  // Getter for section css styling
  get sectionClassBlock() {
    return "slds-popover slds-popover_medium " + this.popoverNubbin;
  }
}
