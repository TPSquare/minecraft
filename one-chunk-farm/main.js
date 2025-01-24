import FARMS from "./data/farms.js";
import DUPS from "./data/dups.js";
const DATA = Object.assign({}, FARMS.fully, FARMS.semi, FARMS.afk, DUPS);

const GET = new (class {
  constructor() {
    this.mList = Object.keys(DATA).length; // List of farm machines
    this.iList = []; // List of items
    Object.keys(DATA).forEach((items) => this.iList.push(...items.split("|")));
    this.quantity = this.iList.length;
    this.stacks = {
      1: ["water_bucket"],
      16: [],
    };
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
})();

const LOG = new (class {
  materials(key, stacks = false) {
    console.log(FUNC.identiferToName(key) + ": ");
    const data = GET.materials(key, stacks);
    if (stacks)
      console.log(
        Object.keys(data)
          .map((k) => {
            const value = (() => {
              if (k == "entities")
                return (
                  "\n" +
                  Object.keys(data[k])
                    .map((e) => `    ${FUNC.identiferToName(e)}: ${data[k][e]}`)
                    .join("\n")
                );
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
          .join("\n")
      );
    else
      console.log(
        Object.keys(data)
          .map((k) => {
            if (k == "entities")
              return (
                "  Entities:\n" +
                Object.keys(data[k])
                  .map((e) => `    ${FUNC.identiferToName(e)}: ${data[k][e]}`)
                  .join("\n")
              );
            if (!Array.isArray(data[k])) return `  ${FUNC.identiferToName(k)}: ${data[k]}`;
            return `  ${FUNC.identiferToName(k)}: ${data[k]} item${FUNC.addS(data[k])}`;
          })
          .join("\n")
      );
  }
})();

const FUNC = new (class {
  identiferToName(identifer) {
    return identifer
      .split("_")
      .map((e) => e.charAt(0).toUpperCase() + e.substr(1))
      .join(" ");
  }
  addS(value) {
    return value == 1 ? "" : "s";
  }
})();

LOG.materials("kelp", true);
// console.log(GET.mList);
