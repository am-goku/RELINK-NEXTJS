import React, { useEffect } from 'react'
import { AccTypeToggler, OnlStatusToggler } from '../ui/buttons/toggleButtons'
import { IUser } from '@/models/User'
import { SanitizedUser } from '@/utils/sanitizer/user';

type Props = {
    onlineStatus?: boolean;
    accountType?: IUser['accountType'];
    setUser: React.Dispatch<React.SetStateAction<SanitizedUser | null>>
}

export default function PrivacySection({ accountType, onlineStatus, setUser }: Props) {

    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        if (error) console.log(error)
    }, [error])

    return (
        <React.Fragment>
            <div className="flex items-center justify-between">
                <span>Private Account</span>
                <AccTypeToggler accountType={accountType} setUser={setUser} setError={setError} />
            </div>
            <div className="flex items-center justify-between">
                <span>Show Online Status</span>
                <OnlStatusToggler setError={setError} onlineStatus={onlineStatus} setUser={setUser} />
            </div>
        </React.Fragment>
    )
}