import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import * as testObject from './database-util';
import {
    RouteError
} from "../routes/route-error";
import * as sqlite3 from "sqlite3";

describe('src/helper/pihole-database', () => {

    describe("DatabaseUtil", () => {
        describe("prepareStatement", () => {
            var databaseStub: sinon.SinonStubbedInstance<sqlite3.Database>;
            var mockRequest;
            var mockResponse;
            var mockNext: sinon.SinonSpy;
            const testCompiledStatement = { "any": "random", "statement": "is valid" };
            beforeEach((done) => {
                mockRequest = sinon.mock({});
                mockResponse = sinon.mock({});
                mockNext = sinon.spy();
                databaseStub = sinon.createStubInstance(sqlite3.Database);
                databaseStub.serialize.callsArg(0);
                databaseStub.prepare.returns(testCompiledStatement);
                done();
                //mockRequest.expects("method").once().throws();
            });

            afterEach(() => {
                //mockRequest.verify();
                //mockResponse.verify();
            });
            it('should pass without query arguments', (done) => {
                const testStatement: string = "any statemenet";
                const testParams: any[] = [1, 2, "any"];
                testObject.DatabaseUtil.prepareStatement(databaseStub, testStatement, testParams)
                    .subscribe(mockNext, (err) => {
                        done(err);
                    }, () => {
                        expect(mockNext.callCount).to.equal(1, "next should have been called just once");
                        expect(mockNext.getCall(0).args).to.deep.equal([testCompiledStatement], "the test stateent should be returned");
                        expect(databaseStub.prepare.calledWithExactly(testStatement, testParams));
                        expect(databaseStub.prepare.callCount).to.equal(1);
                        expect(databaseStub.serialize.callCount).to.equal(1);
                        done();
                    });
            });
        });
    });
});