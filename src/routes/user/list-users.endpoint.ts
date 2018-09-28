import * as express from 'express';
import {
    ParseLimitQueryParameter,
    ParseFromToQueryParameter
} from '../../helper/query-param-tools';
import { createListResponseObserver } from '../../response/list-response.observer';
import { UserDatabase } from '../../helper/user-database';

export const createListUsersEndpoint = (database: UserDatabase): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        let queryLimit: number = 25;
        let queryOffset: number = 0;
        if (req.query.limit) {
            queryLimit = parseInt(req.query.limit);
        }
        if (req.query.offset) {
            queryOffset = parseInt(req.query.offset);
        }
        database.getUsers()
            .subscribe(createListResponseObserver(req, res, next));
    };
}
