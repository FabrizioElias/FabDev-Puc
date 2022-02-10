import * as React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography, Link, MenuList, Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export const NavMenu = () => {
    const [anchorElProfile, setAnchorElProfile] = React.useState<null | HTMLElement>(null)
    const [anchorElNavMenu, setAnchorElNavMenu] = React.useState<null | HTMLElement>(null)

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElProfile(event.currentTarget)
    }

    const handleProfileMenuClose = () => {
        setAnchorElProfile(null)
    }

    const handleNavMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNavMenu(event.currentTarget)
    }

    const handleNavMenuClose = () => {
        setAnchorElNavMenu(null)
    }

    return (
        <AppBar position="static" sx={{ mb: 2 }}>
            <Toolbar>
                <IconButton size="large" aria-label="Navigation menu" aria-controls="menu-navbar" aria-haspopup="true" onClick={handleNavMenuOpen} color="inherit" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-navbar"
                    anchorEl={anchorElNavMenu}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNavMenu)}
                    onClose={handleNavMenuClose}>
                    <MenuList>
                        <Link onClick={handleNavMenuClose} component={RouterLink} to="/" underline="none">
                            <MenuItem>Home</MenuItem>
                        </Link>
                        <Link onClick={handleNavMenuClose} component={RouterLink} to="/doatime" underline="none">
                            <MenuItem>DoaTime</MenuItem>
                        </Link>
                    </MenuList>
                </Menu>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    FabDev
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
