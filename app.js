const PRODUCTS_KEY='marketProducts',USERS_KEY='marketUsers',CART_KEY='marketCart',ORDERS_KEY='marketOrders';
const demoProducts=[
{id:'p1',name:'Robe Élégante',price:35,category:'Femme',sellerName:'Maison Mode',stock:10,image:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80',description:'Une robe élégante pour vos sorties et cérémonies.'},
{id:'p2',name:'Chemise Premium',price:25,category:'Homme',sellerName:'Urban Style',stock:15,image:'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',description:'Chemise moderne et confortable.'},
{id:'p3',name:'Sneakers Urban',price:45,category:'Chaussures',sellerName:'Street Shop',stock:12,image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',description:'Sneakers tendance pour un style urbain.'},
{id:'p4',name:'Sac Élégant',price:30,category:'Accessoires',sellerName:'Kivu Fashion',stock:8,image:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',description:'Sac élégant et pratique.'},
{id:'p5',name:'Pantalon Classic',price:28,category:'Homme',sellerName:'Urban Style',stock:20,image:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',description:'Pantalon classique facile à porter.'},
{id:'p6',name:'Montre Prestige',price:55,category:'Accessoires',sellerName:'One Style',stock:6,image:'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80',description:'Montre élégante pour compléter votre look.'}
];
function getUsers(){return JSON.parse(localStorage.getItem(USERS_KEY)||'[]')} function saveUsers(x){localStorage.setItem(USERS_KEY,JSON.stringify(x))}
function seedAdmin(){const u=getUsers();if(!u.some(x=>x.email==='admin@modemarket.local')){u.push({id:'admin-1',name:'Administrateur',email:'admin@modemarket.local',password:'admin123',role:'admin',verified:true,blocked:false,createdAt:new Date().toISOString()});saveUsers(u)}}
function currentUser(){return JSON.parse(localStorage.getItem('marketUser')||'null')}
function requireLogin(){const u=currentUser();if(!u){location.href='connexion.html';return null}return u}
function requireAdmin(){const u=requireLogin();if(u&&u.role!=='admin'){location.href='../index.html';return null}return u}
function requireVendor(){const u=requireLogin();if(u&&u.role!=='vendeur'){location.href='../index.html';return null}return u}
function logoutUser(){localStorage.removeItem('marketUser');location.href='connexion.html'}
function getProducts(){return JSON.parse(localStorage.getItem(PRODUCTS_KEY)||'null')||demoProducts}
function saveProducts(x){localStorage.setItem(PRODUCTS_KEY,JSON.stringify(x))}
function getCart(){return JSON.parse(localStorage.getItem(CART_KEY)||'[]')}
function saveCart(x){localStorage.setItem(CART_KEY,JSON.stringify(x));updateCartCount()}
function addToCart(id){const p=getProducts().find(x=>x.id===id);if(!p)return;const c=getCart();const item=c.find(x=>x.id===id);if(item)item.quantity++;else c.push({...p,quantity:1});saveCart(c);alert('Produit ajouté au panier.')}
function removeCart(id){saveCart(getCart().filter(x=>x.id!==id));location.reload()}
function cartTotal(){return getCart().reduce((s,x)=>s+x.price*x.quantity,0)}
function money(n){return Number(n||0).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' $'}
function formatDate(x){return new Date(x).toLocaleString('fr-FR')}
function getOrders(){return JSON.parse(localStorage.getItem(ORDERS_KEY)||'[]')}
function updateCartCount(){document.querySelectorAll('#cartCount').forEach(x=>x.textContent=getCart().reduce((s,i)=>s+i.quantity,0))}
function productCard(p){return `<article class="product"><a href="produit.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a><div class="product-body"><small>${p.category} • ${p.sellerName}</small><h3>${p.name}</h3><strong>${money(p.price)}</strong><div><button class="btn primary small" onclick="addToCart('${p.id}');return false">Ajouter</button><a class="btn ghost small" href="produit.html?id=${p.id}">Voir</a></div></div></article>`}
function renderProducts(el,items){el.innerHTML=items.map(productCard).join('')||'<div class="empty">Aucun produit trouvé.</div>'}
function renderCart(el){const c=getCart();if(!c.length){el.innerHTML='<div class="empty">Votre panier est vide.<br><a href="catalogue.html" class="btn primary">Voir le catalogue</a></div>';return}el.innerHTML=`<div class="cart-list">${c.map(x=>`<article class="cart-item"><img src="${x.image}"><div><h3>${x.name}</h3><p>${money(x.price)} × ${x.quantity}</p></div><button class="btn danger" onclick="removeCart('${x.id}')">Retirer</button></article>`).join('')}</div><div class="summary"><strong>Total : ${money(cartTotal())}</strong><a class="btn primary" href="commande.html">Passer la commande</a></div>`}
function updateAccountLink(){const a=document.getElementById('accountLink'),u=currentUser();if(a&&u){a.textContent=u.name||'Mon compte';a.href=u.role==='admin'?'admin/dashboard.html':u.role==='vendeur'?'vendeur/dashboard.html':'mes-commandes.html'}}
document.addEventListener('DOMContentLoaded',()=>{updateCartCount();updateAccountLink();const f=document.getElementById('featured');if(f)renderProducts(f,getProducts().slice(0,4))});