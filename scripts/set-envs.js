const{mkdirSync, writeFileSync}= require('fs');
require('dotenv').config();

const targetPath = `./src/environments/environment.ts`;

const envFileContent =`
export const environment = {
    production: false,
    stock_service_url: "${process.env['STOCK_SERVICE_URL']}",
    user_service_url: "${process.env['USER_SERVICE_URL']}",
};
`;

mkdirSync('./src/environments', {recursive: true});
writeFileSync(targetPath, envFileContent);

