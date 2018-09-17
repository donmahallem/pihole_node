import * as express from "express";
import { createTopClientsEndpoint } from "./clients.endpoint";
import { createTopDomainsEndpoint } from "./domains.endpoint";
import {
    createTopAdsEndpoint
} from "./ads.endpoint";
import { queryParameterValidator } from "../../middleware/query-parameter-validator.middleware";
import * as jsonschema from "jsonschema";
import { TopQueryParameterSchema } from "../../schemas/offset-query-parameter.schema";
import { PiholeDatabase } from "../../helper/pihole-database";

/**
 * The router for the api endpoints
 * @exports apiRouter
 */
let router = express.Router();

const db: PiholeDatabase = new PiholeDatabase();

const subRouter = router.use(queryParameterValidator(TopQueryParameterSchema));
subRouter.get("/domains", createTopDomainsEndpoint(db));
subRouter.get("/clients", createTopClientsEndpoint(db));
subRouter.get("/ads", createTopAdsEndpoint(db));
export = router;
