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
import * as testObject from "./clients.endpoint";
import * as httpMocks from "node-mocks-http";
import { of as rxjsOf } from "rxjs";
import * as supertest from 'supertest';
import * as commonUtil from './common-util';
import * as jsonschema from 'jsonschema';
import { sqlite3 } from "sqlite3";
import { PiholeDatabase } from "../../helper/pihole-database";
describe('routes/top/clients.endpoint', () => {
    describe('createTopClientsEndpoint', function () {
        let expressApp: express.Express;
        let createSchemaValidatorStub: sinon.SinonStub;
        let validatorStubInstance: sinon.SinonStubbedInstance<jsonschema.Validator>;
        let databaseInstanceStub: sinon.SinonStubbedInstance<PiholeDatabase>;
        before(function () {
            createSchemaValidatorStub = sinon.stub(testObject, "createSchemaValidator");
        });
        beforeEach(() => {
            expressApp = express();
            validatorStubInstance = sinon.createStubInstance(jsonschema.Validator);
            createSchemaValidatorStub.returns(validatorStubInstance);
            databaseInstanceStub = sinon.createStubInstance(PiholeDatabase);
        });
        afterEach(() => {
            expect(validatorStubInstance.validate.callCount).to.equal(1);
            expect(createSchemaValidatorStub.callCount).to.equal(1);
            createSchemaValidatorStub.reset();
        });
        after(() => {
            createSchemaValidatorStub.restore();
        })
        describe('schema is invalid', () => {
            let dbCallback: sinon.SinonStub;
            beforeEach(() => {
                dbCallback = sinon.stub();
                validatorStubInstance.validate.returns({
                    valid: false,
                    errors: [{ message: "test error message" }]
                });
            });
            afterEach(() => {
                dbCallback.resetHistory();
            });
            after(() => {

            });
            it('should respond with client present', () => {
                expressApp.all("/", testObject.createTopClientsEndpoint(<any>databaseInstanceStub));
                return supertest(expressApp)
                    .get("/")
                    .expect(401)
                    .then((data: supertest.Response) => {

                    });
            });
        });
        describe('schema is valid', () => {
            beforeEach(() => {
                validatorStubInstance.validate.returns({
                    valid: true
                });
                databaseInstanceStub.getTopClients.returns(rxjsOf("a", "b", "d"));
            });
            afterEach(() => {
                expect(databaseInstanceStub.getTopClients.callCount).to.equal(1);
                databaseInstanceStub.getTopClients.reset();
            });
            after(() => {

            });
            it('should respond default parameter values', () => {
                expressApp.all("/", testObject.createTopClientsEndpoint(<any>databaseInstanceStub));
                return supertest(expressApp)
                    .get("/")
                    .expect(200)
                    .then((data: supertest.Response) => {
                        expect(data.body).to.deep.equal({
                            data: ["a", "b", "d"]
                        });
                        expect(databaseInstanceStub.getTopClients.getCall(0).args).to.deep.equal([25, 0]);
                        expect(validatorStubInstance.validate.getCall(0).args).to
                            .deep.equal([{},
                            testObject.ClientsEndpointSchema]);
                    });
            });
            it('should respond with all parameters provided', () => {
                expressApp.all("/", testObject.createTopClientsEndpoint(<any>databaseInstanceStub));
                return supertest(expressApp)
                    .get("/")
                    .query({
                        offset: 12,
                        limit: 13
                    })
                    .expect(200)
                    .then((data: supertest.Response) => {
                        expect(data.body).to.deep.equal({
                            data: ["a", "b", "d"]
                        });
                        expect(databaseInstanceStub.getTopClients.getCall(0).args).to.deep.equal([13, 12]);
                        expect(validatorStubInstance.validate.getCall(0).args).to.deep.equal([{
                            offset: "12",
                            limit: "13"
                        }, testObject.ClientsEndpointSchema]);
                    });
            });
            it('should respond with all parameters provided except client', () => {
                expressApp.all("/", testObject.createTopClientsEndpoint(<any>databaseInstanceStub));
                return supertest(expressApp)
                    .get("/")
                    .query({
                        offset: 12,
                        limit: 13
                    })
                    .expect(200)
                    .then((data: supertest.Response) => {
                        expect(data.body).to.deep.equal({
                            data: ["a", "b", "d"]
                        });
                        expect(databaseInstanceStub.getTopClients.getCall(0).args).to.deep.equal([13, 12]);
                        expect(validatorStubInstance.validate.getCall(0).args).to.deep.equal([{
                            offset: "12",
                            limit: "13"
                        }, testObject.ClientsEndpointSchema]);
                    });
            });
        });

    });
});