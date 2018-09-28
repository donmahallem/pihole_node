import * as express from 'express';
import { RouteError } from '../route-error';
import { PiholeDatabase } from '../../helper/pihole-database';
import { ParseLimitQueryParameter } from '../../helper/query-param-tools';
import { createListResponseObserver } from '../../response/list-response.observer';


export const createTopAdsEndpoint = (database: PiholeDatabase): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
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
    };
};
