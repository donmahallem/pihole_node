import * as jsonschema from "jsonschema";
declare module "jsonschema" {

    export interface Schema {
        defaultValue?: any;
    }
}