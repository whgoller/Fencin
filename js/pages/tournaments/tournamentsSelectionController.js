var app = angular.module('fencin');
        
app.controller('tournamentSelectionController', function($scope, askfredService, firebaseService){
  $scope.clubInitials = 'USAFC';
  $scope.tournaments = [];
  $scope.events = [];
  
  
  $scope.getClubInfo = function(clubInitials){
    askfredService.getClub($scope.clubInitials).then(function(response){
      var club = response[0];
      $scope.clubName = club.name
      $scope.clubInitials = club.initials
      $scope.clubId = club.id
      console.log('club', club);
      console.log('$scope.clubName', $scope.clubName);
      console.log('$scope.clubInitials', $scope.clubInitials);
      console.log('$scope.clubId', $scope.clubId);
      $scope.getTournamentsList($scope.clubName);
    });
  }();
  
  $scope.getTournamentsList = function(clubName){
    askfredService.getTournaments(clubName).then(function(response){
      $scope.tournaments = response;
      console.log('$scope.tournaments', $scope.tournaments);
    });
  };
  
  
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
    askfredService.getPreRegisteredFencersInEvent(eventId).then(function(fencers){
      $scope.fencers = fencers;
      //trial code
      console.log(fencers)
      fencers.map(function(fencer){
        askfredService.getAthleteByID(fencer.competitor_id).then(function(fencerDetails){
          fencer.fencerDetails = fencerDetails
        });
      });
      
      //end trial code
      console.log('$scope.fencers', $scope.fencers);
    });
  }
  
  $scope.selectAction = function() {
    console.log($scope.selectedTournament);
    $scope.getTournamentEvents($scope.selectedTournament);
    
  }
  
  
  
  
  
   $scope.importIntoFirebase = function(){
     firebaseService.setCompetitor();
//     var list = $firebaseArray(new Firebase('https://fencein.firebaseio.com/clubs'));
//     var cId;
//     var tId;
//     
//     list.$add({
//       clubName: $scope.clubName,
//       clubId: $scope.clubId
//               
//     }).then(function(ref){
//       var cid = ref.key();
//       console.log("added record with id " + id);
//       list.$indexFor(id); // returns location in the array
//            
//     });
//     
//     var tournament = $firebaseArray(new Firebase('https://fencein.firebaseio.com/tournaments/'))
//     tournament.$add({
//       tournamentName: $scope.clubName,
//       tournamentId: $scope.clubId
//               
//     }).then(function(ref){
//       var tId = ref.key();
//       console.log("added record with id " + id);
//       list.$indexFor(id); // returns location in the array
//            
//     });
     
   }
  
  
  
  
});
