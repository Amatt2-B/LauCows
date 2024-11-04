import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CardCrowd } from './CardCrowd';

const data = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400,
    "amt": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398,
    "amt": 2210
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800,
    "amt": 2290
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908,
    "amt": 2000
  },
  {
    "name": "Page E",
    "uv": 1890,
    "pv": 4800,
    "amt": 2181
  },
  {
    "name": "Page F",
    "uv": 2390,
    "pv": 3800,
    "amt": 2500
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  }
]


const App = () => {
  return (
    <div className='w-screen h-screen flex flex-col bg-base-100'>
      {/* Title */}
      <div className='flex items-center p-4'>
        <div className='w-12 m-2 text-primary'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 640 512">
            <path d="M96 224l0 32 0 160c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-88.2c9.9 6.6 20.6 12 32 16.1l0 24.2c0 8.8 7.2 16 16 16s16-7.2 16-16l0-16.9c5.3 .6 10.6 .9 16 .9s10.7-.3 16-.9l0 16.9c0 8.8 7.2 16 16 16s16-7.2 16-16l0-24.2c11.4-4 22.1-9.4 32-16.1l0 88.2c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-160 32 32 0 49.5c0 9.5 2.8 18.7 8.1 26.6L530 427c8.8 13.1 23.5 21 39.3 21c22.5 0 41.9-15.9 46.3-38l20.3-101.6c2.6-13-.3-26.5-8-37.3l-3.9-5.5 0-81.6c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 14.4-52.9-74.1C496 86.5 452.4 64 405.9 64L272 64l-16 0-64 0-48 0C77.7 64 24 117.7 24 184l0 54C9.4 249.8 0 267.8 0 288l0 17.6c0 8 6.4 14.4 14.4 14.4C46.2 320 72 294.2 72 262.4l0-6.4 0-32 0-40c0-24.3 12.1-45.8 30.5-58.9C98.3 135.9 96 147.7 96 160l0 64zM560 336a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zM166.6 166.6c-4.2-4.2-6.6-10-6.6-16c0-12.5 10.1-22.6 22.6-22.6l178.7 0c12.5 0 22.6 10.1 22.6 22.6c0 6-2.4 11.8-6.6 16l-23.4 23.4C332.2 211.8 302.7 224 272 224s-60.2-12.2-81.9-33.9l-23.4-23.4z"/>
          </svg>
        </div>  
        <p className='font-bold text-xl text-primary'>Dashboard</p>
      </div>
      <div className='flex flex-col items-center w-screen h-1/3 justify-center my-4'>
        <p className='text-lg text-center'>Numero de vacas detectadas en un transcurso de 24hrs</p>
        <ResponsiveContainer width='90%'>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorPv)" />            
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className='h-fit px-4 flex items-center'>
        <p className='text-primary text-lg'>Tiempo con deteccion sin vacas (min): </p>
        <p className='text-primary font-bold text-xl ml-4'>0</p>
      </div>
      <div className='flex-1 flex flex-col px-4 py-2'>
        <p className='text-primary text-lg'>Horarios detectados con aglomeracion</p>
        <div className='flex flex-1 overflow-x-auto p-2 space-x-4'>
          <CardCrowd />
          <CardCrowd />
          <CardCrowd />
          <CardCrowd />
          <CardCrowd />
          <CardCrowd />
          <CardCrowd />
          <CardCrowd />
          <CardCrowd />
        </div>
      </div>
    </div>
  )
}

export default App