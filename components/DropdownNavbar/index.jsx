import {
  Button,
  ClickAwayListener,
  Grow,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material'
import { useRef, useEffect, useState } from 'react'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
export default function DropdownNavbar({ name, logoutFunc }) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <div>
      <Button
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2">
          <p className="font-bold text-xsm text-sky-600">{name}</p>
          {!open ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
        </div>
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem
                    className="hover:text-red-500 transition-all duration-500 ease-in-out text-sm font-semibold group"
                    onClick={logoutFunc}
                  >
                    <ListItemIcon>
                      <RiLogoutBoxRLine className="group-hover:text-red-500 ease-in-out duration-500 transition-all" />
                    </ListItemIcon>
                    Çıkış Yap
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}
