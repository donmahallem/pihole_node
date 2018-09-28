/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";
import { Api } from "./api";
import * as TopRoutes from "./top/route";
import { UserRouter } from "./user/route";
import * as HistoryRoutes from "./history/route";
import * as SummaryRoute from "./summary/route";

/**
 * @apiDefine NotAuthorized
 * @apiError NotAuthorized The requester is not authorized to access this endpoint
 * @apiErrorExample NotAuthorized Response:
 *     HTTP/1.1 401 Not Authorized
 *     {
 *       "error":{
 *         "code":401,
 *         "message":"Not authorized"
 *       }
 *     }
 */

/**
 * @apiDefine admin AdminUser
 * A logged in user
 */

/**
 * @apiDefine none public
 * This api endpoint is public
 */

/**
 * @apiDefine InvalidRequest
 * @apiError InvalidRequest The request is malformed
 * @apiErrorExample InvalidRequest Response:
 *     HTTP/1.1 400 Invalid Request
 *     {
 *       "error":{
 *         "code":400,
 *         "message":"Bad Request"
 *       }
 *     }
 */

/**
 * @apiDefine ErrorNotFound
 * @apiError NotFound The requested resource is unknown to the server
 * @apiErrorExample NotFound Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error":{
 *         "code":404,
 *         "message":"Not found"
 *       }
 *     }
 */

/**
 * The router for the api endpoints
 * @exports apiRouter
 */
let router = express.Router();

const supportedDataQueries = {
    "summary": {
        "authRequired": false
    },
    "overTimeData": {
        "authRequired": false
    },
    "topItems": {
        "authRequired": true
    },
    "recentItems": {
        "authRequired": true
    },
    "queryTypes": {
        "authRequired": true
    },
    "forwardDestinations": {
        "authRequired": true
    },
    "allQueries": {
        "authRequired": true
    },
    "querySources": {
        "authRequired": true
    }
};


router.use(function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});



/**
 * @api {get} /api/data/queryTypes Get Querytypes
 * @apiName GetDataQueryTypes
 * @apiGroup Data
 * @apiVersion 1.0.1
 * @apiPermission admin
 *
 * @apiSuccess {Object[]} queryTypes Array with query types
 * @apiSuccess {String} queryTypes.type query type
 * @apiSuccess {Number} queryTypes.count number of queries with this type
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "queryTypes":[
 *         {
 *           "type": "AAAA",
 *           "count": 299
 *         },
 *         {
 *           "type": "AA",
 *           "count": 100
 *         }
 *       ]
 *     }
 * @apiUse InvalidRequest
 * @apiUse NotAuthorized
 */
router.get("/data/queryTypes", Api.getQueryTypes);

/**
 * @api {get} /api/data/summary Get Summary
 * @apiName GetDataSummary
 * @apiGroup Data
 * @apiVersion 1.0.1
 * @apiPermission none
 *
 * @apiSuccess {Object} summary The object summary
 * @apiSuccess {Number} summary.adsBlockedToday Total blocked queries
 * @apiSuccess {Number} summary.dnsQueriesToday Total dns queries
 * @apiSuccess {Number} summary.adsPercentageToday Percentage of blocked requests
 * @apiSuccess {Number} summary.domainsBeingBlocked Domains being blocked in total
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data":{
 *         "adsBlockedToday": 10,
 *         "dnsQueriesToday": 100,
 *         "domainsBeingBlocked": 1337
 *       }
 *     }
 * @apiUse InvalidRequest
 * @apiUse NotAuthorized
 */
router.get("/data/summary", Api.getSummary);
/**
 * @api {get} /api/data/forwardDestinations Get forward Destinations
 * @apiName GetDataForwardDestinations
 * @apiGroup Data
 * @apiVersion 1.0.1
 * @apiPermission admin
 *
 * @apiSuccess {Object[]} forwardDestinations Array with query sources
 * @apiSuccess {String} forwardDestinations.destination name of destination
 * @apiSuccess {Number} forwardDestinations.count number of queries to this destination
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "forwardDestinations":[
 *         {
 *           "destination": "8.8.8.8",
 *           "count":20
 *         },
 *         {
 *           "destination": "8.8.4.4",
 *           "count":29
 *         }
 *       ]
 *     }
 * @apiUse InvalidRequest
 * @apiUse NotAuthorized
 */
router.get("/data/forwardDestinations",
    Api.getForwardDestinations);


/**
 * @api {get} /log?type=... Get Log
 * @apiName GetLog
 * @apiGroup Log
 * @apiVersion 1.0.1
 * @apiPermission admin
 * @apiParam (Query Parameter) {String=all,query,forward,block} type=query gets all queries with the specified type
 *
 * @apiSuccess {Object} data Array with query data
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data":[{
 *           "domain":"domain1.com",
 *           "timestamp":"2017-01-09T23:00:26.000Z",
 *           "client":"127.0.0.1",
 *           "type":"query",
 *           "queryType":"A"
 *         }
 *       ]
 *     }
 * @apiUse InvalidRequest
 * @apiUse NotAuthorized
 */
router.get("/history", Api.getHistory);
/**
 * @api {get} /api/data/overtimeData Get OverTimeData
 * @apiName GetDataOverTimeData
 * @apiGroup Data
 * @apiVersion 1.0.1
 * @apiPermission admin
 * @apiParam (Query Parameter) {Number=1,10,60} [frameSize=10] Sets the overtime timeframe size in minutes
 *
 * @apiSuccess {Object[]} overTimeData Array with query data
 * @apiSuccess {Number{0-..}} overTimeData.ads number of ads in that timeframe
 * @apiSuccess {Number} overTimeData.queries number of queries in that timeframe
 * @apiSuccess {Number} overTimeData.frame the frame number
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "overTimeData":[
 *         {
 *           "ads":20,
 *           "queries":200,
 *           "frame":0
 *         },
 *         {
 *           "ads":20,
 *           "queries":200,
 *           "frame":1
 *         },
 *         {
 *           "ads":20,
 *           "queries":200,
 *           "frame":2
 *         }
 *       ]
 *     }
 * @apiUse InvalidRequest
 * @apiUse NotAuthorized
 */
router.get("/data/overtimeData", Api.getOvertimeData);

router.use("/top", TopRoutes.createTopRouter());

router.use("/user", UserRouter);

router.use("/history", HistoryRoutes);

router.use("/summary", SummaryRoute.createSummaryRouter());

router.use(Api.catchError);

export = router;
