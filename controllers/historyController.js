const {findHistories, findHistoriesByRange} = require('../services/historyService')

const onGetHistoriesByRange = (async (req, res) => {
    const userId = req.query.id
    const start = req.query.start
    const end = req.query.end

    if(!userId) {
        return res.status(400).send('Invalid request, user ID required.');
    }
    if(!start) {
        return res.status(400).send('Invalid request, start date required.');
    }
    if(!end) {
        return res.status(400).send('Invalid request, end date required.');
    }

    try {
        //get histories by range
        const result = await findHistoriesByRange(userId, start, end);
        res.status(200).send(result);  
    } catch (error) {
        res.status(400).send(error.message);  
    }
    return;
}) 

const onGetHistories = (async (req, res) => {
    const userId = req.params['id']
    if(!userId) {
        return res.status(400).send('Invalid request, user ID required.');
    }

    try {
        //get all histories
        const result = await findHistories(userId);
        res.status(200).send(result);  
    } catch (error) {
        res.status(400).send(error.message);  
    }
    return;
}) 

module.exports = {onGetHistories, onGetHistoriesByRange};
