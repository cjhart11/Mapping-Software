# Sprint 5 - *t20* - *Trinity+*

## Goal

### Mobile release with a beautiful user experience! Cleaning up the UI and adding more trip customization.
### Sprint Leader: *Conor Hart*

## Definition of Done

* Version in pom.xml should be **`<version>5.0</version>`** for your final build for deployment.
* Increment release **`v5.0`** created on GitHub with appropriate version number and name.
* Increment **`server-5.0.jar`** deployed for testing and demonstration on SPRINT5 assignment.
* Sprint Review, Restrospective, and Metrics completed (**team/sprint5.md**).


## Policies

#### Mobile First Design!
* Design for mobile, tablet, laptop, desktop (in that order).
* Use ReactStrap for a consistent interface (no HTML, CSS, style, etc.).
* Must adhere to the TripCo Interchange Protocol (TIP) for interoperability and testing.
#### Clean Code
* Code Climate maintainability of A (technical debt ratio <= 5).
* Code adheres to Google style guides for Java and JavaScript.
#### Test Driven Development
* Write unit tests before code.
* Unit tests are fully automated.
* Code Coverage above 60%
#### Configuration Management
* Always check for new changes in master to resolve merge conflicts locally before committing them.
* All changes are built and tested before they are committed.
* All commits include a task/issue number.
* All commits include tests for the added or modified code.
* All tests pass.
#### Continuous Integration / Delivery 
* Master is never broken.  If broken, it is fixed immediately.
* All pull requests build and test with no failures.
* All Java dependencies in pom.xml.  Do not load external libraries in your repo. 


## Plan

This sprint will complete the following Epics.

* *#0 TIPv5: Updating TIP to support v5*
* *#1 ease of use: Cleaning up the UI*
* *#2 Save Map: Adding the ability to save the map*
* *#3 Auto optimize: Add the Automatic optimization option*
* *#4 trip title: Allow naming of a trip*
* *#5 distance display: Display cumulative and leg distances properly*

![Sprint 5 diagram](../images/sprint3_diagrams/sprint3_diagram.jpg)

## Metrics

| Statistic | # Planned | # Completed |
| --- | ---: | ---: |
| Epics | *6* | *8* |
| Tasks |  *11*   | *16* | 
| Story Points |  *20*  | *27* | 


## Scrums

| Date | Tasks closed  | Tasks in progress | Impediments |
| :--- | :--- | :--- | :--- |
| *11/18* | *0* | *0* | *none* |
| *11/20* | *0* | *4* | *none* |
| *11/22* | *3* | *0* | *none* |
| *11/25* | *0* | *4* | *none* |
| *11/27* | *1* | *3* | *none* |
| *11/29* | *0* | *4* | *none* |
| *12/2* | *2* | *2* | *none* |
| *12/4* | *6* | *4* | *none* |
| *12/6* | *4* | *3* | *none* |
| *12/9* | *5* | *2* | *none* |
| *12/11* | *2* | *1* | *none* |
| *12/12* | *1* | *0* | *none* |

## Review (focus on solution and technology)

In this sprint, ...

#### Completed epics in Sprint Backlog 

These Epics were completed.

* #0 Map Scaling: Map now centers and zooms out to show the entire trip when it is modified
* #1 Map Correctness: Map shows the actual path of travel, taking into account crossing the international dateline
* #2 Results found/displayed: When searching for a location it now displays how many total results were found and how many are currently being shown to the user
* #3 Distance Display: Itinerary now shows the leg, cumulative, and total distances. Total is now at the top of itinerary
* #4 Trip Title: User can now set their own title for the Trip, default uses the Title loaded from file
* #5 Auto optimize: Server/Client can now handle a trip of type automatic. If the itinerary is short enough it uses short/shorter, if it is too long then it uses none instead. This is so the user gets a response back very quickly for any scenario.
* #6 TIPv5: All requests/responses are now up to the v5 TIP specification 
* #7 Save Map: User can now save their current trip map into both KML and SVG formats for them to use somewhere else

#### Incomplete epics in Sprint Backlog 

These Epics were not completed.

#### What went well

