/// <reference path='../extensions.d.ts' />
import * as express from 'express';
import { RouteError } from '../routes/route-error';
import {
    Schema,
    validate,
    ValidatorResult,
    Options,
    SchemaContext,
    RewriteFunction
} from 'jsonschema';

export const rewriteDefaultValue: RewriteFunction = (instance: any, schema: Schema, options: Options, ctx: SchemaContext): any => {
    if (schema.defaultValue && instance === undefined) {
        return schema.defaultValue;
    } else {
        if (schema.type === 'integer') {
            return parseInt(instance);
        }
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
        if (result.valid) {
            req.query = result.instance;
            next();
        } else {
            next(new RouteError(401, result.errors[0].property + ' - ' + result.errors[0].message));
        }
    }
}