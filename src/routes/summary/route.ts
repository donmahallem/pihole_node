import * as express from "express";
import {
    createSummaryEndpoint
} from "./summary.endpoint";

/**
 * The router for the api endpoints
 * @exports apiRouter
 */
export const createSummaryRouter = (): express.Router => {
    const router: express.Router = express.Router();
    router.get("/", createSummaryEndpoint());
    return router;
};
