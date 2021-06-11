import { api, LightningElement } from "lwc";

export default class CustomProgressIndicator extends LightningElement {
  // Public properties
  @api items;
  @api section;
  @api
  updateData(itemArr) {
    this.items = [...itemArr];
  }

  // Lifecycle hooks
  connectedCallBack() {
    this.items = Object.assign({}, this.itemArr);
  }

  renderedCallback() {
    let progressItems = this.template.querySelectorAll(".slds-progress__item");
    let toggleItems = this.template.querySelectorAll("lightning-input");
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].complete) {
        progressItems[i].classList.add("slds-is-completed");
        toggleItems[i].checked = true;
      } else {
        progressItems[i].classList.remove("slds-is-completed");
        toggleItems[i].checked = false;
      }
    }
  }

  // Trigger callback on toggle checked
  onToggleChange(event) {
    let eventObj = {
      value: event.target.checked,
      step: event.target.dataset.step,
      section: parseInt(this.section)
    };
    const custEvent = new CustomEvent("update", {
      detail: eventObj
    });
    this.dispatchEvent(custEvent);
  }
}
