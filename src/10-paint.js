let strokeVal=0, strokeErasing=false;
// add or erase the ACTIVE layer type at a hex, decided by strokeErasing.
function applyTool(c,r){
  if(!inB(c,r)) return;
  const i=idx(c,r);
  if(strokeErasing){
    if(active.kind==="terrain") terrain[i]=0;
    else if(active.kind==="river") rivers[i]=0;
    else if(active.kind==="road") roads[i]=0;
    else if(active.kind==="veg") veg[i]=0;
    else if(active.kind==="entity") entity[i]=0;
  } else {
    if(active.kind==="terrain") terrain[i]=active.id;
    else if(active.kind==="river") rivers[i]=strokeVal;
    else if(active.kind==="road") roads[i]=strokeVal;
    else if(active.kind==="veg") veg[i]=strokeVal;
    else if(active.kind==="entity") entity[i]=active.id;
  }
  dirty=true;
}
function paintLine(c0,r0,c1,r1){
  const dc=c1-c0, dr=r1-r0, steps=Math.max(Math.abs(dc),Math.abs(dr));
  if(steps===0){ applyTool(c1,r1); return; }
  for(let s=0;s<=steps;s++) applyTool(Math.round(c0+dc*s/steps),Math.round(r0+dr*s/steps));
}
function floodFill(c,r){
  if(!inB(c,r) || active.kind!=="terrain") return false;
  const newVal=active.id, old=terrain[idx(c,r)]; if(old===newVal) return false;
  const seen=new Uint8Array(ROWS*COLS), stack=[[c,r]]; let n=0;
  while(stack.length){
    const [cc,rr]=stack.pop(); if(!inB(cc,rr)) continue; const i=idx(cc,rr); if(seen[i]||terrain[i]!==old) continue;
    seen[i]=1; terrain[i]=newVal; n++; if(n>ROWS*COLS) break;
    for(const [nc,nr] of neighbors(cc,rr)) stack.push([nc,nr]);
  }
  dirty=true; return n>0;
}
