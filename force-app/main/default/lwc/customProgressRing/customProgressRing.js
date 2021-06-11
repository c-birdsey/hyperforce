import { api, LightningElement } from "lwc";

export default class CustomProgressRing extends LightningElement {
  // Public properties
  @api value;
  @api size;
  @api content;

  // Getter return bool for progress completion
  get isComplete() {
    return this.value === "100" ? true : false;
  }

  // Getter for css styling based on public properties
  get ringStyle() {
    let style = "slds-progress-ring";
    if (this.isComplete) {
      style += " slds-progress-ring_complete";
    } else {
      style += " slds-progress-ring_active-step";
    }

    if (this.size === "large") {
      style += " slds-progress-ring_large";
    }
    return style;
  }

  // Getter for ring partial completion graphic
  get dAttribute() {
    let fillPercent = parseInt(this.value) / 100;
    const arcX = Math.cos(2 * Math.PI * fillPercent).toFixed(2);
    const arcY = Math.sin(2 * Math.PI * fillPercent).toFixed(2);
    const isLong = fillPercent > 0.5 ? 1 : 0;
    return "M 1 0 A 1 1 0 " + isLong + " 1 " + arcX + " " + arcY + " L 0 0";
  }
}
