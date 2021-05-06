# Group5-Online_Car_Parking_Reservation_System


Currently, most of the existing car parking systems are manually managed and a little inefficient. In urban areas, where the number of vehicles is higher as compared to the availability of parking spaces, a lot of time being wasted in searching for parking locations. Hence online booking parking system is a proposed method that users can reserve their parking places using the web. Providing a simple web application for parking vehicles. Booking for a parking slot at home. Can search nearby places using Google map. Easy payment system. Parking owners can add their own parking places. Make it easy to automate parking owners and customers.

## Development

* Clone the Repository using
```
git clone https://github.com/3005coolik/Group5-Online_Car_Parking_Reservation_System.git
```
* You need to download nodejs for running code on your local machine [Node](https://nodejs.org/en/).

* Than perform below command to install all the dependencies
```
npm install
```
* You have to setup ```.env``` file on your local machine with following content in it.
```
DBURI= #MongoDB URL
ACCESS_TOKEN= #access token secret
MAPBOX_TOKEN= #mapbox token
GOOGLE_CLIENT_ID= #google client ID
GOOGLE_CLIENT_SECRET = #google client secret for login with google
EMAIL_PASS= #password of email address to send email
```
* Than you can run app using 
```
npm start
```

## Contribute 

* You can use following set of command to contribute to the repository
```
git add .
git commit -m"issueID  *Your Message*"
git push origin local_branch_name:github_branch_name
```
* Than make Pull Request from the github
