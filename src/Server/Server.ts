import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Utils } from './Utils';
import { LoginHandler } from './LoginHandler';
import { Authorizer } from '../Authorization/Authorizer';


export class Server {

  private authorizer: Authorizer = new Authorizer();

  public createServer() {
    createServer(
      async (req: IncomingMessage, res: ServerResponse) => {
        console.log(`got request from ${req.headers["user-agent"]} for ${req.url}`);
        this.addCorsHeader(res);
        const basePath = Utils.getUrlBasePath(req.url);

        switch (basePath) {
          case 'login':
            await new LoginHandler(req, res, this.authorizer).handleRequest();
            break;
          default:
            break;
        }

        res.end();
      }
    ).listen(8080);
    console.log('server started')
  }

  private addCorsHeader(res: ServerResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
  }
}