  // ---- solarpunk touch effect: one-shot leaf halo + persistent spinning gear ----
  function spawnClickEffect(x, y){
    var wrap = document.createElement('div');
    wrap.className = 'click-fx';
    wrap.style.left = x + 'px';
    wrap.style.top = y + 'px';

    var halo = document.createElement('div');
    halo.className = 'click-halo';
    var n = 7 + Math.floor(Math.random() * 3);
    for (var i = 0; i < n; i++){
      var ang = (360 / n) * i + Math.random() * 12;
      var leaf = document.createElementNS(svgNS, 'svg');
      leaf.setAttribute('viewBox', '0 0 100 120');
      leaf.classList.add('halo-leaf');
      leaf.style.setProperty('--ang', ang + 'deg');
      leaf.style.setProperty('--r', (34 + Math.random() * 16) + 'px');
      leaf.style.animationDelay = (Math.random() * 80) + 'ms';
      var leafUse = document.createElementNS(svgNS, 'use');
      leafUse.setAttribute('href', '#leafShape');
      leaf.appendChild(leafUse);
      halo.appendChild(leaf);
    }
    wrap.appendChild(halo);

    document.body.appendChild(wrap);
    setTimeout(function(){ wrap.remove(); }, 1300);
  }

  function spawnHoldGear(x, y){
    var gear = document.createElementNS(svgNS, 'svg');
    gear.setAttribute('viewBox', '0 0 100 100');
    gear.classList.add('hold-gear', 'intro');
    gear.style.left = x + 'px';
    gear.style.top = y + 'px';
    var use = document.createElementNS(svgNS, 'use');
    use.setAttribute('href', '#gearShape');
    gear.appendChild(use);
    document.body.appendChild(gear);
    gear.addEventListener('animationend', function onIntroEnd(){
      gear.removeEventListener('animationend', onIntroEnd);
      gear.classList.remove('intro');
      gear.classList.add('loop');
    });
    return gear;
  }

  // ---- generative spiral held around the touch point: a = Curve(cos^3(t)e^(kt), sin^3(t)e^(kt), t, 0, 60*PI) ----
  function createSpiralSvg(x, y){
    var size = 460;
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', (-size / 2) + ' ' + (-size / 2) + ' ' + size + ' ' + size);
    svg.classList.add('spiral-curve');
    svg.style.left = x + 'px';
    svg.style.top = y + 'px';
    var gradId = 'spiralGrad' + Math.floor(Math.random() * 1e6);
    var defs = document.createElementNS(svgNS, 'defs');
    var grad = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id', gradId);
    grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '100%');
    [['0%', '#2F5233'], ['50%', '#5B8C5A'], ['100%', '#D9A441']].forEach(function(s){
      var stop = document.createElementNS(svgNS, 'stop');
      stop.setAttribute('offset', s[0]);
      stop.setAttribute('stop-color', s[1]);
      grad.appendChild(stop);
    });
    defs.appendChild(grad);
    svg.appendChild(defs);
    var poly = document.createElementNS(svgNS, 'polyline');
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', 'url(#' + gradId + ')');
    poly.setAttribute('stroke-width', '1.6');
    poly.setAttribute('stroke-linecap', 'round');
    poly.setAttribute('stroke-linejoin', 'round');
    poly.classList.add('spiral-path');
    svg.appendChild(poly);
    document.body.appendChild(svg);
    return svg;
  }

  function updateSpiralPath(svg, k){
    var poly = svg.querySelector('.spiral-path');
    if (!poly) return;
    var count = 900;
    var tMax = 60 * Math.PI;
    var xs = new Array(count + 1);
    var ys = new Array(count + 1);
    var maxMag = 0.0001;
    for (var i = 0; i <= count; i++){
      var t = (i / count) * tMax;
      var c = Math.cos(t), s = Math.sin(t);
      var env = Math.exp(k * t);
      var x = c * c * c * env;
      var y = s * s * s * env;
      xs[i] = x; ys[i] = y;
      var mag = Math.abs(x) > Math.abs(y) ? Math.abs(x) : Math.abs(y);
      if (mag > maxMag) maxMag = mag;
    }
    var scale = 200 / maxMag;
    var pts = new Array(count + 1);
    for (var j = 0; j <= count; j++){
      pts[j] = (xs[j] * scale).toFixed(1) + ',' + (ys[j] * scale).toFixed(1);
    }
    poly.setAttribute('points', pts.join(' '));
  }

  // ---- generative screen crack: jagged pattern revealed by a growing clip circle ----
  function addCrackLine(svg, points, isBranch){
    var d = 'M' + points.map(function(p){ return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' L');
    var path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'crack-line' + (isBranch ? ' crack-branch' : ''));
    svg.appendChild(path);
  }

  function buildCrackPattern(ox, oy){
    var w = window.innerWidth, h = window.innerHeight;
    var maxReach = Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy)) * 1.15;
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.classList.add('crack-overlay');
    var rayCount = 12 + Math.floor(Math.random() * 6);
    for (var i = 0; i < rayCount; i++){
      var angle = (Math.PI * 2 / rayCount) * i + (Math.random() * 0.3 - 0.15);
      var segs = 5 + Math.floor(Math.random() * 3);
      var segLen = maxReach / segs;
      var cx = ox, cy = oy;
      var points = [[cx, cy]];
      for (var s = 0; s < segs; s++){
        angle += (Math.random() * 0.5 - 0.25);
        var len = segLen * (0.7 + Math.random() * 0.6);
        cx += Math.cos(angle) * len;
        cy += Math.sin(angle) * len;
        points.push([cx, cy]);
        if (s > 1 && Math.random() < 0.35){
          var branchAngle = angle + (Math.random() * 1.4 - 0.7);
          var bx = cx + Math.cos(branchAngle) * segLen * 0.8;
          var by = cy + Math.sin(branchAngle) * segLen * 0.8;
          addCrackLine(svg, [[cx, cy], [bx, by]], true);
        }
      }
      addCrackLine(svg, points, false);
    }
    return svg;
  }

  function startScreenCrack(x, y){
    var svg = buildCrackPattern(x, y);
    var zero = 'circle(0px at ' + x + 'px ' + y + 'px)';
    var full = 'circle(150vmax at ' + x + 'px ' + y + 'px)';
    svg.style.clipPath = zero;
    svg.style.webkitClipPath = zero;
    document.body.appendChild(svg);
    void svg.getBoundingClientRect();
    requestAnimationFrame(function(){
      svg.style.transition = 'clip-path 5000ms linear, -webkit-clip-path 5000ms linear';
      svg.style.clipPath = full;
      svg.style.webkitClipPath = full;
    });
    return svg;
  }

  // ---- shared "on top of everything" typewriter overlay, used by both themes ----
  function startWelcomeTyping(fullText){
    var el = document.createElement('div');
    el.className = 'welcome-overlay';
    var span = document.createElement('span');
    span.className = 'welcome-text';
    el.appendChild(span);
    document.body.appendChild(el);
    var i = 0;
    var interval = setInterval(function(){
      i++;
      span.textContent = fullText.slice(0, i);
      if (i >= fullText.length){
        clearInterval(interval);
        span.classList.add('done');
      }
    }, 85);
    return { el: el, clearTyping: function(){ clearInterval(interval); } };
  }

