'use strict';
// Test-only tools. No browser profile or user backup is opened.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),vm=require('node:vm');
const playwright=require('playwright');
const repo=path.resolve(__dirname,'../..');
const appVersion=/const APP_VERSION\s*=\s*'([^']+)'/.exec(fs.readFileSync(path.join(repo,'app.js'),'utf8'))[1];
const artifacts=process.env.MT_TEST_OUTPUT
  ? path.resolve(process.env.MT_TEST_OUTPUT)
  : fs.mkdtempSync(path.join(os.tmpdir(),'moj-trening-tests-'));
fs.mkdirSync(artifacts,{recursive:true});
const engine=process.argv.includes('webkit')?'webkit':'chromium';
async function launch(name=engine){
  const executablePath=process.env[name==='webkit'?'WEBKIT_PATH':'CHROMIUM_PATH'];
  return playwright[name].launch({headless:true,...(executablePath?{executablePath}:{})});
}
function createServer(){
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.mp4':'video/mp4'};
  return http.createServer((request,response)=>{
    let file;
    try{const u=new URL(request.url,'http://localhost');file=path.resolve(repo,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));}catch{response.writeHead(400);response.end();return;}
    if(!file.startsWith(repo+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){response.writeHead(404);response.end();return;}
    response.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
    fs.createReadStream(file).pipe(response);
  });
}
async function serve(){
  if(process.env.MT_BASE_URL){
    const url=new URL(process.env.MT_BASE_URL);
    if(!/^https?:$/.test(url.protocol))throw new Error('MT_BASE_URL must be an HTTP(S) address');
    if(!url.pathname.endsWith('/'))url.pathname+='/';
    return {url:url.href,close:async()=>{}};
  }
  const server=createServer();
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  return {server,url:'http://127.0.0.1:'+server.address().port+'/',close:async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}};
}
async function withOffline(context,server,check){
  if(engine!=='webkit'){
    await context.setOffline(true);
    try{return await check();}
    finally{await context.setOffline(false);}
  }
  // WebKit's offline emulation can reject even a literal SW response:
  // https://github.com/microsoft/playwright/issues/42775
  // Stop the real origin instead; this proves origin-unavailable operation,
  // while Chromium retains coverage of browser-level offline emulation.
  const address=server.address();
  if(!address||address.address!=='127.0.0.1')throw new Error('Offline checks require a running loopback origin');
  await new Promise((resolve,reject)=>{
    server.close(error=>error?reject(error):resolve());
    server.closeAllConnections();
  });
  try{
    // Probe outside the browser and its service worker/cache.
    await new Promise((resolve,reject)=>{
      const request=http.get('http://127.0.0.1:'+address.port+'/',{agent:false},response=>{
        response.resume();
        reject(new Error('Offline origin is still reachable'));
      });
      request.once('error',error=>error.code==='ECONNREFUSED'?resolve():reject(error));
      request.setTimeout(3000,()=>request.destroy(new Error('Offline origin probe timed out')));
    });
    return await check();
  }finally{
    await new Promise((resolve,reject)=>{
      const failed=error=>{server.removeListener('listening',ready);reject(error);};
      const ready=()=>{server.removeListener('error',failed);resolve();};
      server.once('error',failed);
      server.once('listening',ready);
      server.listen(address.port,address.address);
    });
  }
}
function fixture(){
  const ctx={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(repo,'data.js'),'utf8'),ctx);
  const seed=JSON.parse(JSON.stringify(ctx.window.SEED));
  const additions=JSON.parse(fs.readFileSync(path.join(__dirname,'fixture.json'),'utf8'));
  for(const key of ['exercises','protocols','field']){
    Object.assign(seed[key],additions[key]);
    for(const [id,item] of Object.entries(seed[key]))item.id=id;
  }
  return {...seed,kind:additions.kind,v:additions.v,app:additions.app,exportedAt:additions.exportedAt,programs:{},_deleted:[],log:additions.log,settings:additions.settings};
}
async function openJournal(page,all=false){
  if(!await page.locator('.sheet[data-kind="cinemaJournal"]').count())await page.locator('[data-a="cinemaJournal"]').click();
  if(all&&await page.locator('.cinema-journal [data-a="workoutShowAll"]').getAttribute('aria-expanded')!=='true')await page.locator('.cinema-journal [data-a="workoutShowAll"]').click();
}
async function closeJournal(page){if(await page.locator('.sheet[data-kind="cinemaJournal"]').count())await page.locator('[data-a="cinemaJournalClose"]').click();}
async function openCinemaControls(page){
  if(await page.locator('.sheet[data-kind="cinemaPlayback"]').count())return;
  if(!await page.locator('.sheet[data-kind="cinemaMenu"]').count())await page.locator('[data-a="cinemaMenu"]').click();
  await page.locator('[data-a="cinemaPlayback"]').click();
}
async function pressCinemaMain(page){
  await openCinemaControls(page);
  await page.locator('.sheet[data-kind="cinemaPlayback"] .cinema-primary').click();
}
async function openQuit(page){
  await closeJournal(page);
  if(await page.locator('.workout-cinema').count()){
    if(await page.locator('.sheet[data-kind="cinemaPlayback"]').count())await page.locator('[data-a="cinemaClose"]').click();
    if(!await page.locator('.sheet[data-kind="cinemaMenu"]').count())await page.locator('[data-a="cinemaMenu"]').click();
    await page.locator('[data-a="cinemaExit"]').click();
  }else await page.locator('[data-a="quitPlay"]').click();
}
module.exports={repo,artifacts,engine,appVersion,launch,createServer,serve,withOffline,fixture,openJournal,closeJournal,openCinemaControls,pressCinemaMain,openQuit};
