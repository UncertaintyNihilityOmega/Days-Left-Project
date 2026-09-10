  // ---- Decensus Ad Nihilum: motes continuously falling into the event horizon ----
  function createInfallMote(startX, startY, targetX, targetY, dur, extraClass){
    var mote = document.createElement('span');
    mote.className = 'void-mote' + (extraClass ? ' ' + extraClass : '');
    mote.style.left = startX + 'px';
    mote.style.top = startY + 'px';
    mote.style.setProperty('--dx', (targetX - startX) + 'px');
    mote.style.setProperty('--dy', (targetY - startY) + 'px');
    mote.style.setProperty('--spin', (300 + Math.random() * 500) + 'deg');
    mote.style.animationDuration = dur + 's';
    document.body.appendChild(mote);
    return mote;
  }

  var MIN_VOID_MOTES = 6;
  var activeVoidMotes = 0;
  function ambientVoidTarget(){
    var horizon = document.querySelector('.event-horizon');
    var hr = horizon ? horizon.getBoundingClientRect() : null;
    if (hr && hr.width) return { x: hr.left + hr.width / 2, y: hr.top + hr.height / 2 };
    return { x: window.innerWidth / 2, y: window.innerHeight * 0.2 };
  }
  function spawnVoidMote(){
    if (currentTheme() !== 'blackhole') return;
    activeVoidMotes++;
    var target = ambientVoidTarget();
    var angle = Math.random() * Math.PI * 2;
    var radius = 100 + Math.random() * (Math.min(window.innerWidth, window.innerHeight) * 0.45);
    var startX = target.x + Math.cos(angle) * radius;
    var startY = target.y + Math.sin(angle) * radius;
    var dur = 3 + Math.random() * 3;
    var mote = createInfallMote(startX, startY, target.x, target.y, dur, 'blackhole-only');
    setTimeout(function(){
      mote.remove();
      activeVoidMotes--;
      spawnVoidMote();
    }, dur * 1000 + 100);
  }
  function ensureVoidMotes(){
    if (reduceMotion || currentTheme() !== 'blackhole') return;
    while (activeVoidMotes < MIN_VOID_MOTES){ spawnVoidMote(); }
  }

