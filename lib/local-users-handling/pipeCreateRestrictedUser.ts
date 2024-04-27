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
export function addPipeBeforeCreateRestrictedUser(app: Backend) {
//    console.log("Credentials of new restricted user", JSON.parse(request));
    app.pipe.register('security:beforeCreateRestrictedUser', async (request: KuzzleRequest) => {
	console.log("Credentials of new restricted user without parse", request.input.body.credentials);
        return request
    });
}


export function addPipeAfterCreateRestrictedUser(app: Backend) {
    app.pipe.register('security:afterCreateRestrictedUser', async (request: KuzzleRequest) => {
        const user_id = request.result._id;
        /* app.sdk.security.updateUser(user_id, {
            "houses": [],
            "devices": []
        });*/
        return request;
    });
}
