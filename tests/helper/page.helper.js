const sessionFactory = require('.././factory/session.factory');
const userFactory = require('.././factory/user.factory');

const puppeteer = require('puppeteer');


class CustumPage{
    static async setup(){
        console.log('static method is been called')
        const browser = await puppeteer.launch({args:['--no-sandbox']}) // this will make our system to run fastera
        const page = await browser.newPage();

        const myPage = new CustumPage(page);

        return new Proxy(myPage, {
            get: (target, property) =>{
                return myPage[property]|| browser[property] || page[property]
            }
        });
    }
    constructor(page){
        this.page = page;
    }

   async login() {
        const user = await userFactory();
        const {sessionBase64, sessionsignature} = sessionFactory(user.id);
        await this.page.setCookie({name: 'session', value: sessionBase64});
        await this.page.setCookie({name: 'session.sig', value: sessionsignature});
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout"]');
        return;
    }
}

module.exports = CustumPage;