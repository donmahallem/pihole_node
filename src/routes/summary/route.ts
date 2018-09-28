import * as express from "express";
import {
    createSummaryEndpoint
} from "./summary.endpoint";

/**
 * The router for the api endpoints
 * @exports apiRouter
 */
export const createSummaryRouter = (): express.Router => {
    let router = express.Router();
    router.get("/", createSummaryEndpoint());
    return router;
}