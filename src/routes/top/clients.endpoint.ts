import * as express from 'express';
import { RouteError } from '../route-error';
import { PiholeDatabase } from '../../helper/pihole-database';
import { ParseLimitQueryParameter } from '../../helper/query-param-tools';
import { createListResponseObserver } from '../../response/list-response.observer';
import { ValidatorResult, Validator, Schema } from 'jsonschema';
import { PageLimitSchema, PageOffsetSchema } from '../../schemas';

export const ClientsEndpointSchema: Schema = {
    id: '/TopEndpointSchema',
    type: 'object',
    properties: {
        offset: { $ref: PageOffsetSchema.id },
        limit: { $ref: PageLimitSchema.id }
    }
};

export const createSchemaValidator = (): Validator => {
    const val: Validator = new Validator();
    val.addSchema(PageLimitSchema, PageLimitSchema.id);
    val.addSchema(PageOffsetSchema, PageOffsetSchema.id);
    return val;
};

export const createTopClientsEndpoint = (database: PiholeDatabase): express.RequestHandler => {
    const schemaValidator: Validator = createSchemaValidator();
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        const validatonResult: ValidatorResult = schemaValidator.validate(req.query, ClientsEndpointSchema);
        if (validatonResult.valid === true) {
            let queryLimit: number = 25;
            let queryOffset: number = 0;
            if (req.query.limit) {
                queryLimit = parseInt(req.query.limit, 10);
            }
            if (req.query.offset) {
                queryOffset = parseInt(req.query.offset, 10);
            }
            database.getTopClients(queryLimit, queryOffset)
                .subscribe(createListResponseObserver(req, res, next));
        } else {
            next(RouteError.fromValidatorError(validatonResult.errors));
        }
    };
};
