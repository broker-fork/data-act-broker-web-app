# DATA Act Broker Web App

The DATA Act broker website is the front-end to the [DATA Act broker backend](https://github.com/fedspendingtransparency/data-act-broker-backend "DATA Act broker backend").

## Development Set Up

To stand up a local copy of the DATA Act broker website, follow the directions below.

Assumptions:

* You're able to install software on your machine.
* You have git installed on your machine and are able to clone code repositories from GitHub. If this isn't the case, the easiest way to get started is to install [GitHub Desktop](https://desktop.github.com/ "GitHub desktop"), available for Windows or Mac.
* You're familiar with opening a terminal on your machine and using the command line as needed.

### Install Prerequisites and Code

1. If you're not already running Node.js, download and run the installer for your operating system. We recommend v10.x: [https://nodejs.org/en/](https://nodejs.org/en/ "Node.js installer").

2. From the command line, clone the DATA Act web app repository from GitHub to your local machine:

        $ git clone https://github.com/fedspendingtransparency/data-act-broker-web-app.git

3. Switch to the production version of the code. This is the latest stable release.

        $ git checkout master

    **Note:** If you'd rather use the latest, work-in-progress features of the DATA Act broker, replace the above command with `git checkout staging`.

4. Change to the `data-act-broker-web-app` directory that was created when you cloned the DATA Act web repository.

5. Install the web application's package dependencies:

        $ npm install


### Application Configuration

The `data-act-broker-web-app` folder provides a configuration object in the `GlobalConstants.js` file. By default, it is configured to use the local API endpoint - `http://localhost:9999/v1/`. To use the Production endpoint, either overwrite the API property in `GlobalConstants.js`, or you can change the `start` script in the `package.json` file to point at the `webpack.prod.config.js` file:

```json
    "start": "webpack-dev-server --progress --open --config ./webpack/webpack.prod.config.js",
```

The configuration object contains the following properties which may be adjusted as necessary:

* `API` is the base API URL for the server that is hosting the API. It should start with an `https://` or `http://` protocol and end with `/v1/`, including the trailing slash
* `LOCAL_ROOT` is the URL from which you are serving the frontend (this can be left as an empty string for non-local usage).
* `CAS_ROOT` is the root endpoint for the [CAS server](https://apereo.github.io/cas/4.2.x/protocol/CAS-Protocol-Specification.html#cas-uris) when a CAS single sign-on service is used.
* `AUTH_CALLBACK` is the [callback URL](https://apereo.github.io/cas/4.2.x/protocol/CAS-Protocol-Specification.html#response) that the CAS server redirects to upon successful login.
* `GA_TRACKING_ID` is the tracking ID for Google Analytics.
* `LOCAL/DEV/PROD/STAGING` is the boolean value for which environment the `API` is targeting.
* `DEV/PROD` are boolean values used to include or exclude certain features

### Run npm scripts:

Several npm scripts are available to build the frontend web site for various use cases.

#### Hosted Production

If you are building the web site for a hosted production environment, run:

```bash
	$ npm run prod
```
This will build the frontend files to the `/public` directory, which you can then deploy on your host. In this mode, JavaScript files are minified, debugging tools are disabled, and by default the API calls will be made to the Production API.

#### Hosted Development (Build-only)

If you are deploying the frontend to a hosted environment for development/testing purposes, use:

```bash
	$ npm run dev
```
This will build the frontend files to the `/public` directory, which you can then deploy on your host. In this mode, JavaScript files are uncompressed and source-mapped, debugging tools are enabled, and API calls will be made to the endpoint specified in the API property of the GlobalConstants configuration object (by default, `http://localhost:9999/v1/`).

#### Local Development

Finally, if you are a frontend developer or intending to use a fully local environment, use:

```bash
	$ npm run start
```

This will start a web server on port 3000. In this mode, JavaScript files are uncompressed and source-mapped, debugging tools are enabled, and API calls will be made to the endpoint specified in the API property of the GlobalConstants configuration object (by default, `http://localhost:9999/v1/`). Additionally, SASS files in the `/src/_scss` and `/src/css` folders are watched, along with JS files in the `/src/js` folder, and these files are recompiled (and the browser automatically refreshed) whenever a change is detected.

To use the frontend, go to [http://localhost:3000](http://localhost:3000) in a supported web browser.

*Note:* Before running the npm script, ensure that no other applications or services are using port 3000 on your computer.

### Running Tests

To run the unit test suite, run `npm run test`.

## Full DATA Act Broker Setup

For instructions on contributing to this project or installing the DATA Act broker backend, please refer to the [documentation in the DATA Act core repository](https://github.com/fedspendingtransparency/data-act-core/blob/master/doc/INSTALL.md "DATA Act broker installation guide").
