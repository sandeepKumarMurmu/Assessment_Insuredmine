
function mainApiResponse(res, status = 500, type = 'failed', msg = '', data = []) {
    let resData = {
        status: type === 'success' ? 'success' : 'failed',
        message: msg,
    };

    if (type !== 'failed') {
        resData.data = data;
    }

    return res.status(status).json(resData);
}


module.exports = {
    mainApiResponse
}