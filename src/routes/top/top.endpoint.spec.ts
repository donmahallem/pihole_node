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
import * as testObject from "./top.endpoint";
import * as httpMocks from "node-mocks-http";
import { of as rxjsOf } from "rxjs";
import * as supertest from 'supertest';
import * as commonUtil from './common-util';
import * as jsonschema from 'jsonschema';
describe('routes/top/top.endpoint', () => {
    describe('createTopEndpoint', function () {
        let expressApp: express.Express;
        let createSchemaValidatorStub: sinon.SinonStub;
        let validatorStubInstance: sinon.SinonStubbedInstance<jsonschema.Validator>;
        before(function () {
            createSchemaValidatorStub = sinon.stub(commonUtil.CommonUtil, "createSchemaValidator");
        });
        beforeEach(() => {
            expressApp = express();
            validatorStubInstance = sinon.createStubInstance(jsonschema.Validator);
            createSchemaValidatorStub.returns(validatorStubInstance);
        });
        afterEach(() => {
            expect(createSchemaValidatorStub.callCount).to.equal(1);
            expect(createSchemaValidatorStub.getCall(0).args).to.deep.equal([true, true, true]);
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
                expressApp.all("/", testObject.createTopEndpoint(dbCallback));
                return supertest(expressApp)
                    .get("/")
                    .expect(401)
                    .then((data: supertest.Response) => {

                    });
            });
        });
        describe('schema is valid', () => {
            let dbCallback: sinon.SinonStub;
            beforeEach(() => {
                dbCallback = sinon.stub();
                validatorStubInstance.validate.returns({
                    valid: true
                });
                dbCallback.returns(rxjsOf("a", "b", "d"));
            });
            afterEach(() => {
                expect(dbCallback.callCount).to.equal(1);
                dbCallback.resetHistory();
            });
            after(() => {

            });
            it('should respond default parameter values', () => {
                expressApp.all("/", testObject.createTopEndpoint(dbCallback));
                return supertest(expressApp)
                    .get("/")
                    .expect(200)
                    .then((data: supertest.Response) => {
                        expect(data.body).to.deep.equal({
                            data: ["a", "b", "d"]
                        });
                        expect(dbCallback.getCall(0).args).to.deep.equal([25, 0]);
                    });
            });
            it('should respond with all parameters provided', () => {
                expressApp.all("/", testObject.createTopEndpoint(dbCallback));
                return supertest(expressApp)
                    .get("/")
                    .query({
                        offset: 12,
                        limit: 13,
                        client: "test_client"
                    })
                    .expect(200)
                    .then((data: supertest.Response) => {
                        expect(data.body).to.deep.equal({
                            data: ["a", "b", "d"]
                        });
                        expect(dbCallback.getCall(0).args).to.deep.equal([13, 12, "test_client"]);
                    });
            });
            it('should respond with all parameters provided except client', () => {
                expressApp.all("/", testObject.createTopEndpoint(dbCallback));
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
                        expect(dbCallback.getCall(0).args).to.deep.equal([13, 12]);
                    });
            });
        });

    });
});