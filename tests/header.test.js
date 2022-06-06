const sessionFactory = require('./factory/session.factory');
const userFactory = require('./factory/user.factory')
const puppeteer = require('puppeteer');


let browser, page ;

beforeEach( async() => {
     browser = await puppeteer.launch();
     page = await browser.newPage();
     await page.goto('http://localhost:3000');
  
    
})

afterEach( async () => await browser.close);



test('to check whether header contains the logo name', async ()=>{
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster')
})



test('to check on click of loggin button, Oauth boots up', async() => {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
})


test('when logged in, must see logout button', async () => {
        const user = await userFactory();
        const {sessionBase64, sessionsignature} = sessionFactory(user.id);
        
        await page.setCookie({name: 'session', value: sessionBase64});
        await page.setCookie({name: 'session.sig', value: sessionsignature});
        await page.goto('http://localhost:3000');
        await page.waitFor('a[href="/auth/logout"]');

        let text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

        expect(text).toEqual('Logout');
        
})






