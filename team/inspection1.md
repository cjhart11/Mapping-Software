# Inspection - Trinity+ *T20* 
 
| Inspection | Details |
| ----- | ----- |
| Subject | *TIPTrip.java - All functions within class* |
| Meeting | *11/04/19, 10:00am, CS314 Classroom* |
| Checklist | *reference, URL, etc.* |

### Roles

| Name | Role | Preparation Time |
| ---- | ---- | ---- |
| Jonathan Quirk | Dev | 1.5 hours |
| Conor Hart | Dev | 1.5 hours |
| Hunter Sullivan | Sprint Leader | 1.5 hours |
| Benny Roesler  | Dev | 1.5 hours |

### Problems found

| file:line | problem | hi/med/low | who found | github#  |
| --- | --- | :---: | :---: | --- |
| TIPTrip.java:118 | radius is still a float in nearest neighbor | hi | Conor| 294 |
| TIPTrip.java:62 | buildDistances and addFinalDistance are similar enough to refactor | med | Jonathan | NA |
| TIPTrip.java:116 | multiple variables are using the name "holder" or some variant of it. these should be renamed to improve readability. | med | Jonathan | 295 |
| TIPTrip.java:122 | 3 nested loops, could be refactored to be seperate | med | Conor | 297 |
| TIPTrip.java:116 | Consider refactoring holder to be a different container other than a 3d array | med | Hunter | 298 |
| TIPTrip.java:199 | findClosest is not a descriptive method name. Consider renaming methods with better names | high | Hunter | 296 |
| TIPTrip.java:1-262 | We could reorder some of the methods to group similar concepts together like we read about in the textbook | low | Hunter | 299 |
| TIPTrip.java:224 | There is a variable named holder. We can try to find a more descriptive name | med | Benny | 295  |
| TIPTrip.java:230 | translateCoords can be changed to one that includes what its translating to | med | Benny | 296  |
| TIPTrip.java:250 | To improve readability, the parameter names can be updated | med | Benny | 300 |
