
export default function Column() {
  async function remove(formData: FormData) {
    const min = formData.get("min") as string;
    const max = formData.get("max") as string;
    const unit = formData.get("unit") as string;

    alert(`Removed ${min} ${max} ${unit}`);
  }

  return (
    <form action={remove}>
      <input name="min" placeholder="min" />
      <input name="max" placeholder="max" />
      <input name="unit" placeholder="unit" />
      <button type="submit">Remove</button>
    </form>
  );
}