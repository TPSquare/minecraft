await import("https://tpsquare.github.io/modules/js/tpsm/main.js");
await TPSM.import("str", false);

import FARMS from "./data/farms.js";
import DUPS from "./data/dups.js";
const DATA = Object.assign(FARMS.fully, FARMS.special, DUPS);

const DEBUG = new (class {
  constructor() {
    this.dataValidation();
  }
  dataValidation() {
    Object.keys(DATA).forEach((key) => {
      const data = Object.assign(DATA[key]),
        warn = [];
      if (data._length == undefined || data._width == undefined || data._height == undefined)
        warn.push("Undefined size");
      if (data._length > 16 || data._width > 16 || (data._length > 13 && data._width > 13))
        warn.push("Size exceeds limit");
      if (warn.length > 0) console.warn(`[Debug] Warning: ${key}\n     ${warn.join("     \n")}\n`);
    });
  }
})();

const GET = new (class {
  constructor() {
    this.mList = Object.keys(DATA).length; // List of farm machines
    this.iList = []; // List of items
    Object.keys(DATA).forEach((items) => this.iList.push(...items.split("|")));
    this.stacks = {
      1: ["water_bucket", "lava_bucket", "hopper_minecart"],
      16: [],
    };

    this.allMaterials = { entities: {}, tools: [] };
    for (const farmKey in DATA)
      for (const materialKey in DATA[farmKey]) {
        if (materialKey.charAt(0) == "_") continue;
        switch (materialKey) {
          case "entities":
            for (const entityKey in DATA[farmKey][materialKey])
              this.allMaterials.entities[entityKey] =
                (this.allMaterials.entities[entityKey] || 0) +
                DATA[farmKey][materialKey][entityKey];
            continue;
          case "tools":
            for (const toolKey of DATA[farmKey][materialKey])
              if (!this.allMaterials.tools.includes(toolKey)) this.allMaterials.tools.push(toolKey);
            continue;
        }
        this.allMaterials[materialKey] = this.allMaterials[materialKey] || [0, ""];
        if (DATA[farmKey][materialKey] == "Auto") this.allMaterials[materialKey][1] = "+";
        else this.allMaterials[materialKey][0] += DATA[farmKey][materialKey];
      }
  }
  materials(key, stacks = false) {
    if (!key) return;
    const mKey = Object.keys(DATA).find((k) => k.includes(key)),
      result = {};
    if (stacks)
      for (const k in DATA[mKey]) {
        if (k.charAt(0) == "_") continue;
        if (typeof DATA[mKey][k] !== "number") result[k] = DATA[mKey][k];
        else if (this.stacks[1].includes(k)) result[k] = [DATA[mKey][k], 0];
        else if (this.stacks[16].includes(k))
          result[k] = [Math.floor(DATA[mKey][k] / 16), DATA[mKey][k] % 16];
        else result[k] = [Math.floor(DATA[mKey][k] / 64), DATA[mKey][k] % 64];
      }
    else for (const k in DATA[mKey]) if (k.charAt(0) != "_") result[k] = DATA[mKey][k];
    return result;
  }
  products(key) {
    return Object.keys(DATA)
      .find((k) => k.includes(key))
      ?.split("|")
      .map((e) => TPSM.str.capitalization(FUNC.identiferToName(e)));
  }
})();

const LOG = new (class {
  materials(key, stacks = false) {
    let result = GET.products(key).join(", ") + ": \n";
    const data = GET.materials(key, stacks);
    if (stacks)
      result += Object.keys(data)
        .map((k) => {
          const value = (() => {
            switch (k) {
              case "entities":
                return (
                  "\n" +
                  Object.keys(data[k])
                    .map((e) => `    ${FUNC.identiferToName(e)}: ${data[k][e]}`)
                    .join("\n")
                );
              case "tools":
                return data[k].map((e) => FUNC.identiferToName(e)).join(", ");
            }
            if (!Array.isArray(data[k])) return data[k];
            if (!data[k][0]) return `${data[k][1]} item${FUNC.addS(data[k][1])}`;
            if (!data[k][1]) return `${data[k][0]} stack${FUNC.addS(data[k][0])}`;
            return [
              `${data[k][0]} stack${FUNC.addS(data[k][0])}`,
              `${data[k][1]} item${FUNC.addS(data[k][1])}`,
            ].join(" + ");
          })();
          return `  ${FUNC.identiferToName(k)}: ${value}`;
        })
        .join("\n");
    else
      result += Object.keys(data)
        .map((k) => {
          const value = (() => {
            switch (k) {
              case "entities":
                return (
                  "\n" +
                  Object.keys(data[k])
                    .map((e) => `    ${FUNC.identiferToName(e)}: ${data[k][e]}`)
                    .join("\n")
                );
              case "tools":
                return data[k].map((e) => FUNC.identiferToName(e)).join(", ");
            }
            if (!Array.isArray(data[k])) return data[k];
            return `${data[k]} item${FUNC.addS(data[k])}`;
          })();
          return `  ${FUNC.identiferToName(k)}: ${value}`;
        })
        .join("\n");
    console.log(result);
  }
  products(key) {
    console.log(GET.products(key).join(", "));
  }
})();

const FUNC = new (class {
  identiferToName(identifer) {
    if (identifer == "tnt") return "TNT";
    return identifer
      .split("_")
      .map((e) => TPSM.str.capitalization(e))
      .join(" ");
  }
  addS(value) {
    return value == 1 ? "" : "s";
  }
})();