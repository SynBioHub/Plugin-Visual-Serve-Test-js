# Plugin-Serve-Test-js
A small test plugin to test the server interface is working for SynBioHub. Could be the basis for javascript (Node.js) based server plugins.

# Install
## Using docker
Run `docker run --publish 8086:5000 --detach --name js-test-plug synbiohub/plugin-serve-test:snapshot`
Check it is up using localhost:8080/status or post to localhost:8080/run.
