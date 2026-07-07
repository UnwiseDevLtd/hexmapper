function drawOverlay(g, arr, matchVal, color, dashed){
  g.save(); g.strokeStyle=color; g.lineWidth = dashed?S*0.13:S*0.18; g.lineCap = dashed?"butt":"round"; g.lineJoin="round";
  if(dashed) g.setLineDash([S*0.3,S*0.2]);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(arr[idx(c,r)]!==matchVal) continue;
    const [cx,cy]=center(c,r), ns=neighbors(c,r);
    for(let d=0;d<6;d++){ const [nc,nr]=ns[d]; if(!inB(nc,nr)||arr[idx(nc,nr)]!==matchVal) continue; const [mx,my]=EDGE_MID[d]; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+mx,cy+my); g.stroke(); }
  }
  if(dashed) g.setLineDash([]);
  g.restore();
}
function previewEdges(g, arr, matchVal){
  const ns=neighbors(hover.c,hover.r);
  for(let d=0;d<6;d++){ const [nc,nr]=ns[d]; if(inB(nc,nr)&&arr[idx(nc,nr)]===matchVal){ const [mx,my]=EDGE_MID[d]; g.beginPath(); g.moveTo(0,0); g.lineTo(mx,my); g.stroke(); } }
}
