import * as express from "express";
import { createCombindedEndpoint } from "./combined.endpoint";
import { createAdsEndpoint } from "./ads.endpoint";
import { queryParameterValidator } from "../../middleware/query-parameter-validator.middleware";
import * as jsonschema from "jsonschema";
import { PiholeDatabase } from "../../helper/pihole-database";
import { FromToQueryParameterSchema } from "../../schemas/from-to-parameter.schema";

/**
 * The router for the api endpoints
 * @exports apiRouter
 */
let router = express.Router();

const db: PiholeDatabase = PiholeDatabase.getInstance();

const subRouter = router.use(queryParameterValidator(FromToQueryParameterSchema));
subRouter.get("/", createCombindedEndpoint(db));
subRouter.get("/ads", createAdsEndpoint(db));
export = router;
