import * as express from "express";
import { createTopEndpoint } from "./top.endpoint";
import { createTopClientsEndpoint } from "./clients.endpoint";
import { PiholeDatabase } from "../../helper/pihole-database";

/**
 * The router for the api endpoints
 * @exports apiRouter
 */
export const createTopRouter = (): express.Router => {
    const router = express.Router();

    const db: PiholeDatabase = PiholeDatabase.getInstance();

    router.get("/domains", createTopEndpoint(db.getTopDomains));
    router.get("/clients", createTopClientsEndpoint(db));
    router.get("/ads", createTopEndpoint(db.getTopAds));
    return router;
};
