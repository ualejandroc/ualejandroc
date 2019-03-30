/* globals UM */
/* globals Shared */
(function() {

  UM.UMC = Trillo.inherits(Shared.AppC, function(viewSpec) {
    Shared.AppC.call(this, viewSpec);
  });

  var UMC = UM.UMC.prototype;
  var AppC = Shared.AppC.prototype;

  UMC.handleAction = function(actionName, selectedObj) {
    var formName = null;
    var data = null;
    var postUrl = null;
    if (actionName === "newUser") {
      formName = "NewUserForm";
      data = {
        role : "admin"
      };
      postUrl = "/_service/um/newUser";
    } else if (actionName === "editUser") {
      formName = "EditUserForm";
      data = $.extend({}, selectedObj);
      postUrl = "/_service/um/editUser";
    } else if (actionName === "resetPassword") {
      formName = "ResetPasswordForm";
      data = $.extend({}, selectedObj);
      postUrl = "/_service/um/resetPassword";
    }
    if (formName) {
      this.showView({
        name : formName,
        type : Trillo.ViewType.Form,
        container : 'trillo-dialog-container',
        postUrl : postUrl,
        data : data
      });
      return true;
    }
    return AppC.handleAction.call(this, actionName, selectedObj);
  };

  UMC.afterPost = function(result, view) {
    var user, viewUserList;
    this.showResult(result);
    if (result.status === "success") {
      if (view.name === "NewUserForm" || view.name === "EditUserForm") {
        user = result.props.user;
        viewUserList = this.viewByName("UserList");
        if (view.name === "NewUserForm") {
          viewUserList.model().addObj(user);
        } else {
          viewUserList.model().changeObj(user);
        }
      }
    }
  };
})();
