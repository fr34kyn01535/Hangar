rem https://docs.microsoft.com/de-de/nuget/tools/cli-ref-push
nuget.exe sources add -Name Hangar -Source http://localhost:8080
nuget.exe setApiKey test123 -Source http://localhost:8080
nuget.exe push test.nupkg -Source http://localhost:8080
nuget.exe delete test.nupkg 1.0 -Source http://localhost:8080
