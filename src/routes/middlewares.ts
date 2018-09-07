import * as express from "express";
import { RouteError } from "./route-error";
import { UserRequest } from "./../helper/user-request";
enum Scope {
    /**
     * Read history
     */
    HISTORY_READ = 1,
    /**
     * read black or white list
     */
    LISTS_READ = 2,
    LISTS_WRITE = 3,
    SUMMARY_READ = 4,
    SETTINGS_READ = 5,
}
export class Middlewares {
    /*
    Special middleware for api endpoint as no login redirect will be shown
    */
    public static authMiddleware: express.RequestHandler = (req: UserRequest, res: express.Response, next: express.NextFunction) => {
        if (req.user.authenticated) {
            next();
        } else {
            next(new RouteError(401, "Not authorized"));
        }
    };

    /**
     * 
     */
    public static checkScope(scopes: Scope[]) {
        let handler: express.RequestHandler = (req: UserRequest, res: express.Response, next: express.NextFunction) => {
            if (req.user.authenticated) {
                next();
            } else {
                next(new RouteError(401, "Not authorized"));
            }
        }
        return handler;
    };


    /**
     * Verifies the provided cookie
     * @alias express.verifyAuthCookie
     * @method express.verifyAuthCookie
     * @memberof module:helper.express
     * @param {Object} req - express request object
     * @param {Object} res - express response object
     * @param {Function} next - next callback
     * @static
     */
    public static verifyAuthCookie: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.signedCookies["AUTH-TOKEN"]) {
            /* helper.jwtVerify(req.signedCookies["AUTH-TOKEN"], function (err, decoded) {
                 if (decoded) {
                     req.user = {
                         "authenticated": true,
                         "csrfToken": decoded.csrfToken,
                         "token": helper.hashWithSalt(decoded.csrfToken, appDefaults.csrfSecret)
                     };
                 } else {
                     req.user = {
                         "authenticated": false
                     };
                 }
                 next();
             });*/
        } else {
            req["user"] = {
                "authenticated": false
            };
            next();
        }
    };
}