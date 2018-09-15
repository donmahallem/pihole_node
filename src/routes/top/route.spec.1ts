import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import {
    RouteError
} from "../route-error";
import * as express from "express";
import * as queryParameterValidatorMiddleware from "./../../middleware/query-parameter-validator.middleware";
const chaiHttp = require("chai-http");
const chai = require("chai");
chai.use(chaiHttp);
describe('routes/top/route', () => {
    describe('GET /top', function () {
        var app, route;
        var queryParameterValidatorStub, topAdsStub, topClientsStub;
        const testResponseData: any = {
            status: 'not ok',
            data: null
        };
        var testRouter: express.Router;
        before(function () {
            // A stub we can use to control conditionals

            queryParameterValidatorStub = sinon.stub(queryParameterValidatorMiddleware, "queryParameterValidator")
                .returns((req, res, next) => {
                    console.log("a");
                    next();
                });
            app = express();
            testRouter = require("./route");
            app.use(testRouter);
        });
        afterEach(() => {
        });
        after(() => {
            queryParameterValidatorStub.restore();
        })

        it('should respond with a 404 and a null', () => {
            return chai.request(app)
                .get('/ads')
                .then((res) => {
                    expect(res.status).to.equal(200);
                    expect(queryParameterValidatorStub.callCount).to.equal(1);
                    console.log(res.body);
                });
        });
        it('should respond with a 200', () => {
            return chai.request(app)
                .get('/clients')
                .then((res) => {
                    expect(res.status).to.equal(200);
                    console.log(res.body);
                    expect(queryParameterValidatorStub.callCount).to.equal(1, "queryParametervalidator should be called once");
                });
        });

    });
});