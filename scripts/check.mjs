import {readdirSync,statSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
function check(directory){for(const name of readdirSync(directory)){const file=join(directory,name);if(statSync(file).isDirectory())check(file);else if(file.endsWith('.js'))execFileSync(process.execPath,['--check',file],{stdio:'inherit'})}}
check('dist');console.log('All app JavaScript parses.');
