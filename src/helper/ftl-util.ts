import { Socket } from 'net';
import {
    Observable,
    Observer,
    from
} from 'rxjs';
import {
    merge,
    reduce,
    filter,
    map
} from 'rxjs/operators';

export class FTLUtil {

    public static sendRequest(req: string, host: string = 'localhost', port: number = 4711): Observable<any> {
        return Observable.create((pub: Observer<any>) => {

            var client = new Socket();
            client.on('error', (err: Error) => {
                if (pub.closed) {
                    return;
                }
                pub.error(err);
            });
            client.on('data', (data: Buffer) => {
                if (pub.closed) {
                    return;
                }
                pub.next(data.toString("utf-8"));
            });

            client.on('close', () => {
                if (pub.closed) {
                    return;
                }
                pub.complete();
            });
            client.on('connect', () => {
                //client.write(req);
                client.end(req);
            });
            client.connect(port, host);

        });
    }

    public static getStats(host: string = 'localhost', port: number = 4711): Observable<any> {
        const intRegex: RegExp = /^[0-9]+$/;
        const floatRegex: RegExp = /^[0-9]+\.[0-9]*$/;
        return this.sendRequest('>stats', host, port)
            .pipe(map((item: string) => {
                if (item !== undefined) {
                    return item.trim();
                }
            }), filter((item: string): boolean => {
                const a: RegExp = /^[a-zA-Z\_]+ ([0-9\.]+|enabled|disabled)$/;
                return a.test(item);
            }), map((item: string) => {
                const parts: any = item.split(' ');
                return parts;
            }), filter((values: string[]) => {
                return values.length === 2;
            }), map((values: any[]) => {
                if (intRegex.test(values[1])) {
                    values[1] = parseInt(values[1]);
                } else if (floatRegex.test(values[1])) {
                    values[1] = parseFloat(values[1]);
                }
                return values;
            }), reduce((acc: any, item: any[]) => {
                if (Array.isArray(acc)) {
                    const obj: any = {};
                    obj[acc[0]] = acc[1];
                    obj[item[0]] = item[1];
                    return obj;
                } else {
                    acc[item[0]] = item[1];
                    return acc;
                }
            }));
    }
}