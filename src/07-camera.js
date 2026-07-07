function clampZ(z){return Math.max(0.06,Math.min(10,z));}
function zoomAt(x,y,f){
  const rc=cv.getBoundingClientRect(), sx=x-rc.left, sy=y-rc.top;
  const [wx,wy]=[(sx-cam.x)/cam.z,(sy-cam.y)/cam.z];
  cam.z=clampZ(cam.z*f); cam.x=sx-wx*cam.z; cam.y=sy-wy*cam.z; render();
}
function fitGrid(){
  const w=cv.clientWidth-20,h=cv.clientHeight-20;
  cam.z=clampZ(Math.min(w/GRID_W,h/GRID_H));
  cam.x=cv.clientWidth/2-(GRID_W/2)*cam.z; cam.y=cv.clientHeight/2-(GRID_H/2)*cam.z; render();
}
