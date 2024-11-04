import axios from 'axios';

const baseApiEndPoint = import.meta.env.VITE_API_SERVER;
const timeBetweenPicture = import.meta.env.VITE_TIME_PICTURE;

const api = {};

const minValueAgglomeration = 2;

api.getData = async (initialDate, endDate) => {
    const endpoint = `${baseApiEndPoint}/cowsInRange`;
    const response = await axios.get(endpoint, {params: {initialDate, endDate}});

    const status = response.data.status;
    const data = response.data.data;
    if (status !== 'success') return { status: 'failed' };

    const result = {deadTime: 0, cowsAlongTime: [], agglomerationAlongTime: []}
    let currentAgglomeration = null;
    let agglomerationDetected = false;
    let lastDate = '';

    data.forEach(element => {
        if (element.cows === 0) {
            result.deadTime += parseInt(timeBetweenPicture);
        } else {
            if (element.cows >= minValueAgglomeration) {
                if (!agglomerationDetected) {
                currentAgglomeration = { time: 0, maxCow: element.cows, start: element.timestamp_column, end: '23:59' };
                agglomerationDetected = true;
                }
                currentAgglomeration.time += parseInt(timeBetweenPicture);
                currentAgglomeration.maxCow = Math.max(currentAgglomeration.maxCow, element.cows);
            } else if (agglomerationDetected) {
                currentAgglomeration.end = lastDate;
                result.agglomerationAlongTime.push(currentAgglomeration);
                agglomerationDetected = false;
                currentAgglomeration = null;
            }
        }
        
        result.cowsAlongTime.push({ date: element.timestamp_column, cows: element.cows });
        lastDate = element.timestamp_column;
    });
    return {...result, status: 'success'};
};

export default api;
