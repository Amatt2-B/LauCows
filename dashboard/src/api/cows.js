import axios from 'axios';

const baseApiEndPoint = import.meta.env.VITE_API_SERVER;
const timeBetweenPicture = import.meta.env.VITE_TIME_PICTURE;

const api = {};

const minValueAgglomeration = 2;

api.getData = async (initialDate, endDate) => {
    const endpoint = `http://${window.location.hostname}:${baseApiEndPoint}/cowsInRange`;
    const response = await axios.get(endpoint, {params: {initialDate, endDate}});

    const status = response.data.status;
    const data = response.data.data;
    if (status !== 'success') return { status: 'failed' };

    const result = {deadTime: 0, cowsAlongTime: [], agglomerationAlongTime: []}
    let currentAgglomeration = null;
    let agglomerationDetected = false;
    let lastDate = '';

    data.forEach((element, index) => {
        if (element.cows < minValueAgglomeration) {
            if ( element.cows === 0) result.deadTime += parseInt(timeBetweenPicture);
            if ( agglomerationDetected) {
                currentAgglomeration.end = lastDate.split(' ')[1];
                result.agglomerationAlongTime.push(currentAgglomeration);
                agglomerationDetected = false;
                currentAgglomeration = null;
            }
        } else {
            if (!agglomerationDetected) {
                currentAgglomeration = { time: 0, maxCow: element.cows, start: element.timestamp_column.split(' ')[1], end: '23:59' };
                agglomerationDetected = true;
            }
            currentAgglomeration.time += parseInt(timeBetweenPicture);
            currentAgglomeration.maxCow = Math.max(currentAgglomeration.maxCow, element.cows);
        }

        if (index === data.length - 1 && agglomerationDetected) result.agglomerationAlongTime.push(currentAgglomeration);
        
        result.cowsAlongTime.push({ date: element.timestamp_column, cows: element.cows });
        lastDate = element.timestamp_column;
    });
    return {...result, status: 'success'};
};

api.getHeatmap = async (initialDate, endDate) => {
    const endpoint = `http://${window.location.hostname}:${baseApiEndPoint}/cowsInRange`;
    const response = await axios.get(endpoint, { params: { initialDate, endDate } });
    const status = response.data.status;
    const data = response.data.data;

    if (status !== 'success') return { status: 'failed' };

    const groupedData = {};

    data.forEach((element) => {
        const [entryDate, entryTime] = element.timestamp_column.split(' ');
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        const dateAux = new Date(element.timestamp_column).getDay();
        const formatDate = ` ${entryDate} ( ${dayNames[dateAux]} )`;
        const hour = entryTime.split(':')[0];
        const key = `${entryDate}-${hour}`;

        if (!groupedData[key]) {
            groupedData[key] = { count: 0, totalValue: 0, date: formatDate, hour: hour };
        }

        groupedData[key].count += 1;
        groupedData[key].totalValue += element.cows;
    });

    const formatedData = Object.values(groupedData).map((group) => {
        return {
            x: group.hour,
            y: group.date,
            value: Math.round(group.totalValue / group.count)
        };
    });

    return { data: formatedData, status: 'success' };

};

export default api;
