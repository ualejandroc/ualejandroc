/* globals Shared */

(function() {

  Shared.AppC = Trillo.inherits(Trillo.Controller, function(viewSpec) {
    Trillo.Controller.call(this, viewSpec);
  });

  var AppC = Shared.AppC.prototype;
  var Controller = Trillo.Controller.prototype;

  AppC.handleAction = function(actionName, selectedObj, $e, targetController) {
    var formName = null;
    var data = null;
    var postUrl = null;
    if (actionName === "_logout") {
      Trillo.sessionStorage.removeItem("_trillo-access-token_");
      window.location.replace((Trillo.appContext.orgName ? Trillo.appContext.orgName + "/" : "") + "_logout");
      return true;
    } else if (actionName === "myProfile") {
      formName = "MyProfileForm";
      postUrl = "/_service/um/editUser";
      data = this.appCtx().user;
    } else if (actionName === "changeMyPassword") {
      formName = "PasswordForm";
      postUrl = "/_service/um/changePassword";
      data = this.appCtx().user;
    }
    if (formName) {
      this.showView({
        name : formName,
        postUrl : postUrl,
        type : Trillo.ViewType.Form,
        container : 'trillo-dialog-container',
        data : data
      });
      return true;
    }
    return Controller.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };
})();