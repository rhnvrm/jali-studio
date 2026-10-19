import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {JSDOM} from 'jsdom';
const root=path.resolve(import.meta.dirname,'../dist'),base=new URL('https://rhnvrm.github.io/jali-studio/'),w=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:base.href,runScripts:'outside-only'}).window;
function resource(value){const url=new URL(value,base);if(url.origin!==base.origin)return;assert(url.pathname.startsWith(base.pathname),value+' escapes the Pages subpath');assert(fs.statSync(path.join(root,decodeURIComponent(url.pathname.slice(base.pathname.length)))).isFile(),value+' must exist')}
for(const element of w.document.querySelectorAll('script[src],link[rel="stylesheet"][href]'))resource(element.getAttribute('src')||element.getAttribute('href'));
const imports=JSON.parse(w.document.querySelector('script[type="importmap"]').textContent).imports;for(const value of Object.values(imports))resource(value);
w.eval(fs.readFileSync(path.join(root,'catalog.js'),'utf8'));for(const entry of w.jaliCatalog.entries)resource('catalog/'+entry.photo);
console.log('PASS: scripts, styles, module import map and catalogue photos resolve under /jali-studio/.');w.close();
