import { LightningElement, track } from "lwc";
import { productsData, tableData, tableColumns } from "./detailData";

export default class RegionDetails extends LightningElement {
  // Temporary data copy
  products = productsData;
  columns = tableColumns;
  data = tableData;

  // Filter parameters
  filterValue = "all";
  filterOptions = [
    { label: "All Products in Region", value: "all" },
    { label: "My Purchased Products", value: "purchased" }
  ];

  //Expanded sections
  expandAll = false;
  expandPurchased = false;
  expandScheduled = false;
  expandNotAvailable = false;

  @track searchVal = "";

  handleSearch(e) {
    this.searchVal = e.target.value.toLowerCase();
  }

  handleFilter(e) {
    this.filterValue = e.detail.value;
  }

  handleExpand(e) {
    let type = e.target.dataset.section;
    if (type === "all") {
      this.expandAll = !this.expandAll;
    } else if (type === "purchased") {
      this.expandPurchased = !this.expandPurchased;
    } else if (type === "scheduled") {
      this.expandScheduled = !this.expandScheduled;
    } else {
      this.expandNotAvailable = !this.expandNotAvailable;
    }
  }

  searchProducts() {
    if (this.searchVal === "") {
      return this.products;
    }
    let results = this.products.filter((product) => {
      if (product.Name.toLowerCase().includes(this.searchVal)) {
        return product;
      }
    });
    return results;
  }

  get filterAll() {
    return this.filterValue === "all" ? true : false;
  }

  get allProducts() {
    let filteredProducts = this.searchProducts();
    if (!this.expandAll) {
      return filteredProducts.slice(0, 9);
    }
    return filteredProducts;
  }

  get purchasedProducts() {
    let filteredProducts = this.searchProducts();
    return filteredProducts.slice(0, 3);
  }

  get scheduledProducts() {
    let filteredProducts = this.searchProducts();
    return filteredProducts.slice(0, 5);
  }

  get notAvailableProducts() {
    let filteredProducts = this.searchProducts();
    if (!this.expandNotAvailable) {
      return filteredProducts.slice(0, 6);
    }
    return filteredProducts;
  }
}
