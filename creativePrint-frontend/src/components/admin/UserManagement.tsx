import { useSelector } from "react-redux"
import type { RootState } from "../../store/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

export default function UserManagement() {
  const { users } = useSelector((state: RootState) => state.admin)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                <button className="text-red-600 hover:text-red-800">Delete</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

