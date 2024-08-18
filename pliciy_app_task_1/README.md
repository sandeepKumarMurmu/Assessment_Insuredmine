# BIG-OH USER

Big-OhUser is a comprehensive user management system empowering users to effortlessly create, fill, and edit custom forms. With the ability to seamlessly view user details and flexibly list all users, it offers a professional and efficient solution for effective user management.

## Tech Stack
1. Node.js
2. JavaScript

## NPM Packages
1. Sequelize
2. Express.js
3. Express Validator
4. MySQL2
5. UUID
6. Dotenv
7. Cors

## Database Interaction
1. SQL

## Version Control
1. Git

## API / Endpoints
1. `/form` (Create form)
2. `/fill_data?title=userName` (Fill out the form)
3. `/fill_data` (List all users)
4. `/fill_data?title=userName` (List particular user)

## API Explanation

### 1. `/form` (Create form)
- **Method:** POST
- **Body:**
  ```json
  {
    "title": "meenusfs" //alphaNumaric with '_'
  }
  ```
- **Explanation:** This endpoint enables users to create their forms by providing a title, which is a mandatory field.
- **Validation Criteria:**
  * Must contain minimum 4 character.
  * It can be alphaNumaric and also underScore ('_') allowed.
  * rejex used  /^[a-zA-Z0-9_.]+$/.
- **Validation Message:** The title provided is invalid.
- **Response:**
  ```json
   {
      "status": "success",
      "message": "User created successfully",
      "data": {
              "title": "sandeep_123",
              "uniqueId": "bacb2902-acca-488a-ab92-adb37456dc9e"
              }
  }
  ```
### 2. `/fill_data?title=userName` (fill out the form)
- **Method:** POST   
- **Body:**
 ```json
         {
                "name": "Sandeep Kumar", // User name: alphabetical characters with single space
                "email": "sandeep@gmail.com", // Valid email
                "phonenumber": "9577224499", // Minimum 10 digits, numeric only
                "isGraduate": "false" // Boolean value only
         }
 ```
- **Query:** title // An alphanumeric character with underscore ('_') allowed.
- **Explanation:** This endpoint empowers users to fill out and edit the form with their details, ensuring that each field is compulsory.
- **Validation Criteria:**
  * 'Name' must consist of alphabetical characters, allowing both upper and lower case, with a single space permitted.
  * 'Email' should be a valid email address and must contain a minimum of 8 characters.
  * 'PhoneNumber' should be a minimum of 10 digits, accepting only numeric values.
  * The 'isGraduate' field expects a boolean value only.
- **validation-message:**
  * title: The provided title is invalid.
  * name: Invalid name format.
  * email: Invalid email format.
  * phonenumber: Invalid mobile number format.
  * isGraduate: Invalid graduation status.
- **Response:**
```json
{
    "status": "success",
    "message": "User updated successfully",
    "data": []
}
  ```
  
###  3. `/fill_data` (list all user)
- **Method:** GET   
- **Body:** null
- **Query:** null
- **Explanation:** This endpoint allows users to retrieve a list of user details.
- **Validation Criteria:** null
- **validation-message:** null
- **Response:**
```json
{
    "status": "success",
    "message": "User fetched successfully",
    "data": [
                {
                    "unique_id": "2b5ee6e1-eccb-4386-808f-8526bd89d63d",
                    "title": "meenu",
                    "name": "-",
                    "phonenumber": "-",
                    "isGraduate": "False"
                },{
                    "unique_id": "3a206f8e-141a-4863-bd2b-bf7a6f2e1e18",
                    "title": "meenu1234",
                    "name": "sandeep kumar",
                    "phonenumber": "9577224499",
                    "isGraduate": "False"
                }
            ]
}
```
        
### 4. `/fill_data?titel=userName` 
- **Method:** GET   
- **Body:** null
- **Query:** title // An alphanumeric character with underscore ('_') allowed.
- **Explanation:** This endpoint allows users to retrieve details for a single user.
- **Validation Criteria:** Verifies the availability of the user.
- **validation-message:** null
- **Response:**
```json
{
    "status": "success",
    "message": "User fetched successfully",
    "data": [
                {
                    "unique_id": "2b5ee6e1-eccb-4386-808f-8526bd89d63d",
                    "title": "meenu",
                    "name": "-",
                    "phonenumber": "-",
                    "isGraduate": "False"
                }
            ]
}
```

