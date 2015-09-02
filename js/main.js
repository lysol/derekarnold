jQuery.fn.preload = function(cb) {
    this.each(function(){
        $('<img/>')[0].src = this;
    });
    cb();
};

jQuery.fn.viewPath = function() {
  var viewPath = $(this).data('viewPath');
  if (viewPath === undefined) {
    return '/' + $(this).attr('id');
  } else {
    return viewPath;
  }
};

jQuery.fn.setupViewLinks = function() {
  $(this).each(function() {
      $(this)
        .on('click', function() {
            activateView($(this).data('view'), true);
            return false;
          })
        .attr('href', $(this).viewPath());
    });
};

jQuery.fn.activate = function() {
  activateView($(this).attr('id'), false);
};

function activateView(viewID, setState) {
  var viewContainer = $('#' + viewID);
  renderView.apply(viewContainer, [viewContainer.data('view'), function() {
    $('.view-container:not(#' + viewID + ')').hide();
    viewContainer.show();
    $('body').attr('id', 'view-' + viewID);

    if (!viewContainer.hasClass('first-view')) {
      $('#back-home').show();
    } else {
      $('#back-home').hide();
    }

    var viewPath = viewContainer.data('viewPath');
    if (viewPath === undefined) {
      viewPath = '/' + viewID;
    }

    if (setState === undefined || setState) history.pushState(viewID, null, viewPath);

    $(this).find('a.view-link').setupViewLinks();
  }]);
}

function renderView(view, callback) {
  $(this).load('templates/' + view, callback);
}

jQuery(document).on('ready', function() {

  $(['new/images/galveston-mobile.jpg','new/images/galveston.jpg']).preload(function() {
    $('#container').css('height', ($(window).height() + 400) + 'px');

    window.setTimeout(function() {
      $('#container').addClass('show');
    }, 2000);

    $(window).on('resize', function() {
      $('#container').css('height', ($(window).height() + 400) + 'px');
    });
  });

  $('.view-link').setupViewLinks();

  $('.view-container').each(function() {
    var viewPath = $(this).viewPath();
    var re = new RegExp('^' + viewPath + '$');
    console.log(viewPath, window.location.pathname);
    if (window.location.pathname.match(re)) {
      console.log('activate', viewPath, re);
      $(this).activate(false);
      return false;
    }
  });
});

window.addEventListener("popstate", function(e) {
  activateView(e.state, false);
}, false);
