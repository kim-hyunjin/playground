import { VEHICLES, SCENARIOS } from "./data.js";
import { createVehicle, stepVehicle, overlaps, corners } from "./physics.js";
import { evaluateParking, scoreParking } from "./evaluator.js";

const app = document.querySelector("#app");
let selectedVehicle = VEHICLES[1], selectedScenario = SCENARIOS[0];

function renderMenu() {
  app.innerHTML = `<div class="shell"><header class="topbar"><div class="brand">PARKING <b>LAB</b></div><span class="eyebrow">TOP VIEW TRAINING</span></header>
  <section><div class="eyebrow">운전은 감각이 아니라 연습입니다</div><h1>빈틈을 읽고,<br>정확하게 주차하세요.</h1><p class="lead">차량과 상황을 선택하고 저속 조향을 연습해 보세요. 충돌, 정렬 각도, 주차선 안착 여부를 실시간으로 판정합니다.</p></section>
  <section class="selection"><div class="panel"><div class="panel-title"><span class="step">1</span>차량 선택</div><div class="cards" id="vehicles"></div></div>
  <div class="panel"><div class="panel-title"><span class="step">2</span>훈련 상황</div><div class="cards" id="scenarios"></div></div><button class="start" id="start">훈련 시작 →</button></section></div>`;
  const drawChoices = () => {
    app.querySelector("#vehicles").innerHTML = VEHICLES.map(v => `<button class="choice ${v.id === selectedVehicle.id ? "selected" : ""}" data-vehicle="${v.id}"><strong>${v.name}</strong><small>${v.length.toFixed(2)}m × ${v.width.toFixed(2)}m</small><span class="tag">${v.label}</span></button>`).join("");
    app.querySelector("#scenarios").innerHTML = SCENARIOS.map(s => `<button class="choice ${s.id === selectedScenario.id ? "selected" : ""}" data-scenario="${s.id}"><strong>${s.name}</strong><small>${s.description}</small><span class="tag">${s.difficulty}</span></button>`).join("");
  };
  drawChoices();
  app.onclick = e => {
    const v = e.target.closest("[data-vehicle]"); if (v) { selectedVehicle = VEHICLES.find(x => x.id === v.dataset.vehicle); drawChoices(); }
    const s = e.target.closest("[data-scenario]"); if (s) { selectedScenario = SCENARIOS.find(x => x.id === s.dataset.scenario); drawChoices(); }
    if (e.target.closest("#start")) startGame();
  };
}

function startGame() {
  app.innerHTML = `<div class="game-shell"><header class="hud"><button id="exit">← 나가기</button><div class="mission"><strong>${selectedScenario.name}</strong><span>${selectedScenario.description}</span></div><div class="readouts"><div class="readout"><b id="speed">0.0</b><small>km/h</small></div><div class="readout"><b id="gear">N</b><small>GEAR</small></div><div class="readout"><b id="time">0:00</b><small>TIME</small></div><div class="readout"><b id="hits">0</b><small>충돌</small></div></div></header>
  <section class="stage-wrap"><canvas></canvas><div class="toast">충돌했습니다</div><div class="steering-ui"><div class="steering-wheel" id="steering-wheel"><i></i><i></i><i></i></div><div><small>STEERING</small><b id="steering-value">중앙 0°</b></div></div><div class="help">← → 조향 · ↑ 엑셀 · ↓ 브레이크/후진 · R 재시작</div><div class="pedals"><button class="pedal brake" data-input="brake">BRAKE</button><button class="pedal gas" data-input="accelerate">GAS</button></div></section></div>`;
  runGame();
}

