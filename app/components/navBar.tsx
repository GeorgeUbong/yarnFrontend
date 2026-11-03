'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiLink from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import { useAuth } from '../Context/authContext';
import { logout } from '../_utils/_apis/auth.routes';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';

type NavItem = {
  label: string;
  href: string;
  icon: string;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/feed', icon: 'fa-solid fa-house', exact: true },
  { label: 'Settings', href: '/settings', icon: 'fa-solid fa-gear' },
];

type NavBarProps = {
  /** Optional: pass the signed-in user's name to show it before Sign out */
  username?: string;
};

export default function NavBar({ username }: NavBarProps) {
  const pathname = usePathname();
  const { user, clearUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = user?.username ?? username;

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      clearUser();
      window.location.replace('/authpages/loginpage');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong, try again.',
      );
      setIsLoggingOut(false);
    }
  }

  function isActive(item: NavItem) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <Box
      component="header"
      className="w-full border-b"
      sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}
    >
      <nav
        aria-label="Main navigation"
        className="flex min-h-16 w-full items-center justify-between gap-2 px-3 sm:px-6 lg:px-8"
      >
        {/* Left: logo + page links */}
        <div className="flex min-w-0 items-center gap-1 sm:gap-4">
          <Link href="/feed" className="flex shrink-0 items-center">
            <Image
              src={logo}
              alt="App logo"
              priority
              className="h-8 w-auto sm:h-10 md:h-12"
            />
          </Link>

          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              return (
                <MuiLink
                  key={item.href}
                  component={Link}
                  href={item.href}
                  underline="none"
                  aria-current={active ? 'page' : undefined}
                  className="inline-flex items-center gap-2 px-2 py-2 text-sm sm:px-3"
                  sx={(theme) => ({
                    borderRadius: '8px',
                    fontWeight: active ? 600 : 500,
                    color: active ? 'primary.main' : 'text.secondary',
                    bgcolor: active
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                    transition: 'background-color 150ms ease, color 150ms ease',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: alpha(
                        theme.palette.primary.main,
                        active ? 0.14 : 0.06,
                      ),
                    },
                  })}
                >
                  <i className={item.icon} aria-hidden="true" />
                  <span className="hidden sm:inline">{item.label}</span>
                </MuiLink>
              );
            })}
          </div>
        </div>

        {/* Right: user + log out */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          {displayName && (
            <Box className="flex items-center gap-2">
              <Avatar
                src={user?.profileImage ?? undefined}
                alt={displayName}
                sx={{ width: 34, height: 34 }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <Box
                component="span"
                className="hidden max-w-40 truncate text-sm sm:inline"
                sx={{ color: 'text.secondary' }}
              >
                {displayName}
              </Box>
            </Box>
          )}

          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="text"
            color="inherit"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              gap: 1,
              px: 1.5,
              minWidth: 0,
              '&:hover': { color: 'primary.main' },
            }}
          >
            <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
            <span className="hidden sm:inline">
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </span>
          </Button>
        </div>
      </nav>
    </Box>
  );
}