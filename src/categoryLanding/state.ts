export type CategoryLandingViewState={query:string;filter:string|null;scrollOffset?:number};
const cache=new Map<string,CategoryLandingViewState>();
export function categoryLandingState(id:string):CategoryLandingViewState{return cache.get(id)??{query:'',filter:null,scrollOffset:0};}
export function saveCategoryLandingState(id:string,state:CategoryLandingViewState){cache.set(id,state);}
