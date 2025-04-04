import { AppDataSource } from "@bd";
import { User } from "@entities/User";
import { UserRepository } from "@repository/userRepository";
import { NextFunction, Request, Response } from "express";
import { constants } from "http2";
import bcrypt from "bcrypt";
import { SALT_ROUNDS, SECRET_KEY } from "@config";
import jwt from "jsonwebtoken";

export class UserService {

    private userRepository: UserRepository;

    constructor(){
        this.userRepository = AppDataSource.getRepository(User);
    }

    async registerUser(request:Request, response: Response, next: NextFunction){
        try{
            const userData: User = request.body;
            const currentUser = await this.userRepository.findOneBy({
                email: userData.email
            });
            if (!currentUser) {
                userData.password = await bcrypt.hash(userData.password, Number(SALT_ROUNDS));
                await this.userRepository.save(userData);
                response.status(constants.HTTP_STATUS_CREATED).send();
            }else{
                response.status(constants.HTTP_STATUS_CONFLICT).send(
                    {
                        statusCode: 409,
                        description: 'User Alredy exist, please login' 
                    }
                )
            }
        }catch(error){
            next(error);
        }
    }

    async loginUser(request:Request, response: Response, next: NextFunction){
        try{
            const loginData: User = request.body;
            const currentUser = await this.userRepository.findOneBy({
                email: loginData.email
            });
            if (!currentUser) {
                const errorRs = {
                    statusCode: constants.HTTP_STATUS_CONFLICT,
                    description: 'User not found, please register' 
                }
                throw new Error(JSON.stringify(errorRs));
            }
            const comparePassword = await bcrypt.compare(loginData.password, currentUser.password);
            if(!comparePassword){
                const errorRs = {
                    statusCode: constants.HTTP_STATUS_UNAUTHORIZED,
                    description: 'Credentials not valid, verify information'
                }
                throw new Error(JSON.stringify(errorRs));
            }
            const payload = {
                name: currentUser.name,
                email: currentUser.email,
                id: currentUser.id
            }
            const token = jwt.sign(payload, SECRET_KEY,{ expiresIn:'1h'});
            response
                .status(constants.HTTP_STATUS_OK)
                .send({ token });
        }catch(error){
            next(error);
        }
    }
}