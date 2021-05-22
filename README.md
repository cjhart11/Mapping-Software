# t20 - Trinity+
![trinity+ logo](images/t20logo.jfif)

*Trinity+ Logo*

| last | first | eID | GitHub Username | Email |
|------|-------|-----|-----------------|-------|
| Roesler | Benny | roeslerb | bennyroesler | bennytroesler@gmail.com |
| Sullivan | Hunter | hsfrost | Sknowhite | hsfrost@rams.colostate.edu |
| Hart | Conor | cjhart | cjhart11 | cjhart@rams.colostate.edu |
| Quirk | Jonathan | jquirk | Kongleochi | jon_quirk@live.com |



# Creating Pages
<ol>
<li>Navigate to .\client\src\components\Application</li>
<li>Create a directory with the name of the page</li>
<li>Create a JS file with the name of the page</li>
</ol>

# Loading Pages 
<li>Navigate to .\client\src\components</li>
<li>Edit App.js with page title, and option</li>

```
export default class App extends Component {
  constructor (props){
    super(props);
    this.pages = [
        **Modify this array only**
      { title: 'About', page: 'about'},
    ];
  }
```
# Adding page to navbar
```
Coming soon
```


