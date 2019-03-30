/* globals test */

(function() {

  test.topNavC = Trillo.inherits(Shared.SharedC, function(viewSpec) {
    Shared.SharedC.call(this, viewSpec);
  });

  var topNavC = test.topNavC.prototype;
  var SharedC = Shared.SharedC.prototype;

  topNavC.handleAction = function(actionName, selectedObj, $e, targetController) {
    return SharedC.handleAction.call(this, actionName, selectedObj, $e, targetController);
  };

  topNavC.postViewShown = function(view) {
    SharedC.postViewShown.call(this, view);
  };

  topNavC.postViewSetup = function(view) {
    SharedC.postViewSetup.call(this, view);
    if (view === this.view()) {
      md.initMinimizeSidebar();
    }
  };
})();
