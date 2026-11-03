// Fingerprint of an item as the app shipped it. An item on the phone whose fingerprint matches an
// older shipped version was never edited, so a newer version may replace it. Your own fields
// (favourite, your own photo or video, plan days) are not part of the fingerprint and are always kept, and neither is
// what training writes into a protocol's exercises (progress counters, the dose before an increase).
// A protocol where you only set doses (sets, reps, kilograms, rest…) keeps the same structure
// fingerprint, so it still gets a newer structure with your doses carried over.
// Shared by app.js and tools/seed-history.cjs: change both or neither.
(function(root){
  // yours, never shipped: favourite, own media, plan days, last change, a goal or kg suggestion you declined
  var SKIP = { id:1, fav:1, media:1, mediaType:1, updatedAt:1, days:1, goalSkip:1, kgSkip:1 };
  // written into a protocol's exercises by training: counters, the dose before an increase, its date ('easy' in 1.1–1.2)
  var STATE = { ok:1, fail:1, snoozeOk:1, up:1, prev:1, easy:1 };
  // the dose of one exercise in a protocol, and the goal of the period the doses were set for
  var DOSE = { measure:1, sets:1, reps:1, repsList:1, sec:1, kg:1, rest:1, sides:1, r0:1, r1:1 };
  var TOP_DOSE = { goal:1 };
  function canon(v){
    if (Array.isArray(v)) return v.map(canon);
    if (v && typeof v === 'object') return Object.keys(v).sort().filter(function(k){ return v[k] !== undefined; })
      .reduce(function(a, k){ a[k] = canon(v[k]); return a; }, {});
    return v;
  }
  function without(o, drop){ var a = {}; Object.keys(o).forEach(function(k){ if (!drop[k]) a[k] = o[k]; }); return a; }
  // the exercise editor of 1.1–1.4.1 saved every exercise with an empty video link and title (never shipped) and wrote an
  // empty source as null (shipped as ''): an exercise saved there unchanged, or with only your own photo, is not an edit.
  // (null becomes '' rather than the other way round, so no fingerprint of 1.1–1.4.1 or of the photo pack changes)
  function plain(t){
    if (t.video === '' || t.video === null) delete t.video;
    if (t.videoTitle === '' || t.videoTitle === null) delete t.videoTitle;
    if (t.source === null) t.source = '';
    if (t.sourceTitle === null) t.sourceTitle = '';
    return t;
  }
  function shape(o, top, item){
    if (!o || typeof o !== 'object' || Array.isArray(o)) return o;
    var t = plain(without(o, top));
    if (Array.isArray(t.items)) t.items = t.items.map(function(it){ return it && typeof it === 'object' && !Array.isArray(it) ? without(it, item) : it; });
    return t;
  }
  function hash(s){
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36) + '.' + s.length.toString(36);
  }
  var TOP_STRUCT = Object.assign({}, SKIP, TOP_DOSE), ITEM_STRUCT = Object.assign({}, STATE, DOSE);
  root.mtHashSkip = SKIP;
  root.mtStateKeys = Object.keys(STATE);
  root.mtDoseKeys = Object.keys(DOSE);
  root.mtCanon = function(o){ return JSON.stringify(canon(o)); };
  root.mtContentHash = function(o){ return hash(JSON.stringify(canon(shape(o, SKIP, STATE)))); };
  root.mtStructHash = function(o){ return hash(JSON.stringify(canon(shape(o, TOP_STRUCT, ITEM_STRUCT)))); };
  root.mtDoseHash = function(it){
    var d = {}; Object.keys(DOSE).forEach(function(k){ if (it && it[k] !== undefined) d[k] = it[k]; });
    return hash(JSON.stringify(canon(d)));
  };
})(typeof window !== 'undefined' ? window : globalThis);
