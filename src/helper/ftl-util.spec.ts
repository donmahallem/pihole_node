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

describe('src/helper/ftl-util', () => {

    describe("FTLUtil", () => {

        var ftlUtilInstance: testObject.FTLUtil;
        beforeEach(() => {
            ftlUtilInstance = new testObject.FTLUtil();
        });

        afterEach(() => {
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