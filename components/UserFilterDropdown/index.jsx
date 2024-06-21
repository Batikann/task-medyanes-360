import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'

const UserFilterDropdown = ({ sortOrder, setSortOrder }) => {
  const handleChange = (event) => {
    setSortOrder(event.target.value)
  }
  return (
    <div>
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="sort-order-select-label">Sıralama Düzeni</InputLabel>
        <Select
          labelId="sort-order-select-label"
          id="sort-order-select"
          value={sortOrder}
          onChange={handleChange}
          label="Sort Order"
        >
          <MenuItem value="">
            <em>Hiçbiri</em>
          </MenuItem>
          <MenuItem value="asc">Yayın Tarihi Artan</MenuItem>
          <MenuItem value="desc">Yayın Tarihi Azalan</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}
export default UserFilterDropdown
