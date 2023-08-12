import { Field, ErrorMessage } from 'formik';

export default function InputField(props: any) {
  const fieldNormalClassName =
    'w-full px-4 py-2 outline outline-offset-2 outline-1 outline-neutral-400 rounded-md';

  const fieldErrorClassName =
    'w-full px-4 py-2 outline outline-offset-2 outline-1 outline-red-600 rounded-md';

  return (
    <div className="mb-8">
      <label
        htmlFor={props.name}
        className="text-neutral-600 font-semibold block mb-2"
      >
        {props.label}
      </label>

      <Field
        type={props.type}
        name={props.name}
        className={
          props.errors && props.touched
            ? fieldErrorClassName
            : fieldNormalClassName
        }
      />

      <ErrorMessage
        name={props.name}
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </div>
  );
}
