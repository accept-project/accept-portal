ACCEPT Portal
=============================

#Deployment instructions. 

Getting Started:
================

-Before getting started make sure the .Net environment is up and running for the .Net Framework 4.5.
-Make sure Visual Studio 2010 or greater is installed.
-Make sure the NuGet package manager is up to date - https://visualstudiogallery.msdn.microsoft.com/27077b70-9dad-4c64-adcf-c7cf6bc9970c

1 – Download ACCEPT Portal repository zip folder.

2 – Unzip downloaded folder, and Open file “AcceptPortal.sln” with Visual Studio.


Solving the ACCEPT Portal Project Dependencies:
==================================================

1 - If both the ACCEPT API and Framework deployment steps were successfully undertaken, then:

- Compiling the solution will automatically resolve the missing dependencies.

Note: If for any reason that does not happen, then:

- Within the package manager console Tab, type the following command: “Install packages.config”, when the command completes, right click over “AcceptPortal”(within the Solution Explorer), and click compile.


 
