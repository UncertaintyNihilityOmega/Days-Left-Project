  // ---- cyberpunk red zones: stationary square areas with flickering digits ----
  var MIN_RED_ZONES = 3;
  var activeRedZones = 0;
  function pickZonePosition(size){
    var cardEl = document.querySelector('.card');
    var cardRect = cardEl ? cardEl.getBoundingClientRect() : null;
    var w = window.innerWidth, h = window.innerHeight;
    var margin = 16;
    for (var attempt = 0; attempt < 12; attempt++){
      var x = Math.random() * Math.max(1, w - size);
      var y = Math.random() * Math.max(1, h - size);
      if (!cardRect) return { x: x, y: y };
      var overlaps = !(x + size < cardRect.left - margin || x > cardRect.right + margin ||
                        y + size < cardRect.top - margin || y > cardRect.bottom + margin);
      if (!overlaps) return { x: x, y: y };
    }
    // fallback: force it to whichever side of the card has more room
    var leftRoom = cardRect ? cardRect.left - margin - size : 0;
    var rightRoom = cardRect ? w - cardRect.right - margin - size : 0;
    var x2, y2 = Math.random() * Math.max(1, h - size);
    if (leftRoom > rightRoom && leftRoom > 0){ x2 = Math.random() * leftRoom; }
    else if (rightRoom > 0){ x2 = cardRect.right + margin + Math.random() * rightRoom; }
    else { x2 = Math.random() * Math.max(1, w - size); }
    return { x: x2, y: y2 };
  }
  function spawnRedZone(){
    if (currentTheme() !== 'cyber') return;
    activeRedZones++;
    var zone = document.createElement('div');
    zone.className = 'cyber-zone cyber-only';
    var size = 90 + Math.random() * 55;
    zone.style.width = size + 'px';
    zone.style.height = size + 'px';
    var pos = pickZonePosition(size);
    zone.style.left = pos.x + 'px';
    zone.style.top = pos.y + 'px';
    var digitCount = 5 + Math.floor(Math.random() * 4);
    for (var i = 0; i < digitCount; i++){
      var d = document.createElement('span');
      d.className = 'cyber-zone-bit';
      d.textContent = Math.random() < 0.5 ? '0' : '1';
      d.style.left = (8 + Math.random() * (size - 26)) + 'px';
      d.style.top = (8 + Math.random() * (size - 26)) + 'px';
      d.style.animationDelay = (Math.random() * 2) + 's';
      d.style.animationDuration = (0.8 + Math.random() * 1.2) + 's';
      zone.appendChild(d);
    }
    document.body.appendChild(zone);
    var stay = 3000 + Math.random() * 3000;
    setTimeout(function(){
      zone.classList.add('leaving');
      setTimeout(function(){
        zone.remove();
        activeRedZones--;
        spawnRedZone();
      }, 300);
    }, stay);
  }
  function ensureRedZones(){
    if (reduceMotion || currentTheme() !== 'cyber') return;
    while (activeRedZones < MIN_RED_ZONES){ spawnRedZone(); }
  }

  function spawnHoldRedZone(x, y){
    var size = 140;
    var zone = document.createElement('div');
    zone.className = 'cyber-zone cyber-zone-hold';
    zone.style.left = x + 'px';
    zone.style.top = y + 'px';
    zone.style.width = size + 'px';
    zone.style.height = size + 'px';
    for (var i = 0; i < 12; i++){
      var d = document.createElement('span');
      d.className = 'cyber-zone-bit';
      d.textContent = Math.random() < 0.5 ? '0' : '1';
      d.style.left = (10 + Math.random() * (size - 32)) + 'px';
      d.style.top = (10 + Math.random() * (size - 32)) + 'px';
      d.style.animationDelay = (Math.random() * 2) + 's';
      d.style.animationDuration = (0.7 + Math.random()) + 's';
      zone.appendChild(d);
    }
    document.body.appendChild(zone);
    return zone;
  }

  // ---- cyberpunk green rain: minimum 3 falling columns at all times ----
  var MIN_GREEN_COLUMNS = 3;
  var activeGreenColumns = 0;
  function spawnGreenColumn(){
    if (currentTheme() !== 'cyber') return;
    activeGreenColumns++;
    var col = document.createElement('div');
    col.className = 'cyber-column cyber-only';
    var len = 14 + Math.floor(Math.random() * 10);
    for (var i = 0; i < len; i++){
      var s = document.createElement('span');
      s.textContent = Math.random() < 0.5 ? '0' : '1';
      col.appendChild(s);
    }
    col.style.left = (Math.random() * 96) + 'vw';
    var dur = 3.5 + Math.random() * 2.5;
    col.style.animationDuration = dur + 's';
    document.body.appendChild(col);
    setTimeout(function(){
      col.remove();
      activeGreenColumns--;
      spawnGreenColumn();
    }, dur * 1000 + 100);
  }
  function ensureGreenColumns(){
    if (reduceMotion || currentTheme() !== 'cyber') return;
    while (activeGreenColumns < MIN_GREEN_COLUMNS){ spawnGreenColumn(); }
  }

