import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  id,
  nom,
  prenom,
  grade,
  avatarUrl,
  birthday,
  telephone,
  role,
  membre,
  status,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  console.log("date: ", birthday);
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={nom} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {prenom}{' '}{nom}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{birthday}</TableCell>

        <TableCell>{telephone}</TableCell>

        <TableCell>{role}</TableCell>

        <TableCell>
          <div style={{ backgroundColor: grade, width: 50, height: 20, borderRadius: 4, boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 3px 0px' }} ></div>
        </TableCell>

        {/* <TableCell align="center">{isVerified ? 'Yes' : 'No'}</TableCell> */}

        <TableCell>
          <Label color={(membre === 'Partie' && 'error') || 'success'}>{membre}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
        <Link to={'/user-update/'+id}>
          Modifier
        </Link>
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Supprimer
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  id: PropTypes.any,
  telephone: PropTypes.any,
  birthday: PropTypes.any,
  handleClick: PropTypes.func,
  nom: PropTypes.any,
  prenom: PropTypes.any,
  grade: PropTypes.any,
  role: PropTypes.any,
  membre: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
