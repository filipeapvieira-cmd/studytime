- Functions lacked proper comments, making it harder to understand their purpose and reducing reusability. Adding clear comments would improve comprehension and maintainability.
- This is a desktop only application. Today I would have started it as a mobile first application.
- My computer is slow and sometimes, between changing a string and having the result reflected on the screen, 30s are elapsed which inders productive advancements
- Light mode was removed for efficiency

TODO:
1. When editing a session, we should not be able to add a time that does is bigger to (starttime+pause) - endtime
- [X] Rename "Chart" to "Analytics"
- [X] Enhance error handling and layout for unexpected errors (e.g., display "Something went wrong!")
- [X] Remove light mode
- [X] Block login and registration on mobile devices using CSS to restrict access to app features

2. Effectime time should be calculated automatically and not editable when updating a study session
- we need to create a context for the time update. this way we can have an updated study session time when the user wants to modify the session start and end time.