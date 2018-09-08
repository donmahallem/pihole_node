import * as ini from "ini";
import * as fs from "fs";
import { AppDefaults } from "./defaults";

const defaults: any = new AppDefaults();
module.exports = ini.parse(fs.readFileSync(defaults.setupVars, "utf-8"));
