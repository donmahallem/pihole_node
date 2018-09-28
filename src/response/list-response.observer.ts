import { Observer } from 'rxjs';
import * as express from 'express';

export const createListResponseObserver = (req: express.Request, res: express.Response, next: express.NextFunction): Observer<any> => {
    let firstItemSent = false;
    const initData = (res: express.Response) => {
        if (!res.headersSent) {
            res.setHeader('Content-Type', 'application/json');
        }
        res.write('{\"data\":[');
        firstItemSent = true;
    };
    return {
        next: (value: any) => {
            if (!firstItemSent) {
                initData(res);
            } else {
                res.write(',');
            }
            res.write(JSON.stringify(value));
        },
        error: (err: any) => {
            next(err);
        },
        complete: () => {
            if (!firstItemSent) {
                initData(res);
            }
            res.write(']}');
            res.end();
        }
    };
};
