import {
    QueryTypes,
    Summary,
    ForwardDestinations,
    OvertimeData
} from "./../models";
import { RouteError } from "./route-error";
import * as express from "express";

export class Api {
    public static getQueryTypes: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    }

    public static getSummary: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let startTime: number = Date.now();
    }

    public static getForwardDestinations: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    }

    public static getHistory: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const type = req.query.type || "query";
        if (type && (type === "query" || type === "forward" || type === "block")) {
            var first = true;
        } else {
            next(new Error("Unsupported '" + req.query.type + "' type"));
        }
    }

    public static getOvertimeData: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    };

    public static catchError: express.ErrorRequestHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (err instanceof RouteError) {
            res.status(err.statusCode);
            res.json({
                "error": {
                    "message": err.message,
                    "status": err.statusCode
                }
            });
        } else {
            res.sendStatus(500);
        }
    }
}