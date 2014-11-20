var svnr = window.svnr || {};

// console
svnr.log = function(mssg) {
  if(typeof window.console !== 'undefined') console.log(mssg);
};

svnr.validate = function() {
  if ( $.fn.validate === 'undefined' ) {
    return;
  }

  $('form.validate').each(function() {
    var form = $(this);

    form.validate();
  });
};

svnr.mask = function() {
  $('input.mask-phone').mask('+380 (99) 999-99-99');
};

svnr.count = function(_el, _settings) {
  var maxVal = (_settings && _settings.max) ? _settings.max : 99,
      minVal = (_settings && _settings.min) ? _settings.min : 1;

  $(_el).each(function() {
    var count = $(this),
        countInp = $('input:text', count),
        countPlus = $('a.up', count),
        countMinus = $('a.dn', count);

    if(countInp.val() !== parseInt(countInp.val(), 10)) {
      countInp.val(minVal);
    }

    countInp
      .on('keydown', function(_event) {
        if (((_event.which >= 33) && (_event.which <= 40)) || ((_event.which >= 96) && (_event.which <= 105)) || (_event.which == 45) || (_event.which == 8) || (_event.which == 9) || (_event.which == 13) || (_event.which == 27)) {
          return true;
        }
        if (((_event.which < 48) || (_event.which > 57)) ) {
          return false;
        }
        if ((_event.which == 46) && ($(this).value == '')) {
          return false;
        }
        return true;
      })
      .change(function() {
        svnr.cart.calc();
      });

    countPlus.on('click', function() {
      var countVal = parseInt(countInp.val(), 10);

      if(isNaN(countVal)) {
        countInp.val(minVal);
      } else if(countVal < maxVal) {
        countInp.val(countVal + 1);
      }

      svnr.cart.calc();

      return false;
    });

    countMinus.on('click', function() {
      var countVal = parseInt(countInp.val(), 10);

      if(isNaN(countVal)) {
        countInp.val(minVal);
      } else if(countVal > minVal) {
        countInp.val(countVal - 1);
      }

      svnr.cart.calc();

      return false;
    });
  });
};

svnr.cart = {
  calc: function() {
    var cart_total = 0;

    $('table.cart-tab', svnr.cart.holder).each(function() {
      var that = $(this);

      $('tr', that).each(function() {
        var tr = $(this),
            price = parseInt($('td.c-price', tr).text(), 10),
            quantity = parseInt($('div.cart-quantity input', tr).val(), 10),
            item_price = price * quantity;
        if ( !isNaN(item_price) ) {
          $('td.c-total', tr).text(item_price);
          cart_total += item_price;
        }
      });
    });

    $('div.cart-row', svnr.cart.holder).each(function() {
      var row = $(this),
          inp = $('input', row);

      if ( inp.is(':checked') ) {
        var panel_price = parseInt($('div.cart-price', row).text(), 10);
        cart_total += panel_price;
      }
    });

    $('div.cart-total span', svnr.cart.holder).text(cart_total);
  },
  init: function(el) {
    svnr.cart.holder = $(el);
    svnr.cart.calc();
    $('div.cart-row input').on('change.cart', function() {
      svnr.cart.calc();
    });
  }
};

svnr.item = {
  gall: function() {
    $('div.img-js').each(function() {
      var item = $(this);
      var itemImg = $('div.item-img img', item);
      var itemThumb = $('div.item-thumbs a', item);

      itemThumb.on('click.img', function() {
        itemImg.attr('src', $(this).attr('href'));
        return false;
      });
    });
  },
  carousel: function(el, settings) {
    $(el).each(function() {
      var crs = $(this),
          crs_slicer = $(settings.slicer, crs),
          crs_w = crs_slicer.width(),
          crs_node = $(settings.node, crs),
          crs_item = $(settings.item, crs_node),
          crs_width,
          crs_len = crs_item.length,
          crs_prev = $(settings.prev, crs),
          crs_next = $(settings.next, crs),
          crs_vis = settings.visible || 3,
          crs_current = 0,
          crs_speed = settings.speed || 250;

      if ( crs_len <= crs_vis ) {
        crs_prev.hide();
        crs_next.hide();
        crs_node.css({
          width: '100%'
        });
        return;
      }

      function __crsReset() {
        crs_w = crs_slicer.width();
        crs_width = crs_w/crs_vis;
        crs_item.css('width', crs_width);
        crs_node.css({
          position: 'relative',
          width: crs_width*crs_len,
          left: -crs_current*crs_width
        });
      }
      __crsReset();
      $(window).on('resize.crs', function() {
        __crsReset();
      });

      function __crslMove() {
        crs_node
          .stop()
          .animate({
            left: -crs_current*crs_width
          }, crs_speed, 'linear');
      }

      crs_prev.on('click.crs', function() {
        if (crs_current > 0) {
          crs_current--;
        } else {
          crs_current = crs_len - crs_vis;
        }

        __crslMove();

        return false;
      });

      crs_next.on('click.crs', function() {
        if (crs_current < crs_len - crs_vis) {
          crs_current++;
        } else {
          crs_current = 0;
        }

        __crslMove();

        return false;
      });
    });
  },
  init: function() {
    svnr.item.gall();
    svnr.item.carousel('div.carousel', {
      slicer: 'div.carousel-slicer',
      node: 'div.carousel-node',
      item: 'a.cat-item',
      prev: 'a.carousel-prev',
      next: 'a.carousel-next',
      speed: 250,
      visible: 3
    });
  }
};

svnr.nav = function() {
  $('div.nav ul').wrap('<div class="nav-slicer"></div>');
  $('div.nav div.nav-slicer').css({
    width: '100%',
    position: 'relative',
    overflow: 'hidden'
  })
  svnr.item.carousel('div.nav', {
    slicer: 'div.nav-slicer',
    node: 'ul',
    item: 'li',
    prev: 'a.nav-prev',
    next: 'a.nav-next',
    speed: 250,
    visible: 5
  });
};

// init
$(function() {
  svnr.validate();
  svnr.mask();
  svnr.count('div.cart-quantity', {
    min: 1,
    max: 99
  });
  svnr.cart.init('div.cart-js');
  $('div.custom-inputs').urForm({
    replaceCheckboxes: true,
    replaceRadios: true
  });
  svnr.item.init();
  svnr.nav();
});
