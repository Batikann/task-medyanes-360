import { Autocomplete, TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import { FaUsers } from 'react-icons/fa'

const UserSelect = ({ users }) => {
  const { setFieldValue, errors, touched, values } = useFormikContext()

  // Kullanıcı ID'lerini kullanıcı objelerine eşle
  const selectedUsers = values.assignedUsers.map((userId) => {
    return (
      users.find((user) => user.id === userId) || {
        id: userId,
        username: userId,
      }
    )
  })

  return (
    <div className="flex flex-col gap-4 mt-2">
      <label className="flex items-center gap-3">
        <FaUsers size={23} />
        <span>Atanan Kullanıcılar</span>
      </label>
      <Autocomplete
        multiple
        id="assigned-users"
        options={users}
        getOptionLabel={(option) => option.username}
        value={selectedUsers}
        onChange={(event, value) =>
          setFieldValue(
            'assignedUsers',
            value.map((v) => v.id)
          )
        }
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Atanan Kullanıcılar"
            placeholder="Kullanıcı seçin"
            error={touched.assignedUsers && Boolean(errors.assignedUsers)}
            helperText={touched.assignedUsers && errors.assignedUsers}
          />
        )}
      />
    </div>
  )
}

export default UserSelect
