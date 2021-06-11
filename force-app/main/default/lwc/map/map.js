import { LightningElement, track, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadScript } from "lightning/platformResourceLoader";
import getAllOrgData from "@salesforce/apex/OrgController.getAllOrgData";
import getAllRegionData from "@salesforce/apex/RegionController.getAllRegionData";

// Static resource imports for d3 and map icons
import D3 from "@salesforce/resourceUrl/d3";
import D3_ARRAY from "@salesforce/resourceUrl/d3_array";
import D3_GEO from "@salesforce/resourceUrl/d3_geo";
import D3_PROJECTION from "@salesforce/resourceUrl/d3_projection";
import D3_TOPOJSON from "@salesforce/resourceUrl/d3_topojson";
import GEODATA from "@salesforce/resourceUrl/map_data";
import REGIONS_ICONS from "@salesforce/resourceUrl/map_icons";

export default class Map extends LightningElement {
  // Public properties
  @api mapType;
  @api activeOrg;

  // Private properties
  showPopover = false;
  popoverRegion = null;
  popoverLeft;
  popoverTop;
  popoverNubbin;
  @track regionData;
  @track orgData;
  @track isLoaded = false;

  // Define icon paths
  orgIcon = REGIONS_ICONS + "/org.svg";
  selectedOrg = REGIONS_ICONS + "/selected_org.svg";
  regionIcon = REGIONS_ICONS + "/region.svg";
  nonCompliantRegionsIcon = REGIONS_ICONS + "/error.svg";
  readyRegionsIcon = REGIONS_ICONS + "/ready.svg";
  cautionRegionsIcon = REGIONS_ICONS + "/warning.svg";

  // Public functions (called from c-map-viewport)
  @api
  zoomIn() {
    this.d3ZoomIn();
  }

  @api
  zoomOut() {
    this.d3ZoomOut();
  }

  @api
  zoomReset() {
    this.d3Reset();
  }

  @api
  updateMap(selected) {
    if (this.mapType === "distribution") {
      this.d3renderDist(selected);
    } else {
      this.d3renderExplorer(selected);
    }
  }

  async loadOrgs() {
    await getAllOrgData()
      .then((result) => {
        const orgArr = [];
        result.forEach((el) => {
          let org = {
            name: el.Name,
            id: el.Org_ID__c,
            code: el.Code__c,
            infrastructure: el.Infrastructure__c,
            type: el.Org_Type__c,
            region: el.Region__c,
            status: el.Status__c,
            long: el.Longitude__c,
            lat: el.Latitude__c,
            compliance: el.Compliance__c
          };
          orgArr.push(org);
        });
        this.orgData = orgArr;
      })
      .catch((error) => {
        this.error = error;
      });
  }

  async loadRegions() {
    await getAllRegionData()
      .then((result) => {
        const regionArr = [];
        result.forEach((el) => {
          let region = {
            recordId: el.Id,
            name: el.Name,
            code: el.Code__c,
            availability: el.Availability__c,
            zones: el.Available_Zones__c,
            boundary: el.Boundary__c,
            capacity: el.Capacity__c,
            instances: el.Instances__c,
            latency: el.Latency__c,
            compliance: el.Compliance__c,
            long: el.Longitude__c,
            lat: el.Latitude__c
          };
          regionArr.push(region);
        });
        this.regionData = regionArr;
      })
      .catch((error) => {
        this.error = error;
      });
  }

