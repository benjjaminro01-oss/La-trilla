const K='latrilla_save_v1';
export const Save={write(d){try{localStorage.setItem(K,JSON.stringify(d))}catch(e){}},read(){try{return JSON.parse(localStorage.getItem(K))}catch(e){return null}},clear(){try{localStorage.removeItem(K)}catch(e){}}};
