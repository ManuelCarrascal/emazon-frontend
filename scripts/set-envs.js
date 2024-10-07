const{mkdirSync, writeFileSync}= require('fs');
require('dotenv').config();

const targetPath = `./src/environments/environment.ts`;

const envFileContent =`
export const environment = {
    production: false,
    stock_service_url: "${process.env['STOCK_SERVICE_URL']}",
    auth_token:"${process.env['AUTH_TOKEN']}"
};
`;

mkdirSync('./src/environments', {recursive: true});
writeFileSync(targetPath, envFileContent);

