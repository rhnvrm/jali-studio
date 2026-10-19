(function(){
const $=s=>document.querySelector(s),api=window.jali;
let enabled=true;try{enabled=localStorage.getItem('jali-single-key-shortcuts')!=='off'}catch{}
const click=id=>{const button=document.getElementById(id);if(button&&!button.disabled)button.click()};
const shortcuts=[
 ['Tools','V','Select a cell or region'],['Tools','B','Paint with the block or combo brush'],['Tools','H','Pan the view'],['Tools','E','Erase brush'],['Tools','T','Rotate tool'],
 ['Edit','R / Shift R','Rotate selection clockwise / counterclockwise; rotates brush if nothing selected'],['Edit','] / [','Rotate brush clockwise / counterclockwise'],['Edit','F','Fill selected cells with the brush'],['Edit','Delete / Backspace','Remove selected cells'],['Edit','Ctrl / ⌘ A','Select all wall cells'],['Edit','Ctrl / ⌘ C / X / V','Copy / cut / paste cells within this tab'],['Edit','M','Move selection, then choose its top-left destination'],['Edit','Arrow keys','Move selection one cell; adjust placement preview'],['Edit','Enter','Place the pending paste or move'],['Edit','Shift drag · Ctrl / ⌘ click','Add a region / toggle individual cells'],['Edit','Esc','Clear selection / close a panel'],['Edit','Ctrl / ⌘ Z','Undo'],['Edit','Ctrl / ⌘ Shift Z · Ctrl Y','Redo'],
 ['View','1 / 2','Edit wall / preview in space'],['View','+ / −','Zoom elevation'],['View','0','Fit elevation or reset 3D camera'],['View','?','Show this guide']
];
function showHelp(){const previous=document.activeElement;$('#modalTitle').textContent='Keyboard shortcuts';$('#modalContent').innerHTML='<div class="shortcut-guide">'+['Tools','Edit','View'].map(group=>'<h3>'+group+'</h3><dl>'+shortcuts.filter(row=>row[0]===group).map(row=>'<div><dt><kbd>'+row[1]+'</kbd></dt><dd>'+row[2]+'</dd></div>').join('')+'</dl>').join('')+'<label class="shortcut-toggle"><input type="checkbox" id="singleKeyShortcuts"> Enable single-key shortcuts</label><p class="small muted">Shortcuts pause while typing or when a dialog is open. Undo and redo stay available when single-key shortcuts are disabled.</p></div>';$('#singleKeyShortcuts').checked=enabled;$('#singleKeyShortcuts').onchange=e=>{enabled=e.target.checked;try{localStorage.setItem('jali-single-key-shortcuts',enabled?'on':'off')}catch{}};$('#modal').addEventListener('close',()=>{if(previous?.isConnected)previous.focus()},{once:true});$('#modal').showModal()}
$('#keyboardHelp').onclick=showHelp;
const hints={'[data-tool="select"]':['V','Select a cell or region'],'[data-tool="paint"]':['B','Paint'],'[data-tool="pan"]':['H','Pan the view'],'[data-tool="erase"]':['E','Erase'],'[data-tool="rotate"]':['T','Rotate tool'],'#hudRotateLeft':['[','Rotate brush counterclockwise'],'#hudRotateRight':[']','Rotate brush clockwise'],'#hudFillSelection':['F','Fill selection'],'#rotateLeft':['Shift+R','Rotate selection counterclockwise'],'#rotateRight':['R','Rotate selection clockwise'],'#removeSelected':['Delete','Remove selection'],'#view2d':['1','Edit wall'],'#view3d':['2','Preview in space'],'#undo':['Control+Z Meta+Z','Undo'],'#redo':['Control+Shift+Z Meta+Shift+Z Control+Y','Redo']};
for(const [selector,[key,label]]of Object.entries(hints)){const button=$(selector);button.setAttribute('aria-keyshortcuts',key);button.title=label+' ('+key.replaceAll('Control','Ctrl').replaceAll('Meta','⌘')+')'}
document.addEventListener('keydown',e=>{
 if(e.defaultPrevented||e.isComposing||e.repeat||e.altKey||e.target.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"]')||e.target.isContentEditable||document.querySelector('dialog[open]'))return;
 const key=e.key.toLowerCase(),mod=e.ctrlKey||e.metaKey;
 if(mod){if(api.clipboard&&!e.shiftKey&&['a','c','x','v'].includes(key)){e.preventDefault();({a:api.clipboard.selectAll,c:api.clipboard.copy,x:api.clipboard.cut,v:api.clipboard.paste})[key]();return}if(key==='z'){e.preventDefault();api.history(e.shiftKey?'redo':'undo')}else if(key==='y'&&!e.shiftKey){e.preventDefault();api.history('redo')}return}
 if(!enabled)return;
 const tools={v:'select',b:'paint',h:'pan',e:'erase',t:'rotate'};
 if(tools[key]){e.preventDefault();if(api.view!=='2d')click('view2d');api.setTool(tools[key]);return}
 let handled=true;const moves={arrowup:[-1,0],arrowdown:[1,0],arrowleft:[0,-1],arrowright:[0,1]};if(api.clipboard&&moves[key]&&api.view==='2d'&&(api.selection||api.clipboard.pending)){e.preventDefault();api.clipboard.nudge(...moves[key]);return}if(api.clipboard?.pending&&key==='enter'){e.preventDefault();api.clipboard.commit();return}
 if(key==='r'){if(api.selection)api.rotate(e.shiftKey?-90:90);else click(e.shiftKey?'hudRotateLeft':'hudRotateRight')}
 else if(key==='['||key===']')click(key==='['?'hudRotateLeft':'hudRotateRight');
 else if(key==='f'){if(api.selection)api.fillSelection();else handled=false}
 else if(key==='delete'||key==='backspace'){if(api.selection)api.fillSelection(true);else handled=false}
 else if(key==='m')api.clipboard?.move();else if(key==='escape'){if(api.clipboard?.pending)api.clipboard.cancel();else api.clearSelection()}
 else if(key==='1')click('view2d');
 else if(key==='2')click('view3d');
 else if(key==='+'||key==='='||key==='-'){if(api.view==='2d')click(key==='-'?'zoomOut':'zoomIn');else handled=false}
 else if(key==='0')click(api.view==='2d'?'zoomReset':'resetCamera');
 else if(key==='?')showHelp();
 else handled=false;
 if(handled)e.preventDefault();
});
})();
