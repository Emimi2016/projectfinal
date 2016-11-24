#Carelk (V0.5.1)

##New features

##Fixes
- removed node_modules from the repo (do `npm install` instead locally)
- .vscode folder removed - editor settings shouldn't be in an application or repo
- removed autopublish package - a security issue
- added dev_bundle to .gitignore
- commented meteortoys (if anyone else need it uncomment)
- changed server folder name lib to methods
- added a `Diaries` collection as a publication is asking for it
- removed meteor-platform (deprecated), flow-router and react packages

##Notes & need further work
- Login link from verification email page doesn't go anywhere
- CFS file system should be replaced with AWS + slingshot
