import * as express from "express";
import { RouteError } from "../route-error";
import { PiholeDatabase } from "../../helper/pihole-database";
import { ParseLimitQueryParameter } from "../../helper/query-param-tools";
import { createListResponseObserver } from "../../response/list-response.observer";


export const createCombindedEndpoint = (database: PiholeDatabase): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        if (req.query !== undefined) {
            database.getCombinedHistory(req.query.from, req.query.to)
                .subscribe(createListResponseObserver(req, res, next));
        } else {
            database.getCombinedHistory()
                .subscribe(createListResponseObserver(req, res, next));
        }
    };
}