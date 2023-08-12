import { Formik, Form } from 'formik';
import InputField from './_inputField';
import Button from './_button';
// import Button from '@/components/Button';

import * as Yup from 'yup';

import { useNavigate } from 'react-router-dom';
import { useAxios } from '../../hooks/useAxios';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),

  email: Yup.string().email('Invalid email').required('Required'),

  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

export default function register() {
  const navigate = useNavigate();
  const axios = useAxios();

  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await axios.post('/api/user/register', values);
      console.log(response);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label="Username"
              name="username"
              type="text"
              placeholder="Username"
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Password"
            />
            <Button disabled={isSubmitting}>Register</Button>
          </Form>
        )}
      </Formik>
    </>
  );
}
