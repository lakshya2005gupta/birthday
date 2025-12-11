// public/animation/effect.js (replace whole file)

$(window).on('load', function () {
  $('.loading').fadeOut('fast');
  $('.container').fadeIn('fast');
});

$(document).ready(function () {
  var $win = $(window);
  var $container = $('.container');
  var $animationStage = $('.animation-stage');
  var isPlaying = false;
  var balloonsAnimating = false;
  var storyPlaying = false;

  // utility to compute usable width inside container
  function usableWidth() {
    var w = $container.width();
    return Math.max(300, w - 120);
  }

  // animate a single balloon inside container
  function animateBalloon($el) {
    if (!balloonsAnimating) return;
    var areaW = usableWidth();
    var left = Math.round(Math.random() * (areaW - 100));
    var bottom = Math.round(50 + Math.random() * 400);
    $el.animate({ left: left, bottom: bottom }, 10000, function () {
      animateBalloon($el);
    });
  }

  // LINE-UP offsets used when showing the wish
  function centerOffsets() {
    return [-350, -250, -150, -50, 50, 150, 250];
  }

  // ensure everything is sized/positioned on resize
  function layoutOnResize() {
    // nothing heavy; balloons are absolutely positioned by JS in runtime
  }

  $win.on('resize', layoutOnResize);

  // TURN ON - first user action
  $('#turn_on').on('click', function () {
    if (isPlaying) return;
    isPlaying = true;

    // hide the dramatic area and reveal the animation stage
    $('.dramatic-area').fadeOut(300, function () {
      $animationStage.fadeIn(400);
    });

    // mimic original: glow bulbs etc (if present)
    $('#bulb_yellow').addClass('bulb-glow-yellow');
    $('#bulb_red').addClass('bulb-glow-red');
    $('#bulb_blue').addClass('bulb-glow-blue');
    $('#bulb_green').addClass('bulb-glow-green');
    $('#bulb_pink').addClass('bulb-glow-pink');
    $('#bulb_orange').addClass('bulb-glow-orange');

    // after short delay reveal the play button (original flow)
    $(this).fadeOut('slow').delay(1200).promise().done(function () {
      $('#play').fadeIn('slow');
    });
  });

  // PLAY button - starts animation music & next stage
  $('#play').on('click', function () {
    if (!isPlaying) return;
    var audio = $('.song')[0];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(function () {});
    }

    $('#bulb_yellow').addClass('bulb-glow-yellow-after');
    $('#bulb_red').addClass('bulb-glow-red-after');
    $('#bulb_blue').addClass('bulb-glow-blue-after');
    $('#bulb_green').addClass('bulb-glow-green-after');
    $('#bulb_pink').addClass('bulb-glow-pink-after');
    $('#bulb_orange').addClass('bulb-glow-orange-after');

    $(this).fadeOut('slow').delay(800).promise().done(function () {
      $('#bannar_coming').fadeIn('slow');
    });
  });

  // BANNER
  $('#bannar_coming').on('click', function () {
    $('.bannar').addClass('bannar-come');
    $(this).fadeOut('slow').delay(1000).promise().done(function () {
      $('#balloons_flying').fadeIn('slow');
    });
  });

  // BALLOONS FLYING
  $('#balloons_flying').on('click', function () {
    if (balloonsAnimating) return;
    balloonsAnimating = true;

    $('.balloon-border').animate({ top: -500 }, 8000);
    $('#b1,#b4,#b5,#b7').addClass('balloons-rotate-behaviour-one');
    $('#b2,#b3,#b6').addClass('balloons-rotate-behaviour-two');

    // start loops
    $('#b1,#b2,#b3,#b4,#b5,#b6,#b7').each(function () {
      animateBalloon($(this));
    });

    $(this).fadeOut('slow').delay(500).promise().done(function () {
      $('#cake_fadein').fadeIn('slow');
    });
  });

  // CAKE fade in (this should appear after balloons)
  $('#cake_fadein').on('click', function () {
    // stop random movement briefly to show cake moment
    balloonsAnimating = false; // stop loops
    $('#b1,#b2,#b3,#b4,#b5,#b6,#b7').stop(true, true);

    $('.cake').fadeIn('slow');
    $(this).fadeOut('slow').delay(300).promise().done(function () {
      $('#light_candle').fadeIn('slow');
    });
  });

  // LIGHT CANDLE
  $('#light_candle').on('click', function () {
    $('.fuego').fadeIn('slow');
    $(this).fadeOut('slow').promise().done(function () {
      $('#wish_message').fadeIn('slow');
    });
  });

  // WISH MESSAGE - align balloons to row and reveal letters, then show story trigger
  $('#wish_message').on('click', function () {
    // stop any animation loops
    balloonsAnimating = false;
    $('#b1,#b2,#b3,#b4,#b5,#b6,#b7').stop(true, true);

    // compute center
    var containerW = $container.width();
    var centerX = Math.round(containerW / 2);
    var offsets = centerOffsets();

    // rename ids and animate to line positions
    $('#b1').attr('id', 'b11');
    $('#b2').attr('id', 'b22');
    $('#b3').attr('id', 'b33');
    $('#b4').attr('id', 'b44');
    $('#b5').attr('id', 'b55');
    $('#b6').attr('id', 'b66');
    $('#b7').attr('id', 'b77');

    $('#b11').animate({ top: 240, left: centerX + offsets[0] }, 800);
    $('#b22').animate({ top: 240, left: centerX + offsets[1] }, 800);
    $('#b33').animate({ top: 240, left: centerX + offsets[2] }, 800);
    $('#b44').animate({ top: 240, left: centerX + offsets[3] }, 800);
    $('#b55').animate({ top: 240, left: centerX + offsets[4] }, 800);
    $('#b66').animate({ top: 240, left: centerX + offsets[5] }, 800);
    $('#b77').animate({ top: 240, left: centerX + offsets[6] }, 800);

    // show letters now (fade in)
    $('.balloons .balloon-name').addClass('show').fadeIn(900);

    $(this).fadeOut('slow').delay(1000).promise().done(function () {
      $('#story').fadeIn('slow');
    });
  });

  // STORY sequence (long text reveal). When story completes, send message to parent
  $('#story').on('click', function () {
    if (storyPlaying) return;
    storyPlaying = true;

    $(this).fadeOut('slow');
    $('.cake').fadeOut('fast').promise().done(function () {
      $('.message').fadeIn('slow');
    });

    // improved message loop with safe indexing and longer delay
    var paragraphs = $('.message p');
    var i = 0;

    function showNextPara() {
      if (i > 0) {
        $(paragraphs[i - 1]).fadeOut('slow');
      }
      if (i >= paragraphs.length) {
        // story finished — show cake and notify parent
        $('.cake').fadeIn('fast');
        // notify parent that entire animation finished
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'animation-done' }, '*');
          }
        } catch (e) {}
        return;
      }
      $(paragraphs[i]).fadeIn('slow').delay(1300).promise().done(function () {
        i++;
        showNextPara();
      });
    }

    showNextPara();
  });

});
