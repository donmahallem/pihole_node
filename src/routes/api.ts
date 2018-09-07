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
        let queryTypes: QueryTypes = new QueryTypes();
    }

    public static getSummary: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let summary = new Summary();
        let startTime: number = Date.now();
    }

    public static getForwardDestinations: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let destinations = new ForwardDestinations();
    }

    public static getHistory: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(req.query);
        const type = req.query.type || "query";
        if (type && (type === "query" || type === "forward" || type === "block")) {
            var first = true;
        } else {
            next(new Error("Unsupported '" + req.query.type + "' type"));
        }
    }

    public static getOvertimeData: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        var resp = new OvertimeData();
    };

    public static catchError: express.ErrorRequestHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log("error occured", err);
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