rem https://docs.microsoft.com/de-de/nuget/tools/cli-ref-push
nuget.exe sources add -Name Hangar2 -Source http://localhost:8080/index.json
nuget.exe setApiKey test123 -Source http://localhost:8080/index.json
nuget.exe push rocket.core.5.0.0.304.nupkg -Source http://localhost:8080/index.json
nuget.exe delete rocket.core 5.0.0.304 -Source http://localhost:8080/index.json
