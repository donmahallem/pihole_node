import * as express from "express";
import { RouteError } from "../route-error";
import { PiholeDatabase } from "../../helper/pihole-database";
import {
    ParseLimitQueryParameter,
    ParseFromToQueryParameter
} from "../../helper/query-param-tools";

const db: PiholeDatabase = new PiholeDatabase();

const topDomains: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    let first: boolean = true;
    res.setHeader("Content-Type", "application/json");
    res.write("{\"data\":[");
    db.getTopDomains(req.query.limit)
        .subscribe((val) => {
            if (first) {
                first = false;
            } else {
                res.write(",");
            }
            res.write(JSON.stringify(val));
        }, (err: Error): void => {
            res.end(err);
        }, (): void => {
            res.write("]}");
            res.end();
        })
};

export const GetTopDomainsEndpoint: express.RequestHandler[] = [ParseLimitQueryParameter(25, 0, 100),
ParseFromToQueryParameter(),
    topDomains];


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