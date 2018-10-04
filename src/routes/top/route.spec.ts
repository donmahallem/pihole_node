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
import * as topEndpoint from "./top.endpoint";
import * as clientsEndpoint from "./clients.endpoint";
import * as express from "express";
import * as testObject from "./route";
const chaiHttp = require("chai-http");
const chai = require("chai");
chai.use(chaiHttp);
describe('routes/top/route', () => {
    describe('/top', function () {
        var app;
        var testRouter: express.Router;
        var dbInstanceStub: sinon.SinonStub;
        var createTopEndpointStub: sinon.SinonStub;
        var createTopEndpointRequestHandlerStub: sinon.SinonStub;
        var createTopClientsEndpointStub: sinon.SinonStub;
        var createTopClientsEndpointRequestHandlerStub: sinon.SinonStub;
        //var databaseStub: sinon.SinonStubbedInstance<PiholeDatabase>;
        const testRequestHandler: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.json({ path: req.path });
        };
        const dbInstanceStubObject: any = {
            getTopAds: {
                topAds: true
            },
            getTopDomains: {
                topDomains: true
            }
        };
        before(function () {
            // A stub we can use to control conditionals
            createTopEndpointStub = sinon.stub(topEndpoint, "createTopEndpoint");
            createTopEndpointRequestHandlerStub = sinon.stub();
            createTopEndpointStub.returns(createTopEndpointRequestHandlerStub);
            createTopEndpointRequestHandlerStub.callsFake(testRequestHandler);
            //////////////////////////////////
            createTopClientsEndpointStub = sinon.stub(clientsEndpoint, "createTopClientsEndpoint");
            createTopClientsEndpointRequestHandlerStub = sinon.stub();
            createTopClientsEndpointStub.returns(createTopClientsEndpointRequestHandlerStub);
            createTopClientsEndpointRequestHandlerStub.callsFake(testRequestHandler);
            //////////////////////////////////
            dbInstanceStub = sinon.stub(PiholeDatabase, "getInstance").returns(dbInstanceStubObject);
        });
        beforeEach(() => {
            app = express();
            testRouter = testObject.createTopRouter();
            app.use(testRouter);
        });
        afterEach(() => {
            expect(createTopEndpointStub.callCount).to.equal(2);
            expect(createTopEndpointStub.calledWithExactly(dbInstanceStubObject.getTopAds));
            expect(createTopEndpointStub.calledWithExactly(dbInstanceStubObject.getTopDomains));
            expect(dbInstanceStub.callCount).to.equal(1);
            createTopEndpointRequestHandlerStub.resetHistory();
            createTopClientsEndpointRequestHandlerStub.resetHistory();
            dbInstanceStub.resetHistory();
            createTopEndpointStub.resetHistory();
        });
        after(() => {
            createTopEndpointStub.restore();
            createTopClientsEndpointStub.restore();
            dbInstanceStub.restore();
        });

        describe('/ads - GET', function () {
            afterEach(() => {
                expect(createTopEndpointRequestHandlerStub.callCount).to.equal(1);
            });
            it('should respond with 200', () => {
                return chai.request(app)
                    .get('/ads')
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.deep.equal({
                            path: "/ads"
                        });
                        expect(createTopClientsEndpointRequestHandlerStub.callCount).to.equal(0);
                    });
            });
        });
        describe('/domains - GET', function () {
            afterEach(() => {
                expect(createTopEndpointRequestHandlerStub.callCount).to.equal(1);
            });
            it('should respond with 200', () => {
                return chai.request(app)
                    .get('/domains')
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.deep.equal({
                            path: "/domains"
                        });
                        expect(createTopClientsEndpointRequestHandlerStub.callCount).to.equal(0);
                    });
            });
        });
        describe('/clients - GET', function () {
            it('should respond with a 200', () => {
                return chai.request(app)
                    .get('/clients')
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(createTopClientsEndpointRequestHandlerStub.callCount).to.equal(1);
                        expect(res.body).to.deep.equal({
                            path: "/clients"
                        });
                    });
            });
        });

    });
});