function runGame() {
  const canvas = app.querySelector("canvas"), ctx = canvas.getContext("2d"), stage = canvas.parentElement;
  let vehicle = createVehicle(selectedVehicle, selectedScenario.spawn), elapsed = 0, collisions = 0, validFor = 0, last = performance.now(), running = true, collisionLock = 0;
  const input = { left: 0, right: 0, accelerate: 0, brake: 0 };
  const keys = { ArrowLeft:"left",ArrowRight:"right",ArrowUp:"accelerate",ArrowDown:"brake" };
  const reset = () => { vehicle = createVehicle(selectedVehicle, selectedScenario.spawn); elapsed = collisions = validFor = collisionLock = 0; };
  document.onkeydown = e => { if (keys[e.key]) { input[keys[e.key]] = 1; e.preventDefault(); } if (e.key.toLowerCase() === "r") reset(); };
  document.onkeyup = e => { if (keys[e.key]) input[keys[e.key]] = 0; };
  stage.querySelectorAll("[data-input]").forEach(btn => { const set = value => { input[btn.dataset.input] = value; btn.classList.toggle("active", !!value); }; btn.onpointerdown = e => { btn.setPointerCapture(e.pointerId); set(1); }; btn.onpointerup = btn.onpointercancel = () => set(0); });
  app.querySelector("#exit").onclick = () => { running = false; document.onkeydown = document.onkeyup = null; renderMenu(); };

  function resize() { const dpr = Math.min(devicePixelRatio,2), r = canvas.getBoundingClientRect(); canvas.width = r.width*dpr;canvas.height=r.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0); }
  function loop(now) {
    if (!running) return; resize(); const dt = Math.min(.033,(now-last)/1000); last=now; elapsed += dt; collisionLock=Math.max(0,collisionLock-dt);
    const previous=vehicle, next=stepVehicle(vehicle,input,dt), rect={...next,width:next.spec.width,length:next.spec.length};
    const outside = corners(rect).some(p => p.x < 0 || p.y < 0 || p.x > selectedScenario.world.width || p.y > selectedScenario.world.height);
    const hit = outside || selectedScenario.obstacles.some(o=>overlaps(rect,o));
    if(hit){ vehicle={...previous,speed:-previous.speed*.12}; if(!collisionLock){collisions++;collisionLock=.8;const t=app.querySelector(".toast");t.classList.add("show");setTimeout(()=>t?.classList.remove("show"),700);} } else vehicle=next;
    const result=evaluateParking(vehicle,selectedScenario.target); validFor=result.valid?validFor+dt:0;
    draw(ctx,canvas,vehicle,selectedScenario,result);
    const steerDegrees=vehicle.steer*180/Math.PI,steerRatio=vehicle.steer/vehicle.spec.maxSteer;
    app.querySelector("#speed").textContent=(Math.abs(vehicle.speed)*3.6).toFixed(1);app.querySelector("#gear").textContent=vehicle.speed>.05?"D":vehicle.speed<-.05?"R":"N";app.querySelector("#time").textContent=`${Math.floor(elapsed/60)}:${String(Math.floor(elapsed%60)).padStart(2,"0")}`;app.querySelector("#hits").textContent=collisions;app.querySelector("#steering-wheel").style.transform=`rotate(${steerRatio*120}deg)`;app.querySelector("#steering-value").textContent=`${Math.abs(steerDegrees)<.5?"중앙":steerDegrees<0?"좌":"우"} ${Math.abs(steerDegrees).toFixed(0)}°`;
    if(validFor>=1.5){ running=false;showResult(elapsed,collisions,result,reset);return;} requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function draw(ctx, canvas, vehicle, scenario, evaluation) {
  const w=canvas.clientWidth,h=canvas.clientHeight,scale=Math.min(w/scenario.world.width,h/scenario.world.height),ox=(w-scenario.world.width*scale)/2,oy=(h-scenario.world.height*scale)/2;
  ctx.clearRect(0,0,w,h);ctx.fillStyle="#252c28";ctx.fillRect(0,0,w,h);ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);
  ctx.fillStyle="#343b37";ctx.fillRect(0,0,scenario.world.width,scenario.world.height);ctx.strokeStyle="#515954";ctx.lineWidth=.04;for(let x=0;x<scenario.world.width;x+=2){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,scenario.world.height);ctx.stroke();}drawParkingLines(ctx,scenario);
  const t=scenario.target;ctx.save();ctx.translate(t.x,t.y);ctx.rotate(t.angle);ctx.fillStyle=evaluation.inside?"#c9f45b22":"#d9dfd819";ctx.fillRect(-t.length/2,-t.width/2,t.length,t.width);ctx.strokeStyle=evaluation.inside?"#c9f45b":"#e7eee9";ctx.lineWidth=.09;ctx.setLineDash([.35,.2]);ctx.strokeRect(-t.length/2,-t.width/2,t.length,t.width);ctx.restore();
  scenario.obstacles.forEach(o=>drawCar(ctx,o,o.color));drawCar(ctx,{...vehicle,width:vehicle.spec.width,length:vehicle.spec.length},vehicle.spec.color,true);
  ctx.restore();
}
function drawParkingLines(ctx,scenario){
  const parallel=scenario.id==="parallel";ctx.save();ctx.strokeStyle="#d8ddd6";ctx.lineWidth=.08;ctx.globalAlpha=.82;ctx.setLineDash([]);
  if(parallel){
    const top=scenario.target.y-scenario.target.width/2,bottom=scenario.target.y+scenario.target.width/2;
    const targetLeft=scenario.target.x-scenario.target.length/2,targetRight=scenario.target.x+scenario.target.length/2;
    const regularBay=6,boundaries=[targetLeft-regularBay,targetLeft,targetRight,targetRight+regularBay];
    ctx.beginPath();ctx.moveTo(boundaries[0],top);ctx.lineTo(boundaries.at(-1),top);ctx.moveTo(boundaries[0],bottom);ctx.lineTo(boundaries.at(-1),bottom);for(const x of boundaries){ctx.moveTo(x,top);ctx.lineTo(x,bottom);}ctx.stroke();
    ctx.strokeStyle="#e1b84c";ctx.lineWidth=.11;ctx.beginPath();ctx.moveTo(0,8.1);ctx.lineTo(scenario.world.width,8.1);ctx.stroke();
  }else{
    const pitch=scenario.target.width,back=scenario.target.y-scenario.target.length/2,front=scenario.target.y+scenario.target.length/2,start=scenario.target.x-pitch*3.5,end=scenario.target.x+pitch*3.5;ctx.beginPath();ctx.moveTo(start,back);ctx.lineTo(end,back);ctx.moveTo(start,front);ctx.lineTo(end,front);for(let x=start;x<=end+.01;x+=pitch){ctx.moveTo(x,back);ctx.lineTo(x,front);}ctx.stroke();
    ctx.strokeStyle="#e1b84c";ctx.lineWidth=.11;ctx.beginPath();ctx.moveTo(0,10);ctx.lineTo(scenario.world.width,10);ctx.stroke();
  }ctx.restore();
}
function drawCar(ctx,car,color,active=false){ctx.save();ctx.translate(car.x,car.y);ctx.rotate(car.angle);ctx.shadowColor="#0009";ctx.shadowBlur=.3;ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(-car.length/2,-car.width/2,car.length,car.width,.25);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle="#1a2425";ctx.fillRect(-car.length*.12,-car.width*.41,car.length*.38,car.width*.82);ctx.fillStyle=active?"#fff4b8":"#86908b";ctx.fillRect(car.length*.43,-car.width*.34,.08,car.width*.68);ctx.fillStyle="#d95050";ctx.fillRect(-car.length*.5,-car.width*.33,.08,car.width*.66);ctx.restore();}
function showResult(elapsed,collisions,result){const score=scoreParking(elapsed,collisions,result);const overlay=document.createElement("div");overlay.className="result-overlay";overlay.innerHTML=`<div class="result" role="dialog" aria-modal="true" aria-labelledby="result-title"><div class="eyebrow">MISSION COMPLETE</div><h2 id="result-title">주차 성공!</h2><div class="score">${score}<small>점</small></div><div class="result-stats"><div><span>주차 완료 시간</span><b>${elapsed.toFixed(1)}초</b></div><div><span>충돌</span><b>${collisions}회</b></div><div><span>각도 오차</span><b>${(result.angleError*180/Math.PI).toFixed(1)}°</b></div></div><div class="result-actions"><button id="menu">상황 선택</button><button class="primary" id="retry">다시 도전</button></div></div>`;app.querySelector(".stage-wrap").append(overlay);overlay.querySelector("#menu").onclick=renderMenu;overlay.querySelector("#retry").onclick=startGame;}

renderMenu();
