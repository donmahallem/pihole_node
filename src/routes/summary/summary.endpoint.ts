import * as express from 'express';
import { FTLUtil } from '../../helper/ftl-util';
import { createObjectResponseObserver } from '../../response/object-response.observer';

export const createSummaryEndpoint = (): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        FTLUtil
            .getStats()
            .subscribe(createObjectResponseObserver(req, res, next));
    };
};
