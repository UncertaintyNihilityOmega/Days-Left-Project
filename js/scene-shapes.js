  // ---- clock bezel ticks, drawn in code ----
  (function initBezel(){
    var g = document.getElementById('bezelTicks');
    if (!g) return;
    for (var i = 0; i < 24; i++){
      var angle = i * 15;
      var major = (i % 6 === 0);
      var line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', '100');
      line.setAttribute('y1', major ? '7' : '12');
      line.setAttribute('x2', '100');
      line.setAttribute('y2', major ? '21' : '18');
      line.setAttribute('transform', 'rotate(' + angle + ' 100 100)');
      line.setAttribute('stroke-linecap', 'round');
      line.classList.add(major ? 'tick-major' : 'tick-minor');
      g.appendChild(line);
    }
  })();

  // ---- drifting background leaves, drawn in code ----
  (function initBgLeaves(){
    var layer = document.getElementById('bgLayer');
    if (!layer) return;
    var colors = ['var(--fern)', 'var(--sprout)', 'var(--moss)'];
    var count = 15;
    for (var i = 0; i < count; i++){
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 100 120');
      svg.classList.add('bg-leaf');
      var use = document.createElementNS(svgNS, 'use');
      use.setAttribute('href', '#leafShape');
      svg.appendChild(use);

      var size = 16 + Math.random() * 26;
      var left = Math.random() * 100;
      var top = Math.random() * 100;
      var dur = 6 + Math.random() * 8;
      var delay = Math.random() * -dur;
      var rot = Math.random() * 40 - 20;
      var opacity = 0.22 + Math.random() * 0.28;

      svg.style.width = size + 'px';
      svg.style.height = (size * 1.2) + 'px';
      svg.style.left = left + 'vw';
      svg.style.top = top + 'vh';
      svg.style.color = colors[i % colors.length];
      svg.style.opacity = opacity;
      svg.style.setProperty('--rot', rot + 'deg');
      svg.style.animationDuration = dur + 's';
      svg.style.animationDelay = delay + 's';

      layer.appendChild(svg);
    }
  })();

  // ---- lotus flower petals, drawn in code ----
  (function initLotusFlower(){
    var outer = document.getElementById('petalsOuter');
    var inner = document.getElementById('petalsInner');
    var stamens = document.getElementById('lotusStamens');
    if (!outer || !inner) return;
    var cx = 120, cy = 150;
    function petalPath(len, width){
      var tipY = cy - len;
      var mid1 = cy - len * 0.32;
      var mid2 = cy - len * 0.72;
      var half = width / 2;
      return 'M' + cx + ',' + cy +
        ' C' + (cx - half) + ',' + mid1 + ' ' + (cx - half) + ',' + mid2 + ' ' + cx + ',' + tipY +
        ' C' + (cx + half) + ',' + mid2 + ' ' + (cx + half) + ',' + mid1 + ' ' + cx + ',' + cy + ' Z';
    }
    for (var i = 0; i < 6; i++){
      var p = document.createElementNS(svgNS, 'path');
      p.setAttribute('d', petalPath(125, 50));
      p.setAttribute('fill', 'url(#petalOuter)');
      p.setAttribute('transform', 'rotate(' + (i * 60) + ' ' + cx + ' ' + cy + ')');
      outer.appendChild(p);
    }
    for (var j = 0; j < 6; j++){
      var p2 = document.createElementNS(svgNS, 'path');
      p2.setAttribute('d', petalPath(88, 38));
      p2.setAttribute('fill', 'url(#petalInner)');
      p2.setAttribute('transform', 'rotate(' + (j * 60 + 30) + ' ' + cx + ' ' + cy + ')');
      inner.appendChild(p2);
    }
    if (stamens){
      for (var k = 0; k < 8; k++){
        var a = (k * 45) * Math.PI / 180;
        var x1 = cx + Math.cos(a) * 21, y1 = cy + Math.sin(a) * 21;
        var x2 = cx + Math.cos(a) * 28, y2 = cy + Math.sin(a) * 28;
        var line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', x1); line.setAttribute('y1', y1);
        line.setAttribute('x2', x2); line.setAttribute('y2', y2);
        stamens.appendChild(line);
      }
    }
  })();

  // ---- cyberpunk scene: stars + skyline, drawn in code ----
  (function initCyberScene(){
    var starWrap = document.getElementById('cyberStars');
    if (starWrap){
      for (var i = 0; i < 45; i++){
        var s = document.createElement('span');
        s.className = 'cyber-star';
        s.style.left = (Math.random() * 100) + 'vw';
        s.style.top = (Math.random() * 55) + 'vh';
        var sz = 1 + Math.random() * 1.7;
        s.style.width = sz + 'px';
        s.style.height = sz + 'px';
        s.style.animationDuration = (2 + Math.random() * 3) + 's';
        s.style.animationDelay = (Math.random() * 4) + 's';
        starWrap.appendChild(s);
      }
    }

    var skyline = document.getElementById('cyberSkyline');
    if (skyline){
      var n = 16;
      for (var b = 0; b < n; b++){
        var building = document.createElement('div');
        building.className = 'cyber-building';
        var w = 40 + Math.random() * 70;
        var h = 60 + Math.random() * 190;
        building.style.width = w + 'px';
        building.style.height = h + 'px';
        building.style.left = (b / n * 100) + (Math.random() * 3) + '%';
        var rows = Math.floor(h / 18);
        for (var r = 0; r < rows; r++){
          if (Math.random() < 0.55){
            var win = document.createElement('span');
            win.className = 'cyber-window';
            win.style.left = (6 + Math.random() * (w - 16)) + 'px';
            win.style.top = (8 + r * 18) + 'px';
            var wc = Math.random() < 0.7 ? '#ffce6b' : '#37f2ff';
            win.style.background = wc;
            win.style.color = wc;
            building.appendChild(win);
          }
        }
        skyline.appendChild(building);
      }
    }

    function addSpokes(groupId, cx, cy, rInner, rOuter){
      var g = document.getElementById(groupId);
      if (!g) return;
      for (var i = 0; i < 6; i++){
        var a = (i * 60) * Math.PI / 180;
        var x1 = cx + Math.cos(a) * rInner, y1 = cy + Math.sin(a) * rInner;
        var x2 = cx + Math.cos(a) * rOuter, y2 = cy + Math.sin(a) * rOuter;
        var line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', x1); line.setAttribute('y1', y1);
        line.setAttribute('x2', x2); line.setAttribute('y2', y2);
        g.appendChild(line);
      }
    }
    addSpokes('wheelSpokesRear', 88, 150, 8, 26);
    addSpokes('wheelSpokesFront', 300, 150, 8, 26);
  })();

  // ---- Decensus Ad Nihilum: starfield, drawn in code ----
  (function initBlackholeScene(){
    var starWrap = document.getElementById('voidStars');
    if (!starWrap) return;
    for (var i = 0; i < 60; i++){
      var s = document.createElement('span');
      s.className = 'cyber-star blackhole-only';
      s.style.left = (Math.random() * 100) + 'vw';
      s.style.top = (Math.random() * 100) + 'vh';
      var sz = 1 + Math.random() * 1.8;
      s.style.width = sz + 'px';
      s.style.height = sz + 'px';
      s.style.animationDuration = (2 + Math.random() * 3) + 's';
      s.style.animationDelay = (Math.random() * 4) + 's';
      starWrap.appendChild(s);
    }
  })();

