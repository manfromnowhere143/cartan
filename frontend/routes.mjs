export const SITE={"origin":"https://cartan.danielwahnich.dev","name":"CARTAN","image":"/assets/cartan/cartan-hero-poster.jpg","imageAlt":"AI-generated CARTAN service-bay concept. Not validated hardware or engineering evidence.","pages":{"home":{"path":"/","title":"CARTAN — Spacecraft serviceability research","description":"CARTAN investigates interrupted spacecraft module exchange, uncertain retention and electrical isolation. Explore the research question, concepts and evidence boundaries."},"question":{"path":"/research/","title":"The research question — CARTAN","description":"What is safe to do when a spacecraft module exchange is interrupted? CARTAN separates physical state, observation, command and inferred belief."},"laboratory":{"path":"/laboratory/","title":"Module exchange concepts — CARTAN Laboratory","description":"Explore the proposed module, retention, electrical isolation and transfer support in CARTAN’s component study. Concept geometry is not validated hardware."},"interruption":{"path":"/interruption/","title":"Interrupted exchange and uncertain state — CARTAN","description":"Inspect physical state, observations, commands and belief in an explicitly synthetic CARTAN fixture. The example is not a measured experiment or hardware result."},"evidence":{"path":"/evidence/","title":"Evidence and explicit unknowns — CARTAN","description":"Understand what CARTAN’s public interface does and does not establish. Missing records, planned work and inconclusive examples remain distinct from evidence."},"comparison":{"path":"/comparison/","title":"Baseline comparison protocol — CARTAN","description":"CARTAN’s proposed comparison considers conventional control, additional sensing and passive interlocks. No comparative performance result is claimed."},"sources":{"path":"/sources/","title":"Primary research sources — CARTAN","description":"Follow the primary sources informing CARTAN’s spacecraft serviceability research, with explicit distinctions between published methods and CARTAN’s own evidence."},"vision":{"path":"/vision/","title":"Spacecraft that can change — CARTAN vision","description":"CARTAN’s long-term ambition is spacecraft maintenance, upgrades and reconfiguration. The imagery is conceptual; no flight architecture or capability is established."}}};
export const pathFor=view=>SITE.pages[view]?.path??'/';
export function viewFromURL(url){
 const hash=url.hash?.slice(1);if(hash==='top')return 'home';if(Object.hasOwn(SITE.pages,hash))return hash;
 return Object.keys(SITE.pages).find(v=>pathFor(v)===url.pathname)||'home';
}
export function linkedView(url){
 if(url.hash&&url.hash!=='#top'&&!Object.hasOwn(SITE.pages,url.hash.slice(1)))return null;
 return Object.keys(SITE.pages).some(v=>pathFor(v)===url.pathname)?viewFromURL(url):null;
}
export function graphFor(view){
 const p=SITE.pages[view],url=SITE.origin+p.path;
 return {'@context':'https://schema.org','@graph':[
 {'@type':'WebSite','@id':SITE.origin+'/#website',url:SITE.origin+'/',name:SITE.name,inLanguage:'en',description:SITE.pages.home.description,creator:{'@id':SITE.origin+'/#daniel'}},
 {'@type':'Person','@id':SITE.origin+'/#daniel',name:'Daniel Wahnich',url:'https://danielwahnich.dev/'},
 {'@type':'WebPage','@id':url+'#webpage',url,name:p.title,description:p.description,inLanguage:'en',isPartOf:{'@id':SITE.origin+'/#website'},author:{'@id':SITE.origin+'/#daniel'},about:{'@type':'Thing',name:'Spacecraft serviceability research'},primaryImageOfPage:{'@type':'ImageObject',url:SITE.origin+SITE.image,caption:SITE.imageAlt}}
 ]};
}
export function updateMetadata(view){
 const p=SITE.pages[view],url=SITE.origin+p.path;document.title=p.title;
 for(const [s,value] of [['meta[name="description"]',p.description],['meta[property="og:title"]',p.title],['meta[property="og:description"]',p.description],['meta[property="og:url"]',url],['meta[name="twitter:title"]',p.title],['meta[name="twitter:description"]',p.description]])document.querySelector(s)?.setAttribute('content',value);
 document.querySelector('link[rel="canonical"]')?.setAttribute('href',url);
 const graph=document.querySelector('#structured-data');if(graph)graph.textContent=JSON.stringify(graphFor(view));
}
