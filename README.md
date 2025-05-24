# AI Virtue Wall of Honor

<picture>
  <img src="compass.svg" alt="AI Virtue AIVirtue.info" width="180">
</picture>

**AI Virtue** - Committing decisively to prevent AI Risk and catastrophic outcomes.  

Social tool to encourage better AI ethics by listing the names of AI Professionals who uphold AI Virtue.  
Nominees are AI Technical Professionals who choose to make safety a priority - deciding not to contribute to increasing AI capabilities, directly or by safety work that straightforwardly accelerates it. 

It was to be an articulate list of hard criteria but was met with some debated feedback so it'll be democratized now.  
It will start as a widely inclusive list that will get pruned by crowd-debate via the x.com Community "AI Virtue".

## Web access
Two domains, currently it is the same site.

[aivirtue.info](https://aivirtue.info/)  
This may expand to categories of AI Virtue, such as Students, Leaders/Execs/Investors and Advocates/Activists (specifically activists who re-aim their causes to AI risk).

[Wall-of-Honor.info](https://wall-of-honor.info/)


## Dev

The idea was to make a more dramatic user experience with a basic Three.js scene - but grew due to feedback.

I'm not given to dynamically-typed web tech (any F# devs up for collab?), so the styling will be less standard.  
Basically it means favoring:  
- Defining narrow functions first then composing them in a final function.  
- Variables/State being contained within a function that returns data (or functions) over mutations.
- Lambda arrow functions and dot function chaining (with single char variables).
- Constants, white-space formatting, less brackets and no semis!  \\(._. )  

### Files

- __**data.json**__  
Data is provided via JSON file (full schema provided). It contains the name, tagline, links and rationale for each nominee.

- __**main.js**__  
Entry file, sets up the 3D scene and wires the JS DOM gunk.

- __**scene.js**__  
Creates the scene, lighting, particles, text and functionality.

- __**index.html**__  
This is where the home and criteria text is set.  
For efficiency (laziness), CSS/HTML is messy due to delegating to free Claude but fighting it.


### Minification:

'''npm run minify'''


### Comments

Plain Javascript due to F# binding overheads - WebSharper Three.js bindings weren't up-to-date and using an equivalent .NET framework was more work. This was not meant as an open source project, merely freetech a.k.a. github pages free & transparent source.
