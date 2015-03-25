var app = angular.module('fencin');

app.controller('checkinParticipantController', function ($scope, checkinService, firebaseService) {
    $scope.currentParticipant = checkinService.getParticipant();    
    $scope.currentTournament = checkinService.getCurrentTournament();
    $scope.totalAmountDue = 0;
    $scope.eventsParticipatingIn = [];

  //Pulls the usfencing.org fencer information 
    $scope.currentParticipantDetails = function (id) {
        firebaseService.getUSFAFencer(id).then(function (data) {
            $scope.fencerDetails = data
            console.log(' $scope.fencerDetails',  $scope.fencerDetails);
        });
    }($scope.currentParticipant.usfa_id);

  //populates all the events within this tournament
    $scope.getEvents = function () {
        $scope.tournamentEvents = $scope.currentTournament.tournament.tournamentEvents;
    }();    //self call

//Calculates the amount owed when they select/unselect events to participate in
    $scope.eventSelected = function (selected) {
        console.log('selected', selected)
        if (selected.preRegistered) {
//            $scope.eventsParticipatingIn.push(selected);
            $scope.totalAmountDue += parseInt(selected.fee);
        }
        else {
//            $scope.eventsParticipatingIn.push(selected);    //remove it.
            $scope.totalAmountDue -= parseInt(selected.fee);
        }
    };

  //saves method of payment to checkinService
    $scope.paidBy = function () {
        if ($scope.paymentType === 'cash') {
            checkinService.setPaidCash($scope.totalAmountDue);
        } else if ($scope.paymentType === 'check') {
            checkinService.setPaidCheck($scope.totalAmountDue);
        } else if ($scope.paymentType === 'card') {
            checkinService.setPaidCredit($scope.totalAmountDue);
        }
    };

  //sends user to the equipment checkout page
    $scope.equipmentCheckout = function () {
        window.location.hash = '/equipment';
    };


  //submits fencer to the database for backroom access. 
  //will need the fencer duplicated per event registered for
    $scope.submit = function () {
        console.log('currentParticipant', $scope.currentTournament.tournament.tournamentEvents);
        //Need to remove fencer from checkin list and add to a checked-in list.
        $scope.currentParticipant.details = $scope.fencerDetails;
        $scope.currentParticipant.inFencingTime = false;
        console.log($scope.currentParticipant);
        if($scope.eventsParticipatingIn.length > 0){
          for(var i = 0; i < $scope.eventsParticipatingIn.length; i++){
            $scope.currentParticipant.eventName = $scope.eventsParticipatingIn[i];
            firebaseService.setFenncerCheckedIn($scope.currentParticipant);
          }
        }
      //firebaseService.setFenncerCheckedIn();
        window.location.hash = '/checkin';
    };

//Will select preregistered events for the fencer.
    $scope.checkEventsPreregistered = function (event) {
        if (event.fencerIds.indexOf($scope.currentParticipant.id) !== -1) {
            $scope.eventSelected(event);
            console.log('event', event)
//            $scope.eventsParticipatingIn.push(event);
            return true;
        }
        return false;
    };
});

