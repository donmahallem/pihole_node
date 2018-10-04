import * as express from 'express';
import { RouteError } from '../route-error';
import { PiholeDatabase } from '../../helper/pihole-database';
import {
    ParseLimitQueryParameter,
    ParseFromToQueryParameter
} from '../../helper/query-param-tools';
import { createListResponseObserver } from '../../response/list-response.observer';
import {
    PageLimitSchema,
    PageOffsetSchema,
    ClientSchema
} from './../../schemas';
import {
    Schema,
    Validator,
    ValidatorResult
} from 'jsonschema';

import {
    CommonUtil
} from './common-util';

export const TopEndpointSchema: Schema = {
    id: '/TopEndpointSchema',
    type: 'object',
    properties: {
        offset: { $ref: PageOffsetSchema.id },
        limit: { $ref: PageLimitSchema.id },
        client: { $ref: ClientSchema.id }
    }
};
/**
 * @api {get} /api/data Get topItems
 * @apiName GetDataTopItems
 * @apiGroup Data
 * @apiVersion 1.0.0
 * @apiPermission admin
 * @apiParam (Query Parameter) {Boolean=true} topItems Gets the queries over time in 10 minute frames
 *
 * @apiSuccess {Object} topItems Array with query data
 * @apiSuccess {Object} overTimeData.topQueries number of ads in that timeframe
 * @apiSuccess {Object} overTimeData.topAds number of queries in that timeframe
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "topItems":{
 *         "topQueries":{
 *           "good.domain1":29,
 *           "good.domain2":39,
 *         },
 *         "topAds":{
 *           "baddomain1":29,
 *           "baddomain2":39,
 *         }
 *       }
 *     }
 * @apiUse InvalidRequest
 * @apiUse NotAuthorized
 */
export const createTopEndpoint = (databaseFunction: { (limit: number, offset: number, client?: string) }): express.RequestHandler => {
    const schemaValidator: Validator = CommonUtil.createSchemaValidator(true, true, true);
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        const validatonResult: ValidatorResult = schemaValidator.validate(req.query, TopEndpointSchema);
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
                databaseFunction(queryLimit, queryOffset, req.query.client)
                    .subscribe(createListResponseObserver(req, res, next));
            } else {
                databaseFunction(queryLimit, queryOffset)
                    .subscribe(createListResponseObserver(req, res, next));
            }
        } else {
            next(RouteError.fromValidatorError(validatonResult.errors));
        }
    };
};
