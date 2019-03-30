(function() {

  "use strict";
  Trillo.Login = function(viewSpec) {
    var appContext = Trillo.appContext || {};
    Trillo.appName = appContext.appName;
    Trillo.orgName = appContext.orgName;
    Trillo.appServedByDt = appContext.dtServerInst === "true";
    var authChoice = appContext.authChoice;
    $(".js-hide-on-auth-choice-" + authChoice).addClass("trillo-display-none");
    $(".js-show-on-auth-choice-" + authChoice).removeClass("trillo-display-none");
    // if the following line is commented then the login will follow
    // form submission and the server will handle is properly (except one caveat
    // that the server will not
    // honor the "hash" part of url (it really does not know about it).
    if (Trillo.using_jquery_validation) {
      this.validator = $("form").validate({
        errorClass : "trillo-field-error"
      });
    }
    $("form").on("submit", $.proxy(this.doLogin, this));
    $('[name="j_username"]').focus();
    this.validateSessionToken();
    Trillo.sessionStorage.clear();
  };

  var Login = Trillo.Login.prototype;

  /*
   * This method is used for ajax based login. Note we ignore url define as the
   * action attribute of the form. Instead use '/ajaxLogin' URL. Ajax based
   * login is essential for single page UI page redirection and not creating
   * history for the url where the server will normally redirect the page in
   * case of form submission (remember that url-hash is actively used to decide
   * the landing page).
   */
  Login.doLogin = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    if (Trillo.using_jquery_validation) {
      this.validator.form();
      if (!this.validator.valid()) {
        return;
      }
    } else if (Trillo.using_form_validator) {
      if (!Trillo.isFormValid($("form"))) {
        return;
      }
    }
    if (Trillo.runtimeUrl) {
      this.getAuthState();
    } else {
      this._doLogin('/ajaxLogin');
    }
  };

  Login._doLogin = function(loginUrl, p) {
    var $e = $("form");
    var data = p || {};
    var l = $e.serializeArray();
    $.each(l, function() {
      data[this.name] = this.value || '';
    });
    p = $.url(location.search).param();
    if (p) {
      $.each(p, function(key, value) {
        if (typeof data[key] === "undefined") {
          data[key] = value;
        }
      })
    }
    $.ajax(loginUrl, {
      'method' : 'post',
      'data' : Trillo.stringify(data),
      'error' : function() {}
    }).done(function(result) {
      $('body').removeClass('login-failed');
      var url = result.redirectUrl || (Trillo.appContext ? Trillo.appContext.redirectPath : null);
      if (!url) {
        url = result.redirectPath;
        if (!url) {
          url = Trillo.appContext ? Trillo.appContext.homeUrl : "/";
        }
      }
      window.location.replace(url);
    }).fail(function() {
      $('body').addClass('login-failed');
    });
  };

  Login.getAuthState = function() {
    $.ajax({
      url : "/_service/um/authState",
      type : 'post',
      data : Trillo.stringify({
        redirectUrl : Trillo.appContext ? Trillo.appContext.redirectPath : "/"
      }),
      contentType : "application/json",
      notCORS : true,
      x_org_name : "collager"
    }).done($.proxy(this._getAuthState, this));
  };

  Login._getAuthState = function(result) {
    if (result.data) {
      this._doLogin("/ajaxLogin", {
        client_id : "1",
        state : result.data
      });
    }
  };

  Login.validateSessionToken = function() {
    var t = Trillo.sessionStorage.getItem("_trillo-access-token_");
    var data = {
      accessToken : t
    }
    if (t != null) {
      $.ajax('/_validateAccessTokenReq', {
        'method' : 'post',
        'data' : Trillo.stringify(data),
        contentType : "application/json"
      }).done(function(result) {
        $('body').removeClass('login-failed');
        var url = result.redirectUrl || (Trillo.appContext ? Trillo.appContext.redirectPath : null);
        if (!url) {
          url = result.redirectPath;
          if (!url) {
            url = Trillo.appContext ? Trillo.appContext.homeUrl : "/";
          }
        }
        window.location.replace(url);
      }).fail(function() {
        $('.js-application').removeClass('trillo-hidden');
      });
    } else {
      $('.js-application').removeClass('trillo-hidden');
    }
  };

  $(document).ready(function() {
    new Trillo.Login();
  });

})();
