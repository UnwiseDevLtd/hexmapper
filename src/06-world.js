function bgRect(){
  if(!bgImg) return null;
  const fit=Math.min(GRID_W/bgImg.width,GRID_H/bgImg.height)*bgScaleMul;
  const dw=bgImg.width*fit, dh=bgImg.height*fit;
  const dx=(GRID_W-dw)/2+bgOffX, dy=(GRID_H-dh)/2+bgOffY;
  return [dx,dy,dw,dh];
}
// backdrop is solid and ALWAYS below the tiles (it fills the image's alpha but
// never covers painted tiles, even in "image above tiles" mode).
function drawBackdrop(g){ const r=bgRect(); if(!r) return; g.fillStyle=bgColor; g.fillRect(r[0],r[1],r[2],r[3]); }
function drawBgImage(g){ const r=bgRect(); if(!r) return; g.globalAlpha=bgOp; g.drawImage(bgImg,r[0],r[1],r[2],r[3]); g.globalAlpha=1; }
function drawTilesLayer(g){
  const bw=viewStyle==="bw"||viewStyle==="hatch", hatch=viewStyle==="hatch", alpha=viewStyle==="alpha";
  const patterns=hatch?buildHatchPatterns(g):null, symOvr=bw?"#333":null;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const t=terrain[idx(c,r)]; if(!t||!TERR[t]) continue;
    const [cx,cy]=center(c,r); hexPath(g,cx,cy);
    if(viewStyle==="color") g.fillStyle=TERR[t].fill;
    else if(hatch) g.fillStyle=patterns[t]||"#fff";
    else continue;
    g.fill();
  }
  g.strokeStyle="rgba(0,0,0,0.32)"; g.lineWidth=1;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) outlineHex(g,c,r,tKey);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ const t=terrain[idx(c,r)]; if(!t||!TERR[t]) continue; const [cx,cy]=center(c,r); drawTerrain(g,t,cx,cy,symOvr); }
  const bank=computeBankOffsets();
  if(bw){ drawEdges(g,1,"#000",false,bank); drawEdges(g,2,"#444",false,bank); drawEdges(g,3,"#000",true,bank); }
  else { drawEdges(g,1,WATER_RIVER,false,bank); drawEdges(g,2,LAVA_RIVER,false,bank); drawEdges(g,3,ROAD_COLOR,true,bank); }
  drawSettlementPaths(g);
  drawVeg(g);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ const e=entity[idx(c,r)]; if(e===0) continue; const [cx,cy]=center(c,r); drawEntity(g,e,cx,cy,c,r); }
  drawIds(g);
}
function buildWorld(includeBg){
  const g=wctx; g.setTransform(1,0,0,1,0,0); g.clearRect(0,0,world.width,world.height);
  const showBg = includeBg && viewStyle==="color";
  if(showBg) drawBackdrop(g);
  if(showBg && !bgAbove) drawBgImage(g);
  if(viewStyle==="bw"||viewStyle==="hatch"){ g.fillStyle="#ffffff"; g.fillRect(0,0,GRID_W,GRID_H); }
  drawTilesLayer(g);
  if(showBg && bgAbove) drawBgImage(g);
  drawTexts(g);
  g.strokeStyle="rgba(255,255,255,0.15)"; g.lineWidth=2; g.strokeRect(0,0,GRID_W,GRID_H);
}

function render(){
  if(dirty){ buildWorld(true); dirty=false; }
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const w=cv.clientWidth,h=cv.clientHeight;
  ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
  ctx.imageSmoothingEnabled=true;
  ctx.drawImage(world,cam.x,cam.y,world.width*cam.z,world.height*cam.z);
  if(selText>=0&&texts[selText]){
    const t=texts[selText], m=textMetrics(t);
    const sx=t.x*cam.z+cam.x, sy=t.y*cam.z+cam.y;
    ctx.save(); ctx.strokeStyle="#ffe14d"; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
    ctx.strokeRect(sx-m.w/2*cam.z-3, sy-m.h/2*cam.z-3, m.w*cam.z+6, m.h*cam.z+6);
    ctx.restore();
  }
  if(hover.c>=0&&hover.r>=0&&active.kind!=="text"){
    const [cx,cy]=center(hover.c,hover.r);
    const sx=cx*cam.z+cam.x, sy=cy*cam.z+cam.y;
    ctx.save(); ctx.translate(sx,sy); ctx.scale(cam.z,cam.z);
    drawPreview(ctx);
    hexPath(ctx,0,0); ctx.strokeStyle="#fff"; ctx.lineWidth=1.5/cam.z; ctx.stroke();
    ctx.restore();
  }
}
function drawPreview(g){
  g.globalAlpha=0.5;
  if(opMode==="erase"){ hexPath(g,0,0); g.fillStyle="#e27075"; g.fill(); g.globalAlpha=1; return; }
  if(active.kind==="terrain"){ const t=active.id; hexPath(g,0,0); g.fillStyle=TERR[t].fill; g.fill(); drawTerrain(g,t,0,0); }
  else if(active.kind==="veg"){
    if(active.type===1) tree(g,0,0,S*0.95,"#1f5a22"); else drawForestCluster(g,0,0);
  }
  else if(active.kind==="river"){
    const col=active.type===1?WATER_RIVER:LAVA_RIVER;
    g.fillStyle=col; g.beginPath(); g.arc(0,0,S*0.14,0,7); g.fill();
  } else if(active.kind==="road"){
    g.strokeStyle=ROAD_COLOR; g.lineWidth=S*0.13; g.lineCap="butt"; g.setLineDash([S*0.3,S*0.2]);
    g.beginPath(); g.moveTo(-S*0.35,0); g.lineTo(S*0.35,0); g.stroke(); g.setLineDash([]);
  } else if(active.kind==="entity"){ drawEntity(g,active.id,0,0,hover.c,hover.r); }
  g.globalAlpha=1;
}
