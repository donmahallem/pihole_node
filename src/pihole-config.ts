export interface PiholeConfig {
    logFile?: string;
    setupVars?: string;
    whitelistFile?: string;
    blacklistFile?: string;
    gravityListFile?: string;
    wildcardBlacklistFile?: string;
    port?: number;
    csrfSecret?: string;
    jwtSecret?: string;
    cookieSecret?: string;
}


export const loadConfig = (): PiholeConfig => {

    let config: PiholeConfig = {};
    config.logFile = '/var/log/pihole.log';
    config.setupVars = '/etc/pihole/setupVars.conf';
    config.whitelistFile = '/etc/pihole/whitelist.txt';
    config.blacklistFile = '/etc/pihole/blacklist.txt';
    config.gravityListFile = '/etc/pihole/list.preEventHorizon'
    config.wildcardBlacklistFile = '/etc/dnsmasq.d/03-pihole-wildcard.conf';
    config.port = 3000;
    return config;
}