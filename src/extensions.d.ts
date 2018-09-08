import * as jsonsc from "jsonschema";


declare module "jsonschema" {

    export interface Schema {
        defaultValue?: any;
    }
}