export default function Button({ children, disabled = true }: any) {
  return (
    <button
      type="submit"
      className="bg-green-600 text-white py-4 flex w-full justify-center rounded-md"
      disabled={disabled}
    >
      <div>{children}</div>
    </button>
  );
}
