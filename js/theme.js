  var svgNS = 'http://www.w3.org/2000/svg';
  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- restore saved theme before anything else reads it; otherwise default by time of day ----
  // 6am-12pm -> Solarpunk, 12pm-6pm -> Decensus Ad Nihilum, 6pm-6am -> Cyberpunk
  var THEME_CYCLE = ['solar', 'cyber', 'blackhole'];
  var THEME_NAMES = { solar: 'Solarpunk', cyber: 'Cyberpunk', blackhole: 'Decensus Ad Nihilum' };

  (function restoreTheme(){
    var saved = null;
    try { saved = localStorage.getItem('daysleft-theme'); } catch(e){}
    if (THEME_CYCLE.indexOf(saved) !== -1){
      root.setAttribute('data-theme', saved);
    } else {
      var hour = new Date().getHours();
      var theme;
      if (hour >= 6 && hour < 12) theme = 'solar';
      else if (hour >= 12 && hour < 18) theme = 'blackhole';
      else theme = 'cyber';
      root.setAttribute('data-theme', theme);
    }
  })();

  function currentTheme(){ return root.getAttribute('data-theme') || 'solar'; }
  function nextTheme(){
    var idx = THEME_CYCLE.indexOf(currentTheme());
    return THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
  }

  var themeStrings = {
    solar: {
      eyebrow: 'counting down to',
      label: 'days left',
      quoteEyebrow: 'a seed for today',
      quoteHint: 'tap to grow another thought',
      until: 'until ',
      itsHere: "It's here!",
      breakdown: function(parts){ return "That's " + parts.join(', ') + ' to go'; }
    },
    cyber: {
      eyebrow: 'system countdown //',
      label: 'cycles remaining',
      quoteEyebrow: 'signal from the grid',
      quoteHint: 'tap to reroute the signal',
      until: 'ETA ',
      itsHere: 'SYSTEM ARRIVED.',
      breakdown: function(parts){ return parts.join(', ') + ' until sync'; }
    },
    blackhole: {
      eyebrow: 'descending toward',
      label: 'days remain',
      quoteEyebrow: 'a whisper from the void',
      quoteHint: 'tap to fall further',
      until: 'event horizon: ',
      itsHere: 'THE DESCENT IS COMPLETE.',
      breakdown: function(parts){ return parts.join(', ') + ' until the descent completes'; }
    }
  };

  // ↓↓↓ EDIT THIS — the target date (YYYY-MM-DD) ↓↓↓
  var targetDate = new Date('2028-01-01T00:00:00');
  // ↑↑↑ EDIT THIS ↑↑↑

  function updateCounter(){
    var now = new Date();
    var msPerDay = 86400000;
    var totalDays = Math.max(0, Math.ceil((targetDate - now) / msPerDay));

    var y = targetDate.getFullYear() - now.getFullYear();
    var m = targetDate.getMonth() - now.getMonth();
    var d = targetDate.getDate() - now.getDate();
    if (d < 0){
      m--;
      var prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0){ y--; m += 12; }
    if (y < 0){ y = 0; m = 0; d = 0; }

    var t = themeStrings[currentTheme()];
    document.getElementById('dayCount').textContent = totalDays.toLocaleString();

    if (totalDays === 0){
      document.getElementById('breakdown').textContent = t.itsHere;
    } else {
      var parts = [];
      if (y > 0) parts.push(y + (y === 1 ? ' year' : ' years'));
      if (m > 0) parts.push(m + (m === 1 ? ' month' : ' months'));
      parts.push(d + (d === 1 ? ' day' : ' days'));
      document.getElementById('breakdown').textContent = t.breakdown(parts);
    }

    document.getElementById('untilLine').textContent =
      t.until + targetDate.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  }

  updateCounter();
  setInterval(updateCounter, 60000); // stays correct if left open past midnight

  // ---- motivational quotes: random order, never the same one twice in a row ----
  // ↓↓↓ EDIT THIS — replace with your own lines anytime ↓↓↓
  var quotesSolar = [
    "Small steps, planted daily, grow into forests.",
    "You are allowed to build slowly and still arrive.",
    "Every gear turns because another one trusted it to.",
    "Rest is part of the rotation, not a break from it.",
    "The sun returns whether you doubt it or not — so will your progress.",
    "Today's effort is a seed you won't see bloom yet. Plant it anyway.",
    "Growth is quiet before it is obvious.",
    "You don't need the whole forest today. Just the next leaf."
  ];
  var quotesCyber = [
    "The system doesn't break you. You break the system.",
    "Every countdown is a timer you haven't hacked yet.",
    "Chrome fades. What you compile into the net doesn't.",
    "You are not behind schedule. You are ahead of the machine.",
    "Neon burns brightest right before the server reboots.",
    "Debug your doubts before you debug your code.",
    "The grid remembers every line you ever ran.",
    "Tomorrow is just today's cache, cleared."
  ];
  var quotesBlackhole = [
    "Even light bends toward what it cannot escape. So do you, eventually, escape anyway.",
    "Nothing is not empty. It is only waiting to become.",
    "The void does not take from you. It makes room.",
    "Every ending collapses into a beginning too dense to see yet.",
    "You are allowed to disappear for a while and come back different.",
    "Silence is not absence. It is the universe holding its breath for you.",
    "What falls into the dark still exists. It only changes shape.",
    "Even a star becomes a doorway, in the end."
  ];
  // ↑↑↑ EDIT THIS ↑↑↑

  var lastQuoteIndex = -1;
  var lastQuoteTheme = null;
  function activeQuotes(){
    var t = currentTheme();
    if (t === 'cyber') return quotesCyber;
    if (t === 'blackhole') return quotesBlackhole;
    return quotesSolar;
  }
  function nextQuote(){
    var arr = activeQuotes();
    if (lastQuoteTheme !== currentTheme()){ lastQuoteIndex = -1; lastQuoteTheme = currentTheme(); }
    if (arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    var idx;
    do { idx = Math.floor(Math.random() * arr.length); } while (idx === lastQuoteIndex);
    lastQuoteIndex = idx;
    return arr[idx];
  }

  var quoteBox = document.getElementById('quoteBox');
  var quoteText = document.getElementById('quoteText');
  quoteText.textContent = nextQuote();

  function changeQuote(){
    quoteBox.classList.add('changing');
    setTimeout(function(){
      quoteText.textContent = nextQuote();
      quoteBox.classList.remove('changing');
    }, 220);
  }
  quoteBox.addEventListener('click', changeQuote);
  quoteBox.addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      changeQuote();
    }
  });

  // ---- theme toggle ----
  function applyThemeText(){
    var t = themeStrings[currentTheme()];
    document.getElementById('eyebrowText').textContent = t.eyebrow;
    document.getElementById('labelText').textContent = t.label;
    document.getElementById('quoteEyebrowText').textContent = t.quoteEyebrow;
    document.getElementById('quoteHintText').textContent = t.quoteHint;
    themeToggle.setAttribute('aria-label', 'Switch to ' + THEME_NAMES[nextTheme()] + ' theme');
    updateCounter();
  }

  var themeToggle = document.getElementById('themeToggle');
  function setTheme(theme){
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('daysleft-theme', theme); } catch(e){}
    applyThemeText();
    changeQuote();
    if (theme === 'cyber'){ ensureRedZones(); ensureGreenColumns(); }
    if (theme === 'blackhole'){ ensureVoidMotes(); }
  }
  themeToggle.addEventListener('click', function(){
    setTheme(nextTheme());
  });

  applyThemeText(); // sync labels with the restored/default theme

