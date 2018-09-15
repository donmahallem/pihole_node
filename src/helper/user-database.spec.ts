import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import * as testObject from './user-database';
import {
    RouteError
} from "../routes/route-error";
import * as bcrypt from "bcrypt";

describe('src/helper/user-database', () => {

    describe("setPassword", () => {

        var mockBcrypt: sinon.SinonStub;
        beforeEach(() => {
            mockBcrypt = sinon.stub(bcrypt, "hash");
        });

        afterEach(() => {
            mockBcrypt.restore();
        });
        it('should pass and encrypt password with default parameter', (done) => {
            mockBcrypt.returns(new Promise<string>((resolve, reject) => {
                resolve("success");
            }));
            let asdf: testObject.UserDatabase = new testObject.UserDatabase();
            let resultSpy: sinon.SinonSpy = sinon.spy();
            let testResult = (err?: Error) => {
                expect(err).to.not.exist;
                expect(mockBcrypt.callCount).to.equal(1);
                expect(mockBcrypt.getCall(0).args).to.deep.equal(["asdfaf", 12]);
                expect(resultSpy.callCount).to.equal(1);
                expect(resultSpy.getCall(0).args).to.deep.equal(["success"]);
                done();
            };
            asdf.createHashedPassword("asdfaf")
                .subscribe(resultSpy, testResult, testResult);
        });
        it('should pass and encrypt password with extra parameter', (done) => {
            mockBcrypt.returns(new Promise<string>((resolve, reject) => {
                resolve("success");
            }));
            let asdf: testObject.UserDatabase = new testObject.UserDatabase();
            let resultSpy: sinon.SinonSpy = sinon.spy();
            let testResult = (err?: Error) => {
                expect(err).to.not.exist;
                expect(mockBcrypt.callCount).to.equal(1);
                expect(mockBcrypt.getCall(0).args).to.deep.equal(["asdfaf", 24]);
                expect(resultSpy.callCount).to.equal(1);
                expect(resultSpy.getCall(0).args).to.deep.equal(["success"]);
                done();
            };
            asdf.createHashedPassword("asdfaf", 24)
                .subscribe(resultSpy, testResult, testResult);
        });
        it('should create a hashed password', (done) => {
            mockBcrypt.returns(new Promise<string>((resolve, reject) => {
                reject(new Error("random problem"));
            }));
            let asdf: testObject.UserDatabase = new testObject.UserDatabase();
            let resultSpy: sinon.SinonSpy = sinon.spy();
            let testResult = (err?: Error) => {
                expect(err).to.exist;
                expect(err.message).to.equal("random problem");
                expect(mockBcrypt.callCount).to.equal(1);
                expect(mockBcrypt.getCall(0).args).to.deep.equal(["asdfaf", 12]);
                expect(resultSpy.callCount).to.equal(0);
                done();
            };
            asdf.createHashedPassword("asdfaf")
                .subscribe(resultSpy, testResult, testResult);
        });
    });
});