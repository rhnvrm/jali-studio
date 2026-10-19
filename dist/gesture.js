// A tap must remain a single, short, stationary pointer gesture.
export function createTapTracker(threshold=7){const pointers=new Map();let multi=false;return {
down(e){if(e.pointerType==='mouse'&&e.button!==0)return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,time:e.timeStamp||0,moved:false});if(pointers.size>1)multi=true},
move(e){const p=pointers.get(e.pointerId);if(p&&Math.hypot(e.clientX-p.x,e.clientY-p.y)>threshold)p.moved=true},
up(e){const p=pointers.get(e.pointerId),tap=!!p&&pointers.size===1&&!multi&&!p.moved&&Math.hypot(e.clientX-p.x,e.clientY-p.y)<=threshold&&((e.timeStamp||0)-p.time)<650;pointers.delete(e.pointerId);if(!pointers.size)multi=false;return tap},
cancel(e){pointers.delete(e.pointerId);multi=true;if(!pointers.size)multi=false}
}}
