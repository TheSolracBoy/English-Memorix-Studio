import { AdminLayout } from "../../../layouts/AdminLayout";
import { Button, getKeyValue, Input } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  CreateNewCategory,
  EraseCategory,
  LoadAllCategories,
} from "../../../../wailsjs/go/app/App";
import { useNavigate } from "react-router-dom";
import { database } from "../../../../wailsjs/go/models";

export const Categories = () => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    console.log("Re render");
  }, []);

  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<database.Category[]>([]);

  const loadCategories = async () => {
    try {
      const response = await LoadAllCategories();

      setCategories(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateCategory = async (e: any) => {
    e.preventDefault();
    if (newCategory === "") {
      return;
    }
    try {
      const categoryID = await CreateNewCategory(newCategory);
      console.log("Categoryu created", categoryID);
    } catch (error) {
      console.log(error);
    }
    setNewCategory("");
    loadCategories();
  };

  const handleEditClick = (categoryId: number) => {
    navigate(`edit/${categoryId}`);
  };

  const handleEraseCategory = async (categoryId: number) => {
    const response = await EraseCategory(categoryId);
    if (response != "OK") {
      return;
    }
    loadCategories();
  };

  return (
    <AdminLayout title="Categories">
      <Table className="mt-4">
        <TableHeader>
          <TableColumn className="text-center">
            <span>NAME</span>
          </TableColumn>
          <TableColumn className="text-center">
            <span>Edit</span>
          </TableColumn>
          <TableColumn className="text-center">
            <span className="text-center">Erase</span>
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="No categories">
          {categories.map((category) => (
            <TableRow key={category.id} className="text-center ">
              <TableCell>{category.title}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleEditClick(category.id)}
                  size="sm"
                  color="success"
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleEraseCategory(category.id)}
                  size="sm"
                  color="danger"
                >
                  Erase
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <form className="mt-5 flex flex-col " onSubmit={handleCreateCategory}>
        <Input
          value={newCategory}
          aria-labelledby="Enter new Category name"
          onChange={(e) => setNewCategory(e.target.value)}
          type="text"
          placeholder="Enter new Category name"
        />
        <Button
          type="submit"
          className="ml-auto mt-2 "
          size="md"
          color="primary"
        >
          Add new category
        </Button>
      </form>
    </AdminLayout>
  );
};
