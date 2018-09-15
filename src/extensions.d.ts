import * as jsonschema from "jsonschema";
import * as express from "express";
declare module "jsonschema" {

    export interface Schema {
        defaultValue?: any;
    }
}

declare module "express" {
    export interface Request {
        user?: any
    }
}
