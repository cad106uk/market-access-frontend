Feature: Report a barrier
	Start to report a new barrier

	Scenario: Navigate to Report a barrier
		Given I'm on the report a barrier page
		Then the title should be Market Access - Report a barrier
		And the page should not have any accessibility violations
		And the active heading link should be Report a barrier
		And the main heading should be Market access barriers Report a barrier
		And there should be a start banner with a start button
		And a task list with 7 items