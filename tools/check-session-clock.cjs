'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),Clock=require('../session-clock.js');
test('zero is a valid start and active work plus scheduled rest keeps exact fractional seconds',()=>{
  const start=Clock.start(0);assert.deepEqual(start,{seconds:0,at:0,paused:false});
  const work=Clock.update(start,88125,false),rest=Clock.update(work,118375,false);
  assert.equal(work.seconds,88.125);assert.equal(rest.seconds,118.375);assert.equal(start.seconds,0);
});
test('entering a pause counts the preceding active interval, paused updates add none, and resume starts a fresh active interval',()=>{
  let clock=Clock.start(1000);clock=Clock.update(clock,11000,true);assert.equal(clock.seconds,10);
  clock=Clock.update(clock,31000,true);assert.equal(clock.seconds,10);
  clock=Clock.update(clock,61000,false);assert.equal(clock.seconds,10);
  clock=Clock.update(clock,66000,false);assert.equal(clock.seconds,15);
});
test('a finished paused clock never gains seconds during later displays or repeated saves',()=>{
  const finished=Clock.update(Clock.start(0),90000,true);
  assert.equal(finished.seconds,90);
  assert.equal(Clock.update(finished,86400000,true).seconds,90);
  assert.equal(Clock.update(finished,90000,true).seconds,90);
});
test('reload or return excludes time away, preserves saved seconds and resumes paused',()=>{
  const checkpoint=Clock.update(Clock.start(0),10000,false),saved=JSON.parse(JSON.stringify(checkpoint));
  let clock=Clock.resume(saved,610000);assert.deepEqual(clock,{seconds:10,at:610000,paused:true});
  clock=Clock.update(clock,620000,false);assert.equal(clock.seconds,10);
  clock=Clock.update(clock,625250,true);assert.equal(clock.seconds,15.25);assert.equal(saved.seconds,10);
});
test('backward wall-clock changes never subtract or recount a previously charged interval',()=>{
  const current=Clock.update(Clock.start(10000),20000,false),back=Clock.update(current,15000,false);
  assert.equal(back.seconds,10);assert.equal(back.at,20000);
  assert.equal(Clock.update(back,18000,false).seconds,10);
  assert.equal(Clock.update(back,20000,false).seconds,10);
  assert.equal(Clock.update(back,22000,false).seconds,12);
  const paused=Clock.update(current,15000,true);assert.equal(Clock.update(paused,25000,true).seconds,10);
});
test('resume can anchor to a changed wall clock while retaining only known elapsed seconds',()=>{
  const current=Clock.update(Clock.start(10000),20000,false),resumed=Clock.resume(current,5000);
  assert.deepEqual(resumed,{seconds:10,at:5000,paused:true});
  const active=Clock.update(resumed,6000,false);assert.equal(Clock.update(active,7000,true).seconds,11);
});
test('unknown/malformed clocks and times are rejected rather than becoming fabricated elapsed zero',()=>{
  for(const raw of [undefined,null,{},[],{seconds:0,at:0},{seconds:'0',at:0,paused:false},{seconds:-1,at:0,paused:false},{seconds:0,at:null,paused:false},{seconds:0,at:0,paused:'false'}]){
    assert.equal(Clock.sanitize(raw),null);assert.equal(Clock.update(raw,1000,false),null);assert.equal(Clock.resume(raw,1000),null);
  }
  for(const now of [undefined,null,'0',-1,Infinity,NaN,1e20]){assert.equal(Clock.start(now),null);assert.equal(Clock.update(Clock.start(0),now,false),null);}
  assert.equal(Clock.update(Clock.start(0),1000,undefined),null);
});
test('sanitization returns a detached immutable snapshot without modifying or retaining input fields',()=>{
  const input=Object.freeze({seconds:0.25,at:1000,paused:false,extra:{private:true}}),clock=Clock.sanitize(input);
  assert.deepEqual(clock,{seconds:.25,at:1000,paused:false});assert.notEqual(clock,input);assert.ok(Object.isFrozen(clock));
  assert.throws(()=>{clock.seconds=99;},TypeError);assert.equal(input.seconds,.25);
});
