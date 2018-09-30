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
import { Validator, ValidatorResult, ValidationError } from "jsonschema";
import * as supertest from 'supertest';

describe('routes/top/ads.endpoint', () => {
    describe('createTopAdsEndpoint', function () {
        var nextSpy: sinon.SinonSpy;
        var databaseStubbedInstance: sinon.SinonStubbedInstance<PiholeDatabase>;
        let createValidatorStub: sinon.SinonStub;
        let validatorInstanceStub: sinon.SinonStubbedInstance<Validator>
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
            validatorInstanceStub = sinon.createStubInstance(Validator);
            createValidatorStub.callsFake(() => {
                return validatorInstanceStub;
            });
            expressApp = express();
            expressApp.use(testObject.createTopAdsEndpoint(<any>databaseStubbedInstance));
            expressApp.use((a: any, b: express.Request, c: express.Response, d: express.NextFunction) => {
                catchAllStub(a, b, c, d);
                c.status(123);
                c.setHeader("Content-Type", "application/json");
                c.setHeader("a", "b");
                c.send("asdf");
            });
        });
        afterEach(() => {
            databaseStubbedInstance.getTopAds.resetHistory();
            createValidatorStub.reset();
            catchAllStub.resetHistory();
        });
        after(() => {
            createValidatorStub.restore();
        })


        it('should respond without query parameters', () => {
            const testValidationError: ValidationError = <any>{
                message: "test error message"
            };
            const testValidatorResult: ValidatorResult = <any>{
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
            const testValidationError: ValidationError = <any>{
                message: "test error message"
            };
            const testValidatorResult: ValidatorResult = <any>{
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

        it('should not pass with validatorerror present', () => {
            const testValidationError: ValidationError = <any>{
                message: "test error message"
            };
            const testValidatorResult: ValidatorResult = <any>{
                valid: false,
                errors: [testValidationError]
            }
            validatorInstanceStub.validate.returns(testValidatorResult);
            return supertest(expressApp)
                .get('')
                .then((res) => {
                    console.log(res.body, res.header);
                    expect(res.status).to.equal(123);
                    expect(catchAllStub.callCount).to.equal(1);
                    expect(catchAllStub.getCall(0).args[0].message).to.equal(RouteError.fromValidatorError(testValidationError).message);
                    //expect(res.body).to.deep.equal(testErrorResponse);
                });
        });
    });
});