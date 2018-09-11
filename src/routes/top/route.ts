import * as express from "express";
import { topClients } from "./clients.endpoint";
import { GetTopDomainsEndpoint } from "./domains.endpoint";
import {
    GetTopAdsEndpoint,
    topAds
} from "./ads.endpoint";
import { queryParameterValidator } from "../../middleware/query-parameter-validator.middleware";
import * as jsonschema from "jsonschema";
import { TopQueryParameterSchema } from "../../schemas/offset-query-parameter.schema";

/**
 * The router for the api endpoints
 * @exports apiRouter
 */
let router = express.Router();

const subRouter = router.use(queryParameterValidator(TopQueryParameterSchema));
//subRouter.get("/domains", GetTopDomainsEndpoint);
subRouter.get("/clients", topClients);
subRouter.get("/ads", topAds);
export = router;
