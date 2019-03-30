/* globals auth */

(function() {

  auth.SignupFormC = Trillo.inherits(Trillo.Controller, function(viewSpec) {
    Trillo.Controller.call(this, viewSpec);
  });

  var SignupFormC = auth.SignupFormC.prototype;
  var Controller = Trillo.Controller.prototype;

  SignupFormC.postViewShown = function(view) {
    var authChoice = Trillo.appContext.authChoice;
    $(".js-hide-on-auth-choice-" + authChoice).addClass("trillo-display-none");
    $(".js-show-on-auth-choice-" + authChoice).removeClass("trillo-display-none");
  };

  SignupFormC.afterPost = function(result, view) {
    if (result.status === "failed") {
      Controller.afterPost.call(this, result, view);
    } else {
      $(".sign-up-form").addClass("trillo-display-none");
      $(".sign-up-message").removeClass("trillo-display-none");
    }
  };
})();