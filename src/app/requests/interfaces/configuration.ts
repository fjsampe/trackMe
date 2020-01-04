import { AccessCompany } from '../../auth/interfaces/accessCompany';
import { Request } from '../interfaces/request';

export interface Configuration {
    accessCompany: AccessCompany,
    mapboxCode: string,
    request: Request,
    idRequest: string,
    token: string
}
    