import { api, LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class EmptyState extends NavigationMixin(LightningElement) {
  // Public properties
  @api showModal;

  // Private properties
  modalOpen = false;

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  // Redirect to app home/explore regions
  handleExplore() {
    this[NavigationMixin.Navigate]({
      type: "standard__namedPage",
      attributes: {
        pageName: "home"
      }
    });
  }
}
