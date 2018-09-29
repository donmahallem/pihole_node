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
import { Observable } from "rxjs";

describe('src/helper/database-util', () => {

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
        describe('statementToList', () => {

            let stubInstance: sinon.SinonStubbedInstance<sqlite3.Statement>;
            let mockNext: sinon.SinonSpy;
            before(() => {
                mockNext = sinon.spy();
            });
            beforeEach(() => {
                stubInstance = sinon.createStubInstance(sqlite3.Statement);
            });
            afterEach(() => {
                expect(stubInstance.finalize.callCount).to.equal(1, "finalize should have been called every time once");
                mockNext.resetHistory();
            })
            after(() => {

            });
            it('should pass', function (done) {
                testObject.DatabaseUtil.statementToList(stubInstance)
                    .subscribe(mockNext, (err) => {
                        done(new Error("Should not have been called"));
                    }, () => {
                        expect(mockNext.callCount).to.equal(5, "next should have been called just once");
                        for (let i = 0; i < 5; i++) {
                            expect(mockNext.calledWith(i)).to.true;
                        }
                        done();
                    });
                expect(stubInstance.each.callCount).to.equal(1);
                const args: any[] = stubInstance.each.getCall(0).args;
                expect(args.length).to.equal(2);
                for (let i = 0; i < 5; i++) {
                    args[0](undefined, i);
                }
                args[1](undefined, 5);
            });
            it('should only pass items until error occured in complete', function (done) {
                const testError: Error = new Error("test error");
                testObject.DatabaseUtil.statementToList(stubInstance)
                    .subscribe(mockNext, (err) => {
                        expect(err).to.equal(testError);
                        expect(mockNext.callCount).to.equal(5, "next should have been called just once");
                        for (let i = 0; i < 5; i++) {
                            expect(mockNext.calledWith(i)).to.true;
                        }
                        done();
                    }, () => {
                        done(new Error("should not be called"));
                    });
                expect(stubInstance.each.callCount).to.equal(1);
                const args: any[] = stubInstance.each.getCall(0).args;
                expect(args.length).to.equal(2);
                for (let i = 0; i < 10; i++) {
                    if (i == 5) {
                        args[1](testError);
                    } else {
                        args[0](undefined, i);
                    }
                }
            });
            it('should only pass items until error occured in each callback', function (done) {
                const testError: Error = new Error("test error");
                testObject.DatabaseUtil.statementToList(stubInstance)
                    .subscribe(mockNext, (err) => {
                        expect(err).to.equal(testError);
                        expect(mockNext.callCount).to.equal(5, "next should have been called just once");
                        for (let i = 0; i < 5; i++) {
                            expect(mockNext.calledWith(i)).to.true;
                        }
                        done();
                    }, () => {
                        done(new Error("should not be called"));
                    });
                expect(stubInstance.each.callCount).to.equal(1);
                const args: any[] = stubInstance.each.getCall(0).args;
                expect(args.length).to.equal(2);
                for (let i = 0; i < 10; i++) {
                    if (i == 5) {
                        args[0](testError);
                    } else {
                        args[0](undefined, i);
                    }
                }
                args[1](testError);
            });
        });
        describe('runStatement', () => {

            let stubInstance: sinon.SinonStubbedInstance<sqlite3.Statement>;
            let mockNext: sinon.SinonSpy;
            before(() => {
                mockNext = sinon.spy();
            });
            beforeEach(() => {
                stubInstance = sinon.createStubInstance(sqlite3.Statement);
            });
            afterEach(() => {
                expect(stubInstance.finalize.callCount).to.equal(1, "finalize should have been called every time once");
                mockNext.resetHistory();
            })
            after(() => {

            });
            it('should pass', (done) => {
                testObject.DatabaseUtil.runStatement(stubInstance)
                    .subscribe(mockNext, (err) => {
                        done(new Error("should not be called"));
                    }, () => {
                        expect(mockNext.callCount).to.equal(0);
                        done();
                    });

                expect(stubInstance.run.callCount).to.equal(1);
                const args: any[] = stubInstance.run.getCall(0).args;
                expect(args.length).to.equal(1);
                args[0]();
            });
            it('should not call complete if errored', (done) => {
                const testError: Error = new Error("test error");
                testObject.DatabaseUtil.runStatement(stubInstance)
                    .subscribe(mockNext, (err) => {
                        expect(err).to.equal(testError);
                        expect(mockNext.callCount).to.equal(0);
                        done();
                    }, () => {
                        done(new Error("should not be called"));
                    });

                expect(stubInstance.run.callCount).to.equal(1);
                const args: any[] = stubInstance.run.getCall(0).args;
                expect(args.length).to.equal(1);
                args[0](testError);
            });
        });
    });
});