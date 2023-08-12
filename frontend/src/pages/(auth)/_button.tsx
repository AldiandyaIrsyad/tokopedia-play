export default function Button({
  text,
  disabled,
}: {
  text: string;
  disabled: boolean;
}) {
  return (
    <button
      type="submit"
      className="bg-green-600 text-white py-4 flex w-full justify-center rounded-md"
      disabled={disabled}
    >
      <div>{text}</div>
    </button>
  );
}
