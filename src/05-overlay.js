function sep6(a,b){ let d=Math.abs(a-b)%6; return d>3?6-d:d; }
// smooth segments through one tile. Pair the farthest directions first
// (through-path): opposite => straight line through the centre, else a quadratic
// curve; an odd one out is a centre spoke.
function drawSegments(g, cx, cy, mids){
  if(mids.length<1) return;
  let pool=mids.slice();
  while(pool.length>=2){
    let bi=0,bj=1,bs=-1;
    for(let i=0;i<pool.length;i++) for(let j=i+1;j<pool.length;j++){
      const s=sep6(pool[i],pool[j]);
      if(s>bs){ bs=s; bi=i; bj=j; }
    }
    const d1=pool[bi], d2=pool[bj];
    const [ax,ay]=EDGE_MID[d1], [bx,by]=EDGE_MID[d2];
    g.beginPath(); g.moveTo(cx+ax,cy+ay);
    if(bs===3) g.lineTo(cx+bx,cy+by); else g.quadraticCurveTo(cx,cy,cx+bx,cy+by);
    g.stroke();
    pool.splice(bj,1); pool.splice(bi,1);
  }
  for(const d of pool){ const [mx,my]=EDGE_MID[d]; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+mx,cy+my); g.stroke(); }
}
// rivers & roads share edges. Where a connection has both, shift each type to
// the same side along the whole edge: the perpendicular is taken from the edge's
// geometric vector and forced into a fixed half-space (prefer +y), so it does
// NOT flip depending on which endpoint you view from. River one side, road the
// other (sign).
function drawEdges(g, type, color, dashed){
  const isRoad = type===3;
  const mask=new Uint8Array(ROWS*COLS);
  const ox=new Float32Array(ROWS*COLS), oy=new Float32Array(ROWS*COLS), has=new Uint8Array(ROWS*COLS);
  const sign = isRoad ? -1 : 1, dlt = S*0.2;
  for(const e of overlayEdges.values()){
    const ns=neighbors(e.a[0],e.a[1]);
    let d=-1; for(let i=0;i<6;i++){ if(ns[i][0]===e.b[0]&&ns[i][1]===e.b[1]){ d=i; break; } }
    if(d<0) continue;
    const ai=e.a[1]*COLS+e.a[0], bi=e.b[1]*COLS+e.b[0];
    const hasT = isRoad ? e.road===1 : e.river===type;
    if(hasT){ mask[ai]|=(1<<d); mask[bi]|=(1<<((d+3)%6)); }
    const hasOther = isRoad ? e.river!==0 : e.road===1;
    if(hasT && hasOther){
      const [ax,ay]=center(e.a[0],e.a[1]), [bx,by]=center(e.b[0],e.b[1]);
      let px=-(by-ay), py=(bx-ax);          // perpendicular to the edge vector
      const L=Math.hypot(px,py)||1; px/=L; py/=L;
      if(py<0 || (py===0 && px<0)){ px=-px; py=-py; } // order-independent half-space
      px*=dlt*sign; py*=dlt*sign;
      if(!has[ai]){ ox[ai]=px; oy[ai]=py; has[ai]=1; }
      if(!has[bi]){ ox[bi]=px; oy[bi]=py; has[bi]=1; }
    }
  }
  g.save(); g.strokeStyle=color; g.lineWidth=dashed?S*0.13:S*0.18; g.lineCap=dashed?"butt":"round"; g.lineJoin="round";
  if(dashed) g.setLineDash([S*0.3,S*0.2]);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const i=r*COLS+c, m=mask[i]; if(!m) continue;
    const dirs=[]; for(let d=0;d<6;d++) if(m&(1<<d)) dirs.push(d);
    const [cx,cy]=center(c,r);
    drawSegments(g, cx+ox[i], cy+oy[i], dirs);
  }
  if(dashed) g.setLineDash([]);
  g.restore();
}
