/* globals Shared */

(function() {

  "use strict";

  Shared.AppSuggestionListManager = function() {
    this.suggestionsBySource = {};
    this.deferredListBySource = {};
  };

  var AppSuggestionListManager = Shared.AppSuggestionListManager.prototype;

  // return promise.
  AppSuggestionListManager.getAutoCompleteSuggestions = function(source, name) {
    return this.getSuggestions(source, name, "autocomplete");
  };

  // return promise.
  AppSuggestionListManager.getTokenizerSuggestions = function(source, name) {
    var suggestions = this.suggestionsBySource[source];
    var myDeferred;
    var deferredList
    if (suggestions) {
      myDeferred = $.Deferred();
      myDeferred.resolve(suggestions);
      return myDeferred.promise();
    }
    deferredList = this.deferredListBySource[source];
    if (deferredList) {
      // there is pending request for this source.
      // Add a deferred for the returned promise to the list so Once it is
      // fulfilled, promise will be resolved.
      myDeferred = $.Deferred();
      deferredList.push(myDeferred);
      return myDeferred.promise();
    }
    var url = null;
    if (source === "security.roles") {
      url = "_template/roles";
    } else if (source === "security.groups") {
      url = "_template/groups";
    } else if (source === "security.actions") {
      url = "_template/actions";
    } else if (source === "security.policies") {
      url = "_template/policies";
    }
    if (url) {
      //return this.doGet(url + "?appName=" + Trillo.appContext.appName, source);
      return this.doGet(url + "?appName=*", source);
    }
    return this.getSuggestions(source, name, "tokenizer");
  };

  // return promise.
  AppSuggestionListManager.getSuggestions = function(source, name, type) {
    if (source === "t_appEnumNames") {
      return this.getAppEnumNamesSuggestions(name, type);
    }
    return null;
  };

  AppSuggestionListManager.getAppEnumNamesSuggestions = function(name, type) {
    var myDeferred = $.Deferred();
    var l = [];
    if (type === "autocomplete") {
      l = this.viewContext.inputAppViewCtx.getAutoCompleteEnumNamesSuggestions();
    } else if (type === "tokenizer") {
      l = this.viewContext.inputAppViewCtx.getTokenizerEnumNamesSuggestions();
    }
    myDeferred.resolve(l);
    return myDeferred.promise();
  };

  AppSuggestionListManager.getAppEnumSuggestions = function(name, type) {
    var myDeferred = $.Deferred();
    var l = [];
    if (type === "autocomplete") {
      l = this.viewContext.inputAppViewCtx.getAutoCompleteEnumSuggestions(name);
    } else if (type === "tokenizer") {
      l = this.viewContext.inputAppViewCtx.getTokenizerEnumSuggestions(name);
    }
    myDeferred.resolve(l);
    return myDeferred.promise();
  };

  AppSuggestionListManager.doGet = function(url, source) {
    var deferred = $.Deferred();
    var deferredList = [];
    deferredList.push(deferred);
    this.deferredListBySource[source] = deferredList;
    var self = this;
    $.ajax({
      url : url,
      type : 'get',
      contentType : "application/json"
    }).done($.proxy(this.doGetResult, this, source));
    return deferred.promise();
  };

  AppSuggestionListManager.doGetResult = function(source, data) {
    var l = [];
    var i;
    if (data.length) {
      for (i = 0; i < data.length; i++) {
        l.push({
          name : data[i].name,
          id : data[i].name
        });
      }
    }
    this.suggestionsBySource[source] = l;
    var deferredList = this.deferredListBySource[source];
    for (i = 0; i < deferredList.length; i++) {
      deferredList[i].resolve(l);
    }
    this.deferredListBySource[source] = null; // remove deferredList
  }

  Trillo.appSuggestionListManager = new Shared.AppSuggestionListManager();

})();
