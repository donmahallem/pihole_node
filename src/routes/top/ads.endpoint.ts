import * as express from 'express';
import { RouteError } from '../route-error';
import { PiholeDatabase } from '../../helper/pihole-database';
import { ParseLimitQueryParameter } from '../../helper/query-param-tools';
import { createListResponseObserver } from '../../response/list-response.observer';
import {
    Schema,
    Validator,
    ValidatorResult
} from 'jsonschema';
import {
    PageLimitSchema,
    PageOffsetSchema
} from './../../schemas';

export const TopAdsEndpointSchema: Schema = {
    "id": "/TopAdsEndpointSchema",
    "type": "object",
    "properties": {
        "offset": { "$ref": PageOffsetSchema.id },
        "limit": { "$ref": PageLimitSchema.id }
    }
};

export const createTopAdsEndpointSchemaValidator = (): Validator => {
    const validator = new Validator();
    validator.addSchema(PageLimitSchema, PageLimitSchema.id);
    validator.addSchema(PageOffsetSchema, PageOffsetSchema.id);
    return validator;
};

export const createTopAdsEndpoint = (database: PiholeDatabase): express.RequestHandler => {
    const schemaValidator: Validator = createTopAdsEndpointSchemaValidator();
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        const validatonResult: ValidatorResult = schemaValidator.validate(req.query, TopAdsEndpointSchema);
        if (validatonResult.valid === true) {
            let queryLimit: number = 25;
            let queryOffset: number = 0;
            if (req.query.limit) {
                queryLimit = parseInt(req.query.limit, 10);
            }
            if (req.query.offset) {
                queryOffset = parseInt(req.query.offset, 10);
            }
            if (req.query.client) {
                database.getTopAds(queryLimit, queryOffset, req.query.client)
                    .subscribe(createListResponseObserver(req, res, next));
            } else {
                database.getTopAds(queryLimit, queryOffset)
                    .subscribe(createListResponseObserver(req, res, next));
            }
        } else {
            next(RouteError.fromValidatorError(validatonResult.errors));
        }
    };
};
