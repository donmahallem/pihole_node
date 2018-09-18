import * as express from "express";
import { createCombindedEndpoint } from "./combined.endpoint";
import { queryParameterValidator } from "../../middleware/query-parameter-validator.middleware";
import * as jsonschema from "jsonschema";
import { TopQueryParameterSchema } from "../../schemas/offset-query-parameter.schema";
import { PiholeDatabase } from "../../helper/pihole-database";

/**
 * The router for the api endpoints
 * @exports apiRouter
 */
let router = express.Router();

const db: PiholeDatabase = PiholeDatabase.getInstance();

const subRouter = router.use(queryParameterValidator(TopQueryParameterSchema));
subRouter.get("/", createCombindedEndpoint(db));
export = router;
