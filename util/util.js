

const isStringEmpty = (param) => {
    if(typeof param == "undefined" || param == null || param == ""){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    isStringEmpty
}