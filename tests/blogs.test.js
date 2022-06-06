const Page = require('./helper/page.helper');
let page;

beforeEach(async ()=>{
  page =  await Page.setup();
  await page.goto('http://localhost:3000');
});
afterEach(async ()=>{
   await page.close();
});
// used to grp together a set of test sharing common logic
describe('when logged in', ()=>{

    beforeEach(async()=>{
        await page.login();
        await page.click('a[href="/blogs/new"]');
    })
    test('to check if blog creation is working', async ()=>{
        let blogTitle= await page.$eval('form label', el => el.innerHTML);
        expect(blogTitle).toEqual('Blog Title');
    })

    describe('Testing valid scenario',() =>{
        beforeEach(async ()=>{
            // fill values to form and then click on next
            await page.type('input[name="title"]', 'Blog name');
            await page.type('input[name="content"]', 'Blog Content');
            await page.click('button[class="teal btn-flat right white-text"]');
        })
        test('Submitting take user to review screen', async ()=>{
            let headerMsg = await page.$eval('h5', el => el.innerHTML);
            expect(headerMsg).toEqual('Please confirm your entries')
        })
        test('Submitting and then saving adds block to index page', async ()=>{
            await  page.click('button[class="green btn-flat right white-text"]');
            await  page.waitFor('[class="card-action"]');
            let blogHeader=  await  page.$eval('[class="card-title"]', el => el.innerHTML)
            expect(blogHeader).toEqual('Blog name');
        })
    }),

    describe('And using invalid inputs', ()=>{
        beforeEach(async () => {
            await page.click('button[class="teal btn-flat right white-text"]');
        })
        test('Form shows an error message', async()=>{
           let titleErrorMsg = await page.$eval('div[class="title"] div[class="red-text"]', el => el.innerHTML);
           let contentErrorMsg = await page.$eval('div[class="content"] div[class="red-text"]', el => el.innerHTML);

           expect(titleErrorMsg).toEqual('You must provide a value');
           expect(contentErrorMsg).toEqual('You must provide a value');

        })
    })

})

describe('when user not logged in ', ()=>{
    beforeEach(async() =>{

    })
    test('creating a post should gave an error', async()=>{
        const result = await page.evaluate(() =>{
               return fetch('/api/blogs', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers:{
                        'content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: 'My blog',
                        content: 'containing some random conte'
                    })
                }).then(res =>  res.json())
        });
       expect(result).toEqual({ error: 'You must log in!' });
    })
    test('viewing a blog, should gave us error', async()=>{
        const result = await page.evaluate(() =>{
            return fetch('/api/blogs', {
                 method: 'GET',
                 credentials: 'same-origin',
                 headers:{
                     'content-Type': 'application/json'
                 }
             }).then(res =>  res.json())
     });
    expect(result).toEqual({ error: 'You must log in!' });
    })
})
