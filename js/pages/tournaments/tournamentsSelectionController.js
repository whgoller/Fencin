var app = angular.module('fencin');
        
app.controller('tournamentSelectionController', function($scope, askfredService){
  $scope.tournamentName = 'Utah Swords Academy Fencing Club';
  $scope.tournaments = [];
  $scope.events = [];
  
  $scope.getTournamentsList = function(){
    askfredService.getTournaments($scope.tournamentName).then(function(response){
      $scope.tournaments = response;
      console.log('$scope.tournaments', $scope.tournaments);
    });
  }();
  
  
  $scope.getTournamentEvents = function(selectedTournamentId){
    askfredService.getSingleTournamentEvents(selectedTournamentId).then(function(events){
      $scope.events = events; 
      events.map(function(event){
        askfredService.getPreRegisteredFencersInEvent(event.id).then(function(preRegFencers){
          event.preRegisteredFencers = preRegFencers
        });
      });
      console.log('$scope.events', $scope.events);
    });
  }
  
  $scope.getEventFencers = function(eventId){
    askfredService.getPreRegisteredFencersInEvent(eventId).then(function(response){
      $scope.fencers = response;
      console.log('$scope.fencers', $scope.fencers);
    });
  }
  
  $scope.selectAction = function() {
    console.log($scope.selectedTournament);
    $scope.getTournamentEvents($scope.selectedTournament);
    
  }
  
  $scope.importIntoFirebase = function(){
    
  }
  
  
});
