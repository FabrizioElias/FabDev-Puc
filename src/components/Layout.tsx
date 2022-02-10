import * as React from 'react'
import { Container } from '@mui/material'
import { NavMenu } from './NavMenu'

export default class Layout extends React.PureComponent<{}, { children?: React.ReactNode }> {
    public render() {
        return (
            <>
                <NavMenu />
                <Container sx={{ px: { xs: 0 } }}>{this.props.children}</Container>
            </>
        )
    }
}
