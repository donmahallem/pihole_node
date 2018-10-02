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
import * as testObject from "./ads.endpoint";
import * as httpMocks from "node-mocks-http";
import { PiholeDatabase } from "../../helper/pihole-database";
import { of as rxjsOf } from "rxjs";
import * as jsonschema from "jsonschema";
import * as supertest from 'supertest';

describe('routes/top/ads.endpoint', () => {
    describe('createTopAdsEndpointSchemaValidator', () => {
        let testValidator: jsonschema.Validator;

        beforeEach(() => {
            testValidator = testObject.createTopAdsEndpointSchemaValidator();
        });
        afterEach(() => {
        });
        it('should filter all', () => {
            const testData: any = {
                limit: 12,
                offset: 29
            };
            const result: jsonschema.ValidatorResult = testValidator.validate(testData, testObject.TopAdsEndpointSchema);
            expect(result.valid).to.be.true;
        });
        it('should fail for negative numbers', () => {
            const testData: any = {
                limit: -12,
                offset: -29
            };
            const result: jsonschema.ValidatorResult = testValidator.validate(testData, testObject.TopAdsEndpointSchema);
            expect(result.valid).to.not.be.true;
            expect(result.errors.length).to.equal(2);
        });
        it('should fail for limit larger than 50', () => {
            const testData: any = {
                limit: 51,
                offset: 12
            };
            const result: jsonschema.ValidatorResult = testValidator.validate(testData, testObject.TopAdsEndpointSchema);
            expect(result.valid).to.not.be.true;
            expect(result.errors.length).to.equal(1);
        });
        it('should fail for offset smaller than 0', () => {
            const testData: any = {
                offset: -1
            };
            const result: jsonschema.ValidatorResult = testValidator.validate(testData, testObject.TopAdsEndpointSchema);
            expect(result.valid).to.not.be.true;
            expect(result.errors.length).to.equal(1);
        });
    });
    describe('createTopAdsEndpoint', function () {
        var nextSpy: sinon.SinonSpy;
        var databaseStubbedInstance: sinon.SinonStubbedInstance<PiholeDatabase>;
        let createValidatorStub: sinon.SinonStub;
        let validatorInstanceStub: sinon.SinonStubbedInstance<jsonschema.Validator>
        let expressApp: express.Express;
        let catchAllStub: sinon.SinonSpy;
        const testErrorResponse: any = {
            randomError: true
        };
        before(function () {
            nextSpy = sinon.spy();
            databaseStubbedInstance = sinon.createStubInstance(PiholeDatabase);
            databaseStubbedInstance.getTopAds
                .callsFake(() => {
                    return rxjsOf({ "test": "object" });
                });
            createValidatorStub = sinon.stub(testObject, "createTopAdsEndpointSchemaValidator");
            catchAllStub = sinon.stub();
        });
        beforeEach(() => {
            validatorInstanceStub = sinon.createStubInstance(jsonschema.Validator);
            createValidatorStub.callsFake(() => {
                return validatorInstanceStub;
            });
            expressApp = express();
            expressApp.use(testObject.createTopAdsEndpoint(<any>databaseStubbedInstance));
            expressApp.use((a: any, b: express.Request, c: express.Response, d: express.NextFunction) => {
                catchAllStub(a, b, c, d);
                c.setHeader('Content-Type', 'application/json');
                d(a);
            });
        });
        afterEach(() => {
            expect(validatorInstanceStub.validate.callCount).to.equal(1);
            expect(validatorInstanceStub.validate.getCall(0).args[1]).to.deep.equal(testObject.TopAdsEndpointSchema);
            databaseStubbedInstance.getTopAds.resetHistory();
            createValidatorStub.reset();
            catchAllStub.resetHistory();
        });
        after(() => {
            createValidatorStub.restore();
        })


        it('should respond without query parameters', () => {
            const testValidationError: jsonschema.ValidationError = <any>{
                message: "test error message"
            };
            const testValidatorResult: jsonschema.ValidatorResult = <any>{
                valid: true,
                errors: [testValidationError]
            }
            validatorInstanceStub.validate.returns(testValidatorResult);
            return supertest(expressApp)
                .get('')
                .query({})
                .then((res) => {
                    expect(catchAllStub.callCount).to.equal(0);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.deep.equal({ data: [{ "test": "object" }] });
                    expect(databaseStubbedInstance.getTopAds.callCount).to.equal(1, "getTopAds should just be called once");
                    let call = databaseStubbedInstance.getTopAds.getCall(0);
                    expect(call.args).to.deep.equal([25, 0]);
                });
        });

        it('should respond without limit and offset parameters present', () => {
            const testValidationError: jsonschema.ValidationError = <any>{
                message: "test error message"
            };
            const testValidatorResult: jsonschema.ValidatorResult = <any>{
                valid: true,
                errors: [testValidationError]
            }
            validatorInstanceStub.validate.returns(testValidatorResult);
            return supertest(expressApp)
                .get('')
                .query({
                    limit: 12,
                    offset: 10
                })
                .then((res) => {
                    expect(catchAllStub.callCount).to.equal(0);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.deep.equal({ data: [{ "test": "object" }] });
                    expect(databaseStubbedInstance.getTopAds.callCount).to.equal(1, "getTopAds should just be called once");
                    let call = databaseStubbedInstance.getTopAds.getCall(0);
                    expect(call.args).to.deep.equal([12, 10]);
                });
        });
        it('should respond without limit, offset and client parameters present', () => {
            const testValidationError: jsonschema.ValidationError = <any>{
                message: "test error message"
            };
            const testValidatorResult: jsonschema.ValidatorResult = <any>{
                valid: true,
                errors: [testValidationError]
            }
            validatorInstanceStub.validate.returns(testValidatorResult);
            return supertest(expressApp)
                .get('')
                .query({
                    limit: 12,
                    offset: 10,
                    client: "test_client"
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res: supertest.Response) => {
                    expect(catchAllStub.callCount).to.equal(0);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.deep.equal({ data: [{ "test": "object" }] });
                    expect(databaseStubbedInstance.getTopAds.callCount).to.equal(1, "getTopAds should just be called once");
                    let call = databaseStubbedInstance.getTopAds.getCall(0);
                    expect(call.args).to.deep.equal([12, 10, "test_client"]);
                });
        });

        it('should not pass with validatorerror present', () => {
            const testValidationError: jsonschema.ValidationError = <any>{
                message: "test error message"
            };
            const testValidatorResult: jsonschema.ValidatorResult = <any>{
                valid: false,
                errors: [testValidationError]
            }
            validatorInstanceStub.validate.returns(testValidatorResult);
            return supertest(expressApp)
                .get('/')
                .set('Accept', 'application/json')
                .then((res: supertest.Response) => {
                    expect(res.status).to.equal(401);
                    expect(catchAllStub.callCount).to.equal(1);
                    expect(databaseStubbedInstance.getTopAds.callCount).to.equal(0, "getTopAds should just be called once");
                    expect(catchAllStub.getCall(0).args[0].message).to.equal(RouteError.fromValidatorError(testValidationError).message);
                    //expect(res.body).to.deep.equal(testErrorResponse);
                });
        });
    });
});