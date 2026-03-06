;(function(){
    const STORE_KEY='customer_profiles';const REF_KEY='referrals';const PROMO_KEY='promotions';
    const MEMBERSHIP={
        bronze:{code:'bronze',label:'Bronze',minTotal:0,discount:0},
        silver:{code:'silver',label:'Silver',minTotal:2000000000,discount:3},
        gold:{code:'gold',label:'Gold',minTotal:5000000000,discount:5}
    };
    function read(k){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return []}}
    function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
    function nowISO(){return new Date().toISOString()}
    function ensureProfile(user){const list=read(STORE_KEY);let p=list.find(x=>x.id===user.id);if(!p){p={id:user.id,email:user.email||'',name:user.name||'',phone:'',address:'',createdAt:nowISO(),updatedAt:nowISO(),totalSpent:0,orderCount:0,points:0,tier:MEMBERSHIP.bronze.label,level:MEMBERSHIP.bronze.code,upgradedAt:null};list.push(p);write(STORE_KEY,list)}return p}
    function saveProfile(profile){profile.updatedAt=nowISO();const list=read(STORE_KEY);const i=list.findIndex(x=>x.id===profile.id);if(i>=0)list[i]=profile;else list.push(profile);write(STORE_KEY,list);return profile}
    function getProfile(userId){const list=read(STORE_KEY);return list.find(x=>x.id===userId)||null}
    function levelForTotal(total){if(total>=MEMBERSHIP.gold.minTotal)return MEMBERSHIP.gold; if(total>=MEMBERSHIP.silver.minTotal)return MEMBERSHIP.silver; return MEMBERSHIP.bronze}
    function addOrder(userId,order){
        const list=read(STORE_KEY);
        let p=list.find(x=>x.id===userId);
        if(!p){
            p={id:userId,email:'',name:'',phone:'',address:'',createdAt:nowISO(),updatedAt:nowISO(),totalSpent:0,orderCount:0,points:0,tier:MEMBERSHIP.bronze.label,level:MEMBERSHIP.bronze.code,upgradedAt:null};
            list.push(p);
        }
        const cust=order&&order.customer?order.customer:{};
        p.name = cust.name || p.name;
        p.email = cust.email || p.email;
        p.phone = cust.phone || p.phone;
        p.address = cust.address || p.address;
        const add=Number(order.total)||0;
        p.totalSpent+=add;
        p.orderCount+=1;
        p.points+=Math.floor(add/100000);
        const before=p.level||MEMBERSHIP.bronze.code;
        const lvl=levelForTotal(p.totalSpent);
        p.level=lvl.code;
        p.tier=lvl.label;
        if(before!==lvl.code)p.upgradedAt=nowISO();
        p.updatedAt=nowISO();
        write(STORE_KEY,list);
        return p
    }
    function listCustomers(){return read(STORE_KEY)}
    function addReferral(referrerId,newCustomerId){const arr=read(REF_KEY);arr.push({id:Date.now().toString(),referrerId,newCustomerId,at:nowISO()});write(REF_KEY,arr);return true}
    function getReferrals(referrerId){return read(REF_KEY).filter(x=>x.referrerId===referrerId)}
    function seedPromotions(){const cur=read(PROMO_KEY);if(cur.length===0){write(PROMO_KEY,[{id:'promo1',title:'Giảm 10% đơn đầu',desc:'Áp dụng cho khách mới',code:'WELCOME10',type:'percent',value:10},{id:'promo2',title:'Giảm 500K đơn từ 5 triệu',desc:'Số lượng có hạn',code:'SAVE500',type:'fixed',value:500000}] )}}
    function getPromotions(){seedPromotions();return read(PROMO_KEY)}
    function getMembershipForUser(userId){const p=getProfile(userId);if(!p)return{level:MEMBERSHIP.bronze.code,label:MEMBERSHIP.bronze.label,discount:MEMBERSHIP.bronze.discount,total:0};const lvl=p.level&&MEMBERSHIP[p.level]?MEMBERSHIP[p.level]:levelForTotal(p.totalSpent||0);return{level:lvl.code,label:lvl.label,discount:lvl.discount,total:p.totalSpent||0,upgradedAt:p.upgradedAt||null}}
    function getMetrics(days=30){const customers=listCustomers();const orders=JSON.parse(localStorage.getItem('adminOrders')||'[]');const byDay={};const byMonth={};orders.forEach(o=>{const d=new Date(o.date);const day=d.toISOString().slice(0,10);const month=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');byDay[day]=(byDay[day]||0)+(Number(o.total)||0);byMonth[month]=(byMonth[month]||0)+(Number(o.total)||0)});const since=Date.now()-days*86400000;const newCustomers=customers.filter(c=>new Date(c.createdAt).getTime()>=since).length;const topCustomers=[...customers].sort((a,b)=>b.totalSpent-a.totalSpent).slice(0,5);return{totalCustomers:customers.length,byDay,byMonth,newCustomers,topCustomers,totalRevenue:orders.reduce((s,o)=>s+(Number(o.total)||0),0)}}
    window.CustomerDB={ensureProfile,saveProfile,getProfile,addOrder,listCustomers,addReferral,getReferrals,getPromotions,getMetrics,getMembershipForUser}
})(); 
