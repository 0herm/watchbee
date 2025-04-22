type LineProps = {
    color?: string,
    className?: string,
    height?: number,
    width?: number
}

function Line({color, className, height, width}: LineProps) {
    return <div 
        className={`${className}`} 
        style={{backgroundColor: color || '#555', height, width}}
    />
}

export default function Custom404() {
    return (
        <div className='w-full flex flex-row justify-center items-center'>
            <h1 className='text-3xl'>404</h1>
            <Line width={2} height={40} className='mx-4' />
            <h1 className='text-3xl'>This page could not be found.</h1>
        </div>
    )
}
