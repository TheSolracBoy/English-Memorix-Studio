import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadCategoryName } from "../../../../wailsjs/go/app/App";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { EditCategory as EC } from "../../../../wailsjs/go/app/App";

export const EditCategory = () => {
  const [newCategory, setNewCategory] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const params = useParams();

  async function setInfo() {
    const id = Number(params.id);
    const title = await LoadCategoryName(id);
    setTitle(title);
    setNewCategory(title);
  }

  useEffect(() => {
    setInfo();
  }, []);

  const handleEditCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newCategory === "") {
      return;
    }
    if (newCategory == title) {
      navigate("../")
      return;
    }

    try {
      await EC(Number(params.id), newCategory);
      navigate("../");
    } catch (error) {
      console.log(error)
    }
  };

  async function handleCancel() {
    navigate("../")

  }

  return (
    <AdminLayout title="Edit Category">
      <form className="flex flex-col" onSubmit={(e)=>handleEditCategory(e)}>
        <Input
          value={newCategory}
          aria-labelledby="Enter new Category name"
          onChange={(e) => setNewCategory(e.target.value)}
          type="text"
          placeholder={title}
        />
        <div className=" ml-auto flex gap-3">
          <Button type="submit" className="mt-2" size="sm" color="primary">
            Change Name
          </Button>
          <Button onClick={handleCancel} type="button" className="mt-2" size="sm" color="danger">
            Cancel
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};
