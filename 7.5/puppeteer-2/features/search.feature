Feature: Cinema ticket booking

Background:
  Given I am on the cinema home page

  @only
  Scenario: Successful booking of 1 ticket for "Witcher" (happy path)
    When I select day with index 1
    And I select seance with ID "223"
    And I select one free seat
    And I confirm booking
    Then I see a ticket for movie "Ведьмак"

  @only
  Scenario: Successful booking of 2 tickets (happy path)
    When I select day with index 2
    And I select seance with ID "225"
    And I select 2 free seats
    And I confirm booking
    Then I see a ticket for movie "Ведьмак"

  @only
  Scenario: Attempt to book already taken seat (sad path)
    When I select day with index 1
    And I select seance with ID "223"
    And I book one seat
    And I confirm booking
    And I return to home page
    And I select day with index 1 again
    And I select seance with ID "223" again
    Then Occupied seat is not available for selection

  @only
  Scenario: Cannot select past seance (sad path)
    When I select day with index 0
    And I try to select seance with ID "234"
    Then Seance is not available for booking