function sep6(a,b){ let d=Math.abs(a-b)%6; return d>3?6-d:d; }

// Orient every connected cluster of SHARED edges (river+road on the same link):
// DFS from degree-1 endpoints first (so a path flows end-to-end one way), then
// any leftover (cycles / junctions). For each oriented edge a->b store the unit
// left-bank perpendicular (rotate travel-vector 90 CCW) at both endpoints.
// River uses the left bank, road the right (opposite sign) -> consistent side
// through every bend, determined by travel direction (rotation), not compass.
function computeBankOffsets(){
  const adj=new Map();
  for(const e of overlayEdges.values()){
    if(!(e.river!==0 && e.road===1)) continue;
    const ai=e.a[1]*COLS+e.a[0], bi=e.b[1]*COLS+e.b[0];
    if(!adj.has(ai)) adj.set(ai,[]); adj.get(ai).push(bi);
    if(!adj.has(bi)) adj.set(bi,[]); adj.get(bi).push(ai);
  }
  const bank=new Map(), oriented=new Set();
  const ek=(a,b)=>a<b?a+":"+b:b+":"+a;
  const setFlow=(a,b)=>{
    const ac=a%COLS, ar=(a/COLS|0), bc=b%COLS, br=(b/COLS|0);
    const [ax,ay]=center(ac,ar), [bx,by]=center(bc,br);
    let vx=bx-ax, vy=by-ay; const L=Math.hypot(vx,vy)||1; vx/=L; vy/=L;
    const perp=[-vy, vx];
    const nsa=neighbors(ac,ar); let da=0; for(let i=0;i<6;i++){ if(nsa[i][0]===bc&&nsa[i][1]===br){da=i;break;} }
    const nsb=neighbors(bc,br); let db=0; for(let i=0;i<6;i++){ if(nsb[i][0]===ac&&nsb[i][1]===ar){db=i;break;} }
    bank.set(a*6+da, perp); bank.set(b*6+db, perp);
  };
  const dfs=(seed)=>{ const st=[seed]; while(st.length){ const u=st[st.length-1]; const nb=adj.get(u)||[]; let adv=false; for(const v of nb){ const k=ek(u,v); if(oriented.has(k)) continue; setFlow(u,v); oriented.add(k); st.push(v); adv=true; break; } if(!adv) st.pop(); } };
  for(const [u,nb] of adj) if(nb.length===1) dfs(u);
  for(const u of adj.keys()){ for(const v of adj.get(u)){ if(!oriented.has(ek(u,v))){ dfs(u); break; } } }
  return bank;
}

// smooth segments through one tile. Pair farthest directions (through-path):
// opposite => straight, else quadratic via the centre; odd one out => spoke.
// Offsetting is per shared midpoint (left/right bank of the oriented shared
// edge); the centre is offset only when every connection is shared, so shared
// edges meet offset-to-offset and shared->single transitions meet centred.
function drawSegments(g, cx, cy, mids, smask, i, offMap){
  if(mids.length<1) return;
  let allShared=true, cox=0, coy=0, cn=0;
  for(const d of mids){
    if(smask&(1<<d)){ const o=offMap.get(i*6+d); if(o){ cox+=o[0]; coy+=o[1]; cn++; } else allShared=false; }
    else allShared=false;
  }
  if(cn>1){ cox/=cn; coy/=cn; }
  const useC = allShared && cn>0;
  const cenx=cx+(useC?cox:0), ceny=cy+(useC?coy:0);
  const mp=d=>{ const [mx,my]=EDGE_MID[d]; const o=(smask&(1<<d))?offMap.get(i*6+d):null; return [cx+mx+(o?o[0]:0), cy+my+(o?o[1]:0)]; };
  let pool=mids.slice();
  while(pool.length>=2){
    let bi=0,bj=1,bs=-1;
    for(let ii=0;ii<pool.length;ii++) for(let jj=ii+1;jj<pool.length;jj++){ const s=sep6(pool[ii],pool[jj]); if(s>bs){bs=s;bi=ii;bj=jj;} }
    const d1=pool[bi], d2=pool[bj];
    const [ax,ay]=mp(d1), [bx,by]=mp(d2);
    g.beginPath(); g.moveTo(ax,ay);
    if(bs===3) g.lineTo(bx,by); else g.quadraticCurveTo(cenx,ceny,bx,by);
    g.stroke();
    pool.splice(bj,1); pool.splice(bi,1);
  }
  for(const d of pool){ const [mx,my]=mp(d); g.beginPath(); g.moveTo(cenx,ceny); g.lineTo(mx,my); g.stroke(); }
}

function drawEdges(g, type, color, dashed, bank){
  const isRoad = type===3;
  const mask=new Uint8Array(ROWS*COLS), smask=new Uint8Array(ROWS*COLS);
  const sign = isRoad ? -1 : 1, dlt = S*0.2;
  const offMap=new Map();
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
      const pa=bank.get(ai*6+d); if(pa) offMap.set(ai*6+d,[pa[0]*sign*dlt,pa[1]*sign*dlt]);
      const pb=bank.get(bi*6+((d+3)%6)); if(pb) offMap.set(bi*6+((d+3)%6),[pb[0]*sign*dlt,pb[1]*sign*dlt]);
    }
  }
  g.save(); g.strokeStyle=color; g.lineWidth=dashed?S*0.13:S*0.18; g.lineCap=dashed?"butt":"round"; g.lineJoin="round";
  if(dashed) g.setLineDash([S*0.3,S*0.2]);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const i=r*COLS+c, m=mask[i]; if(!m) continue;
    const dirs=[]; for(let d=0;d<6;d++) if(m&(1<<d)) dirs.push(d);
    const [cx,cy]=center(c,r);
    drawSegments(g, cx, cy, dirs, smask[i], i, offMap);
  }
  if(dashed) g.setLineDash([]);
  g.restore();
}
