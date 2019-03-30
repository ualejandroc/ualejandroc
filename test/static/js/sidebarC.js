/* globals test */

(function() {

  test.sidebarC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var sidebarC = test.sidebarC.prototype;
  var SharedC = Shared.SharedC.prototype;

  sidebarC.handleAction = function(actionName, selectedObj, $e, targetController) {
    return SharedC.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  sidebarC.postViewShown = function(view) {
    SharedC.postViewShown.call(this, view);
    if (view === this.view()) {
      var ctx = this.viewCtx().appContext;
      //var page = ctx.appName === ctx.page.name ? "home_" : ctx.page.name;
      //this.$elem().find(".trillo-selected").removeClass("trillo-selected");
      //this.$elem().find('[nm="' + page + '"]').addClass("trillo-selected");
    }
  };
})();
