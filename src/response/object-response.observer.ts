import { Observer } from "rxjs";
import * as express from "express";
import { RouteError } from "../routes/route-error";

export const createObjectResponseObserver = (req: express.Request, res: express.Response, next: express.NextFunction): Observer<any> => {
    let firstItemSent = false;
    const initData = (res: express.Response) => {
        if (!res.headersSent) {
            res.setHeader("Content-Type", "application/json");
        }
    };
    return {
        next: (value: any) => {
            initData(res);
            if (!firstItemSent) {
                firstItemSent = true;
                res.json(value);
            } else {
                next(new RouteError(500, "Item already sent"));
            }
        },
        error: (err: any) => {
            next(err);
        },
        complete: () => {
            initData(res);
            if (!firstItemSent) {
                firstItemSent = true;
                res.json({});
            }
            res.end();
        }
    }
}