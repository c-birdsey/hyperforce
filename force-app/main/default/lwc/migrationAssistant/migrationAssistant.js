import { LightningElement, wire } from "lwc";
import {
  subscribe,
  publish,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import selectedRegion from "@salesforce/messageChannel/SelectedRegion__c";

export default class MigrationAssistant extends LightningElement {
  // Private properties (org to be migrated and target region)
  targetRegion;
  hostedRegion = "Netherlands";
  orgToMigrate = "Acme Marketing";

  // Private properties (migration steps)
  showItems1 = false;
  showItems2 = false;
  showItems3 = false;
  completedItems = 0;

  // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
  connectedCallback() {
    this.subscribeToMessageChannel();
    this.publishMessage();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  // Getters for percentage and task tracking
  get totalPercentage() {
    return ((this.completedItems / 10) * 100).toFixed(0);
  }

  get sectionOnePercentage() {
    let count = 0;
    this.items.sectionOne.forEach((item) => {
      if (item.complete) {
        count++;
      }
    });
    return ((count / 3) * 100).toFixed(0);
  }

  get sectionTwoPercentage() {
    let count = 0;
    this.items.sectionTwo.forEach((item) => {
      if (item.complete) {
        count++;
      }
    });
    return ((count / 5) * 100).toFixed(0);
  }

  get sectionThreePercentage() {
    let count = 0;
    this.items.sectionThree.forEach((item) => {
      if (item.complete) {
        count++;
      }
    });
    return ((count / 2) * 100).toFixed(0);
  }

  get isCompleted() {
    return this.completedItems === 10 ? true : false;
  }

  // Messaging channel setup
  @wire(MessageContext)
  messageContext;

  // Subscribe to message channel
  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        selectedRegion,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  // Unsubscribe to message channel
  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  // Handler for message received by component
  handleMessage(message) {
    if (message.type === "renderResponse" && message.targetRegion) {
      this.targetRegion = message.targetRegion;
      this.hostedRegion = message.activeRegion;
      this.orgToMigrate = message.activeOrg;
    } else if (message.type === "updateTarget" && message.targetRegion) {
      this.targetRegion = message.targetRegion;
    } else if (message.type === "orgChange") {
      this.hostedRegion = message.activeRegion;
      this.orgToMigrate = message.activeOrg;
    }
  }

  // Message published on component render to fetch c-map-viewport properties
  publishMessage() {
    const payload = {
      type: "initialRender"
    };
    publish(this.messageContext, selectedRegion, payload);
  }

  // Toggle open migration guide sections
  handleToggleSection(e) {
    // Get all lightning toggle buttons
    let toggles = this.template.querySelectorAll("lightning-button-icon");

    // Toggle section
    let section = parseInt(e.target.value);
    if (section === 1) {
      this.showItems1 = !this.showItems1;
      toggles[0].iconName = this.showItems1
        ? "utility:chevrondown"
        : "utility:chevronright";
    } else if (section === 2) {
      this.showItems2 = !this.showItems2;
      toggles[1].iconName = this.showItems2
        ? "utility:chevrondown"
        : "utility:chevronright";
    } else {
      this.showItems3 = !this.showItems3;
      toggles[2].iconName = this.showItems3
        ? "utility:chevrondown"
        : "utility:chevronright";
    }
  }

  getItemArr(section) {
    if (section === 1) {
      return this.items.sectionOne;
    } else if (section === 2) {
      return this.items.sectionTwo;
    } else {
      return this.items.sectionThree;
    }
  }

  getSectionId(section) {
    if (section === 1) {
      return ".section-one";
    } else if (section === 2) {
      return ".section-two";
    } else {
      return ".section-three";
    }
  }

  updateItemCompletion(e) {
    let itemArr = this.getItemArr(e.detail.section);
    let sectionId = this.getSectionId(e.detail.section);
    itemArr.forEach((item) => {
      if (item.step === e.detail.step) {
        item.complete = e.detail.value;
      }
    });
    if (e.detail.value) {
      this.completedItems++;
    } else {
      this.completedItems--;
    }
    this.template.querySelector(sectionId).updateData(itemArr);
  }

  // Sample section data
  items = {
    sectionOne: [
      {
        title: "View country-level and region-level data policies",
        isLink: true,
        content: null,
        complete: false,
        step: "1"
      },
      {
        title: "View industry-level data policies",
        isLink: true,
        content: null,
        complete: false,
        step: "2"
      },
      {
        title: "View company-level data policies",
        isLink: true,
        content: null,
        complete: false,
        step: "3"
      }
    ],
    sectionTwo: [
      {
        title: "Enable my domain",
        isLink: false,
        content:
          "Showcase your company's brand and keep your data more secure by adding a customer-specific domain name to your Salesforce org URLs. With My Domain, you can include your company name in your URLs, for example, https://yourcompanyname.my.salesforce.com. Because having a My Domain is more secure, Hyperforce requires it.",
        complete: false,
        step: "1"
      },
      {
        title: "Remove hard-coded references",
        isLink: false,
        content:
          "A hard-coded reference is a link that contains your instance name (e.g. NA25, AP2, EU4, CS10 etc.). If you have any hard-coded references, make sure you update them to relative URLs (for example, login.salesforce.com (http://login.salesforce.com/) or your My Domain subdomain) prior to org migration.",
        complete: false,
        step: "2"
      },
      {
        title: "Update allowlist to include Hyperforce IP range",
        isLink: false,
        content:
          "Ensure your org is available to all your customers by updating your trusted IP ranges to those required by Hyperforce.",
        complete: false,
        step: "3"
      },
      {
        title: "Complete any required contract addendums",
        isLink: false,
        content:
          "Our records show that you can migrate your org to a new region, but final review may require additional signed contract addendums before we can migrate your org data. Any delays in completing this paperwork could delay your org migration process.",
        complete: false,
        step: "4"
      },
      {
        title:
          "Complete any required Master Services Agreement (MSA) addendums",
        isLink: false,
        content:
          "Our records show that you can migrate your org to a new region, but final review may require additional signed MSA addendums before we can migrate your org data. Any delays in completing this paperwork could delay your org migration process.",
        complete: false,
        step: "5"
      }
    ],
    sectionThree: [
      {
        title: "Enable my domain",
        isLink: false,
        content:
          "Showcase your company's brand and keep your data more secure by adding a customer-specific domain name to your Salesforce org URLs. With My Domain, you can include your company name in your URLs, for example, https://yourcompanyname.my.salesforce.com. Because having a My Domain is more secure, Hyperforce requires it.",
        complete: false,
        step: "1"
      },
      {
        title: "Remove hard-coded references",
        isLink: false,
        content:
          "A hard-coded reference is a link that contains your instance name (e.g. NA25, AP2, EU4, CS10 etc.). If you have any hard-coded references, make sure you update them to relative URLs (for example, login.salesforce.com (http://login.salesforce.com/) or your My Domain subdomain) prior to org migration.",
        complete: false,
        step: "2"
      }
    ]
  };
}
