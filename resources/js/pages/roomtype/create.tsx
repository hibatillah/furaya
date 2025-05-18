import { useForm } from "@inertiajs/react";

export default function Create() {
  const { data, setData, post, errors, processing } = useForm({
    name: "",
  });

  return (
    <div>
      <h1>Create Room Type</h1>
      <form>
        {/* Add form fields here */}
        <button type="submit">Create</button>
      </form>
    </div>
  );
}