Overall this sprint was our most successful sprint when compared to the others. We set out to do the same number of epics/tasks as before, but we were able to accomplish much more than what we had originally planned. Most this came from previous design implementations with our project that allowed for easy changes to be made with new features being added. For instance map correctness, map scaling, and distance display were all easy to implement as we had already done pieces of each. We only had to do a little bit of work in order to get the full feature in place, with a few changes for improving the UI for these as well. The results found/displayed was already done in a previous sprint, the only change that went along with this was having the results list being a popup, instead of rendering another list on our page. This also made the user experience nicer as they do not have to scroll down to make any selections. Auto optimize was a harder challenge, timing what our server was possible of doing with a given itinerary needed to take place so a good boundary could be found with implementing any sort of optimization on it, this way if the itinerary is too large then no optimization is done so the user gets a response quickly. Save Map was probably the hardest part of this as we had not done anything beforehand with having our map be an object that could be saved in some way. Changes had to be made so that an object that stored all of the maps values was made, and then two different types of conversion librarys were used so that we could save it as a KML/SVG. The rest of the work done this sprint was improving the UI and user experience with using our page. Many changes were made that reduced the number of headers, reduced the number of buttons clicks, moved/grouped buttons together, and overall clean up of the UI so it wasn't as cluttered. 


#### Problems encountered and resolutions
The first problem we ran into this sprint was discovering that we had a few bugs leftover from previous sprints. First of which was when our client was sending a Trip request we had it hard coding the type to "trip" instead of it using the type that was loaded from the file. Next bugs came from our implementation of sending "location" requests. First our server was stopping itself too short with finding the total number of results it would find, it would always stop itself with the limit passed from client. This was changed with having the server find everything it could with the given string, but only build the places list it returns up to the limit. Next was our client was unable to select all of the countries in the list, we thought requests would always need to specify a country. This was an easy fix to have it default to all, and if the user selects one then it changes to that specific country. We also had a couple bugs that caused our server to crash. First was for trip if the places array passed from client was empty, it was first trying to grab the first item in the list. This was fixed by having it first check if the places array is empty, before doing any sort of indexing on it. The next was for locations with a similar problem. If the filters passed from client had either type or country filled in, but not both it would crash our server. This was because it was checking to see if filters was empty and then was assuming that both type/country were there. This was fixed by after its checks that its not empty it then checks which one is there if it only contains one, then it uses that one appropriately. Other than bugs the biggest challenge came from trying to save the map to a file. From the start this was difficult as our map was only being rendered in real time, nothing was in place to hold the values that the map was using in a permanent way. Getting that in place we then ran into trying to convert it into KML and SVG formats so that it could be saved into a file. This took several trials/errors to find outside libraries that would make this easier to do, but in the end we found a couple that worked well and stuck with those.

## Retrospective (focus on people, process, tools)

In this sprint, ...

#### What we changed this sprint

For this sprint we by far started the earliest on implementing changes from the beggining. Before any planning had even started for new features, bug fixes and UI changes were already being made as we knew these to already be problems. For planning we gave ourselves the same amount of time as the last sprint, but we stopped ourselves from adding too many epics/tasks so we could have a realistic view of what needed to get done to have our project be more user friendly and have the UI improve as well. We were also stricter with having more people test out eachothers requests before they were being merged to avoid any possible problems. 

#### What we did well

As a group this was our most performing sprint yet, it was easy for people to pick up a task, work on it, and get it into place without any real problems along the way. If someone ran into issues with something asking the group for help wasn't ever an issue and at least one other person would jump on board to help them out with it. There were no problems of group members having disagreements with eachother on changes being made or with what should be worked on first, everything ran smoothly. As a group tasks or bug fixes were always being worked on, there were no big gaps of nothing getting done. With the exception of Thanksgiving break, but that is expected for not much to get done. We also finished adding any major features earlier than before, the final days leading up to release have instead been finalizing any bug fixes and small UI fixes here and there. 

#### What we need to work on

We could improve on breaking down an epic into more tasks. This has been a problem for us for the semester, but has improved slightly as we have gone along. We tend to not fully understand how big an epic might be, for instance save map we only had two tasks to go along with it. This easily could have had two more tasks to go along with it, but we didn't fully understand everything that would need to go into place for it.

#### What we will change next sprint 

This is the final sprint for the semester so planning for the next one isn't a high priority. If we were to continue working together modeling everything we did this sprint would be an excellent place to start. The only major change we would need to make is breaking up epics into more tasks. This would require fully understanding the problem before we get into the planning meeting that way we can understand the problem we are looking at with a broader perspective to break it down into smaller pieces.
