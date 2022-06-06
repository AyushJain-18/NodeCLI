const Page = require('./helper/page.helper');
let page;

beforeEach( async ()=>{
    page = await Page.setup(); 
   await page.goto('http://localhost:3000');
})

afterEach( async()=>{
   await page.close()
})

test('User logged in or not, test with proxy', async ()=>{
    await page.login()
    let text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(text).toEqual('Logout');
})