import { Observer } from 'rxjs';
import * as express from 'express';
import { RouteError } from '../routes/route-error';

export const createObjectResponseObserver = (req: express.Request, res: express.Response, next: express.NextFunction): Observer<any> => {
    let sendObject: any;
    return {
        next: (value: any) => {
            sendObject = value;
        },
        error: (err: any) => {
            next(err);
        },
        complete: () => {
            if (!res.headersSent) {
                res.setHeader('Content-Type', 'application/json');
            }
            res.write('{\"data\":');
            if (sendObject) {
                res.write(JSON.stringify(sendObject));
            } else {
                res.write('null');
            }
            res.write('}');
            res.end();
        }
    };
};
