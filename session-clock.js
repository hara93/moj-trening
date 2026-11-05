/* Exact known elapsed training time. Scheduled rests count while active;
   explicit pauses and time away after a saved checkpoint do not. No storage. */
(function(root,factory){
  'use strict';var api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.SessionClock=api;
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  var finite=function(n){return typeof n==='number'&&Number.isFinite(n);};
  var time=function(n){return finite(n)&&n>=0&&Number.isFinite(new Date(n).getTime());};
  function value(seconds,at,paused){return Object.freeze({seconds:seconds,at:at,paused:paused});}
  function sanitize(clock){
    return clock&&typeof clock==='object'&&!Array.isArray(clock)&&finite(clock.seconds)&&clock.seconds>=0&&time(clock.at)&&typeof clock.paused==='boolean'
      ?value(clock.seconds,clock.at,clock.paused):null;
  }
  function start(now){return time(now)?value(0,now,false):null;}
  function update(clock,now,paused){
    var previous=sanitize(clock);
    if(!previous||!time(now)||typeof paused!=='boolean')return null;
    // Never move the anchor backwards and then charge the same interval twice.
    var at=Math.max(previous.at,now),seconds=previous.seconds+(previous.paused?0:(at-previous.at)/1000);
    return finite(seconds)?value(seconds,at,paused):null;
  }
  function resume(saved,now){var previous=sanitize(saved);return previous&&time(now)?value(previous.seconds,now,true):null;}
  return Object.freeze({version:1,start:start,sanitize:sanitize,update:update,resume:resume});
});
