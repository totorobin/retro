
Feature: Login Functionality

    Scenario: First connection
        Given A new user 'userRandom'
        When 'userRandom' connect to the home
        Then 'userRandom' is not logged
        When 'userRandom' set his name as 'Toto'
        Then 'userRandom' is now named 'Toto'