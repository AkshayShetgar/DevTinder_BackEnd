const adminAuth = (req, res, next) => {
    const token = 123;
    const isAuthorized = token === 123;
    if(!isAuthorized){
        res.status(401).send("Unauhtorized");
    }
    else{
        next();
    }
};

const userAuth = (req, res, next) => {
    const token = 123;
    const isAuthorized = token === 1213;
    if(!isAuthorized){
        res.status(401).send("Unauhtorized");
    }
    else{
        next();
    }
};

module.exports = {adminAuth, userAuth};