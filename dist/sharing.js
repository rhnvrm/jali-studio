(function(){
const $=s=>document.querySelector(s);
function currentLink(){const data={design:JSON.parse(JSON.stringify(window.jali.state)),lightStudy:window.jaliStudy.get()},url=new URL(location.href);url.search='';url.hash='design='+window.jaliShareCodec.encode(data);return url.href}
function feedback(text){$('#shareFeedback').textContent=text}
async function copyLink(link){try{await navigator.clipboard.writeText(link);feedback('Link copied. Anyone can open it and edit their own copy.')}catch{const input=$('#shareURL');input.focus();input.select();feedback('Select and copy the link above.')}}
$('#shareDesign').onclick=()=>{try{const link=currentLink();$('#modalTitle').textContent='Share an editable design';$('#modalContent').innerHTML='<div class="share-panel"><p>Send this link to anyone. It contains the wall, dimensions, custom combos and light-study settings.</p><label for="shareURL">Editable design link</label><textarea id="shareURL" readonly rows="3"></textarea><div class="share-actions"><button id="copyShare" class="primary">Copy link</button><button id="nativeShare">Share…</button></div><p id="shareFeedback" role="status">Each person edits their own copy. Changes won’t alter this shared snapshot.</p><p class="small muted">After making more edits, use Share again to create an updated link.</p></div>';$('#shareURL').value=link;$('#nativeShare').hidden=typeof navigator.share!=='function';$('#copyShare').onclick=()=>copyLink(link);$('#nativeShare').onclick=async()=>{try{await navigator.share({title:'Jali wall design',text:'Open this jali design and continue editing it.',url:link})}catch(e){if(e.name!=='AbortError')await copyLink(link)}};$('#modal').showModal()}catch(e){$('#modalTitle').textContent='Could not create share link';$('#modalContent').textContent=e.message;$('#modal').showModal()}};
$('#dismissShared').onclick=()=>$('#sharedBanner').hidden=true;
let loadedHash=null;
function importError(message){$('#modalTitle').textContent='Could not open shared design';$('#modalContent').textContent=message;$('#modal').showModal()}
function clearImportedHash(){try{window.history.replaceState(null,'',window.location.pathname+window.location.search)}catch{try{window.location.hash=''}catch{}}}
function loadHash(){const hash=window.location.hash;if(!hash.startsWith('#design=')||hash===loadedHash)return false;let payload;
try{payload=window.jaliShareCodec.decode(hash.slice(8));if(!window.jali.validateDesign(payload.design)||payload.lightStudy&&!window.jaliStudy.validate(payload.lightStudy))throw Error('This shared design is invalid or uses unsupported blocks.')}catch(e){importError(e.message+' Your current design is unchanged.');return false}
let wallLoaded=false;try{window.jali.loadDesign(payload.design);wallLoaded=true;if(payload.lightStudy)window.jaliStudy.set(payload.lightStudy)}catch(e){importError(e.message+(wallLoaded?' The wall was loaded, but its light settings could not be applied. Use Undo to restore your previous wall.':' Your current design is unchanged.'));return false}
loadedHash=hash;$('#sharedBanner').hidden=false;clearImportedHash();return true;
}
window.jaliSharing={getLink:currentLink,loadHash};loadHash();window.addEventListener('hashchange',loadHash);
})();
