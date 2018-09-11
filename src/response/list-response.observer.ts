import { Observer } from "rxjs";
import * as express from "express";

export const createListResponseObserver = (req: express.Request, res: express.Response, next: express.NextFunction): Observer<any> => {
    let firstItemSent = false;
    return {
        next: (value: any) => {
            if (!firstItemSent) {
                if (!res.headersSent) {
                    res.setHeader("Content-Type", "application/json");
                }
                res.write("{\"data\":[");
                firstItemSent = true;
            } else {
                res.write(",");
            }
            res.write(JSON.stringify(value));
        },
        error: (err: any) => {
            next(err);
        },
        complete: () => {
            res.write("]}");
            res.end();
        }
    }
}