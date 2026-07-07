function overlayMids(arr, c, r, matchVal){
  const ns=neighbors(c,r), mids=[];
  for(let d=0;d<6;d++){ const [nc,nr]=ns[d]; if(inB(nc,nr)&&arr[idx(nc,nr)]===matchVal) mids.push(d); }
  return mids;
}
// draw the overlay segments for one tile. 2 connections => a quadratic curve
// through the centre (smooth bend); 1 => straight stub (terminates at centre,
// per the river rule); 3+ => straight spokes from the centre (branch hub).
function drawSegments(g, cx, cy, mids){
  if(!mids.length) return;
  if(mids.length===2){
    const [ax,ay]=EDGE_MID[mids[0]], [bx,by]=EDGE_MID[mids[1]];
    g.beginPath(); g.moveTo(cx+ax,cy+ay); g.quadraticCurveTo(cx,cy,cx+bx,cy+by); g.stroke();
    return;
  }
  // 1 or 3+: join FAR (opposite) edges as straight through-lines first, then
  // adjacent edges as smooth curves, then anything left as a centre spoke.
  const present=new Set(mids), used=new Set();
  for(const d of mids){
    if(used.has(d)) continue;
    const o=(d+3)%6;
    if(present.has(o)&&!used.has(o)){ used.add(d); used.add(o); const [ax,ay]=EDGE_MID[d],[bx,by]=EDGE_MID[o]; g.beginPath(); g.moveTo(cx+ax,cy+ay); g.lineTo(cx+bx,cy+by); g.stroke(); }
  }
  for(const d of mids){
    if(used.has(d)) continue;
    const a=(d+1)%6;
    if(present.has(a)&&!used.has(a)){ used.add(d); used.add(a); const [ax,ay]=EDGE_MID[d],[bx,by]=EDGE_MID[a]; g.beginPath(); g.moveTo(cx+ax,cy+ay); g.quadraticCurveTo(cx,cy,cx+bx,cy+by); g.stroke(); }
  }
  for(const d of mids){
    if(used.has(d)) continue;
    const [mx,my]=EDGE_MID[d]; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+mx,cy+my); g.stroke();
  }
}
function drawOverlay(g, arr, matchVal, color, dashed){
  g.save(); g.strokeStyle=color; g.lineWidth=dashed?S*0.13:S*0.18; g.lineCap=dashed?"butt":"round"; g.lineJoin="round";
  if(dashed) g.setLineDash([S*0.3,S*0.2]);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(arr[idx(c,r)]!==matchVal) continue;
    const [cx,cy]=center(c,r);
    drawSegments(g, cx, cy, overlayMids(arr,c,r,matchVal));
  }
  if(dashed) g.setLineDash([]);
  g.restore();
}
