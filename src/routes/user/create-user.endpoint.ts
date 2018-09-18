import * as express from "express";
import {
    ParseLimitQueryParameter,
    ParseFromToQueryParameter
} from "../../helper/query-param-tools";
import { createListResponseObserver } from "../../response/list-response.observer";
import { UserDatabase } from "../../helper/user-database";

export const createCreateUsersEndpoint = (database: UserDatabase): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        database.createUser("aasdfasdfasdf", "JJJJ")
            .subscribe(createListResponseObserver(req, res, next));
    };
}
