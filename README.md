ACCEPT Portal
=============

#Configuration and Deployment instructions. 

##Getting Started:

- Before getting started make sure the .Net environment is up and running for the .Net Framework 4.5.
- Make sure Visual Studio 2010 or greater is installed.
- Make sure the NuGet package manager is up to date - https://visualstudiogallery.msdn.microsoft.com/27077b70-9dad-4c64-adcf-c7cf6bc9970c

1. Download ACCEPT Portal repository zip folder.

2. Unzip downloaded folder, and Open file “AcceptPortal.sln” with Visual Studio.

The next step is to resolve third party dependencies.

##Solving the ACCEPT Portal Project Dependencies:

1. If both the ACCEPT API and Framework deployment steps were successfully undertaken, then:

- Compiling the solution will automatically resolve the missing dependencies.

Note: If for any reason it does not happen, then:

- Within the package manager console Tab, type the following command: “Install packages.config”, when the command completes, right click over “AcceptPortal”(within the Solution Explorer), and click compile.

##Solving JavaScript Dependencies:

Currently these dependencies need to be resolved and then referenced within the project manually.

To do so:

1. Within the "...\packages" folder, search for all JavaScript files you can find, then copy and paste them within the "Scripts"("...\AcceptPortal\Scripts") folder.

2. Back to Visual Studio, within the Solution Explorer, right click over the "Scripts" folder and click "Add", then click "Existing Item...".

3. Select all previously copied JavaScript files and click "Add".

4. In Visual Studio Open the Scripts folder and look for each inner folder readme.txt file. within each of them there is specific information on how to solve the dependency.    
 
#Compiling the Solution:

If all dependencies and respective references are resolved, the solution can now be successfully compiled.

##How to compile:
Within the Solution Explorer very top find the solution label: “Solution ‘AcceptPortal’” and right click it, then click “Build”.

#Deploying the Solution:

There are more than one way to deploy .Net projects: http://www.asp.net/mvc/overview/deployment
