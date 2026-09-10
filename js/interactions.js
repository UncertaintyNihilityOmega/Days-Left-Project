  // ---- every 0.5s, every visible binary digit flips 0<->1 ----
  if (!reduceMotion){
    setInterval(function(){
      document.querySelectorAll('.cyber-zone-bit, .cyber-column span').forEach(function(el){
        el.textContent = el.textContent === '0' ? '1' : '0';
      });
    }, 500);
  }

  // ---- blood moon: an ambient timer and a hold-triggered one share the same visual ----
  var bloodMoonAmbientActive = false;
  var bloodMoonHoldActive = false;
  function updateBloodMoonVisual(){
    var moon = document.getElementById('moon');
    var flash = document.getElementById('hackFlash');
    var on = bloodMoonAmbientActive || bloodMoonHoldActive;
    if (moon) moon.classList.toggle('blood', on);
    if (flash) flash.classList.toggle('active', on);
  }

  function spawnHackLabel(x, y){
    var el = document.createElement('div');
    el.className = 'hack-label';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    var span = document.createElement('span');
    span.className = 'hack-text';
    span.textContent = '[HACKING]';
    el.appendChild(span);
    document.body.appendChild(el);
    cyberHackLabel = el;
  }

  var cyberHoldTimeout = null;
  var cyberBloodTimeout = null;
  var cyberWelcomeTimeout = null;
  var cyberWelcomeClear = null;
  var cyberWelcomeEl = null;
  var cyberHackLabel = null;
  var cyberHoldZone = null;

  function clearCyberHold(){
    if (cyberHoldTimeout){ clearTimeout(cyberHoldTimeout); cyberHoldTimeout = null; }
    if (cyberBloodTimeout){ clearTimeout(cyberBloodTimeout); cyberBloodTimeout = null; }
    if (cyberWelcomeTimeout){ clearTimeout(cyberWelcomeTimeout); cyberWelcomeTimeout = null; }
    if (cyberWelcomeClear){ cyberWelcomeClear(); cyberWelcomeClear = null; }
    if (cyberHoldZone){
      var z = cyberHoldZone; cyberHoldZone = null;
      z.classList.add('leaving');
      setTimeout(function(){ z.remove(); }, 300);
    }
    if (cyberHackLabel){
      var el = cyberHackLabel; cyberHackLabel = null;
      el.classList.add('leaving');
      setTimeout(function(){ el.remove(); }, 300);
    }
    if (cyberWelcomeEl){
      var wel = cyberWelcomeEl; cyberWelcomeEl = null;
      wel.classList.add('leaving');
      setTimeout(function(){ wel.remove(); }, 300);
    }
    if (bloodMoonHoldActive){
      bloodMoonHoldActive = false;
      updateBloodMoonVisual();
    }
  }

  var solarHoldGear = null;
  var solarCrackTimeout = null;
  var solarCrackEl = null;
  var solarWelcomeTimeout = null;
  var solarWelcomeClear = null;
  var solarWelcomeEl = null;
  var solarSpiralEl = null;
  var solarSpiralInterval = null;

  function startSolarHold(x, y){
    spawnClickEffect(x, y);
    solarHoldGear = spawnHoldGear(x, y);

    solarSpiralEl = createSpiralSvg(x, y);
    var startTime = Date.now();
    solarSpiralInterval = setInterval(function(){
      var heldSec = (Date.now() - startTime) / 1000;
      var k = Math.min(0.0015 + heldSec * 0.00045, 0.013);
      updateSpiralPath(solarSpiralEl, k);
    }, 160);

    solarCrackTimeout = setTimeout(function(){
      solarCrackEl = startScreenCrack(x, y);
      solarCrackTimeout = null;
    }, 15000);

    solarWelcomeTimeout = setTimeout(function(){
      var w = startWelcomeTyping('{Welcome to Solarpunk- User_}');
      solarWelcomeEl = w.el;
      solarWelcomeClear = w.clearTyping;
      solarWelcomeTimeout = null;
    }, 30000);
  }

  function clearSolarHold(){
    if (solarHoldGear){
      var g = solarHoldGear; solarHoldGear = null;
      g.classList.remove('intro', 'loop');
      g.classList.add('leaving');
      setTimeout(function(){ g.remove(); }, 350);
    }
    if (solarSpiralInterval){ clearInterval(solarSpiralInterval); solarSpiralInterval = null; }
    if (solarSpiralEl){
      var sp = solarSpiralEl; solarSpiralEl = null;
      sp.style.transition = 'opacity .4s ease';
      sp.style.opacity = '0';
      setTimeout(function(){ sp.remove(); }, 420);
    }
    if (solarCrackTimeout){ clearTimeout(solarCrackTimeout); solarCrackTimeout = null; }
    if (solarCrackEl){
      var c = solarCrackEl; solarCrackEl = null;
      c.style.transition = 'opacity .4s ease';
      c.style.opacity = '0';
      setTimeout(function(){ c.remove(); }, 420);
    }
    if (solarWelcomeTimeout){ clearTimeout(solarWelcomeTimeout); solarWelcomeTimeout = null; }
    if (solarWelcomeClear){ solarWelcomeClear(); solarWelcomeClear = null; }
    if (solarWelcomeEl){
      var w2 = solarWelcomeEl; solarWelcomeEl = null;
      w2.classList.add('leaving');
      setTimeout(function(){ w2.remove(); }, 300);
    }
  }

  var blackholeWell = null;
  var blackholeMoteInterval = null;
  var blackholeCollapseTimeout = null;
  var blackholeCollapseEl = null;
  var blackholeWelcomeTimeout = null;
  var blackholeWelcomeClear = null;
  var blackholeWelcomeEl = null;

  function startBlackholeHold(x, y){
    blackholeWell = document.createElement('div');
    blackholeWell.className = 'gravity-well';
    blackholeWell.style.left = x + 'px';
    blackholeWell.style.top = y + 'px';
    document.body.appendChild(blackholeWell);

    blackholeMoteInterval = setInterval(function(){
      var angle = Math.random() * Math.PI * 2;
      var radius = 50 + Math.random() * 110;
      var sx = x + Math.cos(angle) * radius, sy = y + Math.sin(angle) * radius;
      var dur = 0.7 + Math.random() * 0.5;
      var mote = createInfallMote(sx, sy, x, y, dur);
      setTimeout(function(){ mote.remove(); }, dur * 1000 + 100);
    }, 150);

    blackholeCollapseTimeout = setTimeout(function(){
      var el = document.createElement('div');
      el.className = 'void-collapse';
      el.style.setProperty('--px', x + 'px');
      el.style.setProperty('--py', y + 'px');
      document.body.appendChild(el);
      void el.getBoundingClientRect();
      requestAnimationFrame(function(){ el.classList.add('active'); });
      blackholeCollapseEl = el;
      blackholeCollapseTimeout = null;
    }, 15000);

    blackholeWelcomeTimeout = setTimeout(function(){
      var w = startWelcomeTyping('⟨Welcome to the Void- User_⟩');
      blackholeWelcomeEl = w.el;
      blackholeWelcomeClear = w.clearTyping;
      blackholeWelcomeTimeout = null;
    }, 30000);
  }

  function clearBlackholeHold(){
    if (blackholeWell){
      var w = blackholeWell; blackholeWell = null;
      w.classList.add('leaving');
      setTimeout(function(){ w.remove(); }, 350);
    }
    if (blackholeMoteInterval){ clearInterval(blackholeMoteInterval); blackholeMoteInterval = null; }
    if (blackholeCollapseTimeout){ clearTimeout(blackholeCollapseTimeout); blackholeCollapseTimeout = null; }
    if (blackholeCollapseEl){
      var c = blackholeCollapseEl; blackholeCollapseEl = null;
      c.classList.remove('active');
      setTimeout(function(){ c.remove(); }, 1450);
    }
    if (blackholeWelcomeTimeout){ clearTimeout(blackholeWelcomeTimeout); blackholeWelcomeTimeout = null; }
    if (blackholeWelcomeClear){ blackholeWelcomeClear(); blackholeWelcomeClear = null; }
    if (blackholeWelcomeEl){
      var wel = blackholeWelcomeEl; blackholeWelcomeEl = null;
      wel.classList.add('leaving');
      setTimeout(function(){ wel.remove(); }, 300);
    }
  }

  document.addEventListener('pointerdown', function(e){
    if (reduceMotion) return;
    var theme = currentTheme();
    if (theme === 'cyber'){
      var hx = e.clientX, hy = e.clientY;
      cyberHoldZone = spawnHoldRedZone(hx, hy);
      cyberHoldTimeout = setTimeout(function(){
        spawnHackLabel(hx, hy);
        cyberHoldTimeout = null;
      }, 2000);
      cyberBloodTimeout = setTimeout(function(){
        bloodMoonHoldActive = true;
        updateBloodMoonVisual();
        cyberBloodTimeout = null;
      }, 15000);
      cyberWelcomeTimeout = setTimeout(function(){
        var w = startWelcomeTyping('[Welcome to Cyberpunk- User_]');
        cyberWelcomeEl = w.el;
        cyberWelcomeClear = w.clearTyping;
        cyberWelcomeTimeout = null;
      }, 30000);
    } else if (theme === 'blackhole'){
      startBlackholeHold(e.clientX, e.clientY);
    } else {
      startSolarHold(e.clientX, e.clientY);
    }
  });
  function releaseHold(){
    clearCyberHold();
    clearSolarHold();
    clearBlackholeHold();
  }
  document.addEventListener('pointerup', releaseHold);
  document.addEventListener('pointercancel', releaseHold);
  window.addEventListener('blur', releaseHold);

  // ---- keep the ambient pools topped up, and run the periodic set-piece events ----
  ensureRedZones();
  ensureGreenColumns();
  ensureVoidMotes();
  if (!reduceMotion){
    setInterval(ensureRedZones, 4000);
    setInterval(ensureGreenColumns, 4000);
    setInterval(ensureVoidMotes, 4000);

    function triggerBloodMoonEvent(){
      if (currentTheme() !== 'cyber') return;
      bloodMoonAmbientActive = true;
      updateBloodMoonVisual();
      setTimeout(function(){
        bloodMoonAmbientActive = false;
        updateBloodMoonVisual();
      }, 10000);
    }
    setInterval(triggerBloodMoonEvent, 120000);
    setTimeout(triggerBloodMoonEvent, 20000); // early proof-of-life so it's easy to verify

    function triggerQuasarFlare(){
      if (currentTheme() !== 'blackhole') return;
      var flash = document.getElementById('voidFlash');
      var disks = document.querySelectorAll('.accretion-disk');
      if (flash) flash.classList.add('active');
      disks.forEach(function(d){ d.classList.add('flare'); });
      setTimeout(function(){
        if (flash) flash.classList.remove('active');
        disks.forEach(function(d){ d.classList.remove('flare'); });
      }, 10000);
    }
    setInterval(triggerQuasarFlare, 120000);
    setTimeout(triggerQuasarFlare, 20000);
  }
