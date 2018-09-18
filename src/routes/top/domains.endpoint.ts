import * as express from "express";
import { RouteError } from "../route-error";
import { PiholeDatabase } from "../../helper/pihole-database";
import {
    ParseLimitQueryParameter,
    ParseFromToQueryParameter
} from "../../helper/query-param-tools";
import { createListResponseObserver } from "../../response/list-response.observer";

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
export const createTopDomainsEndpoint = (database: PiholeDatabase): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        let queryLimit: number = 25;
        let queryOffset: number = 0;
        if (req.query.limit) {
            queryLimit = parseInt(req.query.limit);
        }
        if (req.query.offset) {
            queryOffset = parseInt(req.query.offset);
        }
        if (req.query.client) {
            database.getTopDomains(queryLimit, queryOffset, req.query.client)
                .subscribe(createListResponseObserver(req, res, next));
        } else {
            database.getTopDomains(queryLimit, queryOffset)
                .subscribe(createListResponseObserver(req, res, next));
        }
    };
}

/*
router
    .get("/top/domains", (req: express.Request, res: express.Response, next: express.NextFunction): void => {

        let limit: number = 25;
        if (req.query) {
            const parsed: any = parseInt(req.query.limit);
            if (Number.isInteger(parsed)) {
                if (parsed < 0) {
                    next(new RouteError(401, "Limit can't be smaller than 0"));
                    return;
                } else if (parsed > 100) {
                    next(new RouteError(401, "Limit can't be larger than 100"));
                    return;
                }
                limit = parsed;
            } else {
                next(new RouteError(401, "Limit parameter is not number"));
                return;
            }
        }
        res.setHeader("Content-Type", "application/json");
        res.write("{\"data\":[");
        let first: boolean = true;
        db.getTopDomains(limit)
            .subscribe((val) => {
                if (first) {
                    first = false;
                } else {
                    res.write(",");
                }
                res.write(JSON.stringify(val));
            }, (err: Error): void => {
                next(err);
            }, (): void => {
                res.write("]}");
                res.end();
            })
    });*/