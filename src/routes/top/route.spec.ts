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
import { PiholeDatabase } from "../../helper/pihole-database";
import * as adsEndpoint from "./ads.endpoint";
import * as clientsEndpoint from "./clients.endpoint";
import * as express from "express";
import * as queryParameterValidatorMiddleware from "./../../middleware/query-parameter-validator.middleware";
import * as testObject from "./route";
const chaiHttp = require("chai-http");
const chai = require("chai");
chai.use(chaiHttp);
describe('routes/top/route', () => {
    describe('/top', function () {
        var app, route;
        var queryParameterValidatorStub, topAdsStub, topClientsStub;
        const testResponseData: any = {
            status: 'not ok',
            data: null
        };
        var testRouter: express.Router;
        var dbInstanceStub: sinon.SinonStub;
        var createTopAdsEndpointStub: sinon.SinonStub;
        var createTopAdsEndpointRequestHandlerStub: sinon.SinonStub;
        var createTopClientsEndpointStub: sinon.SinonStub;
        var createTopClientsEndpointRequestHandlerStub: sinon.SinonStub;
        //var databaseStub: sinon.SinonStubbedInstance<PiholeDatabase>;
        before(function () {
            console.log("outer before");
            // A stub we can use to control conditionals
            createTopAdsEndpointStub = sinon.stub(adsEndpoint, "createTopAdsEndpoint");
            createTopAdsEndpointRequestHandlerStub = sinon.stub();
            createTopAdsEndpointStub.returns(createTopAdsEndpointRequestHandlerStub);
            //////////////////////////////////
            createTopClientsEndpointStub = sinon.stub(clientsEndpoint, "createTopClientsEndpoint");
            createTopClientsEndpointRequestHandlerStub = sinon.stub();
            createTopClientsEndpointStub.returns(createTopClientsEndpointRequestHandlerStub);
            //////////////////////////////////
            queryParameterValidatorStub = sinon.stub(queryParameterValidatorMiddleware, "queryParameterValidator")
                .returns((req, res, next) => {
                    next();
                });
            app = express();
            testRouter = testObject.createTopRouter();
            app.use(testRouter);
            //databaseStub = sinon.createStubInstance(PiholeDatabase);
            dbInstanceStub = sinon.stub(PiholeDatabase, "getInstance").returns({});
        });
        afterEach(() => {
            createTopAdsEndpointRequestHandlerStub.reset();
            createTopClientsEndpointRequestHandlerStub.reset();
        });
        after(() => {
            console.log("outer after");
            createTopAdsEndpointStub.restore();
            createTopClientsEndpointStub.restore();
            queryParameterValidatorStub.restore();
            dbInstanceStub.restore();
        })

        describe('/ads - GET', function () {
            it('should respond with 200', () => {
                const testBody: any = { random: 5 };
                createTopAdsEndpointRequestHandlerStub.callsFake((req: express.Request, res: express.Response, next: express.NextFunction) => {
                    res.json(testBody);
                });
                return chai.request(app)
                    .get('/ads')
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(queryParameterValidatorStub.callCount).to.equal(1);
                        expect(res.body).to.deep.equal(testBody);
                        expect(createTopAdsEndpointRequestHandlerStub.callCount).to.equal(1);
                        expect(createTopClientsEndpointRequestHandlerStub.callCount).to.equal(0);
                    });
            });
            it('should respond with 404', () => {
                const testBody: any = { random: 5 };
                createTopAdsEndpointRequestHandlerStub.callsFake((req: express.Request, res: express.Response, next: express.NextFunction) => {
                    res.statusCode = 404;
                    res.json(testBody);
                });
                return chai.request(app)
                    .get('/ads')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(queryParameterValidatorStub.callCount).to.equal(1);
                        expect(res.body).to.deep.equal(testBody);
                        expect(createTopAdsEndpointRequestHandlerStub.callCount).to.equal(1);
                        expect(createTopClientsEndpointRequestHandlerStub.callCount).to.equal(0);
                    });
            });
        });
        describe('/clients - GET', function () {
            it('should respond with a 200', () => {
                const testBody: any = { random: 5 };
                createTopClientsEndpointRequestHandlerStub.callsFake((req: express.Request, res: express.Response, next: express.NextFunction) => {
                    res.statusCode = 200;
                    res.json(testBody);
                });
                return chai.request(app)
                    .get('/clients')
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(queryParameterValidatorStub.callCount).to.equal(1, "queryParametervalidator should be called once");
                        expect(createTopAdsEndpointRequestHandlerStub.callCount).to.equal(0);
                        expect(createTopClientsEndpointRequestHandlerStub.callCount).to.equal(1);
                        expect(res.body).to.deep.equal(testBody);
                    });
            });
            it('should respond with a 200', () => {
                const testBody: any = { random: 7 };
                createTopClientsEndpointRequestHandlerStub.callsFake((req: express.Request, res: express.Response, next: express.NextFunction) => {
                    res.statusCode = 404;
                    res.json(testBody);
                });
                return chai.request(app)
                    .get('/clients')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(queryParameterValidatorStub.callCount).to.equal(1, "queryParametervalidator should be called once");
                        expect(createTopAdsEndpointRequestHandlerStub.callCount).to.equal(0);
                        expect(createTopClientsEndpointRequestHandlerStub.callCount).to.equal(1);
                        expect(res.body).to.deep.equal(testBody);
                    });
            });
        });

    });
});