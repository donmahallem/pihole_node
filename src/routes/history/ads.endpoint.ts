import * as express from "express";
import { RouteError } from "../route-error";
import { PiholeDatabase } from "../../helper/pihole-database";
import { ParseLimitQueryParameter } from "../../helper/query-param-tools";
import { createListResponseObserver } from "../../response/list-response.observer";


export const createAdsEndpoint = (database: PiholeDatabase): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        database.getAdsHistory()
            .subscribe(createListResponseObserver(req, res, next));
    };
}