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
  } else {
    for(const d of mids){ const [mx,my]=EDGE_MID[d]; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+mx,cy+my); g.stroke(); }
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
