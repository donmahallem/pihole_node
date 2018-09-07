import * as express from "express";
import { GetTopClientsEndpoint } from "./clients.endpoint";
import { GetTopDomainsEndpoint } from "./domains.endpoint";
import { GetTopAdsEndpoint } from "./ads.endpoint";
/**
 * The router for the api endpoints
 * @exports apiRouter
 */
let router = express.Router();

router.get("/domains", GetTopDomainsEndpoint);
router.get("/clients", GetTopClientsEndpoint);
router.get("/ads", GetTopAdsEndpoint);
export = router;
