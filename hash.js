// Fingerprint of an item as the app shipped it. An item on the phone whose fingerprint matches an
// older shipped version was never edited, so a newer version may replace it. Your own fields
// (favourite, video, plan days) are not part of the fingerprint and are always kept.
// Shared by app.js and tools/seed-history.cjs: change both or neither.
(function(root){
  var SKIP = { id:1, fav:1, media:1, mediaType:1, updatedAt:1, days:1 };
  function normalise(v, top){
    if (Array.isArray(v)) return v.map(function(x){ return normalise(x, false); });
    if (v && typeof v === 'object') return Object.keys(v).sort().filter(function(k){ return !(top && SKIP[k]) && v[k] !== undefined; })
      .reduce(function(a, k){ a[k] = normalise(v[k], false); return a; }, {});
    return v;
  }
  root.mtHashSkip = SKIP;
  root.mtContentHash = function(o){
    var s = JSON.stringify(normalise(o, true)), h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36) + '.' + s.length.toString(36);
  };
})(typeof window !== 'undefined' ? window : globalThis);
