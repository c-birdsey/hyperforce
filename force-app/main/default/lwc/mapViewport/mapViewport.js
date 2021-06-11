import { LightningElement, wire } from "lwc";
import {
  subscribe,
  publish,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import selectedRegion from "@salesforce/messageChannel/SelectedRegion__c";
import getOrgModalData from "@salesforce/apex/OrgController.getOrgModalData";

export default class MapViewport extends LightningElement {
  // Private properties
  activeTab = "distribution";
  activeOrg = "Acme Marketing";
  activeRegion = "Netherlands";
  targetRegion;
  orgs;
  mapView = true;

  // Get Salesforce org data
  @wire(getOrgModalData)
  wiredOrgs({ error, data }) {
    if (data) {
      const orgArr = [];
      data.forEach((element) => {
        let comboOption = {
          label: element.Name,
          value: element.Name,
          region: element.Region__c
        };
        orgArr.push(comboOption);
      });
      this.orgs = orgArr;
    } else if (error) {
      console.log(error);
      this.orgs = undefined;
    }
  }

  // Messaging channel initialization
  @wire(MessageContext)
  messageContext;

  // Subscribe/unsubscribe to message channel
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

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }
  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  // Handler for message received by component
  handleMessage(message) {
    if (message.type === "updateTarget") {
      this.targetRegion = message.targetRegion;
    } else if (message.type === "initialRender") {
      // If request from Migration Assistant, publish payload response
      this.publishInitialRenderMessage();
    }
  }

  // Message published on initial component render to initialize private properties
  publishInitialRenderMessage() {
    const payload = {
      type: "renderResponse",
      activeOrg: this.activeOrg,
      activeRegion: this.activeRegion,
      targetRegion: this.targetRegion
    };
    publish(this.messageContext, selectedRegion, payload);
  }

  // Message published on org dropdown change (org to be migrated)
  publishOrgChangeMessage() {
    const payload = {
      type: "orgChange",
      activeOrg: this.activeOrg,
      activeRegion: this.activeRegion
    };
    publish(this.messageContext, selectedRegion, payload);
  }

  // Set active tab for map view
  handleActive(event) {
    this.activeTab = event.target.value;
  }

  // Handle org selection dropdown (org to be migrated)
  handleOrgChange(event) {
    this.activeOrg = event.detail.value;
    this.activeRegion = this.lookupRegion(event.detail.value);
    const mapUpdate = this.template.querySelectorAll("c-map");
    mapUpdate.forEach((map) => map.updateMap(this.activeOrg));
    this.publishOrgChangeMessage();
  }

  // Handle map/list view toggle
  handleView(e) {
    this.mapView = e.target.value === "Map View" ? true : false;

    // set dropdown icon
    var parent = e.target.parentElement;
    parent.iconName =
      e.target.value === "Map View" ? "utility:location" : "utility:table";
  }

  // Get region selected org is deployed in
  lookupRegion(selected) {
    let activeRegion;
    this.orgs.forEach((org) => {
      if (org.value === selected) {
        activeRegion = org.region;
      }
    });
    return activeRegion;
  }

  // Zoom behavior calls public functions in c-map
  handleZoomOut() {
    this.template.querySelector("c-map").zoomOut();
  }

  handleZoomIn() {
    this.template.querySelector("c-map").zoomIn();
  }

  handleZoomReset() {
    this.template.querySelector("c-map").zoomReset();
  }

  // Getter for map heading
  get headerMessage() {
    if (this.activeTab === "distribution") {
      return "See where your Salesforce orgs are.";
    } else {
      return "Explore the benefits of an org migration.";
    }
  }
}
