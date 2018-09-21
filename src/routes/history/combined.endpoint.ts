import * as express from 'express';
import { PiholeDatabase } from '../../helper/pihole-database';
import { createListResponseObserver } from '../../response/list-response.observer';


export const createCombindedEndpoint = (database: PiholeDatabase): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        if (req.query !== undefined) {
            database.getCombinedHistory(req.query.from, req.query.to, req.query.client)
                .subscribe(createListResponseObserver(req, res, next));
        } else {
            database.getCombinedHistory()
                .subscribe(createListResponseObserver(req, res, next));
        }
    };
}