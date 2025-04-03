import 'tsconfig-paths/register';
import "reflect-metadata"
import app from "@server/server";
import { AppDataSource } from "@bd";
import { errorHandler } from "@middlewares/errorHandler";
import userController from '@controllers/userController';
import { PORT } from '@config';

async function main() {
    await AppDataSource.initialize();
    app.listen(PORT, ()=>{
        console.log(`Server is running on ${PORT}`);
    });
    app.use("/v1/api/users-mngr", userController());
    app.use(errorHandler);
    
}

main();


