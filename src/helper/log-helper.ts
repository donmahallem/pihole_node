import through2Spy = require("through2-spy");
import * as moment from "moment";
import stream = require('stream');
import fs = require("fs");
import split2 = require("split2");
import * as through2 from 'through2';
import {
    QueryTypes,
    Summary,
    ForwardDestinations,
    OvertimeData
} from "./../models";

export class Line {
    public readonly type: LineType;
    public readonly timestamp: string;

    constructor(type: LineType, timestamp: string) {
        this.type = type;
        this.timestamp = timestamp;
    }
    /**
     * Convert a log timestamp to a momentjs object
     * @param timestamp the timestamp to convert
     */
    public moment(): moment.Moment {
        return moment(this.timestamp, "MMM DD hh:mm:ss");
    }

}

export class QueryLine extends Line {
    public readonly domain: string;
    public readonly queryType: string;
    public readonly client: string;

    constructor(client: string, domain: string, timestamp: string, queryType: string) {
        super(LineType.QUERY, timestamp);
        this.client = client;
        this.domain = domain;
        this.queryType = queryType;
    }
}

export class BlockLine extends Line {
    public readonly domain: string;
    public readonly list: string;

    constructor(domain: string, timestamp: string, list: string) {
        super(LineType.BLOCK, timestamp);
        this.domain = domain;
        this.list = list;
    }
}
export class ForwardLine extends Line {
    public readonly domain: string;
    public readonly destination: string;
    constructor(timestamp: string, domain: string, destination: string) {
        super(LineType.FORWARD, timestamp);
        this.domain = domain;
        this.destination = destination;
    }
}


export enum LineType {
    QUERY = 1,
    BLOCK = 2,
    FORWARD = 3
}

export class LogHelper {
    public static createLogParser(): stream {
        let filename = "/var/log/pihole.log";
        return fs
            .createReadStream(filename)
            .pipe(split2())
            .pipe(through2.obj((chunk, enc, callback) => {
                callback(null, this.parseLine(chunk));
            }));
    }

    /**
     * Parses the provided line
     * @type {Function}
     * @param {String} line to parse
     * @returns {module:logHelper~Query|module:logHelper~Block|Boolean} the parsed line or false if not recognized
     */
    public static parseLine(line: string, parseMoment: boolean = false): Line | false {
        if (typeof line === "undefined" || line.trim() === "") {
            return false;
        }
        let time = line.substring(0, 16);
        if (parseMoment) {
            time = moment(time, "MMM DD hh:mm:ss").toISOString();
        }
        var infoStart = line.indexOf(": ");
        if (infoStart < 0) {
            return false;
        }
        var info = line.substring(infoStart + 2)
            .replace(/\s{2,}/g, " ")
            .trim();
        var split = info.split(" ");
        if (info.startsWith("query[")) {
            var domain = split[1];
            var type = split[0].substring(6, split[0].length - 1);
            var client = split[3];
            return new QueryLine(client, domain, time, type);
        } else if (split.length === 4 && split[0].match(/^(.*\/)gravity\.list$/)) {
            return new BlockLine(split[1], time, split[0]);
        } else if (split.length === 6 && split[2].match(/^(.*\/)gravity\.list$/)) {
            return new BlockLine(split[3], time, split[2]);
        } else if (info.startsWith("forwarded ")) {
            return new ForwardLine(time, split[1], split[3]);
        } else {
            return false;
        }
    }

    public static createSummarySpy(summary: Summary): stream.Transform {
        if (!summary.hasOwnProperty("adsBlockedToday")) {
            summary.adsBlockedToday = 0;
        }
        if (!summary.hasOwnProperty("dnsQueriesToday")) {
            summary.dnsQueriesToday = 0;
        }
        return through2Spy.obj(function (chunk) {
            if (chunk !== false && chunk.type === LineType.QUERY) {
                summary.dnsQueriesToday++;
            } else if (chunk !== false && chunk.type === LineType.BLOCK) {
                summary.adsBlockedToday++;
            }
        });
    }

    public static createQueryTypesSpy(queryTypes: QueryTypes): stream.Transform {
        return through2Spy.obj(function (chunk) {
            if (chunk === false || chunk.type !== LineType.QUERY) {
                return;
            } else if (queryTypes.hasOwnProperty(chunk.queryType)) {
                queryTypes[chunk.queryType]++;
            } else {
                queryTypes[chunk.queryType] = 1;
            }
        });
    }

    public static createOverTimeDataSpy(overTimeData: OvertimeData) {
        return through2Spy.obj(function (chunk) {
            if (chunk !== false && (chunk.type === LineType.BLOCK || chunk.type === LineType.QUERY)) {
                var timestamp = chunk.moment();
                var minute = timestamp.minute();
                var hour = timestamp.hour();
                var time = (minute - minute % 10) / 10 + 6 * hour;
                const type = chunk.type === LineType.BLOCK ? "ads" : "queries";
                if (overTimeData[type].hasOwnProperty(time)) {
                    overTimeData[type][time]++;
                } else {
                    overTimeData[type][time] = 1;
                }
            }
        });
    };

    public static createForwardDestinationsSpy(destinations: ForwardDestinations): stream.Transform {
        return through2Spy.obj(function (chunk) {
            if (chunk !== false && chunk.type === "forward") {
                if (destinations.hasOwnProperty(chunk.destination)) {
                    destinations[chunk.destination]++;
                } else {
                    destinations[chunk.destination] = 1;
                }
            }
        })
    }
} 