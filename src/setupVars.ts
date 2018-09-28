import * as ini from 'ini';
import * as fs from 'fs';

module.exports = ini.parse(fs.readFileSync('defaults.setupVars', 'utf-8'));
