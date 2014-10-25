//GistID:1c45ca694ad333baeddd
'use strict';

angular.module('stateMock', []);
angular.module('stateMock').service("$state", function($q) {
  this.expectedTransitions = [];
  this.current = {};
  this.transitionTo = function(stateName) {
    if (this.expectedTransitions.length > 0) {
      var expectedState = this.expectedTransitions.shift();
      if (expectedState !== stateName) {
        throw Error("Expected transition to state: " + expectedState + " but transitioned to " + stateName);
      }
    } else {
      throw Error("No more transitions were expected! Tried to transition to " + stateName);
    }
    console.log("Mock transition to: " + stateName);
    this.current.name = stateName;
    var deferred = $q.defer();
    var promise = deferred.promise;
    deferred.resolve();
    return promise;
  };

  this.go = this.transitionTo;

  this.is = function(stateName) {
    if (this.current.name === stateName){
      return true;
    }
    return false;
  };

  this.expectTransitionTo = function(stateName) {
    this.expectedTransitions.push(stateName);
  };


  this.ensureAllTransitionsHappened = function() {
    if (this.expectedTransitions.length > 0) {
      throw Error("Not all transitions happened!");
    }
  };
});
