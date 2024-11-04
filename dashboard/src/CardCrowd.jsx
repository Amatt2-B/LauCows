// eslint-disable-next-line react/prop-types
const CardCrowd = ({time = 10, maxCow = 10, start = '00:00', end = '23:59'}) => {
    return(
        <div className='border-2 rounded-md border-info mx-2 h-full min-w-60 flex flex-col items-center justify-around'>
            <p className='font-bold text-xl'>Tiempo (min)</p>
            <div className='w-20 h-20 rounded-full border-2 border-accent flex justify-center items-center'>
            <p className='text-3xl'> {time} </p>
            </div>
            <p className='font-bold text-lg'>Max. vacas</p>
            <p> {maxCow} </p>
            <p className='font-bold text-lg'>Horario</p>
            <div className='flex w-full justify-center text-center'>
            <p className='font-bold flex-1'>Inicio</p>
            <p className='font-bold flex-1'>Fin</p>
            </div>
            <div className='flex w-full justify-center text-center'>
            <p className='font-bold flex-1'> {start} </p>
            <p className='font-bold flex-1'> {end} </p>
            </div>
        </div>
    );
};

export { CardCrowd };