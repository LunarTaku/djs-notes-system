![Note system banner](https://user-images.githubusercontent.com/91988772/195692459-a0b451c4-6260-447e-bb32-56607733d5e7.png)

# djs-notes-system
A system foradding notes to a user with modlogs and database integration! Created with node.js and discord.js clean and readable code.

## NOTE
- For support join my [discord server](https://discord.gg/FMm7Rh8V) or create a discussion here!

## Dependencies
- discord.js: `npm i discord.js`
- mongoose: `npm i mongoose`

## Instructions
1. Install all the dependencies.
2. Copy the command files into your command folder.
3. Create a folder called `schemas` and copy the schema files into it.
4. Correct all the paths to the schemas folder.
5. Try the commands!

## MongoDB Code
> add to `ready.js` file!
```
    // Add this to the top of the file
    const { connect } = require('mongoose')
    
    // Add this to your ready.js file
    await connect(MONGO_URI)
      .then(() => {
        console.log(`✅ >>> Successfully connected to MongoDB!`);
      })
      .catch((err) => {
        console.log(err);
      });
```

## previews

![image](https://user-images.githubusercontent.com/91988772/195692693-3c5eb5bd-60f9-4e17-a8bc-0d406ad97436.png)
![image](https://user-images.githubusercontent.com/91988772/195693063-97655315-0c77-4a53-a95d-151ffc75c9d9.png)
