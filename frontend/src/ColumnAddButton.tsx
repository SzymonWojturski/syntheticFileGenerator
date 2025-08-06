
export default function ColumnAddButton() {
  async function addColumn() {
    alert(`Add new column`);
  }

  return (
    <form onClick={addColumn}>
      <button type="submit">New column</button>
    </form>
  );
}