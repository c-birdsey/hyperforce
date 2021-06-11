import { LightningElement, api } from "lwc";
import REGIONS_ICONS from "@salesforce/resourceUrl/map_icons";

export default class ImageControl extends LightningElement {
  // Private properties
  imgSrc;
  tableEntry;

  // Public properties
  @api
  get status() {
    return this.imgSrc;
  }
  set status(value) {
    if (value === "General Availability") {
      this.imgSrc = REGIONS_ICONS + "/ga-icon.svg";
    } else if (value === "Selective Availability") {
      this.imgSrc = REGIONS_ICONS + "/sa-icon.svg";
    } else if (value === "Ready to Go" || value === "Compliant") {
      this.imgSrc = REGIONS_ICONS + "/ready.svg";
    } else if (value === "Proceed with Caution") {
      this.imgSrc = REGIONS_ICONS + "/warning.svg";
    } else {
      this.imgSrc = REGIONS_ICONS + "/error.svg";
    }
  }

  @api
  get entry() {
    return this.tableEntry;
  }
  set entry(value) {
    if (value === "ready") {
      this.tableEntry = "Ready to go";
    } else if (value === "caution") {
      this.tableEntry = "Proceed with caution";
    } else if (value === "error") {
      this.tableEntry = "Not compliant";
    } else {
      this.tableEntry = value;
    }
  }
}
