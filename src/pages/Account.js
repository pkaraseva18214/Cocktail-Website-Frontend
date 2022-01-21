import React from 'react'

import UserAccount from './UserAccount'
import ModeratorAccount from './ModeratorAccount'
import AdminAccount from './AdminAccount'

export default function Account(props) {

    switch (props.user.status) {

        case "user":
            return <UserAccount />

        case "moderator":
            return <ModeratorAccount />

        case "admin":
            return <AdminAccount />

        default:
            return <UserAccount />
    }
}