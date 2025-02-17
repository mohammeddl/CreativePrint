import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../store/store"
import { approveRejectProduct } from "../../store/slices/adminSlice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"

export default function ProductApproval() {
  const dispatch = useDispatch()
  const { pendingProducts } = useSelector((state: RootState) => state.admin)

  const handleApproveReject = (productId: string, approved: boolean) => {
    dispatch(approveRejectProduct({ productId, approved }))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Approval</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleApproveReject(product.id, true)}
                  className="bg-green-500 hover:bg-green-600 text-white mr-2"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleApproveReject(product.id, false)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

