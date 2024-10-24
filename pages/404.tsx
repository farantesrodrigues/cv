import Error from 'next/error'

export default function Custom404() {
    return <Error statusCode={404} title={"Page Not Found"} withDarkMode={true}/>
}