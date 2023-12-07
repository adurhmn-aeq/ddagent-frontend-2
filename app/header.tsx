import Image from 'next/image';
import { useEffect, useState } from 'react';
import Cookies from "universal-cookie";

function Header() {
    const cookies = new Cookies();
    const userToken = cookies.get('token')
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        if (userToken) {
            setAuthenticated(true)
        }
    })
    return (
        <header className="container mx-auto px-5 py-2">
            <nav className="flex justify-between">
                <a href={authenticated ? "/dashboard" : "/"} >
                    <Image
                        src="/bilic-alt.svg"
                        width={48}
                        height={48}
                        alt="Logo"
                        className="aspect-auto"
                    />
                </a>
            </nav>
        </header>

    );
}

export default Header;