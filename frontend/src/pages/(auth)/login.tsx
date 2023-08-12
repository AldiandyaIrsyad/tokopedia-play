import { Formik, Form } from 'formik';
import InputField from './_inputField';
import Button from './_button';

import * as Yup from 'yup';

import { useNavigate } from 'react-router-dom';
import { useAxios } from '../../hooks/useAxios';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Required!'),
  password: Yup.string().min(
    8,
    'Password is too short - should be 8 chars minimum.'
  ),
});

export default function Login() {
  const navigate = useNavigate();
  const axios = useAxios();

  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await axios.post('/api/user/login', values);
      console.log(response);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <InputField
                name="email"
                label="Email"
                type="email"
                errors={errors.email}
                touched={touched.email}
              />

              <InputField
                name="password"
                label="Password"
                type="password"
                errors={errors.password}
                touched={touched.password}
              />

              <Button text="Login" disabled={isSubmitting} />
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
