/// <reference path='../extensions.d.ts' />
import * as express from 'express';
import { RouteError } from '../routes/route-error';
import * as jwt from 'jsonwebtoken';
import { UserPermission } from '../helper/user-permissions';

export const createUnauthorizedUser = () => {
    return {
        authorized: false
    };
};

export const createAuthorizationMiddleware = (): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.headers && req.headers.authorization) {
            if (req.user) {
                next(new RouteError(500, 'User Object already set'));
                return;
            }
            const options: jwt.VerifyOptions = {

            };
            jwt.verify(req.headers.authorization, 'key', options, (err: jwt.VerifyErrors, decoded: object | string) => {
                if (err) {
                    req.user = createUnauthorizedUser();
                } else if (decoded) {
                    const anyData: any = decoded;
                    if (anyData.user)
                        req.user = anyData.user;
                } else {
                    req.user = createUnauthorizedUser();
                }
                next();
            });
        } else {
            req.user = createUnauthorizedUser();
            next();
        }
    }
};

export const createPermissionMiddleware = (permissions: UserPermission[]): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (permissions.length === 0) {
            next();
        } else {
            next();
        }
    }
};
