function sep6(a,b){ let d=Math.abs(a-b)%6; return d>3?6-d:d; }
// smooth segments through one tile. Pair the farthest directions first
// (through-path): opposite => straight, else a quadratic through the centre;
// an odd one out is a centre spoke.
//
// Offsetting (river vs road on a shared edge) is done PER shared midpoint, and
// the centre is offset only when every connection is shared (fully co-located),
// so a shared edge meets offset-to-offset while a shared->single transition
// meets centred-to-centred: no gap.
function drawSegments(g, cx, cy, mids, smask, ox, oy){
  if(mids.length<1) return;
  let allShared=mids.length>0;
  for(const d of mids){ if(!(smask&(1<<d))) allShared=false; }
  const cox=allShared?ox:0, coy=allShared?oy:0;
  const cenx=cx+cox, ceny=cy+coy;
  const mp=d=>{ const [mx,my]=EDGE_MID[d]; const s=smask&(1<<d); return [cx+mx+(s?ox:0), cy+my+(s?oy:0)]; };
  let pool=mids.slice();
  while(pool.length>=2){
    let bi=0,bj=1,bs=-1;
    for(let i=0;i<pool.length;i++) for(let j=i+1;j<pool.length;j++){
      const s=sep6(pool[i],pool[j]);
      if(s>bs){ bs=s; bi=i; bj=j; }
    }
    const d1=pool[bi], d2=pool[bj];
    const [ax,ay]=mp(d1), [bx,by]=mp(d2);
    g.beginPath(); g.moveTo(ax,ay);
    if(bs===3) g.lineTo(bx,by); else g.quadraticCurveTo(cenx,ceny,bx,by);
    g.stroke();
    pool.splice(bj,1); pool.splice(bi,1);
  }
  for(const d of pool){ const [mx,my]=mp(d); g.beginPath(); g.moveTo(cenx,ceny); g.lineTo(mx,my); g.stroke(); }
}
// rivers & roads share edges. Build per-tile connection mask + (for shared edges)
// an order-independent perpendicular offset (prefer +y) so river and road sit
// side by side consistently along an edge.
function drawEdges(g, type, color, dashed){
  const isRoad = type===3;
  const mask=new Uint8Array(ROWS*COLS), smask=new Uint8Array(ROWS*COLS);
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
      smask[ai]|=(1<<d); smask[bi]|=(1<<((d+3)%6));
      const [ax,ay]=center(e.a[0],e.a[1]), [bx,by]=center(e.b[0],e.b[1]);
      let px=-(by-ay), py=(bx-ax);
      const L=Math.hypot(px,py)||1; px/=L; py/=L;
      if(px<0 || (px===0 && py<0)){ px=-px; py=-py; }   // order-independent half-space (prefer +x)
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
    drawSegments(g, cx, cy, dirs, smask[i], ox[i], oy[i]);
  }
  if(dashed) g.setLineDash([]);
  g.restore();
}
