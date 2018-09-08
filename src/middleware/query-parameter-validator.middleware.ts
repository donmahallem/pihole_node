import * as express from "express";
import { RouteError } from "../routes/route-error";
import {
    Schema,
    validate,
    ValidatorResult,
    Options,
    SchemaContext,
    RewriteFunction
} from "jsonschema";

export const rewriteDefaultValue: RewriteFunction = (instance: any, schema: Schema, options: Options, ctx: SchemaContext): any => {
    if (schema.defaultValue && instance === undefined) {
        return schema.defaultValue;
    } else {
        return instance;
    }
};

export const queryParameterValidator = (param: Schema): express.RequestHandler => {
    const options: Options = {
        allowUnknownAttributes: false,
        rewrite: rewriteDefaultValue
    };
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let testData: any;
        if (req.query) {
            testData = req.query;
        } else {
            testData = {};
        }
        const result: ValidatorResult = validate(testData, param, options);
        console.log(result.instance);
        if (result.valid) {
            next();
        } else {
            next(new RouteError(401, result.errors[0].message));
        }
    }
}