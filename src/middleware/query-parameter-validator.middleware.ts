import * as express from "express";
import { RouteError } from "../routes/route-error";
import {
    Schema,
    validate,
    ValidatorResult,
    Options,
    SchemaContext
} from "jsonschema";

export const queryParameterValidator = (param: Schema): express.RequestHandler => {
    const options: Options = {
        allowUnknownAttributes: false,
        rewrite: (instance: any, schema: Schema, options: Options, ctx: SchemaContext): any => {
            console.log("Instance:", instance, "Schema:", schema);
        }
    };
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.query) {
            const result: ValidatorResult = validate(req.query, param, options);
            if (result.valid) {
                next();
            } else {
                next(new RouteError(401, result.errors[0].message));
            }
        } else {
            next();
        }
    }
}