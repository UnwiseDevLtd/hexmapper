function overlayMids(arr, c, r, matchVal){
  const ns=neighbors(c,r), mids=[];
  for(let d=0;d<6;d++){ const [nc,nr]=ns[d]; if(inB(nc,nr)&&arr[idx(nc,nr)]===matchVal) mids.push(d); }
  return mids;
}
function sep6(a,b){ let d=Math.abs(a-b)%6; return d>3?6-d:d; }
// Meaningful connectivity per connection count:
// opposite edges -> straight through-lines. If any through-line exists, every
// remaining edge is a branch SPOKE (never curved into a loop over a through).
// With no through-line, pair the farthest remaining edges as quadratic curves
// (a bend / split) and leave the odd one as a spoke; 1 alone is a terminus stub.
function drawSegments(g, cx, cy, mids){
  if(!mids.length) return;
  const present=new Set(mids), used=new Set();
  let throughs=0;
  for(const d of mids){
    if(used.has(d)) continue;
    const o=(d+3)%6;
    if(present.has(o)&&!used.has(o)){
      used.add(d); used.add(o); throughs++;
      const [ax,ay]=EDGE_MID[d],[bx,by]=EDGE_MID[o];
      g.beginPath(); g.moveTo(cx+ax,cy+ay); g.lineTo(cx+bx,cy+by); g.stroke();
    }
  }
  let pool=mids.filter(d=>!used.has(d));
  if(throughs>0){
    for(const d of pool){ const [mx,my]=EDGE_MID[d]; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+mx,cy+my); g.stroke(); }
    return;
  }
  while(pool.length>=2){
    let bi=0,bj=1,bs=-1;
    for(let i=0;i<pool.length;i++) for(let j=i+1;j<pool.length;j++){
      const s=sep6(pool[i],pool[j]);
      if(s>bs){ bs=s; bi=i; bj=j; }
    }
    const d1=pool[bi], d2=pool[bj];
    const [ax,ay]=EDGE_MID[d1], [bx,by]=EDGE_MID[d2];
    g.beginPath(); g.moveTo(cx+ax,cy+ay); g.quadraticCurveTo(cx,cy,cx+bx,cy+by); g.stroke();
    pool.splice(bj,1); pool.splice(bi,1);
  }
  for(const d of pool){ const [mx,my]=EDGE_MID[d]; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+mx,cy+my); g.stroke(); }
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
