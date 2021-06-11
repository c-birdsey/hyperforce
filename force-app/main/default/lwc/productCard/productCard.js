import { LightningElement, api } from "lwc";

export default class ProductCard extends LightningElement {
  // Private properties
  tagList = [];

  // Public properties
  @api productName;
  @api description;
  @api
  get tags() {
    return this.tagList;
  }
  set tags(value) {
    value.forEach((tag, index) => {
      let temp = { Id: index, Value: tag };
      this.tagList.push(temp);
    });
  }
}
