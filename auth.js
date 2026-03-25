;(function(){
    function toHex(buffer){return Array.prototype.map.call(new Uint8Array(buffer),x=>('00'+x.toString(16)).slice(-2)).join('')}
    async function sha256(text){if(window.crypto&&crypto.subtle){const enc=new TextEncoder().encode(text);const buf=await crypto.subtle.digest('SHA-256',enc);return toHex(buf)}return text}
    function keyByRole(role){return role==='admin'?'admins':'users'}
    function load(role){try{return JSON.parse(localStorage.getItem(keyByRole(role))||'[]')}catch(e){return []}}
    function save(role,arr){localStorage.setItem(keyByRole(role),JSON.stringify(arr))}
    function normalizeEmail(email){return String(email||'').trim().toLowerCase()}
    function uid(prefix){return prefix+'_'+Date.now()+Math.floor(Math.random()*1000)}
    async function register({name,email,password,role}){const r=role==='admin'?'admin':'user';const accounts=load(r);const e=normalizeEmail(email);if(accounts.some(a=>a.email===e))return false;const hash=await sha256(password);const user={id:uid(r),name:name||'',email:e,password:hash,role:r,createdAt:new Date().toISOString()};accounts.push(user);save(r,accounts);return true}
    async function login({email,password,role}){const r=role==='admin'?'admin':'user';const accounts=load(r);const e=normalizeEmail(email);const hash=await sha256(password);const acc=accounts.find(a=>a.email===e&&a.password===hash);if(!acc)return false;const session={id:acc.id,name:acc.name,email:acc.email,role:r,loginAt:Date.now()};localStorage.setItem('currentUser',JSON.stringify(session));if(r==='user'){localStorage.setItem('customerId',acc.id)}return true}
    function logout(){localStorage.removeItem('currentUser')}
    function current(){try{return JSON.parse(localStorage.getItem('currentUser'))||null}catch(e){return null}}
    function ensureNav(){
        document.addEventListener('DOMContentLoaded',()=>{
            const nav=document.querySelector('.nav-menu');
            if(!nav)return;
            const old=nav.querySelector('.account-link');
            if(old)old.remove();

            const user=current();

            const wrapper=document.createElement('div');
            wrapper.className='account-wrapper';
            wrapper.style.position='relative';

            const a=document.createElement('a');
            a.className='nav-link account-link';

            if(!user){
                a.href='auth.html';
                a.innerHTML='<i class="fas fa-user"></i> Đăng nhập';
            }else{
                a.href='#';
                a.innerHTML='<i class="fas fa-user-circle"></i> '+(user.name||user.email);
                a.addEventListener('click',e=>{
                    e.preventDefault();

                    const existing=document.querySelector('.account-menu');
                    if(existing){existing.remove();}

                    const m=document.createElement('div');
                    m.className='account-menu';
                    m.style.position='absolute';
                    m.style.right='0';
                    m.style.top='calc(100% + 10px)';
                    m.style.background='#0b1223';
                    m.style.border='1px solid rgba(255,255,255,.1)';
                    m.style.padding='8px';
                    m.style.borderRadius='10px';
                    m.style.zIndex='1000';
                    m.style.minWidth='180px';

                    const mkBtn=(label,href,handler)=>{
                        const b=document.createElement('button');
                        b.textContent=label;
                        b.style.display='block';
                        b.style.padding='8px 12px';
                        b.style.background='transparent';
                        b.style.color='#e5e7eb';
                        b.style.border='0';
                        b.style.cursor='pointer';
                        b.style.width='100%';
                        b.addEventListener('click',()=>{
                            if(handler){
                                handler();
                            }else if(href){
                                window.location.href=href;
                            }
                        });
                        return b;
                    };

                    m.appendChild(mkBtn('Tài khoản','account.html'));
                    m.appendChild(mkBtn('Hội viên','membership.html'));
                    m.appendChild(mkBtn('Đăng xuất',null,()=>{
                        logout();
                        localStorage.removeItem('customerId');
                        window.location.reload();
                    }));
                    if(user.role==='admin'){
                        m.appendChild(mkBtn('Trang admin','admin/index.html'));
                    }

                    wrapper.appendChild(m);

                    function close(){
                        m.remove();
                        document.removeEventListener('click',onDoc);
                    }
                    function onDoc(ev){
                        if(!m.contains(ev.target) && ev.target!==a){
                            close();
                        }
                    }
                    setTimeout(()=>document.addEventListener('click',onDoc),0);
                });
            }

            wrapper.appendChild(a);
            nav.appendChild(wrapper);
        });
    }
    async function seedDefaultAccounts(){
        const defaults=[
            {name:'Admin',email:'admin@gmail.com',password:'123456',role:'admin'},
            {name:'Khách lẻ 01',email:'khachle01@gmail.com',password:'123456',role:'user'},
            {name:'Khách lẻ 02',email:'khachle02@gmail.com',password:'123456',role:'user'},
            {name:'Khách lẻ 03',email:'khachle03@gmail.com',password:'123456',role:'user'},
            {name:'Khách lẻ 04',email:'khachle04@gmail.com',password:'123456',role:'user'}
        ];
        for(const acc of defaults){
            try{
                await register(acc);
            }catch(e){
                console.error('Không thể tạo tài khoản mặc định',acc.email,e);
            }
        }
    }
    function enforceAdmin(){const u=current();if(!u||u.role!=='admin'){window.location.href='../auth.html?mode=admin'}}
    window.Auth={register,login,logout,current,ensureNav,enforceAdmin}
    seedDefaultAccounts();
    ensureNav()
})(); 
