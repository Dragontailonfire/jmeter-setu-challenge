# Setu Automation challenge
API Automation challenge

## 1. Introduction
This test suite covers the validation of the following Setu API end-points
1. onboard - Creates a payee for bill payment
2. bills - Return all the generated bills
3. pay - Make bill payment

In addition to the end-points, the Callback functionality of the pay end-point is covered as well.

## 2. Test suite
The suite is designed using JMeter tool. The different components used are listed below, along with the Test scenarios covered.

The callback feature verification is handled using API from webhook.sites.

### 1. Test case
The basic business flow is as follows:

#### 1. Positive case
    1. Creation of Webhook.sites token that is to be used later for the verification of bill payment.
    2. Registration of the payee using the URL generated with the webhook.sites token.
    3. Generating all the bills using the payee id and the JWT token calculated from the onboard response.
    4. Payment of all the generated bills by the registered payee.
    5. Verification of the response with the callback response. This is extracted with the help of webhook.site API.
#### 2. Negative case
    1. On boarding error validations
        1. 400 error code
        2. 404 error code
    2. Billing error validations
        1. 400 error code
        2. 404 error code
    3. Payment error validations
        1. Amount mismatch
        2. Bill not found
        3. 400 error code
        4. 404 error code

### 2. Jmeter components

#### 0. test suite section
    1. User defined variables component stores variables that can help for debugging. If the on boarding and token generation is not to be repeated for all runs. 

#### 1. webhook.site section (token generation)
    1. HTTP sampler to generate the token.
    2. JSON extractor for saving the UUID. This is used in later components.

#### 2. onboard section
    1. Header manager for the Content Type.
    2. HTTP sampler to register the payee. Request contains the callback URL that is created with the webhook.site UUID.
    3. JSON extractor for saving the payee ID and the JWT secret. This is used in the Header for all other requests as well as the JWT token generation.
    4. JSR223 Sampler used for calculating the JWT secret. This and the payee IDs are assigned to variables that are to be used in subsequent REST calls.
#### 3. bill section
    1. Header manager for the Content Type. Uses the payee ID and the JWT secret calculated from on boarding section
    2. HTTP sampler to generate all the bills.
    3. JSON extractor for saving the bill details. This is used later for payment and verification purposes.
    4. While controller is used to repeat the pay end-point call to pay all the generated bills.
    5. JSR223 sampler used for assigning individual bill details to variables for bill payment and verification.
#### 4. pay section
    1. Header manager for the Content Type. Uses the payee ID and the JWT secret calculated from on boarding section
    2. HTTP sampler to pay a single bill. The request is created with the bill info extracted from the bill end-point. The call is repeated for the number of bills generated.
    3. JSON extractor for saving the transaction ID. This is used later for verification purposes.
#### 5. webhook.site section (requests)
    1. HTTP sampler to get all the requests send to the token.
    2. JSON extractor for saving the callback content from the response.
    3. Constant timer to create a delay so that the requests are not deleted too soon from the next API call.
    4. HTTP sampler to delete all the requests send to the token.
    5. JSON extractor for saving the values from the callback content variable saved earlier.
    6. JSR223 sampler does the assertions. 
#### 6. listener
    1. View Results Tree is used to view the status of the run. 
    2. Edit the file path in this component to generate the .XML file

## 3. Project Setup
1. Download JMeter from [here](https://jmeter.apache.org/download_jmeter.cgi)
2. Download the below `.jar` files and add it to the `lib` folder inside JMeter main folder.
    1. [java-jwt](https://mvnrepository.com/artifact/com.auth0/java-jwt/3.8.3)
    2. [commons-codec](https://mvnrepository.com/artifact/commons-codec/commons-codec/1.13) (This might already be available in JMeter folder)
    2. [jackson-databind](https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind/2.10.1)
    3. [jackson-annotations](https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-annotations/2.10.1)
3. Clone the project from the git repo - [jmeter-setu-challenge](https://github.com/Dragontailonfire/jmeter-setu-challenge.git)

## 4. Running the project
1. Unzip and save the downloaded JMeter file.
2. Open the `jmeter.bat` file from the `bin` folder.
3. Navigate to the project folder and open the `Setu_api_main.jmx` file.
4. Give the file path in the View Results Tree listener for the XML file generation.
5. Run the project from within JMeter and view the result in using the View Results Tree.

## 5. Generating reports
1. APDEX report generation command (run from the `bin` folder) - `jmeter -n -t <folder-path>\jmeter-setu-challenge\Setu_api_main.jmx -l <folder-path>\jmeter-setu-challenge\Results\RunResult.xml -e -o <folder-path>\jmeter-setu-challenge\Results`
2. An `XML` file is generated that contains exhaustive information about the execution from the View Results Tree listener. (RunResult.xml in project root)

## 6. Planned enhancements
1. Using an in-house solution for verifying the callback functionality instead of 3rd party API.
2. Create pretty `.html` report from `.XML` result file.

## 7. References
1. Challenge repo - https://gitlab.com/setu-lobby/test-automation-test/blob/master/README.md
2. Java flavour of JWT taken from [here](https://github.com/auth0/java-jwt)
3. [Webhook.site](https://docs.webhook.site/api.html) API documentation
