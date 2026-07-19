import test from "node:test";
import assert from "node:assert/strict";
import { createVehicle, stepVehicle, overlaps } from "../src/physics.js";
import { evaluateParking } from "../src/evaluator.js";
import { SCENARIOS, VEHICLES } from "../src/data.js";

const spec={width:1.8,length:4.5,wheelbase:2.7,maxSteer:.55,maxForward:4,maxReverse:2.5,acceleration:3,brake:5};
test("vehicle accelerates forward",()=>{const v=stepVehicle(createVehicle(spec,{x:0,y:0,angle:0}),{left:0,right:0,accelerate:1,brake:0},.5);assert.ok(v.x>0);assert.ok(v.speed>0);});
test("rotated rectangles collision",()=>{assert.equal(overlaps({x:0,y:0,width:2,length:4,angle:0},{x:1,y:0,width:2,length:4,angle:.2}),true);assert.equal(overlaps({x:0,y:0,width:2,length:4,angle:0},{x:8,y:0,width:2,length:4,angle:0}),false);});
test("parking requires full containment and stop",()=>{const target={x:5,y:5,width:2.5,length:5.2,angle:0};const v={...createVehicle(spec,{x:5,y:5,angle:0}),speed:0};assert.equal(evaluateParking(v,target).valid,true);assert.equal(evaluateParking({...v,x:7},target).valid,false);assert.equal(evaluateParking({...v,speed:1},target).valid,false);});
test("parallel parking space is horizontal",()=>{const target=SCENARIOS.find(s=>s.id==="parallel").target;assert.ok(target.length>target.width);assert.equal(target.angle,0);});
test("parked cars are centered inside parallel parking bays",()=>{const scenario=SCENARIOS.find(s=>s.id==="parallel"),left=scenario.target.x-scenario.target.length/2,right=scenario.target.x+scenario.target.length/2;assert.ok(scenario.obstacles[0].x-scenario.obstacles[0].length/2>left-6);assert.ok(scenario.obstacles[0].x+scenario.obstacles[0].length/2<left);assert.ok(scenario.obstacles[1].x-scenario.obstacles[1].length/2>right);assert.ok(scenario.obstacles[1].x+scenario.obstacles[1].length/2<right+6);});
test("parking spaces use Korean standard dimensions",()=>{const reverse=SCENARIOS.find(s=>s.id==="reverse").target,front=SCENARIOS.find(s=>s.id==="front").target,parallel=SCENARIOS.find(s=>s.id==="parallel").target;assert.deepEqual([reverse.width,reverse.length],[2.6,5.2]);assert.deepEqual([front.width,front.length],[2.5,5]);assert.deepEqual([parallel.width,parallel.length],[2,6]);});
test("kei car remains within legal exterior dimensions",()=>{const kei=VEHICLES.find(v=>v.id==="kei");assert.ok(kei.width<=1.6);assert.ok(kei.length<=3.6);});
