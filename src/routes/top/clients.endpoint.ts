import * as express from "express";
import { RouteError } from "../route-error";
import { PiholeDatabase } from "../../helper/pihole-database";
import { ParseLimitQueryParameter } from "../../helper/query-param-tools";

const db: PiholeDatabase = new PiholeDatabase();

export const createTopClientsEndpoint = (database: PiholeDatabase): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        let first: boolean = true;
        res.setHeader("Content-Type", "application/json");
        res.write("{\"data\":[");
        database.getTopClients(req.query.limit)
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
    };
}