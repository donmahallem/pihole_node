import { Observer } from 'rxjs';
import { Request, Response, NextFunction } from 'express';

export const createObjectResponseObserver = (req: Request, res: Response, next: NextFunction): Observer<any> => {
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
