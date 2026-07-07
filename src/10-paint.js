let strokeVal=0, curErase=false;
function paintHex(c,r){
  if(!inB(c,r)) return;
  const i=idx(c,r);
  if(curErase||active.kind==="erase"){
    terrain[i]=0; rivers[i]=0; roads[i]=0; veg[i]=0; entity[i]=0;
    texts=texts.filter(t=>{ const [tc,tr]=worldToHex(t.x,t.y); return !(tc===c&&tr===r); });
  } else {
    switch(active.kind){
      case "terrain": terrain[i]=active.id; break;
      case "river":   rivers[i]=strokeVal; break;
      case "road":    roads[i]=strokeVal; break;
      case "veg":     veg[i]=strokeVal; break;
      case "entity":  entity[i]=active.id; break;
    }
  }
  dirty=true;
}
function paintLine(c0,r0,c1,r1){
  const dc=c1-c0, dr=r1-r0, steps=Math.max(Math.abs(dc),Math.abs(dr));
  if(steps===0){ paintHex(c1,r1); return; }
  for(let s=0;s<=steps;s++) paintHex(Math.round(c0+dc*s/steps),Math.round(r0+dr*s/steps));
}
function floodFill(c,r){
  if(!inB(c,r)) return false;
  const newVal = active.kind==="erase" ? 0 : (active.kind==="terrain" ? active.id : null);
  if(newVal===null) return false;
  const old=terrain[idx(c,r)]; if(old===newVal) return false;
  const seen=new Uint8Array(ROWS*COLS), stack=[[c,r]]; let n=0;
  while(stack.length){
    const [cc,rr]=stack.pop(); if(!inB(cc,rr)) continue; const i=idx(cc,rr); if(seen[i]||terrain[i]!==old) continue;
    seen[i]=1; terrain[i]=newVal; n++; if(n>ROWS*COLS) break;
    for(const [nc,nr] of neighbors(cc,rr)) stack.push([nc,nr]);
  }
  dirty=true; return n>0;
}
