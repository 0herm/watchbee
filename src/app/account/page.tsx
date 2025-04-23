import config from "@config"

export default async function page(){
    return (
        <div className='w-full flex justify-center items-center'>
            <div className='bg-[var(--primary-foreground)] min-w-[25rem] min-h-[20rem] rounded-md p-[1rem]'>
            <table className='table-auto w-full text-left border-spacing-y-[0.5rem] border-separate'>
                <thead>
                <tr>
                    <th className='px-[1rem] py-[0.5rem]'>Setting</th>
                    <th className='px-[1rem] py-[0.5rem]'>Value</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='px-[1rem] py-[0.5rem]'>Region</td>
                        <td className='bg-background text-muted-foreground px-[1rem] py-[0.5rem] rounded-sm'>{config.setting.REGION}</td>
                    </tr>
                    <tr>
                        <td className='px-[1rem] py-[0.5rem]'>Language</td>
                        <td className='bg-background text-muted-foreground px-[1rem] py-[0.5rem] rounded-sm'>{config.setting.LANGUAGE}</td>
                    </tr>
                    <tr>
                        <td className='px-[1rem] py-[0.5rem]'>Original Title</td>
                        <td className='bg-background text-muted-foreground px-[1rem] py-[0.5rem] rounded-sm'>{String(config.setting.ORIGINAL_TITLE)}</td>
                    </tr>
                    <tr>
                        <td className='px-[1rem] py-[0.5rem]'>Include adult</td>
                        <td className='bg-background text-muted-foreground px-[1rem] py-[0.5rem] rounded-sm'>{String(config.setting.INCLUDE_ADULT)}</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    )
}