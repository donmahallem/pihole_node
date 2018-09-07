/*
	THIS NEEDS SOME SERIOUS FIXING!!
	There has to be a better way!!
	*/

/**
 * Module containing app defaults that are loaded at start
 * @namespace appDefaults
 * @property {String}  logFile - The default number of players.
 * @property {String}  setupVars         - The default level for the party.
 * @property {String}  whiteListFile      - The default treasure.
 * @property {String}  blackListFile - How much gold the party starts with.
 * @property {Number}  port - How much gold the party starts with.
 * @property {String}  csrfSecret - How much gold the party starts with.
 * @property {String}  jwtSecret - How much gold the party starts with.
 * @property {String}  cookieSecret - How much gold the party starts with.
 * @property {String}  gravityListFile - How much gold the party starts with.
 */

export class AppDefaults {
    logFile: string = "/var/log/pihole.log";
    setupVars: string = "/etc/pihole/setupVars.conf";
    whitelistFile: string = "/etc/pihole/whitelist.txt";
    blacklistFile: string = "/etc/pihole/blacklist.txt";
    gravityListFile: string = "/etc/pihole/list.preEventHorizon"
    wildcardBlacklistFile: string = "/etc/dnsmasq.d/03-pihole-wildcard.conf";
    port: number = 3000;
    csrfSecret: string;
    jwtSecret: string;
    cookieSecret: string;
}
