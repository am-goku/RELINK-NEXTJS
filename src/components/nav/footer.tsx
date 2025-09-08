import React from 'react'

function Footer() {
    return (
        <footer className="mx-auto w-full max-w-6xl px-4 pb-8 text-center text-xs opacity-70">
            © {new Date().getFullYear()} ReLink. All rights reserved.
        </footer>
    )
}

export default Footer