import { getUserSettings, updateUser } from '@/utils/api'
import { getCountries, getLanguages, getTimezones } from '@/utils/tmdbApi'
import { redirect } from 'next/navigation'
import Form from 'next/form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function SettingsPage() {
    const settings = await getUserSettings()
    const countries = await getCountries().then(data => 
        Array.isArray(data) ? data.sort((a, b) => a.native_name.localeCompare(b.native_name)) : data
    )
    const languages = await getLanguages().then(data => 
        Array.isArray(data) ? data.sort((a, b) => a.english_name.localeCompare(b.english_name)) : data
    )
    const timezones = await getTimezones().then(data => {
        if (!Array.isArray(data)) return []
        return [...new Set(data.flatMap(data => data.zones))].sort()
    })

    async function updateSettings(formData: FormData) {
        'use server'
        await updateUser({
            region: formData.get('region') as string,
            language: formData.get('language') as string,
            original_title: formData.get('original_title') === 'on',
            include_adult: formData.get('include_adult') === 'on',
            timezone: formData.get('timezone') as string,
        })
        redirect('/account/settings')
    }

    console.log(settings)

    if (!settings) {
        return <div>No user found.</div>
    }
    
    return (
        <div className='relative w-full h-full flex items-center justify-center'>
            <div className='absolute left-[2rem] top-0'>
                <Link href='/account' className='flex items-center text-white/80 hover:text-white transition-colors'>
                    <ArrowLeft />
                    <span>Back</span>
                </Link>
            </div>
            <div className='max-w-[30rem] bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-[1.5rem] shadow-lg'>
                <h1 className='text-xl font-bold mb-[1rem] text-white/90'>Account Settings</h1>
                <Form action={updateSettings} className='w-full'>
                    <table className='text-white/90'>
                        <tbody>
                            <tr className='border-b border-white/10'>
                                <td className='py-[0.75rem] pr-[1rem] font-medium'>Language:</td>
                                <td className='py-[0.75rem]'>
                                    <select
                                        name='language'
                                        defaultValue={settings.language || ''}
                                        className='bg-white/10 border border-white/20 rounded px-[0.75rem] py-[0.5rem] w-full focus:outline-none focus:ring-2 focus:ring-green-800/70'
                                    >
                                        {Array.isArray(languages) && languages.map((language: Language) => (
                                            <option key={language.iso_639_1} value={language.iso_639_1}>
                                                {language.english_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>

                            <tr className='border-b border-white/10'>
                                <td className='py-[0.75rem] pr-[1rem] font-medium'>Region:</td>
                                <td className='py-[0.75rem]'>
                                    <select
                                        name='region'
                                        defaultValue={settings.region || ''}
                                        className='bg-white/10 border border-white/20 rounded px-[0.75rem] py-[0.5rem] w-full focus:outline-none focus:ring-2 focus:ring-green-800/70'
                                    >
                                        {Array.isArray(countries) && countries.map((country: Country) => (
                                            <option key={country.iso_3166_1} value={country.iso_3166_1}>
                                                {country.native_name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <td className='py-[0.75rem] pr-[1rem] font-medium'>Timezone:</td>
                                <td className='py-[0.75rem]'>
                                    <select
                                        name='timezone'
                                        defaultValue={settings.timezone || ''}
                                        className='bg-white/10 border border-white/20 rounded px-[0.75rem] py-[0.5rem] w-full focus:outline-none focus:ring-2 focus:ring-green-800/70'
                                    >
                                        {Array.isArray(timezones) && timezones.map((timezone) => (
                                            <option key={timezone} value={timezone}>
                                                {timezone}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>

                            <tr className='border-b border-white/10'>
                                <td className='py-[0.75rem] pr-[1rem] font-medium'>Original Title:</td>
                                <td className='py-[0.75rem]'>
                                    <input
                                        type='checkbox'
                                        name='original_title'
                                        defaultChecked={!!settings.original_title}
                                        className='h-[1rem] w-[1rem] accent-green-700'
                                    />
                                </td>
                            </tr>

                            <tr className='border-b border-white/10'>
                                <td className='py-[0.75rem] pr-[1rem] font-medium'>Include Adult:</td>
                                <td className='py-[0.75rem]'>
                                    <input
                                        type='checkbox'
                                        name='include_adult'
                                        defaultChecked={!!settings.include_adult}
                                        className='h-[1rem] w-[1rem] accent-green-700'
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='mt-[1.5rem] flex justify-end'>
                        <button 
                            type='submit' 
                            className='px-[1rem] py-[0.5rem] bg-green-800 text-white rounded hover:bg-green-900 transition'
                        >
                            Save Changes
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
