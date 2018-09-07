import {
    QueryTypes,
    Summary,
    ForwardDestinations,
    OvertimeData
} from "./../models";
import { LogHelper } from "./../helper";
import { RouteError } from "./route-error";
import * as through2 from "through2";
import * as express from "express";

export class Api {
    public static getQueryTypes: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let queryTypes: QueryTypes = new QueryTypes();
        var stream = LogHelper.createLogParser()
            .pipe(LogHelper.createQueryTypesSpy(queryTypes))
            .on("end", function () {
                res.json({
                    "data": queryTypes
                });
            })
            .on("error", function (error) {
                next(new RouteError(500, "Error while parsing the log"));
            })
            .resume();
    }

    public static getSummary: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let summary = new Summary();
        let startTime: number = Date.now();
        var stream = LogHelper.createLogParser()
            .pipe(LogHelper.createSummarySpy(summary))
            .on("end", function () {
                console.log("time", Date.now() - startTime);
                res.json({
                    "data": summary
                });
            })
            .on("error", function (error) {
                next(new RouteError(500, "Error while parsing the log"));
            })
            .resume();
    }

    public static getForwardDestinations: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let destinations = new ForwardDestinations();
        var stream = LogHelper.createLogParser()
            .pipe(LogHelper.createForwardDestinationsSpy(destinations))
            .on("error", function (err) {
                next(err);
            })
            .on("end", function () {
                res.json({
                    "data": destinations
                });
            })
            .resume();
    }

    public static getHistory: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(req.query);
        const type = req.query.type || "query";
        if (type && (type === "query" || type === "forward" || type === "block")) {
            var first = true;
            var stream = LogHelper.createLogParser()
                .pipe(through2.obj(function (chunk, enc, callback) {
                    if (chunk !== false && chunk.type == 1) {
                        if (first) {
                            this.push("{\"data\":[");
                            first = false;
                        } else if (!first && chunk !== null) {
                            this.push(",");
                        }
                        this.push(JSON.stringify(chunk));
                    }
                    callback();
                }, function (callback) {
                    this.push("]}");
                    callback();
                }))
                .pipe(res);
        } else {
            next(new Error("Unsupported '" + req.query.type + "' type"));
        }
    }

    public static getOvertimeData: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        var resp = new OvertimeData();
        var stream = LogHelper.createLogParser()
            .pipe(LogHelper.createOverTimeDataSpy(resp))
            .on("end", function () {
                res.json({
                    "data": resp
                });
            })
            .on("error", function (error) {
                next(new Error("Error while parsing the log"));
            })
            .resume();
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