  // Initialize d3 libraries
  async renderedCallback() {
    if (this.d3Initialized) {
      return;
    }
    this.d3Initialized = true;

    await this.loadOrgs();
    await this.loadRegions();
    this.isLoaded = true;

    Promise.all([
      loadScript(this, D3 + "/d3.v5.min.js"),
      loadScript(this, D3_ARRAY + "/d3-array.v1.min.js"),
      loadScript(this, D3_GEO + "/d3-geo.v1.min.js"),
      loadScript(this, D3_PROJECTION + "/d3-geo-projection.v1.min.js"),
      loadScript(this, D3_TOPOJSON + "/topojson.v2.min.js")
    ])
      .then(() => {
        this.initializeD3();
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error loading D3",
            message: "Unable to load D3 resource",
            variant: "error"
          })
        );
        console.log(error);
      });
  }

  // Build d3 map visualization
  initializeD3() {
    // Initialize d3 variables
    const margin = { top: 0, bottom: 20, left: 0, right: 0 };
    const width = this.template.querySelector(".d3").offsetWidth;
    const height = width * 0.5 - margin.top - margin.bottom;

    // Create projection
    var projection = d3
      .geoPatterson()
      .translate([width / 2, height / 1.7])
      .scale((width / 630) * 100);

    // Define zoom behavior
    var zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on("zoom", function () {
        var e = d3.event.transform,
          // constrain the x and y components of the translation by the dimensions of the viewport
          tx = Math.min(0, Math.max(e.x, width - width * e.k)),
          ty = Math.min(0, Math.max(e.y, height - height * e.k));
        g.attr(
          "transform",
          ["translate(" + [tx, ty] + ")", "scale(" + e.k + ")"].join(" ")
        );
      });

    // Create geopath
    var path = d3.geoPath().projection(projection);

    // Build container
    var svg = d3
      .select(this.template.querySelector("div.d3"))
      .classed("svg-container", true)
      .append("svg")
      // .attr("preserveAspectRatio", "xMinYMin")
      // .attr("viewBox", "0 0 " + width.toString() + " " + height.toString())
      // .classed("svg-content-responsive", true);
      // .append("rect")
      // .classed("rect", true)

      .attr("height", height)
      .attr("width", width);

    var g = svg.append("g");
    svg.call(zoom);

    // Disable zoom behavior on mouse scroll
    svg.on("touchstart.zoom", null);
    svg.on("wheel.zoom", null);
    svg.on("mousewheel.zoom", null);
    svg.on("MozMousePixelScroll.zoom", null);

    // Define map pattern fill
    svg
      .append("defs")
      .append("pattern")
      .attr("id", "boxFill" + this.mapType)
      .attr("patternUnits", "userSpaceOnUse")
      .attr("width", 8)
      .attr("height", 8)
      .append("rect")
      .attr("x", 4)
      .attr("y", 4)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#dddddd");

    // Define drop shadow filter
    var defs = svg.append("defs");
    var dropShadowFilter = defs
      .append("svg:filter")
      .attr("id", "drop-shadow" + this.mapType) 
      .attr("filterUnits", "userSpaceOnUse")
      .attr("width", "150%")
      .attr("height", "150%");
    dropShadowFilter
      .append("svg:feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3)
      .attr("result", "blur-out");
    dropShadowFilter
      .append("svg:feComponentTransfer")
      .append("svg:feFuncA")
      .attr("type", "linear")
      .attr("slope", ".3");
    dropShadowFilter
      .append("svg:feOffset")
      .attr("in", "color-out")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "the-shadow");
    dropShadowFilter
      .append("svg:feBlend")
      .attr("in", "SourceGraphic")
      .attr("in2", "the-shadow")
      .attr("mode", "normal");

    // Load map data
    d3.json(GEODATA + "/world.json")
      .then((data) => {
        var countries = topojson.feature(data, data.objects.countries).features;

        // Draw background
        g.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", width)
          .attr("height", height)
          .attr("fill", "white")
          .on("mouseover", () => {
            this.showPopover = false;
          });

        // Draw country paths
        g.selectAll(".country")
          .data(countries)
          .enter()
          .append("path")
          .attr("class", "country")
          .style("fill", "url(#boxFill" + this.mapType + ")")
          .attr("d", path)
          .on("mouseover", () => {
            this.showPopover = false;
          });

        if (this.mapType === "distribution") {
          this.d3renderDist(this.activeOrg);
        } else {
          this.d3renderExplorer(this.activeOrg);
        }
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error loading JSON map data",
            message: "Unable to load world.topojson from static resources",
            variant: "error"
          })
        );
        console.log(error);
      });

    this.d3renderDist = (selected) => {
      if (this.d3Initialized) {
        g.selectAll(".org").remove();
      }
      g.selectAll(".org")
        .data(this.orgData)
        .enter()
        .append("svg:image")
        .attr("class", "org")
        .attr("id", function (d) {
          return "org-" + d.code;
        })
        .attr("xlink:href", (d) => {
          if (d.name === selected) {
            return this.selectedOrg;
          } else {
            return this.orgIcon;
          }
        })
        .attr("x", function (d) {
          var coords = projection([d.long, d.lat]);
          return coords[0] - 8;
        })
        .attr("y", function (d) {
          var coords = projection([d.long, d.lat]);
          return coords[1] - 8;
        })
        .attr("width", 20)
        .attr("height", 20)
        .style("filter", "url(#drop-shadow" + this.mapType + ")")
        .on("mouseover", (d) => {
          this.showRegionInfo(d, true);
        });

      g.selectAll(".region")
        .data(this.regionData)
        .enter()

        .append("svg:image")
        .attr("class", "region hidden")
        .attr("xlink:href", (d) => {
          return this.regionIcon;
        })
        .attr("x", function (d) {
          var coords = projection([d.long, d.lat]);
          return coords[0] - 9;
        })
        .attr("y", function (d) {
          var coords = projection([d.long, d.lat]);
          return coords[1] - 9;
        })
        .attr("width", 18)
        .attr("height", 18)
        .style("filter", "url(#drop-shadow" + this.mapType + ")");
    };

    this.d3renderExplorer = (selected) => {
      if (this.d3Initialized) {
        g.selectAll(".current-region").remove();
      }
      g.selectAll(".current-region")
        .data(this.orgData)
        .enter()
        .append("svg:image")
        .attr("class", "current-region")
        .attr("xlink:href", (d) => {
          if (d.name === selected) {
            return this.selectedOrg;
          }
        })
        .attr("x", function (d) {
          var coords = projection([d.long, d.lat]);
          return coords[0] - 8;
        })
        .attr("y", function (d) {
          var coords = projection([d.long, d.lat]);
          return coords[1] - 8;
        })
        .attr("width", 20)
        .attr("height", 20)
        .style("filter", "url(#drop-shadow" + this.mapType + ")");

      g.selectAll(".regions")
        .data(this.regionData)
        .enter()
        .append("svg:image")
        .attr("class", function (d) {
          if (d.compliance === "Not Compliant") {
            return "error";
          } else if (d.compliance === "Proceed with Caution") {
            return "caution";
          } else {
            return "ready";
          }
        })
        .attr("id", function (d) {
          return "region-" + d.code;
        })
        .attr("xlink:href", (d) => {
          if (d.compliance === "Not Compliant") {
            return this.nonCompliantRegionsIcon;
          } else if (d.compliance === "Proceed with Caution") {
            return this.cautionRegionsIcon;
          } else {
            return this.readyRegionsIcon;
          }
        })
        .attr("x", function (d) {
          var coords = projection([d.long, d.lat]);
          return coords[0] - 10;
        })
        .attr("y", function (d) {
          var coords = projection([d.long, d.lat]);
          return coords[1] - 10;
        })
        .attr("width", 20)
        .attr("height", 20)
        .on("mouseover", (d) => {
          this.showRegionInfo(d, false);
        });
    };

    this.d3ZoomOut = () => {
      zoom.scaleBy(svg.transition().duration(750), 1 / 1.3);
    };

    this.d3ZoomIn = () => {
      zoom.scaleBy(svg.transition().duration(750), 1.3);
    };

    this.d3Reset = () => {
      zoom.transform(svg, d3.zoomIdentity);
    };
  }

  // Handle Show New Regions filter checkbox
  handleRegions(e) {
    if (e.target.checked) {
      var els = this.template.querySelectorAll(".region.hidden");
      els.forEach((element) => {
        element.classList.remove("hidden");
      });
    } else {
      var els = this.template.querySelectorAll(".region");
      els.forEach((element) => {
        element.classList.add("hidden");
      });
    }
  }

  // Handle Not Compliant filter checkbox
  handleNonCompliant(e) {
    if (e.target.checked) {
      var els = this.template.querySelectorAll(".error.hidden");
      els.forEach((element) => {
        element.classList.remove("hidden");
      });
    } else {
      var els = this.template.querySelectorAll(".error");
      els.forEach((element) => {
        element.classList.add("hidden");
      });
    }
  }

  // Handle Rroceed with Caution filter checkbox
  handleCaution(e) {
    if (e.target.checked) {
      var els = this.template.querySelectorAll(".caution.hidden");
      els.forEach((element) => {
        element.classList.remove("hidden");
      });
    } else {
      var els = this.template.querySelectorAll(".caution");
      els.forEach((element) => {
        element.classList.add("hidden");
      });
    }
  }

  // Handle Ready filter checkbox
  handleReady(e) {
    if (e.target.checked) {
      var els = this.template.querySelectorAll(".ready.hidden");
      els.forEach((element) => {
        element.classList.remove("hidden");
      });
    } else {
      var els = this.template.querySelectorAll(".ready");
      els.forEach((element) => {
        element.classList.add("hidden");
      });
    }
  }

  // Get inline styling for popover block location
  get popoverStyleBlock() {
    return `position: absolute; top: ${this.popoverTop}px; left: ${this.popoverLeft}px; z-index: 2; transform:translateY(-46.5%);`;
  }

  // Get bool value for map type to conditional render filters
  get isDistribution() {
    return this.mapType === "distribution";
  }

  get showRegionPopover() {
    return this.showPopover && this.mapType === "regions";
  }

  get showOrgPopover() {
    return this.showPopover && this.mapType === "distribution";
  }

  showRegionInfo(d, orgFlag) {
    if (this.showPopover && this.popoverRegion.name === d.name) {
      return;
    } else {
      this.showPopover = true;
      this.popoverRegion = d;

      // get location for popover
      if (orgFlag) {
        var el = this.template.querySelector("#org-" + d.code);
      } else {
        var el = this.template.querySelector("#region-" + d.code);
      }
      var parent = this.template.querySelector(".popover-container");
      var parentX = parent.getBoundingClientRect().x;
      var parentY = parent.getBoundingClientRect().y;
      this.popoverLeft = el.getBoundingClientRect().x - parentX;
      this.popoverTop = el.getBoundingClientRect().y - parentY;

      // manipulate x/y depending on lat, accomodate for nubbin (13px) and popover (318px)
      if (d.long > 0) {
        this.popoverLeft -= 322;
      } else {
        this.popoverLeft += 22;
      }

      //set nubbin side
      this.popoverNubbin =
        d.long > 0 ? "slds-nubbin_right" : "slds-nubbin_left";
    }
  }
}
