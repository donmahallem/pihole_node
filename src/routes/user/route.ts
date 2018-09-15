import * as express from "express";
import { createListUsersEndpoint } from "./list-users.endpoint";
import { UserDatabase } from "../../helper/user-database";
import { createCreateUsersEndpoint } from "./create-user.endpoint";

/**
 * The router for the api endpoints
 * @exports apiRouter
 */
let router = express.Router();

/*
const db: UserDatabase = new UserDatabase();

router.get("/list", createListUsersEndpoint(db));
router.post("/create", createCreateUsersEndpoint(db));*/
export = router;
