export const noop = () => {};

export const observeTarget = target => callback => {
    const mutationObserver = new MutationObserver(callback);
    mutationObserver.observe(target, { childList: true });
}

export const debounce = (func, timeout = 300)=>{
    let timer;
    return (...args)=>{
        clearTimeout(timer);
        timer = setTimeout(()=>{ func.apply(this, args); }, timeout);
    };
}