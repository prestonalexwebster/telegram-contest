

function areListsDifferent(prevList, list){
    if(prevList.length !== list.length){
        return true;
    }
    return prevList.some( (val,i) => val !== list[i]);
}

export function createSelector(...args){

    const selectors = args.slice(0,args.length-1);
    const aggregator = args[args.length-1];

    let $prevState = null;
    let $cachedValue = null;
    let $cachedArgs = [];
    return state => {
        if($prevState && state === $prevState){
            return $cachedValue;
        }
        $prevState = state;
        const args = selectors.map(select => select(state));
        const $shouldUpdate = areListsDifferent($cachedArgs, args);
        if(!$shouldUpdate){
            return $cachedValue;
        }
        $cachedArgs = args;
        $cachedValue = aggregator(...args);
        return $cachedValue;
    }
}