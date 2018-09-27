import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import * as testObject from './ftl-util';
import {
    RouteError
} from "../routes/route-error";
import * as bcrypt from "bcrypt";
import * as rxjsOperator from "rxjs/operators";
import * as rxjs from 'rxjs';
import * as netPackage from 'net';
import { EventEmitter } from "events";

describe('src/helper/ftl-util', () => {

    describe("FTLUtil", () => {

        beforeEach(() => {
        });

        afterEach(() => {
        });

        describe("sendRequest", () => {

            let socketInstance: sinon.SinonStub;
            let socketStubInstance: sinon.SinonStubbedInstance<netPackage.Socket>;
            let nextSpy: sinon.SinonSpy;
            before(() => {
                socketInstance = sinon.stub(netPackage, "Socket").callsFake(() => {
                    return socketStubInstance;
                });
                nextSpy = sinon.spy();
            });
            beforeEach(() => {
                socketStubInstance = <any>sinon.createStubInstance(netPackage.Socket);
                //for some reason the stubedinstance doesnt provide ANY method
                socketStubInstance.on = <any>sinon.stub();
                socketStubInstance.connect = <any>sinon.stub();
                console.log(socketStubInstance);
            });
            afterEach(() => {
                socketInstance.resetHistory();
                nextSpy.resetHistory();
            });
            after(() => {
                socketInstance.restore();
            });
            it('should get and transform the data correctly for a list', function (done) {
                testObject.FTLUtil.sendRequest("JJ").subscribe(nextSpy, done, () => {
                    socketInstance.calledWith("error");
                    done();
                });
                this.timeout(1000);
                expect(socketStubInstance.on.callCount).to.equal(4);
                expect(socketStubInstance.on.getCall(1).args[0]).to.equal("data");
                let dataCallback: any = socketStubInstance.on.getCall(1).args[1];
                dataCallback("a");
                dataCallback("b");
                expect(socketStubInstance.on.getCall(2).args[0]).to.equal("close");
                let completeCallback: any = socketStubInstance.on.getCall(2).args[1];
                completeCallback();

            });
        });
        describe("getStats", () => {

            const testData: string[] = ["domains_being_blocked 130560",
                "",
                "dns_queries_today 2748",
                "ads_blocked_today 753",
                "ads_percentage_today 27.401747",
                "unique_domains 423",
                "queries_forwarded 1792",
                "queries_cached 203",
                "clients_ever_seen 7",
                "unique_clients 7",
                "dns_queries_all_types 2771",
                "reply_NODATA 19",
                "reply_NXDOMAIN 9",
                "reply_CNAME 190",
                "reply_IP 429",
                "status enabled",
                undefined,
                "---EOM---"];
            const testDataResult: any = {
                "domains_being_blocked": 130560,
                "dns_queries_today": 2748,
                "ads_blocked_today": 753,
                "ads_percentage_today": 27.401747,
                "unique_domains": 423,
                "queries_forwarded": 1792,
                "queries_cached": 203,
                "clients_ever_seen": 7,
                "unique_clients": 7,
                "dns_queries_all_types": 2771,
                "reply_NODATA": 19,
                "reply_NXDOMAIN": 9,
                "reply_CNAME": 190,
                "reply_IP": 429,
                "status": "enabled"
            };
            var stubSendRequest: sinon.SinonStub;

            beforeEach(() => {
                stubSendRequest = sinon.stub(testObject.FTLUtil, "sendRequest");
            });

            afterEach(() => {
                stubSendRequest.restore();
            });
            it('should get and transform the data correctly for a list', (done) => {

                stubSendRequest.callsFake(() => {
                    return rxjs.from(testData);
                });
                testObject.FTLUtil.getStats()
                    .subscribe((dat) => {
                        expect(dat).to.deep.equal(testDataResult);
                        expect(stubSendRequest.callCount).to.equal(1);
                    }, (err) => {
                        done(err);
                    }, () => {
                        done();
                    })
            });
            it('should get and transform the data correctly for a single item', (done) => {

                stubSendRequest.callsFake(() => {
                    return rxjs.from(["test 129"]);
                });
                testObject.FTLUtil.getStats()
                    .subscribe((dat) => {
                        expect(dat).to.deep.equal({
                            test: 129
                        });
                        expect(stubSendRequest.callCount).to.equal(1);
                    }, (err) => {
                        done(err);
                    }, () => {
                        done();
                    })
            });
        });
    });
});