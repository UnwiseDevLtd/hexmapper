function drawBgLayer(g){
  if(!bgImg) return;
  const fit=Math.min(GRID_W/bgImg.width,GRID_H/bgImg.height)*bgScaleMul;
  const dw=bgImg.width*fit, dh=bgImg.height*fit;
  const dx=(GRID_W-dw)/2+bgOffX, dy=(GRID_H-dh)/2+bgOffY;
  // solid backdrop fills the image's transparent pixels; only the image itself
  // respects bgOp, so the backdrop stays full-strength at any opacity.
  g.fillStyle=bgColor; g.fillRect(dx,dy,dw,dh);
  g.globalAlpha=bgOp; g.drawImage(bgImg,dx,dy,dw,dh); g.globalAlpha=1;
}
function drawTilesLayer(g){
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ const t=terrain[idx(c,r)]; if(!t||!TERR[t]) continue; const [cx,cy]=center(c,r); hexPath(g,cx,cy); g.fillStyle=TERR[t].fill; g.fill(); }
  g.strokeStyle="rgba(0,0,0,0.32)"; g.lineWidth=1;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) outlineHex(g,c,r,tKey);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ const t=terrain[idx(c,r)]; if(!t||!TERR[t]) continue; const [cx,cy]=center(c,r); drawTerrain(g,t,cx,cy); }
  drawOverlay(g, rivers, 1, WATER_RIVER, false);
  drawOverlay(g, rivers, 2, LAVA_RIVER, false);
  drawOverlay(g, roads, 1, ROAD_COLOR, true);
  drawSettlementPaths(g);
  drawVeg(g);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){ const e=entity[idx(c,r)]; if(e===0) continue; const [cx,cy]=center(c,r); drawEntity(g,e,cx,cy,c,r); }
  drawIds(g);
}
function buildWorld(includeBg){
  const g=wctx; g.setTransform(1,0,0,1,0,0); g.clearRect(0,0,world.width,world.height);
  if(includeBg && !bgAbove) drawBgLayer(g);
  drawTilesLayer(g);
  if(includeBg && bgAbove) drawBgLayer(g);
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
  if(active.kind==="terrain"){ const t=active.id; hexPath(g,0,0); g.fillStyle=TERR[t].fill; g.fill(); drawTerrain(g,t,0,0); }
  else if(active.kind==="veg"){
    if(active.type===1) tree(g,0,0,S*0.95,"#1f5a22"); else drawForestCluster(g,0,0);
  }
  else if(active.kind==="river"){
    const col=active.type===1?WATER_RIVER:LAVA_RIVER;
    g.strokeStyle=col; g.lineWidth=S*0.18; g.lineCap="round";
    previewEdges(g, rivers, active.type);
    g.fillStyle=col; g.beginPath(); g.arc(0,0,S*0.12,0,7); g.fill();
  } else if(active.kind==="road"){
    g.strokeStyle=ROAD_COLOR; g.lineWidth=S*0.13; g.lineCap="butt"; g.setLineDash([S*0.3,S*0.2]);
    previewEdges(g, roads, 1); g.setLineDash([]);
  } else if(active.kind==="entity"){ drawEntity(g,active.id,0,0,hover.c,hover.r); }
  g.globalAlpha=1;
}
