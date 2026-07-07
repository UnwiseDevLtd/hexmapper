function tree(g,x,y,sz,col){
  g.fillStyle=col;
  g.beginPath(); g.moveTo(x,y-sz*0.5); g.lineTo(x+sz*0.32,y+sz*0.2); g.lineTo(x-sz*0.32,y+sz*0.2); g.closePath(); g.fill();
  g.fillRect(x-sz*0.06,y+sz*0.16,sz*0.12,sz*0.22);
}
function waveH(g,cx,cy,scale){
  g.lineWidth=S*0.12*scale; g.beginPath();
  const x0=cx-S*0.42, x1=cx+S*0.42, steps=4, dx=(x1-x0)/steps;
  g.moveTo(x0,cy);
  for(let i=1;i<=steps;i++){ const mx=x0+dx*(i-0.5),xx=x0+dx*i; g.quadraticCurveTo(mx,cy+(i%2?S*0.1:-S*0.1),xx,cy); }
  g.stroke();
}
function drawTerrain(g,id,cx,cy){
  const sym=TERR[id].sym; g.fillStyle=sym; g.strokeStyle=sym; g.lineJoin="round"; g.lineCap="round";
  switch(id){
    case 3: g.lineWidth=S*0.07; for(const [tx,ty] of [[-0.25,0.12],[0.05,-0.06],[0.25,0.16]]){ g.beginPath(); g.moveTo(cx+tx*S,cy+ty*S); g.lineTo(cx+tx*S,cy+(ty-0.13)*S); g.stroke(); } break;
    case 4: g.lineWidth=S*0.13; g.beginPath();
      g.moveTo(cx-S*0.42,cy+S*0.28); g.lineTo(cx-S*0.2,cy-S*0.05); g.lineTo(cx+S*0.02,cy+S*0.28);
      g.moveTo(cx-S*0.02,cy+S*0.28); g.lineTo(cx+S*0.2,cy-S*0.05); g.lineTo(cx+S*0.42,cy+S*0.28);
      g.stroke(); break;
    case 5: for(const [tx,ty] of [[-0.2,0.1],[0.1,-0.06],[0.22,0.2],[-0.08,-0.16]]){ g.beginPath(); g.arc(cx+tx*S,cy+ty*S,S*0.045,0,7); g.fill(); } break;
    case 6: g.lineWidth=S*0.14; g.beginPath();
      g.arc(cx-S*0.28,cy+S*0.12,S*0.3,Math.PI*1.05,Math.PI*1.95);
      g.arc(cx+S*0.28,cy+S*0.12,S*0.3,Math.PI*1.05,Math.PI*1.95);
      g.stroke(); break;
    case 7: g.beginPath(); g.moveTo(cx,cy-S*0.36); g.lineTo(cx+S*0.34,cy+S*0.22); g.lineTo(cx-S*0.34,cy+S*0.22); g.closePath(); g.fill(); break;
    case 8: // large mountain: small peak overlaid on a larger back peak
      g.save();
      g.fillStyle="#9aa0ad";
      g.beginPath(); g.moveTo(cx-S*0.05,cy-S*0.46); g.lineTo(cx+S*0.44,cy+S*0.3); g.lineTo(cx-S*0.46,cy+S*0.3); g.closePath(); g.fill();
      g.fillStyle="#ffffff";
      g.beginPath(); g.moveTo(cx+S*0.08,cy-S*0.24); g.lineTo(cx+S*0.42,cy+S*0.3); g.lineTo(cx-S*0.30,cy+S*0.3); g.closePath(); g.fill();
      g.restore();
      break;
    case 9: waveH(g,cx,cy,1); break;
    case 10: waveH(g,cx,cy,1); waveH(g,cx,cy-S*0.24,0.8); break;
    case 11: waveH(g,cx,cy,1); break;
    case 12: waveH(g,cx,cy,1); waveH(g,cx,cy-S*0.24,0.8); break;
    case 13: g.lineWidth=S*0.1; waveH(g,cx,cy+S*0.18,0.9); g.lineWidth=S*0.06;
      for(const tx of [-0.2,0.05,0.25]){ const ty=-0.05; g.beginPath(); g.moveTo(cx+tx*S,cy+ty*S); g.lineTo(cx+tx*S,cy+ty*S-S*0.22); g.stroke(); }
      break;
    case 14: g.lineWidth=S*0.07; for(let i=-2;i<=2;i++){ g.beginPath(); g.moveTo(cx-S*0.4,cy+i*S*0.18); g.lineTo(cx+S*0.4,cy+i*S*0.18-S*0.16); g.stroke(); } break;
  }
}
function house(g,cx,cy,sz){
  g.save(); g.fillStyle="#ffd479"; g.strokeStyle="#3a2a00"; g.lineWidth=1.1;
  g.beginPath(); g.moveTo(cx,cy-sz*0.34); g.lineTo(cx+sz*0.3,cy-sz*0.05); g.lineTo(cx-sz*0.3,cy-sz*0.05); g.closePath(); g.fill(); g.stroke();
  g.fillRect(cx-sz*0.2,cy-sz*0.05,sz*0.4,sz*0.3); g.strokeRect(cx-sz*0.2,cy-sz*0.05,sz*0.4,sz*0.3);
  g.restore();
}
function cityTexture(g,cx,cy){
  g.save(); g.fillStyle="#d7dae3";
  for(const [x,y,w,h] of [[-0.2,-0.04,0.16,0.24],[0.06,0.02,0.14,0.2],[-0.04,-0.2,0.12,0.16]]) g.fillRect(cx+x*S,cy+y*S,w*S,h*S);
  g.restore();
}
function drawSkull(g,cx,cy){
  g.save(); g.fillStyle="#eee"; g.strokeStyle="#2b2b2b"; g.lineWidth=1.1;
  g.beginPath(); g.arc(cx,cy-S*0.04,S*0.27,0,Math.PI*2); g.fill(); g.stroke();
  g.fillStyle="#222";
  g.beginPath(); g.arc(cx-S*0.1,cy-S*0.06,S*0.07,0,Math.PI*2); g.fill();
  g.beginPath(); g.arc(cx+S*0.1,cy-S*0.06,S*0.07,0,Math.PI*2); g.fill();
  g.beginPath(); g.arc(cx,cy+S*0.05,S*0.04,0,Math.PI*2); g.fill();
  g.strokeStyle="#2b2b2b"; g.beginPath(); g.moveTo(cx-S*0.12,cy+S*0.2); g.lineTo(cx+S*0.12,cy+S*0.2); g.stroke();
  g.restore();
}
function drawCave(g,cx,cy){
  g.save(); g.fillStyle="#5b524a";
  g.beginPath(); g.moveTo(cx-S*0.34,cy+S*0.28); g.lineTo(cx-S*0.34,cy-S*0.1);
  g.arc(cx,cy-S*0.1,S*0.34,Math.PI,0,false); g.lineTo(cx+S*0.34,cy+S*0.28); g.closePath(); g.fill();
  g.fillStyle="#0c0c0c";
  g.beginPath(); g.moveTo(cx-S*0.2,cy+S*0.24); g.lineTo(cx-S*0.2,cy-S*0.02);
  g.arc(cx,cy-S*0.02,S*0.2,Math.PI,0,false); g.lineTo(cx+S*0.2,cy+S*0.24); g.closePath(); g.fill();
  g.restore();
}
function drawForestCluster(g,cx,cy){
  g.save();
  g.fillStyle="#0c3a12";
  for(const [bx,by,br] of [[-0.24,0.08,0.26],[0.24,0.08,0.26],[0,-0.18,0.32]]){
    g.beginPath(); g.arc(cx+bx*S,cy+by*S,br*S,0,Math.PI*2); g.fill();
  }
  g.fillStyle="#2e6a36";
  for(const [bx,by,br] of [[-0.24,0.02,0.13],[0.24,0.02,0.13],[0,-0.24,0.16]]){
    g.beginPath(); g.arc(cx+bx*S,cy+by*S,br*S,0,Math.PI*2); g.fill();
  }
  g.fillStyle="#3a2a14";
  g.fillRect(cx-S*0.05,cy+S*0.22,S*0.10,S*0.12);
  g.restore();
}
function drawEntity(g,type,cx,cy){
  if(type===1){ house(g,cx,cy,S*0.9); return; }
  if(type===2){ cityTexture(g,cx,cy); return; }
  if(type===3){
    g.save(); g.textAlign="center"; g.textBaseline="middle";
    g.font=`bold ${Math.round(S*1.15)}px ui-sans-serif,system-ui,sans-serif`;
    g.lineWidth=3; g.strokeStyle="#000"; g.strokeText("?",cx,cy);
    g.fillStyle="#ffe14d"; g.fillText("?",cx,cy); g.restore(); return;
  }
  if(type===4){ drawSkull(g,cx,cy); return; }
  if(type===5){ drawCave(g,cx,cy); return; }
}
function drawVeg(g){
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const v=veg[idx(c,r)]; if(!v) continue;
    const [cx,cy]=center(c,r);
    if(v===1) tree(g,cx,cy,S*0.95,"#1f5a22");
    else drawForestCluster(g,cx,cy);
  }
}
function roundRect(g,x,y,w,h,r){
  g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath();
}
function textMetrics(t){
  wctx.save(); wctx.textAlign="center"; wctx.textBaseline="middle"; wctx.font=`${t.size}px ui-sans-serif,system-ui,sans-serif`;
  const w=wctx.measureText(t.s).width, pad=t.size*0.25, h=t.size*1.35;
  wctx.restore();
  return {w:w+2*pad,h,pad};
}
function drawTexts(g){
  g.save(); g.textAlign="center"; g.textBaseline="middle";
  for(const t of texts){
    g.font=`${t.size}px ui-sans-serif,system-ui,sans-serif`;
    const m=textMetrics(t);
    g.fillStyle="#fff"; roundRect(g,t.x-m.w/2,t.y-m.h/2,m.w,m.h,t.size*0.2); g.fill();
    g.strokeStyle="rgba(0,0,0,0.18)"; g.lineWidth=1; g.stroke();
    if(t.s){ g.fillStyle="#000"; g.fillText(t.s,t.x,t.y); }
  }
  g.restore();
}
function drawIds(g){
  if(!showIds) return;
  g.save(); g.textAlign="center"; g.textBaseline="middle"; g.font=`${idSize}px ui-monospace,ui-sans-serif,system-ui,sans-serif`;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const [cx,cy]=center(c,r), id=hexId(c,r);
    const y = idPos==="top" ? cy-S*0.46 : cy;
    const tw=g.measureText(id).width;
    if(idBg!=="none"){ g.fillStyle = idBg==="white" ? "rgba(255,255,255,0.82)" : "rgba(0,0,0,0.6)"; roundRect(g,cx-tw/2-2,y-idSize*0.62,tw+4,idSize*1.24,2); g.fill(); }
    g.fillStyle = idBg==="dark" ? "#fff" : (idBg==="white" ? "#000" : "rgba(20,20,20,0.55)");
    g.fillText(id,cx,y);
  }
  g.restore();
}
function hitText(wx,wy){
  for(let i=texts.length-1;i>=0;i--){
    const t=texts[i], m=textMetrics(t);
    if(wx>=t.x-m.w/2&&wx<=t.x+m.w/2&&wy>=t.y-m.h/2&&wy<=t.y+m.h/2) return i;
  }
  return -1;
}
