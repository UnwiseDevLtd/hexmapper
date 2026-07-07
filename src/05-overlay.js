// rivers & roads are explicit edges between adjacent tiles. Each edge draws a
// straight segment between the two tile centres; junctions are where edges meet
// at a centre. type 1=water river, 2=lava river, 3=road.
function drawEdges(g, type, color, dashed){
  g.save(); g.strokeStyle=color; g.lineWidth=dashed?S*0.13:S*0.18; g.lineCap=dashed?"butt":"round"; g.lineJoin="round";
  if(dashed) g.setLineDash([S*0.3,S*0.2]);
  for(const e of overlayEdges.values()){
    if(e.type!==type) continue;
    const [ax,ay]=center(e.a[0],e.a[1]);
    const [bx,by]=center(e.b[0],e.b[1]);
    g.beginPath(); g.moveTo(ax,ay); g.lineTo(bx,by); g.stroke();
  }
  if(dashed) g.setLineDash([]);
  g.restore();
}
