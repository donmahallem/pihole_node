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
import * as summaryEndpoint from "./summary.endpoint";
import * as express from "express";
import * as testObject from "./route";
const chaiHttp = require("chai-http");
const chai = require("chai");
chai.use(chaiHttp);
describe('routes/summary/route', () => {
    describe('catch all', function () {
        var app;
        var testRouter: express.Router;
        var createSummaryEndpointStub: sinon.SinonStub;
        var createSummaryEndpointRequestHandlerStub: sinon.SinonStub;
        var ftlUtilStub: sinon.SinonStub;
        //var databaseStub: sinon.SinonStubbedInstance<PiholeDatabase>;
        before(function () {
            // A stub we can use to control conditionals
            createSummaryEndpointStub = sinon.stub(summaryEndpoint, "createSummaryEndpoint");
            createSummaryEndpointRequestHandlerStub = sinon.stub();
            createSummaryEndpointStub.returns(createSummaryEndpointRequestHandlerStub);
            //
            app = express();
            testRouter = testObject.createSummaryRouter();
            app.use(testRouter);
        });
        afterEach(() => {
            createSummaryEndpointRequestHandlerStub.resetHistory();
            createSummaryEndpointStub.resetHistory();
        });
        after(() => {
            createSummaryEndpointStub.restore();
        })

        describe('/summary - GET', function () {
            it('should respond with 200', () => {
                const testBody: any = { random: 5 };
                createSummaryEndpointRequestHandlerStub.callsFake((req: express.Request, res: express.Response, next: express.NextFunction) => {
                    res.json(testBody);
                });
                return chai.request(app)
                    .get('/')
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.deep.equal(testBody);
                        expect(createSummaryEndpointRequestHandlerStub.callCount).to.equal(1);
                    });
            });
            it('should respond with 404', () => {
                const testBody: any = { random: 5 };
                createSummaryEndpointRequestHandlerStub.callsFake((req: express.Request, res: express.Response, next: express.NextFunction) => {
                    res.statusCode = 404;
                    res.json(testBody);
                });
                return chai.request(app)
                    .get('/')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body).to.deep.equal(testBody);
                        expect(createSummaryEndpointRequestHandlerStub.callCount).to.equal(1);
                    });
            });
        });

    });
});