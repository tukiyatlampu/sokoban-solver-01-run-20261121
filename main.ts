import{mkdirSync,readFileSync,readdirSync,writeFileSync}from"node:fs"
import{join}from"node:path"
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output",C=250000,M="lurd"
function solve(s:string){
 const R=s.split(/\r?\n/),W=2+Math.max(...R.map(r=>r.length)),N=W*(R.length+2),D=[-1,-W,1,W],L=(N+31)>>5
 const f=new Uint8Array(N).fill(1),g=new Uint8Array(N),B:number[]=[],G:number[]=[]
 let p=0
 for(let y=0;y<R.length;y++)for(let x=0;x<R[y].length;x++){
  const c=R[y][x],i=(y+1)*W+x+1
  if(!" .$*@+".includes(c))continue
  f[i]=0
  if(".+*".includes(c))g[i]=1,G.push(i)
  if("$*".includes(c))B.push(i)
  if("@+".includes(c))p=i
 }
 if(!p||B.length!=G.length)return""
 const A=f.slice()
 for(const b of B)A[b]=2
 const q=new Int32Array(N),seen=q.slice(),step=new Uint8Array(N)
 const bits=new Int32Array((C+1)*L),par=new Int32Array(C+1),link=par.slice(),move=new Uint16Array(C+1)
 let tag=0
 function walk(a:Uint8Array,p:number,t=0){
  let n=1
  q[0]=p;seen[p]=++tag
  for(let i=0;i<n;i++){
   const x=q[i]
   if(x==t)break
   for(let d=0;d<4;d++){
    const y=x+D[d]
    if(!a[y]&&seen[y]!=tag)seen[y]=tag,step[y]=d,q[n++]=y
   }
  }
  return n
 }
 function pull(a:Uint8Array,h:number[]){
  const l=new Uint8Array(N)
  let n=0
  for(const x of h)l[x]=1,q[n++]=x
  for(let i=0;i<n;i++)for(const d of D){
   const y=q[i]-d
   if(!a[y]&&!a[y-d]&&!l[y])l[y]=1,q[n++]=y
  }
  return l
 }
 const hit=(i:number,x:number)=>bits[i*L+(x>>5)]&(1<<x)
 function search(w:Uint8Array,start:number[],h:number[],p:number,door=0){
  const a=w.slice(),live=pull(w,h),b=start.slice().sort((x,y)=>x-y),m=b.length,num=N**m<=2**53
  const keys:(number|string)[]=[0],map=new Map<number|string,number>()
  let n=0,win=0
  function add(p:number,j:number,v:number){
   if(n==C)return
   let z=0
   if(num)for(const x of b)z=z*N+x
   const k=num?z:String.fromCharCode(...b),i=map.get(k)||0
   for(let t=i;t;t=link[t])if(hit(t,p))return
   map.set(k,++n);keys[n]=k;link[n]=i;par[n]=j;move[n]=v
   const o=n*L,e=walk(a,p)
   bits.fill(0,o,o+L)
   for(let t=0;t<e;t++)bits[o+(q[t]>>5)]|=1<<q[t]
  }
  function put(i:number,x:number){
   while(i&&b[i-1]>x)b[i]=b[--i]
   while(i+1<m&&b[i+1]<x)b[i]=b[++i]
   b[i]=x
   return i
  }
  function frozen(x:number){
   for(let i=-1;i<=1;i+=2)for(let j=-W;j<=W;j+=2*W){
    const y=x+i,z=x+j,t=y+j
    if(a[y]&&a[z]&&a[t]&&(!g[x]||a[y]==2&&!g[y]||a[z]==2&&!g[z]||a[t]==2&&!g[t]))return true
   }
   return false
  }
  for(const x of b)a[x]=2
  add(p,0,0)
  for(const x of b)a[x]=0
  for(let i=1,e=1;i<=n;i++){
   let k=keys[i]
   if(typeof k=="number")for(let j=m;j--;){b[j]=k%N;k=(k-b[j])/N}
   else for(let j=0;j<m;j++)b[j]=k.charCodeAt(j)
   if(b.every(x=>g[x])){
    if(!win)win=i
    if(!door||hit(i,door)){win=i;break}
   }else if(!win&&n<C){
    for(const x of b)a[x]=2
    for(let j=0;j<m;j++){
     const x=b[j]
     for(let d=0;d<4;d++){
      const y=x+D[d]
      if(a[y]||!live[y]||!hit(i,x-D[d]))continue
      a[y]=2;a[x]=0
      if(!frozen(y)){const t=put(j,y);add(x,i,4*x+d);put(t,x)}
      a[y]=0;a[x]=2
     }
    }
    for(const x of b)a[x]=0
   }
   if(i==e){if(win)break;e=n}
  }
  if(!win)return
  const path:number[]=[]
  for(let i=win;par[i];i=par[i])path.push(move[i])
  return{path:path.reverse(),exit:!door||hit(win,door)}
 }
 function replay(paths:number[][]){
  const a=A.slice()
  let s="",u=p
  for(const path of paths)for(const v of path){
   const x=v>>2,d=v&3,y=x+D[d],t=x-D[d]
   walk(a,u,t)
   if(seen[t]!=tag||a[x]!=2||a[y])return
   let r=""
   for(let j=t;j!=u;){const k=step[j];r=M[k]+r;j-=D[k]}
   s+=r+M[d].toUpperCase()
   a[x]=0;a[y]=2;u=x
  }
  return s
 }
 function rooms(){
  const l=pull(f,G),a=f.slice(),r=(p/W|0)*W,paths:number[][]=[],last:number[][]=[]
  for(let x=r;x<r+W;x++)if(!a[x]){
   if(l[x]||A[x]==2)return
   a[x]=1
  }
  for(let x=0;x<N;x++)if(!a[x]){
   const n=walk(a,x),w=new Uint8Array(N).fill(1),b:number[]=[],h:number[]=[]
   let d=0
   for(let i=0;i<n;i++){
    const y=q[i],z=r+y%W
    a[y]=1;w[y]=0
    if(A[y]==2)b.push(y)
    if(g[y])h.push(y)
    if(Math.abs(y-z)==W&&!f[z]){
     if(d&&d!=z)return
     d=z
    }
   }
   if(b.length!=h.length)return
   if(!b.length)continue
   if(!d)return
   w[d]=0
   const v=search(w,b,h,d,d)
   if(!v)return
   if(v.exit)paths.push(v.path)
   else last.push(v.path)
  }
  if(last.length<2)return replay(paths.concat(last))
 }
 return rooms()??replay([search(f,B,G,p)?.path??[]])??""
}
for(const e of readdirSync(I,{withFileTypes:true}))if(e.isDirectory()){
 const o=join(O,e.name),s=solve(readFileSync(join(I,e.name,"level.txt"),"utf8"))
 mkdirSync(o,{recursive:true})
 writeFileSync(join(o,"solution.txt"),s)
}
