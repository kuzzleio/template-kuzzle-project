import { Controller, KuzzleRequest, Backend, BadRequestError, InternalError, ForbiddenError} from 'kuzzle';

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
        const {username, token} = request.input.args
        if(!(username && token)){
          throw new BadRequestError("Invalid request");
        }
    } catch (e) {
      console.error(e);
      throw new BadRequestError("Invalid request")
      return
    }
    return
  }

}
