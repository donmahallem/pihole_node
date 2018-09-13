import * as express from "express";
import { createTopClientsEndpoint } from "./clients.endpoint";
import { createTopDomainsEndpoint } from "./domains.endpoint";
import {
    GetTopAdsEndpoint,
    topAds
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

const subRouter = router.use(queryParameterValidator(TopQueryParameterSchema));
subRouter.get("/domains", createTopDomainsEndpoint(new PiholeDatabase()));
subRouter.get("/clients", createTopClientsEndpoint(new PiholeDatabase()));
subRouter.get("/ads", topAds);
export = router;
