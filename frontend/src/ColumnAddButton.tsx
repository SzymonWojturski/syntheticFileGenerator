
export default function ColumnAddButton() {
  async function addColumn(formData:FormData) {
    alert(`Add new column`);
  }

  return (
    <form action={addColumn}>
      <button type="submit">New column</button>
    </form>
  );
}