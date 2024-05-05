import { Controller, KuzzleRequest, Backend, BadRequestError, InternalError, ForbiddenError} from 'kuzzle';

const jwt = require('jsonwebtoken');

export class CustomUser extends Controller {
  constructor (app: Backend) {
    super(app);
    this.name = "custom-user";
    // type ControllerDefinition
    this.definition = {
      actions: {
        validateUser: {
          handler: this.validateUser,
          http:[
            { verb: 'get', path: 'custom-user/validate' },
          ]
        },
      }
    };
  }
  
  async validateUser(request: KuzzleRequest){
    
    // const inputUsernameToken = request.input.args;
    // Decode token:
    // const username, token = jwtdecode(input.token);
    try {
        const {code} = request.input.args
        if(!code){
          throw new BadRequestError("Invalid request.");
        }
        // Get user data from user_kuid
        const decoded = jwt.verify(code, "shhhhh");
        if (Date.now() > decoded.expiration){
          throw new BadRequestError("Validation code expired.");
        }
        const username = decoded.username;
        const user_data = await this.app.sdk.security.getUser(username);
        if (user_data._source.ValidationToken === code){
          // If token is correct and the user has not yet been validated, then update profileIds of the corresponding user
          if(user_data._source.profileIds.includes("profile-non-validated-users")){
            let body = {
              profileIds: ['profile-validated-users']
            }
            this.app.sdk.security.updateUser(username, body);
          } else{
            throw new BadRequestError("Error in user validation. Maybe the user is already validated?")
          }
        } else{
          throw new BadRequestError("Invalid token")
        }
    } catch (e) {
      throw new BadRequestError("Invalid request")
    }
    return
  }

}
