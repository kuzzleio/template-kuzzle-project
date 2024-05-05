import {KuzzleRequest, Backend, BadRequestError} from 'kuzzle';
// import { checkPassword, checkStringContent, generateRandomString } from './module';
import { request } from 'http';
/*
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[]\.,;:\s@"]+(.[^<>()[]\.,;:\s@"]+)*)|.(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/
    );
};
*/

const jwt = require('jsonwebtoken');

const rand = () => {
    return Math.random().toString(36).substr(2);
};
  
const token = (username : String) => {
    let t = jwt.sign({username: username, expiration: Date.now() + 3600*1000}, "shhhhh");
    return t;
};

export function addPipeBeforeCreateRestrictedUser(app: Backend) {
    app.pipe.register('security:beforeCreateRestrictedUser', async (request: KuzzleRequest) => {
        return request
    });
}


export function addPipeAfterCreateRestrictedUser(app: Backend) {
    app.pipe.register('security:afterCreateRestrictedUser', async (request: KuzzleRequest) => {
        const user_id = request.result._id;
        // Add "ValidationToken" field to new restricted user
        let user = request.input.body.credentials.local.username;
        let t = token(user_id);
        app.sdk.security.updateUser(user_id, {
            "ValidationToken": t 
        });
        let url = "http://localhost:7512/_/custom-user/validate?code="+t;
        app.sdk.query( {
          "controller": "hermes/smtp",
          "action": "sendEmail",
          "account": "contact",
          "body": {
            "to": [
              user
            ],
            "subject": "Validate your TeamMake user!",
            "html": "Validate your TeamMake user by following the link: <br>" + url
          }
        });
        return request;
    });
}
